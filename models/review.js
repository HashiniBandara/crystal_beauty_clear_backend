import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
  },
  productId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
    required: true,
  },
}, { timestamps: true });

const Review = mongoose.model("reviews", reviewSchema);
export default Review;
