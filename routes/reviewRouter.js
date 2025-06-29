import express from "express";
import {
  createReview,
  getAllReviews,
  blockReview,
  getProductReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", createReview); 
reviewRouter.get("/all", getAllReviews); 
reviewRouter.get("/product/:productId", getProductReviews); 
reviewRouter.patch("/block", blockReview); 

export default reviewRouter;
