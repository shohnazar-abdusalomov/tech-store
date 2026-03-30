const cors = require('cors');

const corsOptions = {
    origin: (origin, callback) => {
        // Allow all origins (Netlify, localhost, mobile apps)
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: false,
    maxAge: 86400
};

module.exports = cors(corsOptions);
