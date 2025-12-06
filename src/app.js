import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


import methodOverride from 'method-override';

import { healthCheck } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authMiddleWare } from './middlewares/authMiddleware.js'

import { userRoutes } from './routes/userRoutes.js';
import { friendRoutes } from './routes/friendRoutes.js';
import { messageRoutes } from './routes/messageRoutes.js';
import { authRoutes } from './routes/authRoutes.js';

//import { userViewRoutes } from './routes/userViewRoutes.js';

dotenv.config();

export const app = express();

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(cookieParser());

app.get('/', (req, res) => {
    return res.redirect('/home');
});


app.get('/health', async (req, res) => {
    try {
        res.json({ ok: await healthCheck() });
    } catch (e) {
        res.status(500).json({ ok: false });
    }
});

// API routes do need authentication (For development only)
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);

app.use('/auth', authRoutes);
app.use(authMiddleWare);

app.get('/home', (req, res) => {
    res.send(req.user);

});

// app.get('/whoami', (req, res) => {
//     res.send(`You are logged in as ${req.user.username} (id=${req.user.id})`);
// });

app.use(errorHandler);
