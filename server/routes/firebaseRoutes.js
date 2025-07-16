import express from 'express';
import multer from 'multer';
import { bucket } from '../config/firebase.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Upload image to Firebase Storage
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const file = req.file;
    const fileName = `chat-images/${Date.now()}-${file.originalname}`;
    
    // Create a new blob in the bucket
    const blob = bucket.file(fileName);
    
    // Create a write stream
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Handle stream events
    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      try {
        // Make the file public
        await blob.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        res.json({
          message: 'Image uploaded successfully',
          imageUrl: publicUrl,
        });
      } catch (error) {
        console.error('Error making file public:', error);
        res.status(500).json({ message: 'Failed to make file public' });
      }
    });

    // Write the file to the stream
    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router; 