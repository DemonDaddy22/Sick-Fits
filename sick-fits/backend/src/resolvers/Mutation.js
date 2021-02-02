const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeEmailTemplate } = require('../mail');
const { hasPermission } = require('../utils');
const stripe = require('../stripe');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to do that!');
        }

        const item = await ctx.db.mutation.createItem({
            // this is how to create a relationship between the User and the Item
            data: {
                ...args.data, user: {
                    connect: {
                        id: ctx.request.userId
                    }
                }
            }
        }, info);

        return item;
    },
    updateItem(parent, args, ctx, info) {
        const updates = { ...args };
        delete updates.id;
        return ctx.db.mutation.updateItem({
            data: updates,
            where: { id: args.id }
        }, info);
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.where.id };
        const item = await ctx.db.query.item({ where }, `{ id title user { id } }`);

        const ownItem = item.user.id === ctx.request.userId;
        const hasPermission = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

        if (!ownItem && !hasPermission) {
            throw new Error(`You do not have permission to delete the item!`);
        }

        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10); // second argument is the length of salt we want to use for hashing
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        }, info);

        // generate JWT Token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // cookie valid for 1 year
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        const user = await ctx.db.query.user({ where: { email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error(`Invalid password`);
        }

        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // cookie valid for 1 year
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
        });

        return user;
    },
    signout(parent, args, ctx, info) {
        try {
            ctx.response.clearCookie('token');
            return { message: 'Signed out successfully' };
        } catch (e) {
            return { message: e };
        }
    },
    async requestReset(parent, args, ctx, info) {
        const user = await ctx.db.query.user({ where: { email: args.email } });
        if (!user) {
            throw new Error(`No such user found for email ${email}`);
        }

        // Set reset token and expiry on the user
        const resetToken = (await promisify(randomBytes)(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken, resetTokenExpiry }
        });

        // email reset link to user
        const mail = await transport.sendMail({
            from: 'reset-email@sickfits.com',
            to: user.email,
            subject: 'Link to update your password',
            html: makeEmailTemplate(user.name, `Click on the link or paste it in your browser to update your password.
            \n
            <a href='${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}'>${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}</a>
            \n
            If you did not request to update your password, please ignore this mail.
            `)
        });

        return { message: 'Success! Check your email for a reset link!' };
    },
    async resetPassword(parent, args, ctx, info) {
        if (args.password !== args.confirmPassword) {
            throw new Error(`Passwords do not match, please try again!`);
        }

        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });

        if (!user) {
            throw new Error(`Token is either invalid or expired!`);
        }

        const password = await bcrypt.hash(args.password, 10);

        const updateUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        const token = jwt.sign({ userId: updateUser.id }, process.env.APP_SECRET);

        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });

        return updateUser;
    },
    async updatePermissions(parent, args, ctx, info) {
        if (!ctx.request.userId) throw new Error('You must be logged in!');

        const user = await ctx.db.query.user({
            where: { id: ctx.request.userId }
        }, info);

        hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.mutation.updateUser({
            where: { id: args.id },
            data: {
                permissions: { set: args.permissions }
            }
        }, info);
    },
    async addToCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) throw new Error('You must be logged in!');

        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        }, info);

        if (existingCartItem) {
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            }, info);
        }

        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info);
    },
    async removeFromCart(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) throw new Error('You must be logged in!');

        const cartItem = await ctx.db.query.cartItem({
            where: { id: args.id }
        }, `{ id user { id } }`);

        if (!cartItem) throw new Error('No item found!');

        if (cartItem.user.id !== userId) throw new Error('You do not own this item!');

        return ctx.db.mutation.deleteCartItem({
            where: { id: args.id }
        }, info);
    },
    async createOrder(parent, args, ctx, info) {
        const { userId } = ctx.request;
        if (!userId) throw new Error('You must be logged in to complete this order!');

        const user = await ctx.db.query.user({
            where: { id: userId }
        }, `{
            id name email cart {
                id quantity item {
                    id
                    title
                    description
                    price
                    image
                    largeImage
                }
            }
        }`);

        // recalculate total amount as someone can manipulate the amount on client side
        const amount = user.cart.reduce((accu, curr) => {
            if (!curr.item) return accu;
            return accu + curr.item.price * curr.quantity
        }, 0);

        // create stripe charge
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token,
            description: 'Payment for sick fits order',
            shipping: {
                name: user.name,
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                }
            }
        });

        // convert cart items to order items
        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user: { connect: { id: userId } }
            };
            delete orderItem.id;
            return orderItem;
        });

        // create order
        const order = await ctx.db.mutation.createOrder({
            data: {
                charge: charge.id,
                total: charge.amount,
                items: { create: orderItems },
                user: { connect: { id: userId } }
            }
        }).catch(err => { throw new Error('There are still some out of stock items in your cart') });

        // clean user's cart by deleting cart items
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds
            }
        });

        return order;
    }
};

module.exports = Mutations;
