"use client";

import {
  TypeCarousel,
  TypeCollection,
  TypeProduct,
} from "@/services/type.module";

import { createSlice } from "@reduxjs/toolkit";

interface ActionState {
  dataEdit: TypeCollection | undefined;
  editCarousel: TypeCarousel | undefined;
  editProduct: TypeProduct | undefined;
}

const initialState: ActionState = {
  dataEdit: undefined,
  editCarousel: undefined,
  editProduct: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    setEditProduct: (state, action) => {
      state.editProduct = action.payload;
    },
  },
});

export const { setDataEdit, setEditCarousel, setEditProduct } =
  actionSlice.actions;

export default actionSlice.reducer;
