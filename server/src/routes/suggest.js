const express = require('express');
const router = express.Router();
const { suggestByIngredients, generateRecipe } = require('../services/ai');
const { getRecipe } = require('../services/recipe');

/**
 * POST /api/suggest/by-ingredients
 * Body: { ingredients: ['番茄', '鸡蛋', '猪肉'] }
 * 根据现有食材推荐可做菜品
 */
router.post('/by-ingredients', async (req, res) => {
  const ingredients = req.body?.ingredients;
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ success: false, message: '请至少提供一种食材' });
  }

  try {
    const result = await suggestByIngredients(ingredients);
    res.json({ success: true, dishes: result.dishes || [] });
  } catch (err) {
    console.error('[suggest] error:', err.message);
    res.status(500).json({ success: false, message: err.message || '推荐失败，请稍后重试' });
  }
});

/**
 * GET /api/recipe?dish=菜品名
 * 根据菜品名返回菜谱：优先查本地数据库，未命中则调用 AI 生成
 */
router.get('/recipe', async (req, res) => {
  const dishName = (req.query.dish || '').trim();
  if (!dishName) {
    return res.status(400).json({ success: false, message: '缺少 dish 参数' });
  }

  // 先查本地库（快，零费用）
  const local = getRecipe(dishName);
  if (local) {
    return res.json({
      success: true,
      dishName,
      recipe: local,
      source: 'local'
    });
  }

  // 本地未命中，AI 生成
  try {
    const result = await generateRecipe(dishName);
    res.json({ ...result, source: 'ai' });
  } catch (err) {
    console.error('[recipe] error:', err.message);
    res.status(500).json({ success: false, message: err.message || '菜谱生成失败，请稍后重试' });
  }
});

module.exports = router;
