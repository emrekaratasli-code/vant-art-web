import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkoutHandler from './api/checkout.js';

dotenv.config();

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Mock Vercel Request/Response objects to match what the handler expects
const adaptRequest = (req, res, next) => {
    // Vercel serverless functions might expect things not in standard Express req
    // But for this simple case, Express req/res should be compatible enough
    // provided we handle the body parsing (which express.json() does)
    next();
};

// Routes
// We need to wrap the handler because it might be async and Express doesn't auto-catch async errors in older versions,
// plus the handler signature is (req, res).
app.post('/api/checkout', async (req, res) => {
    try {
        await checkoutHandler(req, res);
    } catch (error) {
        console.error('API Handler Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ status: 'failure', errorMessage: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`
    🚀 Backend server running locally!
    👉 http://localhost:${PORT}
    
    API Endpoint: http://localhost:${PORT}/api/checkout
    `);
});
