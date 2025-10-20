import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { healthCheck } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { userRoutes } from './routes/userRoutes.js';

dotenv.config();

export const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', async (req, res) => {
    try {
        res.json({ ok: await healthCheck() });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
})

app.use('/api/users', userRoutes);

app.use(errorHandler);
