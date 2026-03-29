const express = require("express");
const Recipe = require("../models/Recipe");
const RecipeSchemaValidation = require("../validation/RecipeValidation");
const authenticateUser = require("../middleware/authenticateUser");
const Rating = require("../models/Rating");
const mongoose = require("mongoose");
const { recipeUploads } = require("../middleware/uploads");

const router = express.Router();

router.post("/upload-recipe-image", authenticateUser, recipeUploads.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Try different properties that might contain the URL
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;

    if (!imageUrl) {
      console.error("File object:", req.file);
      return res
        .status(400)
        .json({ message: "Image upload to Cloudinary failed" });
    }

    res.json({
      success: true,
      imageUrl: imageUrl,
    });
  } catch (err) {
    console.error("Recipe image upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("Fetching recipes from database...");
    const recipe = await Recipe.find().populate({
      path: "createdBy",
      select: "fullName profilepic",
      model: "user",
      options: { strictPopulate: false }, // Make populate optional
    });
    console.log(`Found ${recipe.length} recipes`);
    res.json(recipe);
  } catch (err) {
    console.error("Something went wrong in / route:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      message: "Failed to fetch recipes",
      error: err.message,
    });
  }
});

router.get("/my", authenticateUser, async (req, res) => {
  try {
    const recipe = await Recipe.find({ createdBy: req.user.id }).populate({
      path: "createdBy",
      select: "fullName profilepic",
      model: "user",
    });
    return res.status(200).json(recipe);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/create", authenticateUser, async (req, res) => {
  try {
    const payLoad = {
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl,
    };

    const result = RecipeSchemaValidation.safeParse(payLoad);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: result.error.issues.map((x) => x.message).join(", ") });
    }

    const recipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      createdBy: req.user.id,
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl,
    });
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.log("this error is in post 404", err);
    res.status(404).json({ message: err.message });
  }
});

router.post("/:id/rate", authenticateUser, async (req, res) => {
  const { rating } = req.body;
  const recipeId = req.params.id;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(404)
      .json({ message: "rating must be in between 1 to 5" });
  }

  try {
    const recipeExist = await Recipe.findById(recipeId);
    const updatedRating = await Rating.findOneAndUpdate(
      {
        recipe: recipeId,
        user: userId,
      },

      { rating },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      },
    );
    if (!recipeExist) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Thanks For Rating", rating: updatedRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const result = await Recipe.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(recipeId) } },
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "recipe",
          as: "ratings",
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$ratings" },
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$ratings" }, 0] },
              { $round: [{ $avg: "$ratings.rating" }, 1] },
              0,
            ],
          },
        },
      },
      {
        $project: {
          title: 1,
          ingredients: 1,
          createdBy: 1,
          instructions: 1,
          imageUrl: 1,
          ratingCount: 1,
          averageRating: 1,
        },
      },
    ]);
    const recipe = result[0];

    if (!recipe) {
      return res.status(404).json({ message: "Recipe Not found." });
    }
    res.json(recipe);
  } catch (err) {
    return res.status(404).json({ message: "Recipe Not found." });
  }
});

module.exports = router;
