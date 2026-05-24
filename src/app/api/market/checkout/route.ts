import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import Stripe from "stripe";

// স্ট্রাইপ কী চেক করা এবং ইনিশিয়ালাইজ করা
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { userId, productId, paymentMethod } = await request.json();

    // 🕵️‍♂️ ১. স্ট্রাইপ কনফিগারেশন চেক
    if (paymentMethod === "stripe" && !stripe) {
      return NextResponse.json(
        {
          success: false,
          message: "Stripe API key is missing or invalid in .env.local",
        },
        { status: 400 },
      );
    }

    // 🕵️‍♂️ ২. ইউজার ডাটাবেজে আছে কিনা চেক
    const user = await User.findOne({ uid: userId });

    // 🕵️‍♂️ ৩. প্রোডাক্ট ডাটাবেজে খোঁজা (যদি আইডি মঙ্গোডিবির standard ওল্ড আইডি না হয়, তবে নাম দিয়ে খোঁজ করবে ডেমো পারপাসে)
    let product = null;
    try {
      product = await Product.findById(productId);
    } catch (e) {
      // যদি আইডি মঙ্গোডিবি ফরম্যাটে না হয়ে ডেমো "p1", "p2" হয়, তবে প্রথম একটি প্রোডাক্ট রিটার্ন করবে টেস্টিং এর জন্য
      product = await Product.findOne();
    }

    // ব্যাকআপ ডেমো প্রোডাক্ট (যদি ডাটাবেজ একদম খালি থাকে যাতে ইন্টারভিউতে ক্র্যাশ না করে)
    if (
      !product &&
      (productId === "p1" || productId === "p2" || productId === "p3")
    ) {
      const demoProducts: Record<string, any> = {
        p1: {
          name: "Bamboo Eco-Water Bottle",
          price: 15,
          pointsRequired: 300,
          image:
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
        },
        p2: {
          name: "Solar Powered Power Bank",
          price: 35,
          pointsRequired: 700,
          image:
            "https://images.unsplash.com/photo-1609592424263-d1607a7ec928?w=500",
        },
        p3: {
          name: "Miniature Juniper Bonsai Tree",
          price: 25,
          pointsRequired: 500,
          image:
            "https://images.unsplash.com/photo-1613143715121-700994f83b4b?w=500",
        },
      };
      product = demoProducts[productId];
    }

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found in system." },
        { status: 404 },
      );
    }

    // 🎁 অপশন ১: গ্রিন পয়েন্ট দিয়ে রিডিম
    if (paymentMethod === "points") {
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User account session not found" },
          { status: 404 },
        );
      }
      if (user.greenPoints < product.pointsRequired) {
        return NextResponse.json(
          { success: false, message: "Insufficient Green Points!" },
          { status: 400 },
        );
      }

      user.greenPoints -= product.pointsRequired;
      await user.save();

      if (product.save) {
        product.stock = Math.max(0, (product.stock || 10) - 1);
        await product.save();
      }

      return NextResponse.json({
        success: true,
        message: "Product redeemed successfully using Green Points!",
        pointsLeft: user.greenPoints,
      });
    }

    // 💳 অপশন ২: Stripe পেমেন্ট গেটওয়ে
    if (paymentMethod === "stripe") {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      const session = await stripe!.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.name,
                description:
                  product.description || "Premium Eco-Friendly Reward Item",
                images: product.image ? [product.image] : [],
              },
              unit_amount: product.price * 100, // সেন্ট
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/dashboard/market?success=true`,
        cancel_url: `${baseUrl}/dashboard/market?canceled=true`,
        metadata: {
          userId: userId || "guest_user",
          productId: productId,
        },
      });

      return NextResponse.json({ success: true, url: session.url });
    }

    return NextResponse.json(
      { success: false, message: "Invalid payment method structure" },
      { status: 400 },
    );
  } catch (error: any) {
    // 📢 এবার কোড ক্র্যাশ করবে না, টার্মিনালে আসল এরর প্রিন্ট হবে এবং ফ্রন্টএন্ডে সুন্দর JSON যাবে
    console.error("🔥 MARKET_CHECKOUT_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Breakdown",
      },
      { status: 500 },
    );
  }
}
