# 🍳 Nandini's Recipe Manager

A beautiful and responsive recipe management web application where you can store, organize, and manage your favorite recipes with ease.

## ✨ Features

### 🎯 Core Functionality

- **Add New Recipes** - Complete form with ingredients and instructions
- **View Recipes** - Beautiful grid layout with recipe cards
- **Edit Recipes** - Update existing recipes easily
- **Delete Recipes** - Remove recipes with confirmation
- **Recipe Details** - Detailed view with step-by-step instructions

### 🔍 Smart Filtering & Search

- **Search Recipes** - Real-time search by title and description
- **Filter by Difficulty** - Easy, Medium, Hard
- **Filter by Prep Time** - Quick meals (15min), 30min, 60min, 2hrs
- **Clear Filters** - One-click reset for all filters

### 📱 Responsive Design

- **Mobile-First** - Perfect on all devices
- **Tablet Optimized** - Great experience on tablets
- **Desktop Enhanced** - Full features on larger screens

### 🎨 Beautiful UI/UX

- **Gradient Backgrounds** - Stunning visual appeal
- **Smooth Animations** - Hover effects and transitions
- **Interactive Elements** - Engaging user experience
- **Color-Coded Difficulty** - Easy visual identification

## 🚀 Quick Start

### Method 1: Simple Local Setup

1. Download all project files
2. Open `index.html` in your web browser
3. Start adding your recipes!

## 📁 Project Structure

text
RECIPE-MANAGER-APP/
│
├── index.html # Main HTML file
├── README.md # Project documentation
│
├── css/ # Stylesheets folder
│ └── style.css # Main stylesheet
│
├── images/ # Recipe images folder
│ ├── img2.png
│ ├── img3.jpg
│ ├── img4.webp
│ ├── img5.jpg
│ ├── img6.jpg
│ ├── img7.webp
│ └── img8.png
│
└── js/ # JavaScript modules
├── app.js # Main application logic
├── recipes.js # Recipe data and management
├── storage.js # Local storage operations
└── utils.js # Utility functions

text

## 🚀 Features

- **Recipe Catalog**: Browse through a collection of delicious recipes
- **Filtering System**: Filter by difficulty level and cooking time
- **Responsive Design**: Works perfectly on all devices
- **Recipe Management**: Add, view, and manage recipes
- **Local Storage**: Save recipes locally in browser
- **Modern UI**: Clean, food-themed design

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript ES6+** - Application logic
- **Local Storage API** - Data persistence
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📋 File Descriptions

### HTML Files

- `index.html` - Main application interface

### CSS Files

- `css/style.css` - All styling including responsive design, animations, and layout

### JavaScript Files

- `js/app.js` - Main application controller, DOM manipulation, event handling
- `js/recipes.js` - Recipe data structure and management functions
- `js/storage.js` - Local storage operations (save, load, delete recipes)
- `js/utils.js` - Helper functions and utilities

### Assets

- `images/` - Folder containing all recipe images

## 🎯 Installation & Setup

1. **Download** all project files maintaining the folder structure
2. **Open** `index.html` in a web browser
3. **No server required** - works directly in browser

## 💻 Usage

### Browsing Recipes

- Scroll through the recipe cards to view all available recipes
- Each card shows:
  - Recipe image
  - Title and description
  - Preparation and cooking times
  - Difficulty level
  - "View Recipe" button

### Filtering Recipes

- Use the **Difficulty** dropdown to filter by:
  - All recipes
  - Easy
  - Medium
  - Hard
- Use the **Total Time** input to filter by maximum cooking time
- Click **Clear Filters** to reset all filters

### Adding Recipes

- Click the **+ Add Recipe** button
- Fill in the recipe details in the form
- Submit to add to your collection

## 🔧 JavaScript Modules Overview

### js/app.js

- Initializes the application
- Handles DOM events
- Manages UI updates
- Coordinates between other modules

### js/recipes.js

```javascript
// Example structure
const recipes = [
  {
    id: 1,
    title: "Vegetable Stir Fry",
    description: "Quick and healthy vegetable stir fry...",
    prepTime: 10,
    cookTime: 10,
    totalTime: 20,
    difficulty: "Easy",
    image: "images/img2.png",
  },
];
```

js/storage.js
saveRecipes(recipes) - Saves recipes to localStorage

loadRecipes() - Loads recipes from localStorage

clearRecipes() - Clears all saved recipes

js/utils.js
Helper functions for:

Formatting time

Validating inputs

Generating unique IDs

DOM manipulation helpers

🎨 CSS Features (css/style.css)
Key Styling Components:
Responsive Grid System - Flexbox and CSS Grid layouts

Recipe Cards - Hover effects and transitions

Navigation Bar - Fixed positioning with backdrop

Filter Section - Form styling and interactive elements

Footer Design - Multi-column layout

Color Variables - Consistent color scheme

Media Queries - Mobile-first responsive design

Responsive Breakpoints:
Mobile: < 768px

Tablet: 768px - 1024px

Desktop: > 1024px

📱 Browser Compatibility
Chrome (recommended)

Firefox

Safari

Edge

🔮 Future Enhancements
Recipe search functionality

Recipe categories

User ratings and reviews

Meal planning features

Shopping list generation

Recipe sharing

Print recipe feature

🐛 Troubleshooting
Common Issues:
Images not loading - Check image paths in images/ folder

Local storage not working - Ensure browser supports localStorage

Filters not applying - Check console for JavaScript errors

Development:
Open browser developer tools (F12) for debugging

Check console for error messages

Verify all file paths are correct

👩‍🍳 About
Welcome to my little world of cooking! Here I collect my favorite recipes—some quick and simple, some a bit special—each one tried, tested, and loved by me.

📞 Contact
Email: nandiniguptait1@gmail.com

Phone: +91 6307089359

Address: Amar Business Zone, Floor 14
© 2025 Nandini's Menu Repository. All rights reserved. | Designed with ❤️ for food lovers

This updated README.md now correctly reflects your project structure with the `css/style.css` file in the proper location. It includes:

- ✅ Correct file structure with css folder
- ✅ Complete documentation for all files
- ✅ CSS-specific section explaining styling features
- ✅ Installation and usage instructions
- ✅ Technical details for each JavaScript module
- ✅ Troubleshooting section
- ✅ Contact information and personal touch

The README is now perfectly aligned with your actual project structure!
