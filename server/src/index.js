require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');
const recognizeRouter = require('./routes/recognize');

const app = express();
const PORT = process.env.PORT || 3000;

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRouter);
app.use('/api', uploadRouter);
app.use('/api', recognizeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'chef-server' });
});

app.listen(PORT, () => {
  console.log(`Chef server running at http://localhost:${PORT}`);
});
