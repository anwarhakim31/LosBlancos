import { TypeShippingAddress } from "@/services/type.module";
import { createSlice } from "@reduxjs/toolkit";

interface TypeState {
  address: TypeShippingAddress | null;
}

const initialState: TypeState = {
  address: null,
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
  },
});

export const { setShippingAddress, removeShippingAddress } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
