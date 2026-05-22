import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Activity from "../../../models/Activity";

const CARBON_FACTORS: { [key: string]: number } = {
  driving: 0.18,
  transit: 0.06,
  walking: 0.0,
  bicycling: 0.0,
};

// ১. POST Method
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, userName, userEmail, transportType, distance } = body;

    if (!userId || !transportType || !distance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const factor = CARBON_FACTORS[transportType] || 0.0;
    const carbonEmission = Number((distance * factor).toFixed(2));

    const newActivity = await Activity.create({
      userId,
      userName,
      userEmail,
      transportType,
      distance: Number(distance),
      carbonEmission,
    });

    return NextResponse.json(
      { success: true, data: newActivity },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ২. GET Method (নিশ্চিত করুন export করা আছে)
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: activities },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
