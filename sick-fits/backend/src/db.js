// This file is required to make connection to the remote Prisma DB and gives the ability to query it using JS
import Prisma from 'prisma-binding';

const db = new Prisma({
    typeDefs: 'src/generated/prisma.graqhql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    debug: false
});

module.exports = db;