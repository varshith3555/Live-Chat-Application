import express from 'express';
import { createChat, getChats } from '../controllers/chatController.js';
import protect from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

router.post(
  '/',
  protect,
  [
    body('isGroupChat').optional().isBoolean(),
    body('chatName').if(body('isGroupChat').equals('true')).notEmpty().withMessage('Group chat name is required'),
    body('members').optional().isArray(),
    body('userId').optional().isString(),
  ],
  validate,
  createChat
);

router.get('/', protect, getChats);

export default router; 