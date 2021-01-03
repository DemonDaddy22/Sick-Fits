const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO - Check if user is logged in

        const item = await ctx.db.mutation.createItem({
            data: { ...args.data }
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
        const item = await ctx.db.query.item({ where }, `{ id title }`);
        // TODO - Check if user owns the item or has permission to delete it
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10); // second argument is the length of salt we want to be used for hashing
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
        });
        
        return user;
    },
    async signin(parent, {email, password}, ctx, info) {
        const user = await ctx.db.query.user({ where: { email }});
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
        });
        
        return user;
    }
};

module.exports = Mutations;
