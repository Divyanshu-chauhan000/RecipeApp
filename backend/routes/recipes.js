const express = require("express");
const Recipe = require("../models/Recipe");
const RecipeSchemaValidation = require("../validation/RecipeValidation");
const authenticateUser = require("../middleware/authenticateUser");
const Rating = require("../models/Rating");
const mongoose = require("mongoose");
const { recipeUploads } = require("../middleware/uploads");

const router = express.Router();

router.post(
  "/upload-recipe-image",
  authenticateUser,
  recipeUploads.single("image"),
  async (req, res) => {
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
  },
);

router.get("/", async (req, res) => {
  try {
    console.log("Fetching recipes from database...");
    const recipes = await Recipe.find().populate({
      path: "createdBy",
      select: "fullName profilepic",
      model: "user",
      options: { strictPopulate: false },
    });

    const recipeIds = recipes.map((r) => r._id);
    const ratings = await Rating.aggregate([
      { $match: { recipe: { $in: recipeIds } } },
      {
        $group: {
          _id: "$recipe",
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    const ratingMap = ratings.reduce((acc, item) => {
      acc[item._id.toString()] = item;
      return acc;
    }, {});

    const recipeWithRatings = recipes.map((recipe) => {
      const metric = ratingMap[recipe._id.toString()] || {
        averageRating: 0,
        ratingCount: 0,
      };
      return {
        ...recipe.toObject(),
        averageRating: Number(
          metric.averageRating ? metric.averageRating.toFixed(1) : 0,
        ),
        ratingCount: metric.ratingCount,
      };
    });

    console.log(`Found ${recipeWithRatings.length} recipes`);
    res.json(recipeWithRatings);
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
      .status(400)
      .json({ message: "rating must be in between 1 to 5" });
  }

  try {
    const recipeExist = await Recipe.findById(recipeId);
    if (!recipeExist) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedRating = await Rating.findOneAndUpdate(
      { recipe: recipeId, user: userId },
      { rating, recipe: recipeId, user: userId },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    res.json({ message: "Thanks For Rating", rating: updatedRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/review", authenticateUser, async (req, res) => {
  const { rating, comment } = req.body;
  const recipeId = req.params.id;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "rating must be in between 1 to 5" });
  }

  if (!comment || comment.trim().length === 0) {
    return res.status(400).json({ message: "comment is required" });
  }

  try {
    const recipeExist = await Recipe.findById(recipeId);
    if (!recipeExist) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedReview = await Rating.findOneAndUpdate(
      { recipe: recipeId, user: userId },
      { rating, comment, recipe: recipeId, user: userId },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.json({ message: "Thanks For Review", review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId).populate({
      path: "createdBy",
      select: "fullName profilepic",
      model: "user",
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe Not found." });
    }

    const reviews = await Rating.find({ recipe: recipeId }).populate({
      path: "user",
      select: "fullName profilepic",
      model: "user",
    });

    const ratingCount = reviews.length;
    const averageRating = ratingCount
      ? Number(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount).toFixed(
            1,
          ),
        )
      : 0;

    const formattedReviews = reviews.map((rev) => ({
      _id: rev._id,
      user: rev.user?.fullName || "Anonymous",
      profilepic: rev.user?.profilepic || null,
      rating: rev.rating,
      comment: rev.comment || "",
      createdAt: rev.createdAt,
    }));

    res.json({
      ...recipe.toObject(),
      ratingCount,
      averageRating,
      reviews: formattedReviews,
    });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: "Recipe Not found." });
  }
});

module.exports = router;
