const Storage = {
  KEY: "recipes",

  initialize: function () {
    const existingRecipes = this.getRecipes();
    if (existingRecipes.length === 0) {
      const sampleRecipes = this.getSampleRecipes();
      this.saveRecipes(sampleRecipes);
      return sampleRecipes;
    }
    return existingRecipes;
  },

  getRecipes: function () {
    try {
      const recipes = localStorage.getItem(this.KEY);
      return recipes ? JSON.parse(recipes) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      Utils.showNotification("Error loading recipes", "error");
      return [];
    }
  },

  saveRecipes: function (recipes) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(recipes));
      return true;
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      Utils.showNotification("Error saving recipe", "error");
      return false;
    }
  },

  getRecipe: function (id) {
    const recipes = this.getRecipes();
    return recipes.find((recipe) => recipe.id === id);
  },

  addRecipe: function (recipe) {
    const recipes = this.getRecipes();
    recipes.push(recipe);
    return this.saveRecipes(recipes);
  },

  updateRecipe: function (updatedRecipe) {
    const recipes = this.getRecipes();
    const index = recipes.findIndex((recipe) => recipe.id === updatedRecipe.id);
    if (index !== -1) {
      recipes[index] = updatedRecipe;
      return this.saveRecipes(recipes);
    }
    return false;
  },

  deleteRecipe: function (id) {
    const recipes = this.getRecipes();
    const filteredRecipes = recipes.filter((recipe) => recipe.id !== id);
    return this.saveRecipes(filteredRecipes);
  },

  getSampleRecipes: function () {
    return [
      {
        id: Utils.generateId(),
        title: "White Sauce Pasta",
        description: "Creamy and delicious white sauce pasta with vegetables.",
        prepTime: 15,
        cookTime: 20,
        difficulty: "Medium",
        imageUrl:
          "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        ingredients: [
          "250g pasta",
          "2 litres water",
          "2 tablespoons butter",
          "1.5 cups milk",
          "½ cup onion",
          "½ cup capsicum",
          "¼ cup carrot",
          "¼ cup sweet corn",
        ],
        instructions: [
          "Boil pasta in salted water for 7 minutes",
          "Sauté vegetables in butter",
          "Prepare white sauce with flour and milk",
          "Combine everything and serve hot",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Vegetable Stir Fry",
        description: "Quick and healthy vegetable stir fry with savory sauce.",
        prepTime: 10,
        cookTime: 10,
        difficulty: "Easy",
        imageUrl:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        ingredients: [
          "2 cups mixed vegetables",
          "2 tablespoons vegetable oil",
          "2 cloves garlic",
          "3 tablespoons soy sauce",
        ],
        instructions: [
          "Heat oil in wok",
          "Add garlic and stir fry",
          "Add vegetables and cook",
          "Add sauce and serve",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Chocolate Chip Cookies",
        description: "Classic soft and chewy chocolate chip cookies.",
        prepTime: 15,
        cookTime: 12,
        difficulty: "Easy",
        imageUrl:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        ingredients: [
          "2 ¼ cups flour",
          "1 teaspoon baking soda",
          "1 cup butter",
          "¾ cup sugar",
          "2 cups chocolate chips",
        ],
        instructions: [
          "Preheat oven to 375°F",
          "Mix dry ingredients",
          "Cream butter and sugars",
          "Bake for 9-11 minutes",
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  },
};
