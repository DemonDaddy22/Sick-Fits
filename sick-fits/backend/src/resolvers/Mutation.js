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
    }
};

module.exports = Mutations;
