const express = require('express');
const { recognizeDish } = require('../services/ai');

const router = express.Router();

router.post('/recognize', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: '缺少图片地址' });
  }

  try {
    const result = await recognizeDish(imageUrl);
    res.json(result);
  } catch (err) {
    console.error('recognize error:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || '识别服务异常，请稍后重试'
    });
  }
});

module.exports = router;
