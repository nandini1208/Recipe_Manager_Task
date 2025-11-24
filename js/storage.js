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
    try {
      const recipes = this.getRecipes();

      // ✅ PURANA METHOD - Filter out the old recipe and add updated one
      const filteredRecipes = recipes.filter(
        (recipe) => recipe.id !== updatedRecipe.id
      );
      filteredRecipes.push(updatedRecipe);

      localStorage.setItem(this.KEY, JSON.stringify(filteredRecipes));

      console.log(
        "✅ Recipe updated. Before:",
        recipes.length,
        "After:",
        filteredRecipes.length
      );
      return true;
    } catch (error) {
      console.error("Error updating recipe:", error);
      return false;
    }
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
        description:
          "Creamy, rich, and perfectly seasoned white sauce pasta loaded with fresh vegetables. A comforting and delicious dish for any day!",
        prepTime: 15,
        cookTime: 20,
        difficulty: "Medium",
        imageUrl: "images/img1.jpg",
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
        description:
          "Quick and healthy vegetable stir fry tossed in a flavorful savory sauce.",
        prepTime: 10,
        cookTime: 10,
        totalTime: 20,
        difficulty: "Easy",
        imageUrl: "images/img2.png",
        ingredients: [
          "2 cups mixed vegetables",
          "2 tablespoons vegetable oil",
          "2 cloves garlic, minced",
          "3 tablespoons soy sauce",
        ],
        instructions: [
          "Heat oil in a wok on medium-high flame.",
          "Add minced garlic and stir fry for a few seconds.",
          "Add mixed vegetables and cook for 3–4 minutes.",
          "Pour soy sauce, mix well, and cook for another minute.",
          "Serve hot.",
        ],
        createdAt: new Date().toISOString(),
      },

      {
        id: Utils.generateId(),
        title: "Chocolate Chip Cookies",
        description:
          "Classic soft and chewy chocolate chip cookies with rich chocolate flavor.",
        prepTime: 15,
        cookTime: 12,
        totalTime: 27,
        difficulty: "Easy",
        imageUrl: "images/img3.jpg",
        ingredients: [
          "2 ¼ cups all-purpose flour",
          "1 teaspoon baking soda",
          "1 cup butter, softened",
          "¾ cup sugar",
          "¾ cup brown sugar",
          "2 cups chocolate chips",
        ],
        instructions: [
          "Preheat your oven to 375°F (190°C).",
          "In a bowl, whisk together the flour and baking soda.",
          "Cream the softened butter, sugar, and brown sugar until fluffy.",
          "Gradually mix dry ingredients into the butter mixture.",
          "Fold in the chocolate chips.",
          "Scoop dough onto a baking tray.",
          "Bake for 9–11 minutes until golden brown.",
        ],
        createdAt: new Date().toISOString(),
      },

      {
        id: Utils.generateId(),
        title: "Chocolate Cake",
        description:
          "Soft, moist, and rich chocolate cake perfect for birthdays and celebrations.",
        prepTime: 15,
        cookTime: 35,
        totalTime: 50,
        difficulty: "Medium",
        imageUrl: "images/img4.webp",
        ingredients: [
          "1 cup all-purpose flour",
          "1/2 cup cocoa powder",
          "3/4 cup sugar",
          "1 tsp baking powder",
          "1/2 tsp baking soda",
          "2 eggs or 1/2 cup curd (for eggless option)",
          "1/2 cup milk",
          "1/4 cup oil",
          "1 tsp vanilla essence",
          "1/2 cup hot water",
        ],
        instructions: [
          "Preheat the oven to 180°C (350°F). Grease and line a cake tin.",
          "In a bowl, mix flour, cocoa powder, sugar, baking powder, and baking soda.",
          "In another bowl, whisk together milk, eggs or curd, oil, and vanilla essence.",
          "Combine the wet and dry ingredients and mix gently.",
          "Add hot water gradually and mix until the batter becomes smooth.",
          "Pour the batter into the cake tin and bake for 30–35 minutes.",
          "Let the cake cool completely, then frost with chocolate icing.",
        ],
        createdAt: new Date().toISOString(),
      },

      {
        id: Utils.generateId(),
        title: "Dhokla",
        description: "images/img5.jpg",
        prepTime: 10,
        cookTime: 15,
        totalTime: 25,
        difficulty: "Medium",
        imageUrl:
          "https://rakskitchen.net/wp-content/uploads/2011/09/khaman-besan.jpg",
        ingredients: [
          "1 cup besan (gram flour)",
          "1 cup water",
          "1 tbsp lemon juice",
          "1 tbsp sugar",
          "Salt to taste",
          "1 tbsp eno (fruit salt)",
          "1 tsp mustard seeds",
          "2 green chilies (slit)",
          "A few curry leaves",
          "1 tbsp oil",
          "1/2 cup water (for tadka)",
        ],
        instructions: [
          "In a bowl, whisk together besan, water, lemon juice, salt, and sugar until smooth.",
          "Add eno, mix gently, and immediately pour the batter into a greased tray.",
          "Steam the batter for about 15 minutes or until a toothpick comes out clean.",
          "For tempering, heat oil and add mustard seeds, green chilies, and curry leaves.",
          "Add 1/2 cup water with a little lemon and sugar to the tempering and mix well.",
          "Pour the prepared tadka evenly over the steamed dhokla.",
          "Cut into squares and serve warm.",
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
        totalTime: 15,
        difficulty: "Easy",
        imageUrl: "images/img6.jpg",
        ingredients: [
          "4 bread slices",
          "1/2 cup sliced cucumber",
          "1/2 cup sliced tomato",
          "1/2 cup onion rings",
          "1/2 cup capsicum",
          "2 tbsp mayonnaise or green chutney",
          "2 cheese slices",
          "Butter for grilling",
          "Salt and pepper",
          "Oregano",
        ],
        instructions: [
          "Spread butter and mayo/chutney on bread slices.",
          "Layer cucumber, tomato, onion and capsicum.",
          "Sprinkle salt, pepper and oregano.",
          "Place cheese slice and close the sandwich.",
          "Grill on pan or sandwich maker for 2–3 minutes.",
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
        totalTime: 60,
        difficulty: "Hard",
        imageUrl: "images/img7.webp",
        ingredients: [
          "250g paneer cubes",
          "3 tomatoes",
          "1 sliced onion",
          "10–12 cashews",
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
          "Boil tomatoes, onion and cashews for 10 minutes.",
          "Cool and blend into a smooth puree.",
          "Heat butter, add bay leaf, cinnamon and ginger-garlic paste.",
          "Add tomato-cashew puree and cook until thick.",
          "Add chili powder, turmeric, garam masala and salt.",
          "Add cream and kasuri methi.",
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
        totalTime: 100,
        difficulty: "Hard",
        imageUrl: "images/img8.png",
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
          "Half-boil the rice with whole spices.",
          "Layer marinated chicken at the bottom of the pot.",
          "Spread half-cooked rice above it.",
          "Pour saffron milk and ghee on top.",
          "Seal lid with dough and cook on dum for 40 minutes on low flame.",
          "Rest for 10 minutes before serving.",
        ],
        createdAt: new Date().toISOString(),
      },
    ];
  },
};
