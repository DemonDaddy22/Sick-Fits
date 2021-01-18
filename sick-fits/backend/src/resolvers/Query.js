const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    // async items(parent, args, ctx, info) {
    //     const items = ctx.db.query.items();
    //     return items;
    // }
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    currentUser: (parent, args, ctx, info) => {
        if (!ctx.request.userId) return null;

        return ctx.db.query.user({
            where: { id: ctx.request.userId }
        }, info);
    },
    users: async (parent, args, ctx, info) => {
        if (!ctx.request.userId) throw new Error('You must be logged in!');

        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        return ctx.db.query.users({}, info);
    },
    order: async (parent, args, ctx, info) => {
        if (!ctx.request.userId) throw new Error('You must be logged in!');

        const order = await ctx.db.query.order({
            where: { id: args.id }
        }, info);

        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');

        if (!ownsOrder || !hasPermissionToSeeOrder) throw new Error(`You are not allowed to see this order!`);

        return order;
    },
    orders: async (parent, args, ctx, info) => {
        if (!ctx.request.userId) throw new Error('You must be logged in!');

        const orders = await ctx.db.query.orders({
            where: {
                user: { id: ctx.request.userId }
            }
        }, info);

        return orders;
    }
};

module.exports = Query;
