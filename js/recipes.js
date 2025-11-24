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
    const timeFilter = document.getElementById("timeFilter");

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
      timeFilter.addEventListener("input", () => {
        this.handleSearchAndFilter();
      });

      timeFilter.addEventListener("change", () => {
        this.handleSearchAndFilter();
      });
    }
  },

  // UPDATED TIME FILTER - Clear logic
  handleSearchAndFilter: function () {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    const difficultyFilter = document.getElementById("difficulty-filter").value;
    const timeFilterValue = document.getElementById("timeFilter").value.trim();

    let filtered = this.currentRecipes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm)
      );
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (recipe) => recipe.difficulty === difficultyFilter
      );
    }

    // ✅ UPDATED TIME FILTER - Clear logic
    if (timeFilterValue) {
      let maxMinutes = 0;

      // Convert "1 hr 30 min", "1h30m", "90min", etc. to total minutes
      if (timeFilterValue.includes("hr") || timeFilterValue.includes("h")) {
        // Extract hours and minutes
        const hoursMatch = timeFilterValue.match(/(\d+(\.\d+)?)\s*h(r)?/);
        const minsMatch = timeFilterValue.match(/(\d+)\s*m(in)?/);

        const hours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
        const minutes = minsMatch ? parseInt(minsMatch[1]) : 0;

        maxMinutes = hours * 60 + minutes;
        console.log(`Converted: ${hours}h ${minutes}m → ${maxMinutes} minutes`);
      } else {
        // Simple number input (assume minutes)
        maxMinutes = parseInt(timeFilterValue);
      }

      // Apply filter
      if (!isNaN(maxMinutes) && maxMinutes > 0) {
        filtered = filtered.filter((recipe) => {
          const totalTime = recipe.prepTime + recipe.cookTime;
          return totalTime <= maxMinutes;
        });

        console.log(
          `Showing recipes under ${maxMinutes} minutes (${Math.floor(
            maxMinutes / 60
          )}h ${maxMinutes % 60}m)`
        );
      }
    }

    this.renderRecipes(filtered);
  },
  clearFilters: function () {
    document.getElementById("search-input").value = "";
    document.getElementById("difficulty-filter").value = "all";
    document.getElementById("timeFilter").value = "";
    this.handleSearchAndFilter();
  },

  renderRecipes: function (recipes) {
    const recipeGrid = document.getElementById("recipe-grid");
    if (!recipeGrid) return;

    if (recipes.length === 0) {
      recipeGrid.innerHTML = `
            <div class="empty-state">
                <h3>No Recipes Found</h3>
                <p>Try adjusting your search criteria.</p>
                <button class="btn btn-primary" onclick="RecipeManager.clearFilters()">Clear Filters</button>
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
                            }">View Recipe</button>
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
  },
};
