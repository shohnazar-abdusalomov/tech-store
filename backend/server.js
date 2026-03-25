require('dotenv').config();

const express = require('express');
const corsMiddleware = require('./middlewares/cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');
const { ApiResponse } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    ApiResponse.success(res, {
        message: 'Product API Backend',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            products: '/api/products',
            auth: '/api/auth'
        }
    });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server - listen on all interfaces
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`Server accessible on network at http://YOUR_IP:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;
