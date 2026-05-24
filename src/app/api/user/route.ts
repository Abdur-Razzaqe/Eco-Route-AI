import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; // আপনার ডাটাবেজ কানেকশন পাথ
import mongoose from "mongoose";

// ইউজার স্কিমা ডিফাইন করা (যদি আলাদা ফাইলে না থাকে)
const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ["user", "business"], default: "user" },
    greenPoints: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

// GET: ইউজারের রোল তুলে আনা
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    const dbUser = await UserModel.findOne({ uid });
    if (!dbUser)
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, role: dbUser.role });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST: নতুন ইউজার ডাটাবেজে সেভ করা
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { uid, name, email, role } = body;

    // ইউজার অলরেডি থাকলে নতুন করে ক্রিয়েট করবে না
    let existingUser = await UserModel.findOne({ uid });
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "User already exists",
      });
    }

    const newUser = await UserModel.create({ uid, name, email, role });
    return NextResponse.json({ success: true, data: newUser });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
