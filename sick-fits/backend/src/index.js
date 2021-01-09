require('dotenv').config({ path: 'variables.env' });

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        // decode JWT to add user id onto each request
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId;
    }
    next();
});

// middleware to populate the current user
server.express.use(async (req, res, next) => {
    if (!req.userId) return next();

    const user = await db.query.user({
        where: { id: req.userId }
    },
        '{id, name, email, permissions}'
    );

    req.user = user;
    next();
})

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    },
}, deets => console.log(`Server is now running on http://localhost:${deets.port}`));