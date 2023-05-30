const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = mongoose.Schema({
  name: { type: String, default: null },
  category: { type: String, default: "Category1" },
  description: { type: String, default: null },
  images: [String],
  cover_image: { type: String, default: null },
  regular_price: { type: Number, default: 0 },
  sales_price: { type: Number, default: 0 },
  created_at: { type: Date, default: +new Date() },
  visibility: { type: Boolean, default: true },
});

const Product = mongoose.model("products", productSchema);
export default Product;
