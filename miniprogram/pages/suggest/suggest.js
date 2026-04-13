const { suggestByIngredients, getRecipeByName } = require('../../utils/api');

Page({
  data: {
    inputValue: '',
    ingredients: [],
    dishes: [],
    loading: false,
    error: ''
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  addIngredient() {
    const val = this.data.inputValue.trim();
    if (!val) return;
    if (this.data.ingredients.includes(val)) {
      wx.showToast({ title: '食材已添加', icon: 'none', duration: 1200 });
      return;
    }
    this.setData({
      ingredients: [...this.data.ingredients, val],
      inputValue: ''
    });
  },

  removeIngredient(e) {
    const index = e.currentTarget.dataset.index;
    const ingredients = [...this.data.ingredients];
    ingredients.splice(index, 1);
    this.setData({ ingredients });
  },

  async onSearch() {
    if (this.data.ingredients.length === 0 || this.data.loading) return;

    this.setData({ loading: true, error: '', dishes: [] });

    try {
      const res = await suggestByIngredients(this.data.ingredients);
      if (res.success && res.dishes?.length > 0) {
        this.setData({ dishes: res.dishes });
      } else {
        this.setData({ error: '未找到合适的菜品，请尝试更换食材' });
      }
    } catch (err) {
      this.setData({ error: err.message || '网络异常，请稍后重试' });
    } finally {
      this.setData({ loading: false });
    }
  },

  async onDishTap(e) {
    const dishName = e.currentTarget.dataset.name;

    wx.showLoading({ title: '加载菜谱…', mask: true });

    try {
      const res = await getRecipeByName(dishName);
      wx.hideLoading();

      if (res.success) {
        wx.navigateTo({
          url: `/pages/recipe/recipe?dish=${encodeURIComponent(res.dishName || dishName)}&data=${encodeURIComponent(JSON.stringify(res.recipe || {}))}`
        });
      } else {
        wx.showToast({ title: res.message || '获取菜谱失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: err.message || '网络异常', icon: 'none' });
    }
  }
});
