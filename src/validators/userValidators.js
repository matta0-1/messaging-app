import { body, param } from 'express-validator';

export const idParam = [param('id')
    .isInt({ gt: 0 }).withMessage('id must be a positive integer')
];

export const upsertUser = [
    body('username').isString().isLength({ min: 1, max: 255 }).withMessage('Username must be a string between 1-255 characters'),
    body('firstName').isString().isLength({ min: 1, max: 255 }).withMessage('First name must be a string between 1-255 characters'),
    body('lastName').isString().isLength({ min: 1, max: 255 }).withMessage('Last name must be a string between 1-255 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isStrongPassword().withMessage('Invalid password'),
];

export const usernameParam = [
    param('username').isString().isLength({ min: 1, max: 255 }).withMessage('Username must be a string between 1-255 characters'),
];
