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
  // Category reference (as ID string)
  categoryId: {
    type: String,
    required: true,
  },

  // Feature flags
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },

  // For latest products sorting
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Product =mongoose.model("products",productSchema)
export default Product;
