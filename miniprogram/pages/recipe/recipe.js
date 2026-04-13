const { getExternalContent, getRecipeByName } = require('../../utils/api');

Page({
  data: {
    dishName: '',
    baseIngredients: [],
    scaledIngredients: [],
    steps: [],
    servings: 2,
    loading: true,
    error: '',
    externalContent: { bilibili: [], xiaohongshu: [] }
  },

  onLoad(options) {
    const dish = options.dish ? decodeURIComponent(options.dish) : '';

    if (options.data) {
      // 数据直接通过 URL 参数传入（来自识别结果或历史记录）
      let recipe = {};
      try { recipe = JSON.parse(decodeURIComponent(options.data)); } catch (e) {}
      this._display(dish, recipe);
    } else {
      // 仅有菜名（来自推荐卡片或食材找菜）
      this._fetchRecipe(dish);
    }
  },

  // ── 菜谱数据 ──────────────────────────────

  async _fetchRecipe(dishName) {
    this.setData({ loading: true, error: '' });
    try {
      const res = await getRecipeByName(dishName);
      if (res.success) {
        this._display(res.dishName || dishName, res.recipe || {});
      } else {
        this.setData({ error: res.message || '获取菜谱失败', loading: false });
      }
    } catch (err) {
      this.setData({ error: err.message || '网络异常', loading: false });
    }
  },

  _display(dishName, recipe) {
    const baseIngredients = recipe.ingredients || [];
    this.setData({
      dishName,
      baseIngredients,
      scaledIngredients: this._scaleIngredients(baseIngredients, 2),
      steps: recipe.steps || [],
      loading: false
    });
    // 异步加载外部教程，不阻塞主内容渲染
    if (dishName) this._loadExternalContent(dishName);
  },

  async _loadExternalContent(dishName) {
    try {
      const res = await getExternalContent(dishName);
      if (res.success) {
        this.setData({
          externalContent: {
            bilibili: res.bilibili || [],
            xiaohongshu: res.xiaohongshu || []
          }
        });
      }
    } catch (e) {
      // 外部内容加载失败静默处理
    }
  },

  // ── 食材份量 ──────────────────────────────

  _scaleIngredients(base, servings) {
    const ratio = servings / 2;
    return base.map(item => {
      if (typeof item === 'string') return item;
      const scaled = item.amount * ratio;
      const display = scaled % 1 === 0 ? scaled : parseFloat(scaled.toFixed(1));
      return `${item.name}  ${display}${item.unit}`;
    });
  },

  changeServings(e) {
    const delta = e.currentTarget.dataset.delta;
    const newServings = Math.max(1, Math.min(10, this.data.servings + delta));
    if (newServings === this.data.servings) return;
    this.setData({
      servings: newServings,
      scaledIngredients: this._scaleIngredients(this.data.baseIngredients, newServings)
    });
  },

  // ── 外部教程 ──────────────────────────────

  onExternalTap(e) {
    const url = e.currentTarget.dataset.url;
    wx.showModal({
      title: '即将复制链接',
      content: '该内容需在浏览器中打开，是否复制链接？',
      confirmText: '复制',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: url,
            success: () => {
              wx.showToast({ title: '链接已复制', icon: 'success', duration: 2000 });
            }
          });
        }
      }
    });
  },

  // ── 分享 ──────────────────────────────────

  onShareAppMessage() {
    return {
      title: `${this.data.dishName} - Chef 菜谱`,
      path: `/pages/recipe/recipe?dish=${encodeURIComponent(this.data.dishName)}&data=${encodeURIComponent(JSON.stringify({
        ingredients: this.data.baseIngredients,
        steps: this.data.steps
      }))}`
    };
  }
});
