import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  userId: string; // Users কালেকশনের uid-এর সাথে ম্যাপ করা
  transportType: "driving" | "transit" | "bicycling" | "walking";
  distance: number; // কিলোমিটার এককে
  carbonEmission: number; // কেজি এককে ($kg\ CO_2$)
  aiSuggestion: string; // AI থেকে জেনারেট হওয়া ১ লাইনের রিয়েলটাইম টিপস
  createdAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true }, // ইনডেক্সিং করা হয়েছে ফাস্ট কোয়েরির জন্য
    transportType: {
      type: String,
      enum: ["driving", "transit", "bicycling", "walking"],
      required: true,
    },
    distance: { type: Number, required: true },
    carbonEmission: { type: Number, required: true },
    aiSuggestion: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
