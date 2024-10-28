import { transactionService } from "@/services/transaction/method";
import {
  TypeOngkir,
  TypeShippingAddress,
  TypeTransaction,
} from "@/services/type.module";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCheckout = createAsyncThunk(
  "transaction/getTransaction",
  async ({ transactionId }: { transactionId: string }) => {
    const res = await transactionService.get(transactionId);

    const data = res.data.transaction;

    return data;
  }
);

interface TypeState {
  address: TypeShippingAddress | null;
  costs: TypeOngkir | null;
  transaction: TypeTransaction | null;
  errorSubmit: {
    address: boolean;
    payment: boolean;
    ongkir: boolean;
  };
  payment: string;
  loading: boolean;
  error: string | null;
}

const initialState: TypeState = {
  address: null,
  costs: null,
  transaction: null,
  errorSubmit: {
    address: false,
    payment: false,
    ongkir: false,
  },
  payment: "",
  loading: true,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.address = action.payload;
      state.errorSubmit.address = false;
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

        state.errorSubmit.ongkir = false;
      }
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
      state.errorSubmit.payment = false;
    },
    setError: (state, action) => {
      state.errorSubmit = { ...state.errorSubmit, ...action.payload };
    },
    resetCheckout: (state) => {
      state.address = null;
      state.costs = null;
      state.transaction = null;
      state.errorSubmit = {
        address: false,
        payment: false,
        ongkir: false,
      };
      state.payment = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCheckout.fulfilled, (state, action) => {
      state.transaction = action.payload as TypeTransaction;

      state.transaction.totalPayment = state.transaction.subtotal + 1000;

      state.loading = false;
    });
    builder.addCase(getCheckout.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCheckout.rejected, (state, action) => {
      state.error = action.error.message || "Failed to fetch cartList";
    });
  },
});

export const {
  setShippingAddress,
  removeShippingAddress,
  setOngkir,
  setPayment,
  setError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
