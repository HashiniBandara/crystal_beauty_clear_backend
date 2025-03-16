import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  altName: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  labeledPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
    default: ["https://assets.cntraveller.in/photos/64475681c810805ead8e34aa/16:9/w_1024%2Cc_limit/GettyImages-1305078018.jpg"],
  },
  stock: {
    type: Number,
    required: true,
  },
})

const Product =mongoose.model("products",productSchema)
export default Product;
