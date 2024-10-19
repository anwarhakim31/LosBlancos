import { ongkirService } from "@/services/ongkir/method";
import { TypeOngkir } from "@/services/type.module";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setOngkir } from "./chechkoutSlice";

export const getOngkir = createAsyncThunk(
  "ongkir/getOngkir",
  async (
    {
      desCity,
      desProvince,
      weight,
    }: {
      desCity: string;
      desProvince: string;
      weight: string;
    },
    { dispatch }
  ) => {
    const res = await ongkirService.ongkir(desCity, desProvince, weight);

    dispatch(setOngkir(res.data.costs[0]));

    return res.data.costs;
  }
);

interface stateType {
  costs: TypeOngkir[];
  loading: boolean;
  error: string | null;
}

const initialState: stateType = {
  costs: [],
  loading: true,
  error: null,
};

const ongkirSlice = createSlice({
  name: "ongkir",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOngkir.fulfilled, (state, action) => {
      state.loading = false;
      state.costs = action.payload;
      console.log(action.payload);
    });
    builder.addCase(getOngkir.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch cartList";
    });
  },
});

export default ongkirSlice.reducer;
