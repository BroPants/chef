/**
 * 菜谱数据
 * MVP 使用内置数据，后续可对接数据库或第三方 API
 */
const RECIPES = {
  '番茄炒蛋': {
    ingredients: [
      { name: '番茄', amount: 2, unit: '个' },
      { name: '鸡蛋', amount: 3, unit: '个' },
      { name: '葱花', amount: 5, unit: 'g' },
      { name: '盐', amount: 3, unit: 'g' },
      { name: '糖', amount: 2, unit: 'g' },
      { name: '食用油', amount: 20, unit: 'ml' }
    ],
    steps: [
      '番茄洗净切块，鸡蛋打散加少许盐',
      '热锅倒油，倒入蛋液炒至凝固盛出',
      '再倒少许油，放入番茄翻炒出汁',
      '加入盐、糖调味',
      '倒入炒好的鸡蛋翻炒均匀，撒葱花即可'
    ]
  },
  '宫保鸡丁': {
    ingredients: [
      { name: '鸡胸肉', amount: 300, unit: 'g' },
      { name: '花生米', amount: 50, unit: 'g' },
      { name: '干辣椒', amount: 8, unit: '根' },
      { name: '葱', amount: 20, unit: 'g' },
      { name: '姜', amount: 5, unit: 'g' },
      { name: '蒜', amount: 3, unit: '瓣' },
      { name: '生抽', amount: 15, unit: 'ml' },
      { name: '醋', amount: 10, unit: 'ml' },
      { name: '糖', amount: 8, unit: 'g' },
      { name: '淀粉', amount: 10, unit: 'g' }
    ],
    steps: [
      '鸡肉切丁，加淀粉、生抽腌渍15分钟',
      '花生米在干锅中小火翻炒至香脆，备用',
      '热油爆香干辣椒、葱姜蒜',
      '下鸡丁大火翻炒至变色',
      '加入生抽、醋、糖调好的料汁，快速翻炒',
      '最后加入花生米翻匀出锅'
    ]
  },
  '鱼香肉丝': {
    ingredients: [
      { name: '猪里脊', amount: 250, unit: 'g' },
      { name: '木耳', amount: 20, unit: 'g' },
      { name: '胡萝卜', amount: 60, unit: 'g' },
      { name: '青椒', amount: 60, unit: 'g' },
      { name: '郫县豆瓣', amount: 15, unit: 'g' },
      { name: '醋', amount: 15, unit: 'ml' },
      { name: '糖', amount: 10, unit: 'g' },
      { name: '淀粉', amount: 10, unit: 'g' }
    ],
    steps: [
      '猪里脊切丝，加淀粉腌渍；木耳、胡萝卜、青椒切丝',
      '调鱼香汁：醋、糖、生抽、淀粉、水混合',
      '热油滑炒肉丝至变色，盛出',
      '爆香豆瓣，放入配菜翻炒1分钟',
      '倒回肉丝，淋入鱼香汁大火翻炒均匀'
    ]
  },
  '红烧肉': {
    ingredients: [
      { name: '五花肉', amount: 500, unit: 'g' },
      { name: '冰糖', amount: 30, unit: 'g' },
      { name: '料酒', amount: 30, unit: 'ml' },
      { name: '生抽', amount: 20, unit: 'ml' },
      { name: '老抽', amount: 10, unit: 'ml' },
      { name: '八角', amount: 2, unit: '个' },
      { name: '姜', amount: 15, unit: 'g' }
    ],
    steps: [
      '五花肉切3cm方块，冷水下锅焯水2分钟，捞出洗净',
      '锅中放冰糖，小火炒至琥珀色糖色',
      '下肉块翻炒，均匀裹上糖色',
      '加料酒、生抽、老抽、八角、姜，翻炒均匀',
      '加热水没过肉，大火烧开转小火炖40分钟',
      '开盖大火收汁至浓稠'
    ]
  },
  '麻婆豆腐': {
    ingredients: [
      { name: '豆腐', amount: 400, unit: 'g' },
      { name: '猪肉末', amount: 100, unit: 'g' },
      { name: '郫县豆瓣', amount: 20, unit: 'g' },
      { name: '花椒粉', amount: 2, unit: 'g' },
      { name: '葱', amount: 10, unit: 'g' },
      { name: '蒜', amount: 3, unit: '瓣' },
      { name: '淀粉', amount: 8, unit: 'g' }
    ],
    steps: [
      '豆腐切2cm方块，入沸盐水焯1分钟，捞出',
      '热油炒香肉末至出油，加豆瓣炒出红油',
      '加蒜末炒香，倒入300ml水烧开',
      '放入豆腐轻推，小火煮3分钟入味',
      '淀粉水勾芡，撒花椒粉和葱花'
    ]
  }
};

/**
 * 查询菜谱
 * 精确匹配 → 模糊匹配 → 返回 null（调用方决定 fallback 策略）
 */
function getRecipe(dishName) {
  const name = (dishName || '').trim();
  if (RECIPES[name]) return RECIPES[name];
  for (const [key, val] of Object.entries(RECIPES)) {
    if (key.includes(name) || name.includes(key)) return val;
  }
  return null;
}

/**
 * 查询菜谱，找不到时返回默认菜（用于图像识别流程，保证有兜底）
 */
function getRecipeWithFallback(dishName) {
  return getRecipe(dishName) || RECIPES['番茄炒蛋'];
}

module.exports = { getRecipe, getRecipeWithFallback, RECIPES };
