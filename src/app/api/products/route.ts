import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

// GET: সব প্রোডাক্ট লিস্ট তুলে আনা
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ stock: { $gt: 0 } });
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST: নতুন প্রোডাক্ট অ্যাড করা (টেস্টিং বা অ্যাডমিন প্যানেলের জন্য)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
