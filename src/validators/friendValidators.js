import { body, cookie, param } from 'express-validator';

export const idParam = [
    param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')
];

export const updateFriend = [
    body('user1Id').isInt({ gt: 0 }).withMessage('id of user 1 must be a positive integer'),
    body('user2Id').isInt({ gt: 0 }).withMessage('id of user 2 must be a positive integer'),
    body('state').isString().isIn(['a', 'A', 'b', 'B', 'p', 'P']).withMessage('Status must be one of: a(Accepted), b(Blocked), p(Pending)'),
]

export const insertFriend = [
    body('user1Id').isInt({ gt: 0 }).withMessage('id of user 1 must be a positive integer'),
    body('user2Id').isInt({ gt: 0 }).withMessage('id of user 2 must be a positive integer'),
]

