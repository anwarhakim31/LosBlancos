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
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOngkir.fulfilled, (state, action) => {
      state.loading = false;
      state.costs = action.payload;
    });
    builder.addCase(getOngkir.rejected, (state) => {
      state.loading = false;
      state.error = "Pengiriman untuk alamat ini tidak tersedia";
    });

    builder.addCase(getOngkir.pending, (state) => {
      state.loading = false;
      state.error = null;
    });
  },
});

export const { setLoading } = ongkirSlice.actions;
export default ongkirSlice.reducer;
