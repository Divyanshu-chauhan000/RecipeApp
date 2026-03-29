require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe')

const recipeData = [
  {
    "title": "Paneer Butter Masala",
    "ingredients": [
      "Paneer",
      "Butter",
      "Tomato",
      "Cream",
      "Spices"
    ],
    "instructions": "Heat butter, add tomato puree, cook with spices, add paneer and cream, simmer for 10 minutes.",
    "image": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398"
  },
  {
    "title": "Veg Biryani",
    "ingredients": [
      "Rice",
      "Mixed Vegetables",
      "Yogurt",
      "Spices",
      "Saffron"
    ],
    "instructions": "Cook rice separately, prepare vegetable masala, layer rice and veggies, cook on low heat.",
    "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0"
  },
  {
    "title": "Masala Dosa",
    "ingredients": [
      "Rice Batter",
      "Potato",
      "Onion",
      "Mustard Seeds",
      "Curry Leaves"
    ],
    "instructions": "Prepare dosa batter, cook dosa on pan, add potato filling, fold and serve.",
    "image": "https://images.unsplash.com/photo-1630383249896-424e482df921"
  },
  {
    "title": "Chocolate Cake",
    "ingredients": [
      "Flour",
      "Cocoa Powder",
      "Sugar",
      "Eggs",
      "Butter"
    ],
    "instructions": "Mix ingredients, bake at 180°C for 30 minutes, let it cool and serve.",
    "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
  }
]

const connectDB = async () =>{
 try{
  await mongoose.connect(process.env.MONGODB_URI);
//  await Recipe.deleteMany({})
//  await Recipe.insertMany(recipeData)

  console.log("MongoDB connected Successfully");
 }catch(error){
   console.error("MongoDB connection Failed");
   console.error(error);
   process.exit(1);   // If error occur , server close
 }
}

module.exports = connectDB;