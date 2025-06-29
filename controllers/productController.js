import Category from "../models/category.js";
import Product from "../models/product.js";

// export function createProduct(req, res) {
//   if (req.user == null) {
//     res.status(403).json({
//       message: "You need to login first",
//     });
//     return;
//   }

//   if (req.user.role != "admin") {
//     res.status(403).json({
//       message: "You are not authorized to create a product",
//     });
//     return;
//   }

//   const product = new Product(req.body);

//   product
//     .save()
//     .then(() => {
//       res.json({
//         message: "Product saved successfully",
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Product not saved",
//       });
//     });
// }

export async function createProduct(req, res) {
  if (!req.user) {
    return res.status(403).json({ message: "You need to login first" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "You are not authorized to create a product" });
  }

  const { categoryId } = req.body;
  const categoryExists = await Category.findOne({ categoryId });

  if (!categoryExists) {
    return res.status(400).json({ message: "Invalid categoryId. Category not found." });
  }

  const product = new Product(req.body);

  try {
    await product.save();
    res.json({ message: "Product saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Product not saved", error: err.message });
  }
}


// export function getProducts(req, res) {
//   Product.find()
//     .then((products) => {
//       res.json(products);
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Product not found",
//       });
//     });
// }

export async function getProducts(req, res) {
  try {
    const products = await Product.find().lean(); // plain JS objects
    const categories = await Category.find().lean();

    const productsWithCategoryInfo = products.map((product) => {
      const category = categories.find(c => c.categoryId === product.categoryId);
      return {
        ...product,
        categoryName: category?.name || "Unknown",
        categoryImage: category?.image || null,
      };
    });

    res.json(productsWithCategoryInfo);
  } catch (err) {
    res.status(500).json({ message: "Product not found" });
  }
}

export async function getProductById(req, res) {
  const productId = req.params.id;
  const product = await Product.findOne({ productId: productId });
  if (product == null) {
    res.status(404).json({
      message: "Product not found",
    });
    return;
  }
  res.json({ product: product });
}

export function deleteProduct(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }
  Product.findOneAndDelete({
    productId: req.params.productId,
  })
    .then(() => {
      res.json({
        message: "Product deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not deleted",
      });
    });
}

//changing the code

export function updateProduct(req, res) {
  if (req.user == null) {
    res.status(403).json({
      message: "You need to login first",
    });
    return;
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to update a product",
    });
    return;
  }
  Product.findOneAndUpdate(
    {
      productId: req.params.productId,
    },
    req.body
  )
    .then(() => {
      res.json({
        message: "Product updated successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not updated",
      });
    });
}

export async function searchProduct(req, res) {
  const search = req.params.id;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { altName: { $elemMatch: { $regex: search, $options: "i" } } },
      ],
    });
    res.json({
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in searching product",
    });
    return;
  }
}
