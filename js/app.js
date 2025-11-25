const App = {
  currentPage: "home",
  editingRecipeId: null,

  init: function () {
    this.setupEventListeners();
    this.navigateTo("home");
    RecipeManager.init();
    this.setupFooterLinks();
    this.setupRealTimeValidation();
    this.setupClearFilters();
    this.setupTimeFilter();
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

  // CORRECTED: Time filter setup
  setupTimeFilter: function () {
    const timeFilter = document.getElementById("timeFilter");

    if (timeFilter) {
      // Real-time filtering
      timeFilter.addEventListener("input", function () {
        RecipeManager.handleSearchAndFilter();
      });

      // Clear time filter when clear filters is clicked
      const clearFiltersBtn = document.getElementById("clear-filters");
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", function () {
          timeFilter.value = "";
          RecipeManager.handleSearchAndFilter();
        });
      }
    }
  },

  // ADDED: Clear filters setup
  setupClearFilters: function () {
    const clearFiltersBtn = document.getElementById("clear-filters");
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => {
        this.clearAllFilters();
      });
    }
  },

  clearAllFilters: function () {
    console.log("Clearing all filters...");

    // Clear search input
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = "";
    }

    // Reset difficulty filter
    const difficultyFilter = document.getElementById("difficulty-filter");
    if (difficultyFilter) {
      difficultyFilter.value = "all";
    }

    // Clear time filter
    const timeFilter = document.getElementById("timeFilter");
    if (timeFilter) {
      timeFilter.value = "";
    }

    RecipeManager.currentRecipes = Storage.getRecipes();
    RecipeManager.handleSearchAndFilter();

    Utils.showNotification("All filters cleared!", "success");

    // Add visual feedback
    const clearBtn = document.getElementById("clear-filters");
    if (clearBtn) {
      clearBtn.classList.add("active");
      setTimeout(() => {
        clearBtn.classList.remove("active");
      }, 2000);
    }
  },

  // ADDED: Real-time validation setup
  setupRealTimeValidation: function () {
    // Ingredients real-time validation
    document.addEventListener("input", (e) => {
      if (e.target.classList.contains("ingredient-input")) {
        this.validateIngredientsRealTime();
      }
      if (e.target.classList.contains("instruction-input")) {
        this.validateInstructionsRealTime();
      }
    });
  },

  // ADDED: Real-time ingredients validation
  validateIngredientsRealTime: function () {
    const ingredientInputs = document.querySelectorAll(".ingredient-input");
    const hasIngredients = Array.from(ingredientInputs).some(
      (input) => input.value.trim() !== ""
    );
    const errorElement = document.getElementById("ingredients-error");

    if (hasIngredients && errorElement) {
      errorElement.classList.remove("show");
    }
  },

  // ADDED: Real-time instructions validation
  validateInstructionsRealTime: function () {
    const instructionInputs = document.querySelectorAll(".instruction-input");
    const hasInstructions = Array.from(instructionInputs).some(
      (input) => input.value.trim() !== ""
    );
    const errorElement = document.getElementById("instructions-error");

    if (hasInstructions && errorElement) {
      errorElement.classList.remove("show");
    }
  },

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

  handleQuickLink: function (filterType) {
    console.log("Quick link clicked:", filterType);

    if (filterType !== "add") {
      this.navigateTo("home");
    }

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

    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  filterQuickMeals: function () {
    const allRecipes = RecipeManager.currentRecipes;
    const filteredQuickMeals = allRecipes.filter((recipe) => {
      const totalTime = recipe.prepTime + recipe.cookTime;
      return totalTime <= 15;
    });

    RecipeManager.renderRecipes(filteredQuickMeals);

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
        this.validateIngredientsRealTime(); // ADDED: Validate after removal
      }
      if (e.target.classList.contains("remove-instruction")) {
        this.removeFormField(e.target, "instructions");
        this.validateInstructionsRealTime(); // ADDED: Validate after removal
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
    } else if (page === "add" && !this.editingRecipeId) {
      // ✅ ONLY reset form if NOT in edit mode
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
    this.editingRecipeId = null; // ✅ Explicitly set to null
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

    // ✅ DEBUG LINES ADD KARO
    console.log("🔄 Form submitted, editing ID:", this.editingRecipeId);
    console.log("📝 Form data:", formData);

    let completeRecipeData;
    let success = false;

    if (this.editingRecipeId) {
      // ✅ EDIT MODE - Existing recipe update karo
      const existingRecipe = Storage.getRecipe(this.editingRecipeId);
      if (!existingRecipe) {
        Utils.showNotification("Recipe not found for editing", "error");
        return;
      }

      completeRecipeData = {
        ...existingRecipe, // ✅ Existing data retain karo
        ...formData, // ✅ New form data
        id: this.editingRecipeId, // ✅ Same ID rahega
        // createdAt unchanged rahega
      };

      console.log("📤 Sending to update:", completeRecipeData);
      success = Storage.updateRecipe(completeRecipeData);
    } else {
      // ✅ ADD MODE - New recipe
      completeRecipeData = {
        ...formData,
        id: Utils.generateId(),
        createdAt: new Date().toISOString(),
        imageUrl: formData.imageUrl || null,
      };
      success = Storage.addRecipe(completeRecipeData);
    }

    console.log("💾 Save result:", success);

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
    } else {
      Utils.showNotification(
        "Failed to save recipe. Check console for details.",
        "error"
      );
    }
  },

  validateForm: function () {
    let isValid = true;

    // Clear all previous errors
    this.clearAllErrors();

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

    // ✅ Prep Time Validation
    const prepTime = document.getElementById("prep-time").value;
    if (prepTime === "" || prepTime < 0) {
      this.showError(
        "prep-time",
        "Prep Time * is required (0 or more minutes)"
      );
      isValid = false;
    }

    // ✅ Cook Time Validation
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

    // ✅ Ingredients Validation - FIXED
    const ingredientInputs = document.querySelectorAll(".ingredient-input");
    const hasIngredients = Array.from(ingredientInputs).some(
      (input) => input.value.trim() !== ""
    );
    if (!hasIngredients) {
      this.showError("ingredients", "At least one ingredient is required");
      isValid = false;
    }

    // ✅ Instructions Validation - FIXED
    const instructionInputs = document.querySelectorAll(".instruction-input");
    const hasInstructions = Array.from(instructionInputs).some(
      (input) => input.value.trim() !== ""
    );
    if (!hasInstructions) {
      this.showError(
        "instructions",
        "At least one instruction step is required"
      );
      isValid = false;
    }

    return isValid;
  },

  // ADDED: Clear all errors function
  clearAllErrors: function () {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.classList.remove("show");
    });

    document.querySelectorAll(".error").forEach((el) => {
      el.classList.remove("error");
    });
  },

  showError: function (fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add("show");
    }

    if (inputElement) {
      inputElement.classList.add("error");
    }
  },

  getFormData: function (isEditForm = false) {
    const prefix = isEditForm ? "edit-" : "";

    return {
      title: document.getElementById(`${prefix}title`)?.value.trim() || "",
      description:
        document.getElementById(`${prefix}description`)?.value.trim() || "",
      prepTime:
        parseInt(document.getElementById(`${prefix}prep-time`)?.value) || 0,
      cookTime:
        parseInt(document.getElementById(`${prefix}cook-time`)?.value) || 0,
      difficulty:
        document.getElementById(`${prefix}difficulty`)?.value || "easy",
      imageUrl: document.getElementById(`${prefix}image-url`)?.value || "",
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

    this.clearAllErrors();
  },

  showRecipeDetail: function (recipeId) {
    const recipe = Storage.getRecipe(recipeId);
    if (!recipe) {
      Utils.showNotification("Recipe not found", "error");
      return;
    }

    const totalTime = recipe.prepTime + recipe.cookTime;

    // Remove existing modal if any
    const existingModal = document.querySelector(".recipe-modal-overlay");
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal HTML
    const modalHTML = `
        <div class="recipe-modal-overlay">
            <div class="recipe-modal-container">
                <div class="recipe-modal-header">
                    <button class="recipe-modal-close">&times;</button>
                    ${
                      recipe.imageUrl
                        ? `<img src="${recipe.imageUrl}" alt="${recipe.title}" class="recipe-modal-image"
                                 onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'">`
                        : `<div class="recipe-modal-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                                <span>📷 No Image Available</span>
                              </div>`
                    }
                    <h2 class="recipe-modal-title">${recipe.title}</h2>
                </div>
                
                <div class="recipe-modal-content">
                    <div class="recipe-modal-meta">
                        <div class="meta-item">
                            <div class="meta-label">Prep Time</div>
                            <div class="meta-value">${Utils.formatTime(
                              recipe.prepTime
                            )}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Cook Time</div>
                            <div class="meta-value">${Utils.formatTime(
                              recipe.cookTime
                            )}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Total Time</div>
                            <div class="meta-value">${Utils.formatTime(
                              totalTime
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

                    <div class="recipe-modal-body">
                        <div class="recipe-modal-section">
                            <h3>Description</h3>
                            <p>${recipe.description}</p>
                        </div>

                        <div class="recipe-modal-section">
                            <h3>Ingredients</h3>
                            <ul class="ingredients-list">
                                ${recipe.ingredients
                                  .map((ingredient) => `<li>${ingredient}</li>`)
                                  .join("")}
                            </ul>
                        </div>

                        <div class="recipe-modal-section">
                            <h3>Instructions</h3>
                            <ol class="instructions-list">
                                ${recipe.instructions
                                  .map(
                                    (instruction, index) => `
                                    <li>
                                        <div class="instruction-number">${
                                          index + 1
                                        }</div>
                                        <div class="instruction-text">${instruction}</div>
                                    </li>
                                `
                                  )
                                  .join("")}
                            </ol>
                        </div>
                    </div>
                </div>

                <div class="recipe-modal-actions">
                    <button class="btn btn-secondary edit-recipe-detail" data-id="${
                      recipe.id
                    }">Edit Recipe</button>
                    <button class="btn btn-danger delete-recipe-detail" data-id="${
                      recipe.id
                    }">Delete Recipe</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Add event listeners
    const modal = document.querySelector(".recipe-modal-overlay");
    const closeBtn = document.querySelector(".recipe-modal-close");
    const editBtn = document.querySelector(".edit-recipe-detail");
    const deleteBtn = document.querySelector(".delete-recipe-detail");

    // Close modal events
    const closeModal = () => modal.remove();

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Escape key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Edit and delete buttons
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        closeModal();
        this.prepareEditForm(recipeId);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        const recipeId = e.target.getAttribute("data-id");
        closeModal();
        this.deleteRecipe(recipeId);
      });
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

    if (imgPath.includes("file://")) {
      console.error("❌ LOCAL FILE PATH - May not work in browsers");
    } else if (imgPath.includes("http")) {
      console.log("✅ WEB URL - Should work");
    } else {
      console.log("📍 RELATIVE PATH - Check file exists");
    }
  });
}

document.addEventListener("DOMContentLoaded", debugImagePaths);

function safeRefresh() {
  console.log("Refreshing without clearing data...");
  RecipeManager.init();
  console.log("Recipes loaded:", RecipeManager.currentRecipes.length);
}
function goBackToHome() {
  window.location.href = "index.html";
}
function goBackToHome() {
  // Hide detail
  document.getElementById("detail").style.display = "none";

  // Show home
  document.getElementById("home").style.display = "block";

  // Refresh content
  setTimeout(() => {
    RecipeManager.renderRecipes(RecipeManager.currentRecipes);
  }, 100);
}
