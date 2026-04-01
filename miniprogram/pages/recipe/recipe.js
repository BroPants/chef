Page({
  data: {
    dishName: '',
    baseIngredients: [],
    scaledIngredients: [],
    steps: [],
    servings: 2,
    loading: true,
    error: ''
  },

  onLoad(options) {
    const dish = options.dish ? decodeURIComponent(options.dish) : '';
    let recipe = {};
    try {
      if (options.data) {
        recipe = JSON.parse(decodeURIComponent(options.data));
      }
    } catch (e) {
      console.error('parse recipe data error', e);
    }

    const baseIngredients = recipe.ingredients || [];
    this.setData({
      dishName: dish,
      baseIngredients,
      scaledIngredients: this._scaleIngredients(baseIngredients, 2),
      steps: recipe.steps || [],
      loading: false
    });
  },

  _scaleIngredients(base, servings) {
    const ratio = servings / 2;
    return base.map(item => {
      // 兼容旧格式（字符串）
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
