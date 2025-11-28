import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { isAdmin, isAuth } from '../utils.js';

// ✅ Initialize S3 client once (not per request!)
const s3 = new S3Client({
  endpoint: process.env.LIARA_ENDPOINT,
  region: 'iran', // required for Liara
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
  forcePathStyle: true, // Mandatory for Liara
});

const upload = multer({ storage: multer.memoryStorage() }); // Explicit memory storage
const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'فایلی ارسال نشده است' });
      }

      // ✅ Generate clean filename (Persian-safe)
      const ext = req.file.originalname.split('.').pop().toLowerCase();
      const cleanName = req.file.originalname
        .replace(/\.[^/.]+$/, '') // remove ext
        .replace(/[^a-zA-Z0-9آ-ی\s]/g, '-') // keep Persian/English + space
        .replace(/\s+/g, '-');
      const filename = `products/${Date.now()}-${cleanName}.${ext}`;

      // ✅ Upload directly from buffer (no streamifier!)
      const command = new PutObjectCommand({
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: filename,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      });

      await s3.send(command);

      // ✅ Public URL (Liara auto-generates)
      const url = `${process.env.LIARA_ENDPOINT}/${process.env.LIARA_BUCKET_NAME}/${filename}`;

      // ✅ Match Cloudinary’s response shape for minimal frontend change
      res.json({
        secure_url: url, // ← Cloudinary used secure_url; keep same key!
        public_id: filename, // ← optional, but useful for delete later
        original_filename: req.file.originalname,
      });
    } catch (error) {
      console.error('Liara upload error:', error);
      res
        .status(500)
        .json({ error: 'آپلود با خطا مواجه شد', details: error.message });
    }
  }
);

export default uploadRouter;
