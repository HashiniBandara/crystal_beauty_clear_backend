import Category from "../models/category.js";

// CREATE a new category
export async function createCategory(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { categoryId, name, image, description } = req.body;

  try {
    const existing = await Category.findOne({ categoryId });
    if (existing) {
      return res.status(400).json({ message: "Category ID already exists" });
    }

    const category = new Category({ categoryId, name, image, description });
    await category.save();
    res.json({ message: "Category created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create category", error: err.message });
  }
}

// READ all categories
export async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving categories" });
  }
}

// READ a single category by categoryId
export async function getCategoryById(req, res) {
  try {
    const category = await Category.findOne({ categoryId: req.params.id });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving category" });
  }
}

// UPDATE a category
export async function updateCategory(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const updated = await Category.findOneAndUpdate(
      { categoryId: req.params.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}

// DELETE a category
export async function deleteCategory(req, res) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const deleted = await Category.findOneAndDelete({ categoryId: req.params.id });
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
}
