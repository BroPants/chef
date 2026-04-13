const { recognizeDish, getDailyRecommendation } = require('../../utils/api');

const HISTORY_KEY = 'recognitionHistory';
const HISTORY_MAX = 10;
const LAST_REC_KEY = 'lastRecommendationId';

Page({
  data: {
    loading: false,
    error: '',
    history: [],
    statusBarHeight: 0,
    rec: null,
    recLoading: false
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync();
    this.setData({ statusBarHeight });
    getApp().checkLogin();
  },

  onShow() {
    this.loadHistory();
    this.loadRecommendation();
  },

  // ── 每日推荐 ──────────────────────────────

  async loadRecommendation() {
    this.setData({ recLoading: true });
    try {
      const lastId = wx.getStorageSync(LAST_REC_KEY) || '';
      const res = await getDailyRecommendation(lastId);
      if (res.success && res.dish) {
        this.setData({ rec: res.dish });
        wx.setStorageSync(LAST_REC_KEY, res.dish.id);
      }
    } catch (e) {
      // 推荐失败静默处理，不影响主流程
    } finally {
      this.setData({ recLoading: false });
    }
  },

  onRecRefresh() {
    this.loadRecommendation();
  },

  onRecTap() {
    const rec = this.data.rec;
    if (!rec) return;
    wx.navigateTo({
      url: `/pages/recipe/recipe?dish=${encodeURIComponent(rec.name)}`
    });
  },

  // ── 食材找菜 ──────────────────────────────

  onSuggestTap() {
    wx.navigateTo({ url: '/pages/suggest/suggest' });
  },

  // ── 历史记录 ──────────────────────────────

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

  onHistoryTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.history[index];
    wx.navigateTo({
      url: `/pages/recipe/recipe?dish=${encodeURIComponent(item.dishName)}&data=${encodeURIComponent(JSON.stringify(item.data || {}))}`
    });
  },

  // ── 拍照识别 ──────────────────────────────

  onChooseImage(e) {
    const source = e.currentTarget.dataset.source;
    this.chooseAndRecognize(source);
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
      await this.recognizeAndNavigate(res.tempFiles[0].tempFilePath);
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
        this.setData({ error: result.message || '未能识别菜品，请换一张更清晰的图片重试' });
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
