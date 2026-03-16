/**
 * AI 菜品识别
 * MVP 阶段使用 mock 结果，后续可替换为腾讯云/百度等视觉 AI 接口
 */
function recognizeDish(imageUrl) {
  // MVP：mock 识别结果，后续接入腾讯云/百度/阿里视觉 API
  (void imageUrl);
  const mockDish = getMockDishFromUrl();
  return Promise.resolve(mockDish);
}

function getMockDishFromUrl() {
  // MVP：无真实 AI 时固定返回 demo 菜，后续接入腾讯云/百度等视觉 API
  return '番茄炒蛋';
}

module.exports = { recognizeDish };
