import mongoose, { Schema, Document } from "mongoose";

export interface IDelivery extends Document {
  businessId: string; // কোন বিজনেস রুটটি ক্রিয়েট করেছে (User uid)
  deliveryId: string; // ট্র্যাকিং আইডি
  startPoint: string; // যেমন: "Dhaka, Bangladesh"
  endPoint: string; // যেমন: "Chittagong, Bangladesh"
  distance: number; // কিমিতে
  duration: string; // যেমন: "5 hours 20 mins"
  fuelSaved: number; // এআই রুট ব্যবহারের ফলে কত লিটার ফুয়েল বাঁচলো
  co2Saved: number; // কত কেজি কার্বন সেভ হলো
  status: "pending" | "in-transit" | "delivered";
  createdAt: Date;
}

const DeliverySchema: Schema = new Schema(
  {
    businessId: { type: String, required: true, index: true },
    deliveryId: { type: String, required: true, unique: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: String, required: true },
    fuelSaved: { type: Number, default: 0 },
    co2Saved: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "in-transit", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Delivery ||
  mongoose.model<IDelivery>("Delivery", DeliverySchema);
