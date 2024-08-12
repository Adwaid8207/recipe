const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  imageUrl: { type: String },
  category: { 
    type: String, 
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Snack'], 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
