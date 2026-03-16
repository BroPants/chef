const express = require('express');
const { getRecipe } = require('../services/recipe');
const { recognizeDish } = require('../services/ai');

const router = express.Router();

router.post('/recognize', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ success: false, message: '缺少图片地址' });
  }

  try {
    const dishName = await recognizeDish(imageUrl);
    if (!dishName) {
      return res.json({
        success: false,
        message: '未能识别菜品，请换一张更清晰的图片重试'
      });
    }

    const recipe = getRecipe(dishName);
    res.json({
      success: true,
      dishName,
      recipe: recipe || { ingredients: [], steps: [] }
    });
  } catch (err) {
    console.error('recognize error:', err);
    res.status(500).json({
      success: false,
      message: err.message || '识别服务异常，请稍后重试'
    });
  }
});

module.exports = router;
