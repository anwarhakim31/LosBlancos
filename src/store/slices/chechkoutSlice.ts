import { transactionService } from "@/services/transaction/method";
import {
  TypeOngkir,
  TypeShippingAddress,
  TypeTransaction,
} from "@/services/type.module";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCheckout = createAsyncThunk(
  "transaction/getTransaction",
  async ({
    transactionId,
    userId,
  }: {
    transactionId: string;
    userId: string;
  }) => {
    const res = await transactionService.get(transactionId, userId);

    return res.data.transaction;
  }
);

interface TypeState {
  address: TypeShippingAddress | null;
  costs: TypeOngkir | null;
  transaction: TypeTransaction | null;
  loading: boolean;
  error: string | null;
}

const initialState: TypeState = {
  address: null,
  costs: null,
  transaction: null,
  loading: true,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.address = action.payload;
    },
    removeShippingAddress: (state) => {
      state.address = null;
    },
    setOngkir: (state, action) => {
      state.costs = action.payload;
      if (state.transaction) {
        state.transaction.shippingCost = action.payload.cost[0].value;
        state.transaction.totalPayment =
          action.payload.cost[0].value + state.transaction.subtotal + 1000;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCheckout.fulfilled, (state, action) => {
      state.transaction = action.payload as TypeTransaction;

      state.transaction.totalPayment = state.transaction.subtotal + 1000;

      state.loading = false;
    });

    builder.addCase(getCheckout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
  },
});

export const { setShippingAddress, removeShippingAddress, setOngkir } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
