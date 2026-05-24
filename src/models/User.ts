import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  uid: string; // ফায়ারবেস থেকে আসা ইউনিক ইউজার আইডি
  name: string;
  email: string;
  role: "user" | "business";
  greenPoints: number; // মার্কেটপ্লেসে রিডিম করার জন্য পয়েন্ট
  membershipTier: "bronze" | "silver" | "gold" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "business"], default: "user" },
    greenPoints: { type: Number, default: 0 },
    membershipTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "enterprise"],
      default: "bronze",
    },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
