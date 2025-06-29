import Review from "../models/review.js";
import { v4 as uuidv4 } from "uuid";

// User submits review
export async function createReview(req, res) {
  const { productId, userEmail, userName, rating, comment } = req.body;
  try {
    const review = new Review({
      reviewId: uuidv4(),
      productId,
      userEmail,
      userName,
      rating,
      comment,
    });
    await review.save();
    res.json({ success: true, message: "Review submitted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review", error: error.message });
  }
}


// Admin views all reviews
export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
}

// Public: Get reviews by product
export async function getProductReviews(req, res) {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId, isBlocked: false });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to load product reviews" });
  }
}

// Admin block/unblock
export async function blockReview(req, res) {
  const { reviewId, isBlocked } = req.body;
  try {
    await Review.updateOne({ reviewId }, { isBlocked });
    res.json({ message: `Review ${isBlocked ? "blocked" : "unblocked"} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review status" });
  }
}
