import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "https://assets.cntraveller.in/photos/64475681c810805ead8e34aa/16:9/w_1024%2Cc_limit/GettyImages-1305078018.jpg", // default image
  },
  description: {
    type: String,
    default: "",
  },
});

const Category = mongoose.model("categories", categorySchema);
export default Category;
