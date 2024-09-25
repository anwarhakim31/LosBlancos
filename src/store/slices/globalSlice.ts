"use client";
import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  user: undefined | [];
}

const initialState: CounterState = {
  user: undefined,
};

const globalSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = globalSlice.actions;
export default globalSlice.reducer;
