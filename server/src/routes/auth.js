const express = require('express');
const axios = require('axios');
const router = express.Router();

const APPID = process.env.WECHAT_APPID || '';
const SECRET = process.env.WECHAT_SECRET || '';

router.post('/login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: '缺少 code' });
  }
  if (!APPID || !SECRET) {
    return res.status(500).json({
      success: false,
      message: '服务端未配置微信 AppID/Secret，请在 .env 中配置 WECHAT_APPID 和 WECHAT_SECRET'
    });
  }

  try {
    const resp = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: APPID,
        secret: SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = resp.data;
    if (errcode) {
      return res.status(400).json({ success: false, message: errmsg || '登录失败' });
    }

    res.json({
      success: true,
      openid,
      sessionKey: session_key
    });
  } catch (err) {
    console.error('auth error:', err);
    res.status(500).json({ success: false, message: '登录服务异常' });
  }
});

module.exports = router;
