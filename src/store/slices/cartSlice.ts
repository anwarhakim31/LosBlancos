import { cartService, cartType } from "@/services/cart/method";
import { itemCartType } from "@/services/type.module";
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
  async (
    { userId, productId, quantity, atribute, atributeValue }: cartType,
    { dispatch }
  ) => {
    const data = {
      userId,
      productId,
      quantity,
      atribute,
      atributeValue,
    };

    const res = await cartService.postCart(data);

    if (res.status === 200) {
      dispatch(getCart({ id: userId }));
      toast.success(res.data.message);
    }

    return res.data.cart;
  }
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (
    { userId, productId }: { userId: string; productId: string },
    { dispatch }
  ) => {
    const res = await cartService.deleteCart(userId, productId);

    if (res.status === 200) {
      dispatch(getCart({ id: userId }));
      toast.info(res.data.message);
    }

    return res.data.cart;
  }
);

interface stateType {
  cart: {
    items: itemCartType[];
    total: 0;
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

      state.cart.total ===
        state.cart.items.reduce((total, item) => total + item.price, 0);
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

      state.cart.total ===
        state.cart.items.reduce((total, item) => total + item.price, 0);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postCart.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(postCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.cart.items = action.payload?.items;
      state.cart.total = action.payload?.total;

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
    builder.addCase(deleteCart.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
  },
});

export const { plusQuantity, minusQuantity } = cartSlice.actions;

export default cartSlice.reducer;
