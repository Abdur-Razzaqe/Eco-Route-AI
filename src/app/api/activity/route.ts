import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Activity from "../../../models/Activity";

const CARBON_FACTORS: { [key: string]: number } = {
  driving: 0.18,
  transit: 0.06,
  walking: 0.0,
  bicycling: 0.0,
};

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    // Front-end theke userName o userEmail ana hocche
    const { userId, userName, userEmail, transportType, distance } = body;

    if (!userId || !transportType || !distance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const factor = CARBON_FACTORS[transportType] || 0.0;
    const carbonEmission = Number((distance * factor).toFixed(2));

    // Database-e userName o userEmail shoho create kora hocche
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
