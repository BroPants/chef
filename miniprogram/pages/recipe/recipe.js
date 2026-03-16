Page({
  data: {
    dishName: '',
    ingredients: [],
    steps: [],
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

    this.setData({
      dishName: dish,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      loading: false
    });
  },

  onShareAppMessage() {
    return {
      title: `${this.data.dishName} - Chef 菜谱`,
      path: `/pages/recipe/recipe?dish=${encodeURIComponent(this.data.dishName)}&data=${encodeURIComponent(JSON.stringify({
        ingredients: this.data.ingredients,
        steps: this.data.steps
      }))}`
    };
  }
});
