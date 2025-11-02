import { body, param } from "express-validator";

export const idParam = [
    param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')
];

export const upsertMessage = [
    body('content').isString().isLength({ max: 1000 }).withMessage('Message content is too large, must be less than 1000 characters'),
    body('senderId').isInt({ gt: 0 }).withMessage('id of sender must be a positive integer'),
    body('receiverId').isInt({ gt: 0 }).withMessage('id of receiver must be a positive integer'),
];

export const upsertUserId = [
    body('user2Id').isInt({ gt: 0 }).withMessage('id of other user must be a positive integer'),
];

export const upsertMessageContent = [
    body('content').isString().isLength({ max: 1000 }).withMessage('Message content is too large, must be less than 1000 characters'),
]
