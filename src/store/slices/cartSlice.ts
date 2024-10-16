import { cartService, cartType } from "@/services/cart/method";
import { itemCartType } from "@/services/type.module";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
    { userId, productId, quantity, atribute, atributeValue, price }: cartType,
    { dispatch }
  ) => {
    const data = {
      userId,
      productId,
      quantity,
      atribute,
      atributeValue,
      price,
    };

    const res = await cartService.postCart(data);

    if (res.status === 200) {
      dispatch(getCart({ id: userId }));
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
  reducers: {},
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
  },
});

export default cartSlice.reducer;
