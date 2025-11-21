const RecipeManager = {
  currentRecipes: [],

  init: function () {
    this.currentRecipes = Storage.initialize();
    this.renderRecipes(this.currentRecipes);
    this.setupEventListeners();
  },

  setupEventListeners: function () {
    const searchInput = document.getElementById("search-input");
    const difficultyFilter = document.getElementById("difficulty-filter");
    const timeFilter = document.getElementById("timeFilter"); // ✅ CORRECTED ID

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        this.handleSearchAndFilter();
      });
    }

    if (difficultyFilter) {
      difficultyFilter.addEventListener("change", () => {
        this.handleSearchAndFilter();
      });
    }

    if (timeFilter) {
      // ✅ ADDED: Real-time input event for instant filtering
      timeFilter.addEventListener("input", () => {
        this.handleSearchAndFilter();
      });

      // ✅ KEEP: Change event as backup
      timeFilter.addEventListener("change", () => {
        this.handleSearchAndFilter();
      });
    }
  },

  handleSearchAndFilter: function () {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const difficulty = document.getElementById("difficulty-filter").value;
    const maxTimeInput = document.getElementById("timeFilter").value; // ✅ CORRECTED ID

    // ✅ FIXED: Handle empty time input properly
    const maxTime = maxTimeInput === "" ? 0 : parseInt(maxTimeInput) || 0;

    console.log(
      "Filtering - Search:",
      searchTerm,
      "Difficulty:",
      difficulty,
      "Max Time:",
      maxTime
    );

    const filteredRecipes = this.currentRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchTerm)
        );

      const matchesDifficulty =
        difficulty === "all" || recipe.difficulty === difficulty;

      const totalTime = recipe.prepTime + recipe.cookTime;
      // ✅ FIXED: Time filter logic - show all when 0, filter when > 0
      const matchesTime = maxTime === 0 || totalTime <= maxTime;

      return matchesSearch && matchesDifficulty && matchesTime;
    });

    console.log("Filtered recipes:", filteredRecipes.length);
    this.renderRecipes(filteredRecipes);
  },

  clearFilters: function () {
    document.getElementById("search-input").value = "";
    document.getElementById("difficulty-filter").value = "all";
    document.getElementById("timeFilter").value = ""; // ✅ CORRECTED ID
    this.handleSearchAndFilter();
  },

  renderRecipes: function (recipes) {
    const recipeGrid = document.getElementById("recipe-grid");

    if (!recipeGrid) return;

    if (recipes.length === 0) {
      recipeGrid.innerHTML = `
        <div class="empty-state">
          <h3>No Recipes Found</h3>
          <p>Try adjusting your search criteria or clear filters to see all recipes.</p>
          <button class="btn btn-primary" onclick="RecipeManager.clearFilters()">Clear All Filters</button>
        </div>
      `;
      return;
    }

    recipeGrid.innerHTML = `
      <div class="recipes-grid">
        ${recipes
          .map(
            (recipe) => `
            <div class="recipe-card">
              <div class="recipe-image-container">
                <img src="${
                  recipe.imageUrl ||
                  "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                }" 
                     alt="${recipe.title}" 
                     class="recipe-image"
                     onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'">
              </div>
              <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-description">${recipe.description}</p>
                
                <div class="recipe-meta">
                  <div class="meta-item">
                    <div class="meta-label">Prep Time</div>
                    <div class="meta-value">${
                      recipe.prepTime === 0
                        ? "No prep"
                        : Utils.formatTime(recipe.prepTime)
                    }</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-label">Cook Time</div>
                    <div class="meta-value">${
                      recipe.cookTime === 0
                        ? "No cooking"
                        : Utils.formatTime(recipe.cookTime)
                    }</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-label">Total Time</div>
                    <div class="meta-value">${Utils.formatTime(
                      recipe.prepTime + recipe.cookTime
                    )}</div>
                  </div>
                  <div class="meta-item">
                    <div class="meta-label">Difficulty</div>
                    <div class="meta-value">
                      <span class="difficulty ${recipe.difficulty.toLowerCase()}">${
              recipe.difficulty
            }</span>
                    </div>
                  </div>
                </div>
                
                <div class="recipe-actions">
                  <button class="btn btn-primary view-recipe" data-id="${
                    recipe.id
                  }">View</button>
                  <button class="btn btn-secondary edit-recipe" data-id="${
                    recipe.id
                  }">Edit</button>
                  <button class="btn btn-danger delete-recipe" data-id="${
                    recipe.id
                  }">Delete</button>
                </div>
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    `;

    this.addRecipeCardEventListeners();
  },

  addRecipeCardEventListeners: function () {
    document.querySelectorAll(".view-recipe").forEach((button) => {
      button.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        App.showRecipeDetail(recipeId);
      });
    });

    document.querySelectorAll(".edit-recipe").forEach((button) => {
      button.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        App.prepareEditForm(recipeId);
      });
    });

    document.querySelectorAll(".delete-recipe").forEach((button) => {
      button.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        App.deleteRecipe(recipeId);
      });
    });
  },
};
