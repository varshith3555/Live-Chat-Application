import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import protect from '../middleware/auth.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'live-chat', allowed_formats: ['jpg', 'png', 'jpeg', 'gif'] }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const router = express.Router();

router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type.' });
  }
  res.json({ url: req.file.path });
});

export default router; 