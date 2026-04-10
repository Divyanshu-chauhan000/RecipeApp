const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true },
);

RatingSchema.index({ user: 1, recipe: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
