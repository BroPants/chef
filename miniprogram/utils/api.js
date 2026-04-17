function getBaseUrl() {
  const config = require('./config.js');
  const app = getApp();
  return app?.globalData?.baseUrl || config.getRuntimeBaseUrl() || 'http://localhost:3000';
}

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getBaseUrl() + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(new Error(res.data?.message || `请求失败: ${res.statusCode}`));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络异常'));
      }
    });
  });
}

function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: getBaseUrl() + '/api/upload',
      filePath,
      name: 'image',
      success(res) {
        let data;
        try {
          data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        } catch (e) {
          reject(new Error('后端服务未启动或返回异常，请先运行 npm run dev'));
          return;
        }
        if (res.statusCode >= 200 && res.statusCode < 300 && data.url) {
          resolve(data);
        } else {
          reject(new Error(data?.message || '上传失败'));
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '上传失败'));
      }
    });
  });
}

async function recognizeDish(filePath) {
  const uploadRes = await uploadImage(filePath);
  const res = await request({
    url: '/api/recognize',
    method: 'POST',
    data: { imageUrl: uploadRes.url }
  });
  return res;
}

async function login(code) {
  return request({
    url: '/api/auth/login',
    method: 'POST',
    data: { code }
  });
}

/**
 * 获取每日随机推荐菜品
 * @param {string} [excludeId] 上次推荐的菜品 id，用于避免连续重复
 */
function getDailyRecommendation(excludeId) {
  const url = excludeId
    ? `/api/recommendations/daily?exclude=${excludeId}`
    : '/api/recommendations/daily';
  return request({ url });
}

/**
 * 获取菜品的外部教程链接（B站 + 小红书）
 * @param {string} dishName 菜品名
 */
function getExternalContent(dishName) {
  return request({ url: `/api/content/external?dish=${encodeURIComponent(dishName)}` });
}

/**
 * 根据食材列表推荐菜品
 * @param {string[]} ingredients 食材名称数组
 */
function suggestByIngredients(ingredients) {
  return request({
    url: '/api/suggest/by-ingredients',
    method: 'POST',
    data: { ingredients }
  });
}

/**
 * 根据菜品名获取菜谱（本地库优先，miss 后 AI 生成）
 * @param {string} dishName 菜品名
 */
function getRecipeByName(dishName) {
  return request({ url: `/api/recipe?dish=${encodeURIComponent(dishName)}` });
}

module.exports = {
  request,
  uploadImage,
  recognizeDish,
  login,
  getBaseUrl,
  getDailyRecommendation,
  getExternalContent,
  suggestByIngredients,
  getRecipeByName
};
