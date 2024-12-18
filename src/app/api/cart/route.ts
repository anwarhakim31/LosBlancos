import connectDB from "@/lib/db";
import Cart from "@/lib/models/cart-model";
import Product from "@/lib/models/product-model";
import Stock from "@/lib/models/stock-model";
import { ResponseError } from "@/lib/response-error";
import { verifyToken } from "@/lib/verify-token";

import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  _id: string;
  atribute: string;
  atributeValue: string;
  product: string;
}

export async function POST(req: NextRequest) {
  await connectDB();
  const token = verifyToken(req, ["customer"]);

  try {
    if (token instanceof NextResponse) {
      return token;
    }

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
    if (cartDB.items[itemIndex]?.quantity + quantity > stockDB.stock) {
      return ResponseError(
        400,
        "Semua stok yang tersedia sudah ada di keranjang"
      );
    }

    if (itemIndex !== -1) {
      cartDB.items[itemIndex].quantity += quantity;
      cartDB.items[itemIndex].price += productDB.price * quantity;
    } else {
      cartDB.items.unshift({
        product: productId,
        quantity: quantity <= 1 ? 1 : quantity,
        atribute,
        atributeValue,
        price: productDB.price * quantity,
      });
    }

    await cartDB.save();

    const added = await Cart.findOne({ userId })
      .populate({
        path: "items.product",
        populate: {
          path: "collectionName stock",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: `${productDB.name}  ${
        atributeValue.charAt(0).toUpperCase() + atributeValue.slice(1)
      } ditambahkan ke keranjang`,
      cart: added,
    });
  } catch (error) {
    return ResponseError(500, "Internal Server Error");
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get("userId");

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const cart = new Cart({ userId, items: [] });

      await cart.save();
    }

    if (cart && cart.items.length > 0) {
      for (const item of cart.items) {
        const stockDB = await Stock.findOne({
          productId: item.product,
          attribute: item.atribute,
          value: item.atributeValue,
        });

        const productDB = await Product.findById(item.product);

        if (!productDB) {
          await cart.items.remove(item._id);

          await cart.save();
        }

        if (productDB && stockDB?.stock === 0) {
          await cart.items.remove(item._id);

          await cart.save();
        }

        if (item.quantity > stockDB?.stock) {
          item.quantity = stockDB?.stock;

          await cart.save();
        }

        cart.stock = stockDB?.stock;
      }
    }

    const cartPopulate = await cart.populate({
      path: "items.product",
      populate: {
        path: "stock collectionName",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil diambil",
      cart: cartPopulate,
    });
  } catch (error) {
    console.log(error);
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
