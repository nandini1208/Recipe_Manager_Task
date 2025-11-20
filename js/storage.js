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
        imageUrl: "images/img.jpg",
        ingredients: [
          "250g pasta (penne, fusilli, or similar)",
          "2 litres water",
          "1/2 teaspoon salt (plus extra as needed)",
          "1/2 teaspoon oil",
          "2 tablespoons butter",
          "1.5 tablespoons all-purpose flour (maida)",
          "1.5 cups milk (room temperature or slightly warm)",
          "2 cloves garlic, finely chopped (optional but recommended)",
          "1/2 cup onion, finely chopped",
          "1/2 cup capsicum, chopped",
          "1/4 cup carrot, chopped",
          "1/4 cup sweet corn",
          "1/2 teaspoon black pepper, freshly ground",
          "1/2 teaspoon oregano",
          "1/4 teaspoon chilli flakes",
          "2 cheese slices or 1/2 cup grated cheese",
          "1 tablespoon fresh cream (optional)",
          "Salt to taste",
        ],

        instructions: [
          "Boil 2 litres of water with 1/2 tsp salt and 1/2 tsp oil. Add pasta and cook for 7–9 minutes until al dente. Drain and rinse with cold water. Set aside.",
          "Heat 1 tbsp butter in a pan. Add garlic and sauté 30 seconds. Add onion, capsicum, carrot, and sweet corn. Cook for 2 minutes without browning. Remove and set aside.",
          "Add remaining 1 tbsp butter to the same pan. Add flour and mix for 1 minute until slightly frothy (do not brown).",
          "Slowly pour milk in 3–4 batches while whisking continuously to avoid lumps. Cook for 2–3 minutes until it thickens.",
          "Add cheese slices/grated cheese, black pepper, oregano, chilli flakes, and salt. Mix until smooth and creamy. Add cream if using.",
          "Add cooked vegetables and pasta into the sauce. Mix gently and cook for 1–2 minutes.",
          "Taste and adjust seasoning. Serve hot with extra chilli flakes or oregano.",
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
        imageUrl: "images/vegetables-stir-fry.jpg",
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
        imageUrl: "images/chocolate-chip-cookie.jpg",
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
