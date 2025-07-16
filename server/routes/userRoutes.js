import express from 'express';
import { getUsers, updateProfile, changePassword } from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, changePassword);

export default router; 