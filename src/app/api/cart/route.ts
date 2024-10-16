import Cart from "@/lib/models/cart-model";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";

import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  _id: string;
  atribute: string;
  atributeValue: string;
  product: string;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity, atribute, atributeValue } =
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

    const stockDB = await Stock.findOne({
      productId,
      attribute: atribute,
      value: atributeValue,
    });

    if (!stockDB) {
      return ResponseError(404, "Stok tidak ditemukan");
    }

    if (quantity > productDB.stock) {
      return ResponseError(400, "Stok tidak mencukupi");
    }

    if (itemIndex !== -1) {
      cartDB.items[itemIndex].quantity += quantity;
    } else {
      cartDB.items.push({
        product: productId,
        quantity: quantity <= 1 ? 1 : quantity,
        atribute,
        atributeValue,
        price: productDB.price,
      });
    }

    await cartDB.save();

    const added = await Cart.findOne({ userId }).populate({
      path: "items.product",
      populate: {
        path: "collectionName",
      },
    });

    return NextResponse.json({
      success: true,
      message: `${
        productDB.name
      } ${atribute.toLowerCase()} ${atributeValue} ditambahkan ke keranjang`,
      cart: added,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.product",
      populate: {
        path: "collectionName",
      },
    });

    if (!cart) {
      const cart = new Cart({ userId, items: [] });

      await cart.save();
    }

    if (cart) {
      for (const item of cart.items) {
        const stockDB = await Stock.findOne({
          productId: item.product._id,
          attribute: item.atribute,
        });

        if (stockDB) {
          item.product.stock = stockDB.stock;
        }

        if (item.quantity > stockDB?.stock) {
          item.quantity = stockDB?.stock;

          await cart.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      cart: cart,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, itemId } = await req.json();

    if (!userId || !itemId) {
      return ResponseError(400, "Data tidak boleh kosong");
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return ResponseError(404, "Keranjang tidak ditemukan");
    }

    cart.items = cart.items.filter(
      (item: CartItem) => item._id.toString() !== itemId
    );

    await cart.save();

    const updateCart = await Cart.findOne({ userId }).populate({
      path: "items.product",
      populate: {
        path: "collectionName",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Berhasil menghapus dari keranjang",
      cart: updateCart,
    });
  } catch (error) {
    console.log(error);
    return ResponseError(500, "Internal Server Error");
  }
}
