import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivity extends Document {
  userId: string;
  userName?: string; // <-- User-er Naam-er jonno optional field
  userEmail?: string; // <-- User-er Email-er jonno optional field
  transportType: "driving" | "transit" | "walking" | "bicycling";
  distance: number;
  carbonEmission: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    userId: { type: String, required: [true, "User ID is required"] },
    userName: { type: String }, // <-- Schema-te jog kora holo
    userEmail: { type: String }, // <-- Schema-te jog kora holo
    transportType: {
      type: String,
      enum: ["driving", "transit", "walking", "bicycling"],
      required: [true, "Transport type is required"],
    },
    distance: { type: Number, required: [true, "Distance is required"] },
    carbonEmission: {
      type: Number,
      required: [true, "Carbon emission is required"],
    },
  },
  { timestamps: true },
);

const Activity =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
export default Activity;
