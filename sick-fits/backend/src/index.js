require('dotenv').config({ path: 'variables.env' });

import createServer from './createServer';
import db from './db';

const server = new createServer();

// TODO - use Express middleware to handle cookies (JWT)
// TODO - use Express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    },
}, deets => console.log(`Server is now running on http://localhost:${deets.port}`));