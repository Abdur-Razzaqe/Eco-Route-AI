import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // আসল মূল্য (USD বা BDT)
    pointsRequired: { type: Number, required: true }, // কিনতে কত গ্রিন পয়েন্ট লাগবে
    image: { type: String, required: true },
    stock: { type: Number, default: 10 },
  },
  { timestamps: true },
);

export default models.Product || model("Product", ProductSchema);
