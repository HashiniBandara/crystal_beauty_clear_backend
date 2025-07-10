import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, searchProduct, updateProduct } from '../controllers/productController.js';

const productRouter=express.Router();

productRouter.post("/",createProduct)
productRouter.get("/",getProducts)
productRouter.get("/category/:categoryId", getProductsByCategory);
productRouter.get("/:id",getProductById)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)
productRouter.get("/search/:id",searchProduct)

export default productRouter;