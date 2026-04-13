/**
 * 外部教程内容库（B站 + 小红书）
 * MVP 策略：为常见菜品预置搜索链接，未收录菜品自动回退到关键词搜索 URL
 *
 * 注：微信小程序无法直接 webview 第三方域名，前端统一采用"复制链接"方式
 */

/**
 * 构建 Bilibili 搜索 URL
 */
function biliSearch(keyword) {
  return `https://search.bilibili.com/all?keyword=${encodeURIComponent(keyword + ' 做法 教程')}&order=click`;
}

/**
 * 构建小红书搜索 URL
 */
function xhsSearch(keyword) {
  return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}&type=51`;
}

/**
 * 每道菜预置 1~2 条搜索入口，title 体现搜索意图
 * coverImage 暂留空，前端用平台默认图标代替
 */
const CONTENT_MAP = {
  '番茄炒蛋': {
    bilibili: [
      { title: '番茄炒蛋 经典家常做法，3分钟学会', author: 'B站美食区', url: biliSearch('番茄炒蛋') },
      { title: '饭店同款番茄炒蛋，秘诀在这里', author: 'B站美食区', url: biliSearch('番茄炒蛋 饭店') }
    ],
    xiaohongshu: [
      { title: '番茄炒蛋的正确打开方式，汁多软嫩', author: '小红书美食', url: xhsSearch('番茄炒蛋') },
      { title: '我妈教我的番茄炒蛋，20年老配方', author: '小红书美食', url: xhsSearch('番茄炒蛋 家常') }
    ]
  },
  '宫保鸡丁': {
    bilibili: [
      { title: '宫保鸡丁 正宗川菜做法，酸甜辣完美', author: 'B站美食区', url: biliSearch('宫保鸡丁') },
      { title: '宫保鸡丁怎么炒才嫩？大厨教你', author: 'B站美食区', url: biliSearch('宫保鸡丁 嫩') }
    ],
    xiaohongshu: [
      { title: '宫保鸡丁家常版，比外卖好吃10倍', author: '小红书美食', url: xhsSearch('宫保鸡丁') },
      { title: '花生米不腥的秘诀 | 宫保鸡丁详解', author: '小红书美食', url: xhsSearch('宫保鸡丁 花生') }
    ]
  },
  '鱼香肉丝': {
    bilibili: [
      { title: '鱼香肉丝 正宗做法，没有鱼也能做出鱼香味', author: 'B站美食区', url: biliSearch('鱼香肉丝') }
    ],
    xiaohongshu: [
      { title: '鱼香肉丝超详细步骤，新手零失败', author: '小红书美食', url: xhsSearch('鱼香肉丝') }
    ]
  },
  '红烧肉': {
    bilibili: [
      { title: '红烧肉 皮糯肉烂不油腻，肥肠下饭', author: 'B站美食区', url: biliSearch('红烧肉') },
      { title: '红烧肉焖煮时间和火候全解析', author: 'B站美食区', url: biliSearch('红烧肉 时间 火候') }
    ],
    xiaohongshu: [
      { title: '妈妈的红烧肉配方，软糯入味', author: '小红书美食', url: xhsSearch('红烧肉') },
      { title: '冰糖炒糖色教程，红烧肉成功关键', author: '小红书美食', url: xhsSearch('红烧肉 糖色') }
    ]
  },
  '麻婆豆腐': {
    bilibili: [
      { title: '麻婆豆腐 正宗四川做法，麻辣鲜香', author: 'B站美食区', url: biliSearch('麻婆豆腐') }
    ],
    xiaohongshu: [
      { title: '麻婆豆腐嫩滑不破的秘密', author: '小红书美食', url: xhsSearch('麻婆豆腐') }
    ]
  }
};

/**
 * 获取菜品外部教程内容
 * 若菜品不在预置库中，返回关键词搜索 URL 作为 fallback
 */
function getExternalContent(dishName) {
  const name = (dishName || '').trim();

  // 精确匹配
  if (CONTENT_MAP[name]) return CONTENT_MAP[name];

  // 模糊匹配
  for (const [key, val] of Object.entries(CONTENT_MAP)) {
    if (key.includes(name) || name.includes(key)) return val;
  }

  // fallback：构建搜索入口
  return {
    bilibili: [
      { title: `在 B站 搜索「${name} 做法」`, author: 'B站', url: biliSearch(name) }
    ],
    xiaohongshu: [
      { title: `在小红书搜索「${name}」`, author: '小红书', url: xhsSearch(name) }
    ]
  };
}

module.exports = { getExternalContent };
