import { cartService, cartType } from "@/services/cart/method";
import { itemCartType } from "@/services/type.module";
import { ResponseError } from "@/utils/axios/response-error";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({ id }: { id: string }) => {
    const res = await cartService.getCart(id);
    return res.data.cart;
  }
);

export const postCart = createAsyncThunk(
  "cart/postCart",
  async ({
    userId,
    productId,
    quantity,
    atribute,
    atributeValue,
  }: cartType) => {
    try {
      const data = { userId, productId, quantity, atribute, atributeValue };
      const res = await cartService.postCart(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        return res.data.cart;
      }
    } catch (error) {
      ResponseError(error);
    }
  }
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async ({ userId, itemId }: { userId: string; itemId: string }) => {
    const res = await cartService.deleteCart(userId, itemId);

    if (res.status === 200) {
      toast.success(res.data.message);
    }

    return res.data.cart;
  }
);

interface stateType {
  cart: {
    items: itemCartType[];
    total: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: stateType = {
  cart: {
    items: [],
    total: 0,
  },
  loading: true,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    plusQuantity: (state, action) => {
      const index = state.cart.items.findIndex(
        (item) => item._id === action.payload
      );

      if (index !== -1) {
        state.cart.items[index].quantity += 1;
        if (typeof state.cart.items[index].product.price === "number") {
          state.cart.items[index].price +=
            state.cart.items[index].product.price;
        }
      }

      state.cart.total = state.cart.items.reduce(
        (total, item) => total + item.price,
        0
      );
    },
    minusQuantity: (state, action) => {
      const index = state.cart.items.findIndex(
        (item) => item._id === action.payload
      );

      if (index !== -1) {
        state.cart.items[index].quantity -= 1;
        if (typeof state.cart.items[index].product.price === "number") {
          state.cart.items[index].price -=
            state.cart.items[index].product.price;
        }
      }

      state.cart.total = state.cart.items.reduce(
        (total, item) => total + item.price,
        0
      );
    },
    clearCart: (state) => {
      state.cart = {
        items: [],
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postCart.fulfilled, (state, action) => {
      state.loading = false;

      if (action.payload) {
        state.cart.items = action.payload?.items;
        state.cart.total = action.payload?.total;
      } else {
        state.cart.items = [];
        state.cart.total = 0;
      }
    });
    builder.addCase(postCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      if (action.payload) {
        state.cart.items = action.payload?.items;
        state.cart.total = action.payload?.total;
      }

      state.loading = false;
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });

    builder.addCase(postCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCart.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.cart.items = action.payload?.items;
        state.cart.total = action.payload?.total;
      }
    });
    builder.addCase(deleteCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
  },
});

export const { plusQuantity, minusQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
