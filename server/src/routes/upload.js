const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = (file.originalname || file.mimetype || '').split('.').pop() || 'jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '未收到图片' });
  }
  const url = `/uploads/${req.file.filename}`;
  const fullUrl = `${req.protocol}://${req.get('host')}${url}`;
  res.json({ success: true, url: fullUrl, path: url });
});

module.exports = router;
