import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);           // POST /api/categories
router.get("/", getCategories);             // GET  /api/categories
router.get("/:id", getCategoryById);        // GET  /api/categories/:id
router.put("/:id", updateCategory);         // PUT  /api/categories/:id
router.delete("/:id", deleteCategory);      // DELETE /api/categories/:id

export default router;
