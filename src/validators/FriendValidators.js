import { body, param } from 'express-validator';

export const idParam =
    [param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')];

export const upsertFriend = [
    body('user1Id').isInt({ gt: 0 }).withMessage('id of user 1 must be a positive integer'),
    body('user2Id').isInt({ gt: 0 }).withMessage('id of user 2 must be a positive integer'),
]
