import { TypeOngkir, TypeShippingAddress } from "@/services/type.module";
import { createSlice } from "@reduxjs/toolkit";

interface TypeState {
  address: TypeShippingAddress | null;
  costs: TypeOngkir | null;
}

const initialState: TypeState = {
  address: null,
  costs: null,
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
    },
  },
});

export const { setShippingAddress, removeShippingAddress, setOngkir } =
  checkoutSlice.actions;

export default checkoutSlice.reducer;
