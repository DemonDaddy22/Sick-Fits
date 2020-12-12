const Mutations = {
    // createDog(parent, args, ctx, info) {
    //     global.dogs = global.dogs || [];
    //     const newDog = { name: args.name };
    //     global.dogs.push(newDog);
    //     return newDog;
    // }x
    async createItem(parent, args, ctx, info) {
        // TODO - Check if user is logged in

        const item = await ctx.db.mutation.createItem({
            data: { ...args.data }
        }, info);

        return item;
    }
};

module.exports = Mutations;
