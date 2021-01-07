const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASSWORD
    }
});

const makeEmailTemplate = (name, text) => `
    <div className="email" style="
        border-radius: 4px;
        border: 1px dashed #212121;
        padding: 1.25rem;
        font-family: monospace;
        line-height: 2;
        font-size: 1.25rem;
    ">
        <h3>Hey There, ${name}!</h3>
        <br />
        <p>${text}</p>
        <br />
        <h2 style="
            color: #ff0000;
            letter-spacing: 1px;
            text-transform: uppercase;
            transform: skew(-7deg);
            text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.1);
        ">
            Sick Fits
        </h2>
    </div>
`;

exports.transport = transport;
exports.makeEmailTemplate = makeEmailTemplate;