import connectDB from "@/lib/db";
import Banner from "@/lib/models/banner-model";
import Carousel from "@/lib/models/carousel-model";
import Marquee from "@/lib/models/marquee-model";
import Product from "@/lib/models/product-model";
import Testimoni from "@/lib/models/testi-model";
import { ResponseError } from "@/lib/response-error";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const carousel = await Carousel.find({});
    let marquee = await Marquee.findOne();
    const newProduct = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate({ path: "collectionName" });
    const bestProduct = await Product.find({ sold: { $gt: 0 } })
      .limit(4)
      .sort({ sold: -1 })
      .populate({ path: "collectionName" });
    let banner = await Banner.findOne();
    const testimoni = await Testimoni.find({ status: true }).sort({
      updatedAt: -1,
    });

    if (!banner) {
      const newBanner = await Banner.create({
        display: true,
        image: "/banner.png",
      });
      banner = newBanner;
    }

    if (!marquee) {
      const newMarquee = await Marquee.create({
        display: true,
        image: Array(4).fill("/default.png"),
      });
      marquee = newMarquee;
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      carousel: carousel,
      marquee: marquee,
      newProduct: newProduct,
      bestProduct: bestProduct,
      testimoni: testimoni,
      banner: banner,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
