import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivity extends Document {
  userId: string;
  transportType: "driving" | "transit" | "walking" | "bicycling";
  distance: number;
  carbonEmission: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    userId: { type: String, required: [true, "User ID is required"] },
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

const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;
