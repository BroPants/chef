const config = require('./utils/config.js');

// Chef 微信小程序 - 入口
App({
  globalData: {
    userInfo: null,
    openid: null,
    baseUrl: config.baseUrl
  },
  onLaunch() {
    this.checkLogin();
    this.doLogin();
  },
  checkLogin() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.globalData.openid = openid;
    }
  },
  doLogin() {
    const { login } = require('./utils/api.js');
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            const data = await login(res.code);
            if (data.success && data.openid) {
              wx.setStorageSync('openid', data.openid);
              this.globalData.openid = data.openid;
            }
          } catch (e) {
            console.warn('login fail', e);
          }
        }
      }
    });
  }
});
