const express = require('express');
const router = express.Router();
const RECOMMENDATIONS = require('../data/recommendations');

/**
 * GET /api/recommendations/daily?exclude=id1,id2
 * 随机返回一道推荐菜，支持排除最近推送过的菜品
 */
router.get('/daily', (req, res) => {
  const excludeIds = (req.query.exclude || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const pool = RECOMMENDATIONS.filter(r => !excludeIds.includes(r.id));
  const source = pool.length > 0 ? pool : RECOMMENDATIONS;
  const dish = source[Math.floor(Math.random() * source.length)];

  res.json({ success: true, dish });
});

module.exports = router;
