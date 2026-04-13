const { recognizeDish } = require('../../utils/api');

const HISTORY_KEY = 'recognitionHistory';
const HISTORY_MAX = 10;

Page({
  data: {
    loading: false,
    error: '',
    history: [],
    statusBarHeight: 0
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
    getApp().checkLogin();
  },

  onShow() {
    this.loadHistory();
  },

  loadHistory() {
    try {
      const history = wx.getStorageSync(HISTORY_KEY) || [];
      this.setData({ history });
    } catch (e) {}
  },

  saveToHistory(dishName, recipeData) {
    try {
      let history = wx.getStorageSync(HISTORY_KEY) || [];
      history = history.filter(item => item.dishName !== dishName);
      history.unshift({ dishName, data: recipeData, time: Date.now() });
      history = history.slice(0, HISTORY_MAX);
      wx.setStorageSync(HISTORY_KEY, history);
      this.setData({ history });
    } catch (e) {}
  },

  onChooseImage(e) {
    const source = e.currentTarget.dataset.source;
    this.chooseAndRecognize(source);
  },

  onHistoryTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.history[index];
    wx.navigateTo({
      url: `/pages/recipe/recipe?dish=${encodeURIComponent(item.dishName)}&data=${encodeURIComponent(JSON.stringify(item.data || {}))}`
    });
  },

  async chooseAndRecognize(source) {
    const sourceType = source === 'camera' ? ['camera'] : ['album'];

    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType,
        sizeType: ['compressed'],
        maxDuration: 30
      });

      const tempFile = res.tempFiles[0].tempFilePath;
      await this.recognizeAndNavigate(tempFile);
    } catch (err) {
      if (err.errMsg && err.errMsg.includes('cancel')) return;
      this.setData({ error: err.errMsg || '获取图片失败，请重试' });
    }
  },

  async recognizeAndNavigate(tempFilePath) {
    this.setData({ loading: true, error: '' });

    try {
      const result = await recognizeDish(tempFilePath);
      if (result.success) {
        this.saveToHistory(result.dishName, result.recipe || {});
        wx.navigateTo({
          url: `/pages/recipe/recipe?dish=${encodeURIComponent(result.dishName)}&data=${encodeURIComponent(JSON.stringify(result.recipe || {}))}`
        });
      } else {
        this.setData({
          error: result.message || '未能识别菜品，请换一张更清晰的图片重试'
        });
      }
    } catch (err) {
      this.setData({ error: err.message || '网络异常，请检查网络后重试' });
    } finally {
      this.setData({ loading: false });
    }
  },

  clearError() {
    this.setData({ error: '' });
  }
});
