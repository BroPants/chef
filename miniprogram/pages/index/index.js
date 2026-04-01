const { request, uploadImage, recognizeDish } = require('../../utils/api');

Page({
  data: {
    loading: false,
    error: ''
  },

  onLoad() {
    getApp().checkLogin();
  },

  onChooseImage(e) {
    const source = e.currentTarget.dataset.source; // 'camera' | 'album'
    this.chooseAndRecognize(source);
  },

  async chooseAndRecognize(source) {
    const count = 1;
    const sizeType = ['compressed'];
    const sourceType = source === 'camera' ? ['camera'] : ['album'];

    try {
      const res = await wx.chooseMedia({
        count,
        mediaType: ['image'],
        sourceType,
        sizeType,
        maxDuration: 30
      });

      const tempFile = res.tempFiles[0].tempFilePath;
      await this.recognizeAndNavigate(tempFile);
    } catch (err) {
      if (err.errMsg && err.errMsg.includes('cancel')) {
        return;
      }
      this.setData({
        error: err.errMsg || '获取图片失败，请重试'
      });
    }
  },

  async recognizeAndNavigate(tempFilePath) {
    this.setData({ loading: true, error: '' });

    try {
      const result = await recognizeDish(tempFilePath);
      if (result.success) {
        wx.navigateTo({
          url: `/pages/recipe/recipe?dish=${encodeURIComponent(result.dishName)}&data=${encodeURIComponent(JSON.stringify(result.recipe || {}))}`
        });
      } else {
        this.setData({
          error: result.message || '未能识别菜品，请换一张更清晰的图片重试'
        });
      }
    } catch (err) {
      this.setData({
        error: err.message || '网络异常，请检查网络后重试'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  clearError() {
    this.setData({ error: '' });
  }
});
