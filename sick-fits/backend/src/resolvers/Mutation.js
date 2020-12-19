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
    }
};

module.exports = Mutations;
