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
      {
        id: Utils.generateId(),
        title: "Chocolate Cake",
        description:
          "Soft, moist and rich chocolate cake perfect for celebrations.",
        prepTime: 15,
        cookTime: 35,
        difficulty: "Medium",
        imageUrl: "images/cake.jpg",
        ingredients: [
          "1 cup all-purpose flour",
          "½ cup cocoa powder",
          "¾ cup sugar",
          "1 tsp baking powder",
          "½ tsp baking soda",
          "2 eggs or ½ cup curd",
          "½ cup milk",
          "¼ cup oil",
          "1 tsp vanilla essence",
          "½ cup hot water",
        ],
        instructions: [
          "Preheat oven to 180°C.",
          "Mix flour, cocoa, sugar, baking powder and baking soda.",
          "Whisk milk, eggs or curd, oil and vanilla.",
          "Combine wet and dry mixtures.",
          "Add hot water and mix.",
          "Bake for 30-35 minutes.",
          "Cool and add chocolate frosting.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Instant Dhokla",
        description:
          "Soft and spongy Gujarati dhokla made quickly using besan and eno.",
        prepTime: 10,
        cookTime: 15,
        difficulty: "Easy",
        imageUrl: "images/dhokla.jpg",
        ingredients: [
          "1 cup besan",
          "1 cup water",
          "1 tbsp lemon juice",
          "1 tbsp sugar",
          "Salt to taste",
          "1 tbsp eno",
          "1 tsp mustard seeds",
          "2 green chilies",
          "Curry leaves",
          "1 tbsp oil",
          "½ cup water for tadka",
        ],
        instructions: [
          "Mix besan, water, lemon juice, salt and sugar.",
          "Add eno and pour quickly into tray.",
          "Steam for 15 minutes.",
          "Prepare tempering with oil, mustard seeds, chilies and curry leaves.",
          "Add sugar + lemon water to tempering.",
          "Pour tadka over dhokla and cut into squares.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Veg Hakka Noodles",
        description:
          "Street-style hakka noodles tossed with veggies, soy sauce and pepper.",
        prepTime: 10,
        cookTime: 15,
        difficulty: "Medium",
        imageUrl: "images/noodles.jpg",
        ingredients: [
          "200g hakka noodles",
          "1 tbsp oil",
          "1 tbsp chopped garlic",
          "½ cup sliced onion",
          "½ cup cabbage",
          "½ cup capsicum",
          "¼ cup carrot",
          "2 tbsp soy sauce",
          "1 tbsp vinegar",
          "1 tsp green chilli sauce",
          "½ tsp black pepper",
          "Salt to taste",
          "Spring onions",
        ],
        instructions: [
          "Boil noodles and rinse with cold water.",
          "Heat oil and fry garlic.",
          "Add onion, cabbage, capsicum and carrot on high flame.",
          "Add soy sauce, vinegar, chilli sauce and pepper.",
          "Add noodles and toss well.",
          "Garnish with spring onions before serving.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Fresh Veg Salad",
        description:
          "Healthy, crunchy and refreshing salad with lemon dressing.",
        prepTime: 8,
        cookTime: 0,
        difficulty: "Easy",
        imageUrl: "images/salad.jpg",
        ingredients: [
          "1 cup chopped cucumber",
          "1 cup chopped tomato",
          "½ cup sliced onion",
          "½ cup carrot",
          "½ cup capsicum",
          "½ cup boiled sweet corn",
          "1 tbsp lemon juice",
          "1 tbsp olive oil",
          "Salt to taste",
          "½ tsp black pepper",
          "½ tsp chaat masala",
        ],
        instructions: [
          "Add all chopped veggies in a bowl.",
          "Mix lemon juice, oil, salt, pepper and chaat masala for dressing.",
          "Pour dressing over veggies.",
          "Toss gently and serve fresh.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Veg Cheese Sandwich",
        description:
          "Quick and tasty cheesy vegetable sandwich perfect for breakfast.",
        prepTime: 10,
        cookTime: 5,
        difficulty: "Easy",
        imageUrl: "images/sandwich.jpg",
        ingredients: [
          "4 bread slices",
          "½ cup sliced cucumber",
          "½ cup sliced tomato",
          "½ cup onion rings",
          "½ cup capsicum",
          "2 tbsp mayonnaise or chutney",
          "2 cheese slices",
          "Butter for grilling",
          "Salt and pepper",
          "Oregano",
        ],
        instructions: [
          "Spread butter and mayo/chutney on bread.",
          "Layer cucumber, tomato, onion and capsicum.",
          "Add salt, pepper and oregano.",
          "Place cheese slice and close sandwich.",
          "Grill on pan or maker for 2–3 minutes.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Paneer Butter Masala",
        description:
          "Rich, creamy, restaurant-style paneer butter masala made with cashew paste and aromatic spices.",
        prepTime: 25,
        cookTime: 35,
        difficulty: "Hard",
        imageUrl: "images/paneer-butter-masala.jpg",
        ingredients: [
          "250g paneer cubes",
          "3 tomatoes",
          "1 onion sliced",
          "10-12 cashews",
          "1 tbsp ginger-garlic paste",
          "1 tsp red chili powder",
          "1 tsp garam masala",
          "1/2 tsp turmeric",
          "1 bay leaf",
          "1 cinnamon stick",
          "1/2 cup cream",
          "2 tbsp butter",
          "Salt to taste",
          "1 tbsp kasuri methi",
        ],
        instructions: [
          "Boil tomatoes, onions and cashews together for 10 minutes.",
          "Cool and grind to a smooth puree.",
          "Heat butter, add bay leaf and cinnamon, then ginger-garlic paste.",
          "Add tomato-cashew puree and cook until thick.",
          "Add chili powder, turmeric, garam masala and salt.",
          "Add cream and kasuri methi, mix well.",
          "Add paneer cubes and simmer for 5 minutes.",
          "Serve hot with naan or rice.",
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: Utils.generateId(),
        title: "Chicken Dum Biryani",
        description:
          "Authentic layered dum biryani made with marinated chicken, fragrant basmati rice and whole spices.",
        prepTime: 40,
        cookTime: 60,
        difficulty: "Hard",
        imageUrl: "images/biryani.jpg",
        ingredients: [
          "500g chicken",
          "2 cups basmati rice",
          "1 cup fried onions",
          "1 cup yogurt",
          "2 tbsp ginger-garlic paste",
          "1 tsp turmeric",
          "2 tsp biryani masala",
          "1 tsp red chili powder",
          "Whole spices (bay leaf, cinnamon, cloves, cardamom)",
          "1/2 cup mint leaves",
          "1/2 cup coriander leaves",
          "Saffron milk",
          "Ghee",
          "Salt to taste",
        ],
        instructions: [
          "Wash rice and soak for 30 minutes.",
          "Marinate chicken with yogurt, spices, fried onions, mint, coriander and salt for 1 hour.",
          "Half-boil basmati rice with whole spices.",
          "Layer marinated chicken at bottom of pot.",
          "Add half-cooked rice above it.",
          "Pour saffron milk and ghee on top.",
          "Seal lid using dough and cook on dum for 40 minutes on low flame.",
          "Let it rest for 10 minutes before serving.",
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  },
};
