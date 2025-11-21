const App = {
  currentPage: "home",
  editingRecipeId: null,

  init: function () {
    this.setupEventListeners();
    this.navigateTo("home");
    RecipeManager.init();
    this.setupFooterLinks(); // ADDED: Initialize footer links
  },

  setupEventListeners: function () {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("data-page");
        this.navigateTo(page);
      });
    });

    const recipeForm = document.getElementById("recipe-form");
    if (recipeForm) {
      recipeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.navigateTo("home");
      });
    }

    this.setupDynamicFormListeners();

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("back-to-home")) {
        this.navigateTo("home");
      }
    });
  },

  // ADDED: Footer links setup
  setupFooterLinks: function () {
    const quickLinks = document.querySelectorAll(".quick-link");

    quickLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const filterType = link.getAttribute("data-filter");
        this.handleQuickLink(filterType);
      });
    });
  },

  // ADDED: Handle footer quick links
  handleQuickLink: function (filterType) {
    console.log("Quick link clicked:", filterType);

    // Always navigate to home first (except for add recipe)
    if (filterType !== "add") {
      this.navigateTo("home");
    }

    // Apply filters after a short delay to ensure page is loaded
    setTimeout(() => {
      switch (filterType) {
        case "all":
          RecipeManager.clearFilters();
          break;

        case "add":
          this.navigateTo("add");
          break;

        case "easy":
          document.getElementById("difficulty-filter").value = "Easy";
          RecipeManager.handleSearchAndFilter();
          break;

        case "dessert":
          this.filterDesserts();
          break;

        case "quick":
          this.filterQuickMeals();
          break;
      }
    }, 100);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  // ADDED: Filter quick meals function
  filterQuickMeals: function () {
    const allRecipes = RecipeManager.currentRecipes;
    const filteredQuickMeals = allRecipes.filter((recipe) => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      return totalTime <= 15; // 15 minutes or less
    });

    RecipeManager.renderRecipes(filteredQuickMeals);

    // Show message if no quick meals found
    if (filteredQuickMeals.length === 0) {
      const recipeGrid = document.getElementById("recipe-grid");
      if (recipeGrid) {
        recipeGrid.innerHTML = `
          <div class="empty-state">
            <h3>No Quick Meals Found</h3>
            <p>No recipes under 15 minutes available. Add some quick recipes!</p>
          </div>
        `;
      }
    }
  },

  setupDynamicFormListeners: function () {
    const addIngredientBtn = document.getElementById("add-ingredient");
    if (addIngredientBtn) {
      addIngredientBtn.addEventListener("click", () => {
        this.addFormField("ingredients");
      });
    }

    const addInstructionBtn = document.getElementById("add-instruction");
    if (addInstructionBtn) {
      addInstructionBtn.addEventListener("click", () => {
        this.addFormField("instructions");
      });
    }

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-ingredient")) {
        this.removeFormField(e.target, "ingredients");
      }
      if (e.target.classList.contains("remove-instruction")) {
        this.removeFormField(e.target, "instructions");
      }
    });
  },

  navigateTo: function (page) {
    document.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });

    const targetPage = document.getElementById(page);
    if (targetPage) {
      targetPage.classList.add("active");

      const navLink = document.querySelector(`[data-page="${page}"]`);
      if (navLink) {
        navLink.classList.add("active");
      }
    }

    this.currentPage = page;

    if (page === "home") {
      this.resetForm();
      RecipeManager.renderRecipes(RecipeManager.currentRecipes);
    } else if (page === "add") {
      this.prepareAddForm();
    }
  },

  addFormField: function (type) {
    const container = document.getElementById(`${type}-container`);
    const placeholder =
      type === "ingredients" ? "Ingredient and amount" : "Step description";

    const fieldHTML =
      type === "ingredients"
        ? `<div class="ingredient-item">
          <input type="text" class="ingredient-input" placeholder="${placeholder}">
          <button type="button" class="remove-ingredient">×</button>
        </div>`
        : `<div class="instruction-item">
          <textarea class="instruction-input" placeholder="${placeholder}"></textarea>
          <button type="button" class="remove-instruction">×</button>
        </div>`;

    container.insertAdjacentHTML("beforeend", fieldHTML);
  },

  removeFormField: function (button, type) {
    const container = document.getElementById(`${type}-container`);
    const items = container.querySelectorAll(
      `.${type === "ingredients" ? "ingredient-item" : "instruction-item"}`
    );

    if (items.length > 1) {
      button
        .closest(
          type === "ingredients" ? ".ingredient-item" : ".instruction-item"
        )
        .remove();
    } else {
      Utils.showNotification(
        `At least one ${type.slice(0, -1)} is required`,
        "error"
      );
    }
  },

  prepareAddForm: function () {
    this.editingRecipeId = null;
    document.getElementById("form-title").textContent = "Add New Recipe";
    this.resetForm();
  },

  prepareEditForm: function (recipeId) {
    const recipe = Storage.getRecipe(recipeId);
    if (!recipe) {
      Utils.showNotification("Recipe not found", "error");
      return;
    }

    this.editingRecipeId = recipeId;
    this.navigateTo("add");
    document.getElementById("form-title").textContent = "Edit Recipe";

    setTimeout(() => {
      document.getElementById("recipe-id").value = recipe.id;
      document.getElementById("title").value = recipe.title;
      document.getElementById("description").value = recipe.description;
      document.getElementById("prep-time").value = recipe.prepTime;
      document.getElementById("cook-time").value = recipe.cookTime;
      document.getElementById("difficulty").value = recipe.difficulty;
      document.getElementById("image-url").value = recipe.imageUrl || "";

      const ingredientsContainer = document.getElementById(
        "ingredients-container"
      );
      ingredientsContainer.innerHTML = "";
      recipe.ingredients.forEach((ingredient) => {
        const div = document.createElement("div");
        div.className = "ingredient-item";
        div.innerHTML = `
          <input type="text" class="ingredient-input" value="${ingredient}">
          <button type="button" class="remove-ingredient">×</button>
        `;
        ingredientsContainer.appendChild(div);
      });

      const instructionsContainer = document.getElementById(
        "instructions-container"
      );
      instructionsContainer.innerHTML = "";
      recipe.instructions.forEach((instruction) => {
        const div = document.createElement("div");
        div.className = "instruction-item";
        div.innerHTML = `
          <textarea class="instruction-input">${instruction}</textarea>
          <button type="button" class="remove-instruction">×</button>
        `;
        instructionsContainer.appendChild(div);
      });
    }, 100);
  },

  handleFormSubmit: function () {
    if (!this.validateForm()) {
      return;
    }

    const formData = this.getFormData();
    const completeRecipeData = {
      ...formData,
      id: this.editingRecipeId || Utils.generateId(),
      createdAt: new Date().toISOString(),
      imageUrl: formData.imageUrl || null,
    };

    let success = false;

    if (this.editingRecipeId) {
      completeRecipeData.id = this.editingRecipeId;
      success = Storage.updateRecipe(completeRecipeData);
    } else {
      success = Storage.addRecipe(completeRecipeData);
    }

    if (success) {
      const message = this.editingRecipeId
        ? "Recipe updated successfully!"
        : "Recipe added successfully!";
      Utils.showNotification(message, "success");

      setTimeout(() => {
        RecipeManager.currentRecipes = Storage.getRecipes();
        RecipeManager.renderRecipes(RecipeManager.currentRecipes);
        this.navigateTo("home");
        this.resetForm();
        this.editingRecipeId = null;
      }, 800);
    }
  },

  validateForm: function () {
    let isValid = true;

    document.querySelectorAll(".error-message").forEach((el) => {
      el.classList.remove("show");
    });
    document.querySelectorAll(".error").forEach((el) => {
      el.classList.remove("error");
    });

    // ✅ Recipe Title Validation
    const title = document.getElementById("title").value.trim();
    if (!title) {
      this.showError("title", "Recipe title is required");
      isValid = false;
    }

    // ✅ Description Validation
    const description = document.getElementById("description").value.trim();
    if (!description) {
      this.showError("description", "Description is required");
      isValid = false;
    }

    // ✅ Prep Time Validation (0 allowed)
    const prepTime = document.getElementById("prep-time").value;
    if (prepTime === "" || prepTime < 0) {
      this.showError(
        "prep-time",
        "Please enter a valid prep time (0 or more minutes)"
      );
      isValid = false;
    }

    // ✅ Cook Time Validation (0 allowed)
    const cookTime = document.getElementById("cook-time").value;
    if (cookTime === "" || cookTime < 0) {
      this.showError(
        "cook-time",
        "Please enter a valid cook time (0 or more minutes)"
      );
      isValid = false;
    }

    // ✅ Difficulty Validation
    const difficulty = document.getElementById("difficulty").value;
    if (!difficulty) {
      this.showError("difficulty", "Please select a difficulty level");
      isValid = false;
    }

    // ✅ Image URL Validation (Optional)
    const imageUrl = document.getElementById("image-url").value.trim();
    if (imageUrl && !Utils.isValidUrl(imageUrl)) {
      this.showError("image-url", "Please enter a valid URL");
      isValid = false;
    }

    // ✅ Ingredients Validation
    const ingredients = this.getIngredients();
    if (ingredients.length === 0) {
      this.showError("ingredients", "At least one ingredient is required");
      isValid = false;
    } else if (ingredients.some((ing) => !ing.trim())) {
      this.showError("ingredients", "All ingredients must be filled");
      isValid = false;
    }

    // ✅ Instructions Validation
    const instructions = this.getInstructions();
    if (instructions.length === 0) {
      this.showError(
        "instructions",
        "At least one instruction step is required"
      );
      isValid = false;
    } else if (instructions.some((inst) => !inst.trim())) {
      this.showError("instructions", "All instruction steps must be filled");
      isValid = false;
    }

    return isValid;
  },
  showError: function (fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement && inputElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
      inputElement.classList.add("error");
    }
  },

  getFormData: function () {
    return {
      title: document.getElementById("title").value.trim(),
      description: document.getElementById("description").value.trim(),
      prepTime: parseInt(document.getElementById("prep-time").value),
      cookTime: parseInt(document.getElementById("cook-time").value),
      difficulty: document.getElementById("difficulty").value,
      imageUrl: document.getElementById("image-url").value.trim() || null,
      ingredients: this.getIngredients(),
      instructions: this.getInstructions(),
    };
  },

  getIngredients: function () {
    const inputs = document.querySelectorAll(".ingredient-input");
    return Array.from(inputs)
      .map((input) => input.value.trim())
      .filter((ing) => ing);
  },

  getInstructions: function () {
    const inputs = document.querySelectorAll(".instruction-input");
    return Array.from(inputs)
      .map((input) => input.value.trim())
      .filter((inst) => inst);
  },

  resetForm: function () {
    const form = document.getElementById("recipe-form");
    if (form) {
      form.reset();
    }

    const ingredientsContainer = document.getElementById(
      "ingredients-container"
    );
    const instructionsContainer = document.getElementById(
      "instructions-container"
    );

    if (ingredientsContainer) {
      ingredientsContainer.innerHTML = `
        <div class="ingredient-item">
          <input type="text" class="ingredient-input" placeholder="Ingredient and amount">
          <button type="button" class="remove-ingredient">×</button>
        </div>
      `;
    }

    if (instructionsContainer) {
      instructionsContainer.innerHTML = `
        <div class="instruction-item">
          <textarea class="instruction-input" placeholder="Step description"></textarea>
          <button type="button" class="remove-instruction">×</button>
        </div>
      `;
    }

    document.querySelectorAll(".error-message").forEach((el) => {
      el.classList.remove("show");
    });
    document.querySelectorAll(".error").forEach((el) => {
      el.classList.remove("error");
    });
  },

  showRecipeDetail: function (recipeId) {
    const recipe = Storage.getRecipe(recipeId);
    if (!recipe) {
      Utils.showNotification("Recipe not found", "error");
      return;
    }

    const detailContainer = document.getElementById("recipe-detail");
    const totalTime = recipe.prepTime + recipe.cookTime;

    detailContainer.innerHTML = `
      <div class="recipe-detail-container">
        <div class="recipe-detail-header">
          ${
            recipe.imageUrl
              ? `<img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-detail-image"
                   onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'">`
              : `<div class="recipe-detail-image" style="background-color: #e9ecef; display: flex; align-items: center; justify-content: center; color: #6c757d;">
                  <span>No Image Available</span>
                </div>`
          }
          <h2 class="recipe-detail-title">${recipe.title}</h2>
        </div>
        
        <div class="recipe-detail-meta">
          <div class="meta-item">
            <div class="meta-label">Prep Time</div>
            <div class="meta-value">${Utils.formatTime(recipe.prepTime)}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Cook Time</div>
            <div class="meta-value">${Utils.formatTime(recipe.cookTime)}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">Total Time</div>
            <div class="meta-value">${Utils.formatTime(totalTime)}</div>
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

        <div class="recipe-detail-content">
          <div class="recipe-section">
            <h3>Description</h3>
            <p>${recipe.description}</p>
          </div>

          <div class="recipe-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
              ${recipe.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="recipe-section">
            <h3>Instructions</h3>
            <ol class="instructions-list">
              ${recipe.instructions
                .map(
                  (instruction, index) => `
                <li>
                  <div class="instruction-number">${index + 1}</div>
                  <div class="instruction-text">${instruction}</div>
                </li>`
                )
                .join("")}
            </ol>
          </div>
        </div>

        <div class="recipe-detail-actions">
          <button class="btn btn-primary back-to-home">Back to Recipes</button>
          <button class="btn btn-secondary edit-recipe-detail" data-id="${
            recipe.id
          }">Edit Recipe</button>
          <button class="btn btn-danger delete-recipe-detail" data-id="${
            recipe.id
          }">Delete Recipe</button>
        </div>
      </div>
    `;

    const editBtn = detailContainer.querySelector(".edit-recipe-detail");
    const deleteBtn = detailContainer.querySelector(".delete-recipe-detail");

    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        this.prepareEditForm(recipeId);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        this.deleteRecipe(recipeId);
      });
    }

    this.navigateTo("detail");
  },

  deleteRecipe: function (recipeId) {
    const recipe = Storage.getRecipe(recipeId);
    if (!recipe) return;

    if (
      confirm(
        `Are you sure you want to delete "${recipe.title}"? This action cannot be undone.`
      )
    ) {
      if (Storage.deleteRecipe(recipeId)) {
        Utils.showNotification("Recipe deleted successfully", "success");
        RecipeManager.currentRecipes = Storage.getRecipes();

        if (this.currentPage === "detail") {
          this.navigateTo("home");
        } else {
          RecipeManager.renderRecipes(RecipeManager.currentRecipes);
        }
      }
    }
  },
};

document.addEventListener("DOMContentLoaded", function () {
  App.init();

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-recipe")) {
      const recipeId = e.target.getAttribute("data-id");
      App.prepareEditForm(recipeId);
    }

    if (e.target.classList.contains("delete-recipe")) {
      const recipeId = e.target.getAttribute("data-id");
      App.deleteRecipe(recipeId);
    }

    if (e.target.classList.contains("view-recipe")) {
      const recipeId = e.target.getAttribute("data-id");
      App.showRecipeDetail(recipeId);
    }
  });
});

// Image path debugger
function debugImagePaths() {
  console.log("=== IMAGE PATH DEBUGGER ===");

  const images = document.querySelectorAll("img");
  images.forEach((img, index) => {
    const imgPath = img.src;
    console.log(`Image ${index + 1}: ${imgPath}`);

    // Check if it's a local file
    if (imgPath.includes("file://")) {
      console.error("❌ LOCAL FILE PATH - May not work in browsers");
    } else if (imgPath.includes("http")) {
      console.log("✅ WEB URL - Should work");
    } else {
      console.log("📍 RELATIVE PATH - Check file exists");
    }
  });
}

// Run when page loads
document.addEventListener("DOMContentLoaded", debugImagePaths);

// Safe refresh function
function safeRefresh() {
  console.log("Refreshing without clearing data...");
  RecipeManager.init();
  console.log("Recipes loaded:", RecipeManager.currentRecipes.length);
}
