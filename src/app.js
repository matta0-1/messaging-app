import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import methodOverride from 'method-override';

import { healthCheck } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { userRoutes } from './routes/userRoutes.js';
import { friendRoutes } from './routes/friendRoutes.js';
import { messageRoutes } from './routes/messageRoutes.js';

import { userViewRoutes } from './routes/userViewRoutes.js';

dotenv.config();

export const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('index', {
        title: 'Messaging application',
        message: 'Welcome back',
        port: process.env.PORT || 4000,
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', async (req, res) => {
    try {
        res.json({ ok: await healthCheck() });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
})

app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);

app.use('/users', userViewRoutes);

app.use(errorHandler);
