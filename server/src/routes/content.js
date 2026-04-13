const express = require('express');
const router = express.Router();
const { getExternalContent } = require('../data/externalContent');

/**
 * GET /api/content/external?dish=菜品名
 * 返回该菜品的 B 站视频搜索入口 + 小红书笔记搜索入口
 */
router.get('/external', (req, res) => {
  const dish = (req.query.dish || '').trim();
  if (!dish) {
    return res.status(400).json({ success: false, message: '缺少 dish 参数' });
  }

  const content = getExternalContent(dish);
  res.json({ success: true, dish, ...content });
});

module.exports = router;
