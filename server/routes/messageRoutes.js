import express from 'express';
import { sendMessage, getMessages, markAsSeen } from '../controllers/messageController.js';
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
    body('content').notEmpty().withMessage('Message content is required'),
    body('chatId').notEmpty().withMessage('Chat ID is required'),
  ],
  validate,
  sendMessage
);

router.get('/:chatId', protect, getMessages);
router.post('/:chatId/seen', protect, markAsSeen);

export default router; 