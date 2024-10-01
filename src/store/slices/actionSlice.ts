"use client";

import { TypeCategory } from "@/services/type.module";
import { createSlice } from "@reduxjs/toolkit";

interface ActionState {
  dataEdit: TypeCategory | undefined;
}

const initialState: ActionState = {
  dataEdit: undefined,
};

const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {
    setDataEdit: (state, action) => {
      state.dataEdit = action.payload;
    },
  },
});

export const { setDataEdit } = actionSlice.actions;

export default actionSlice.reducer;
