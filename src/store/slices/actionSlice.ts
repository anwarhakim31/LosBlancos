"use client";

import { TypeCarousel, TypeCategory } from "@/services/type.module";
import { createSlice } from "@reduxjs/toolkit";

interface ActionState {
  dataEdit: TypeCategory | undefined;
  editCarousel: TypeCarousel | undefined;
}

const initialState: ActionState = {
  dataEdit: undefined,
  editCarousel: undefined,
};

const actionSlice = createSlice({
  name: "action",
  initialState,
  reducers: {
    setDataEdit: (state, action) => {
      state.dataEdit = action.payload;
    },
    setEditCarousel: (state, action) => {
      state.editCarousel = action.payload;
    },
  },
});

export const { setDataEdit, setEditCarousel } = actionSlice.actions;

export default actionSlice.reducer;

export const selectedEditCarousel = (state: TypeCarousel) => state;
