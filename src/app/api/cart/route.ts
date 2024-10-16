import Cart from "@/lib/models/cart-model";
import Product from "@/lib/models/product-model";
import { ResponseError } from "@/lib/response-error";
import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  atribute: string;
  atributeValue: string;
  product: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity, atribute, atributeValue, price } =
      await req.json();

    if (!userId || !productId || !quantity || !atribute || !atributeValue) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    const productDB = await Product.findById(productId);

    if (!productDB) {
      return ResponseError(404, "Produk tidak ditemukan");
    }

    let cartDB = await Cart.findOne({ userId });

    if (!cartDB) {
      cartDB = new Cart({ userId, items: [] });
    }

    const itemIndex = cartDB.items.findIndex(
      (item: CartItem) =>
        item.product.toString() === productId &&
        item.atribute === atribute &&
        item.atributeValue === atributeValue
    );

    if (itemIndex !== -1) {
      cartDB.items[itemIndex].quantity += quantity;
    } else {
      cartDB.items.push({
        product: productId,
        quantity,
        atribute,
        atributeValue,
        price,
      });
    }

    await cartDB.save();

    return NextResponse.json({
      success: true,
      message: "Produk ditambahkan ke keranjang",
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    const cart = await Cart.findOne({ userId }).populate("items.product");

    return NextResponse.json({
      success: true,
      cart: cart,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}
