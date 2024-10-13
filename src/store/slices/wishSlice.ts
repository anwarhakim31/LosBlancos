"use client";

import { TypeProduct } from "@/services/type.module";
import { createSlice } from "@reduxjs/toolkit";

const getWishlistStorage = () => {
  if (typeof window !== "undefined") {
    const wishlist = localStorage.getItem("wishlist");
    if (!wishlist) {
      return [];
    }
    return JSON.parse(wishlist);
  }
  return [];
};
interface wishSlice {
  wishlist: TypeProduct[];
}

const initialState: wishSlice = {
  wishlist: getWishlistStorage(),
};

const wishSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishList: (state, action) => {
      state.wishlist = action.payload;
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    addWishList: (state, action) => {
      state.wishlist = [...state.wishlist, action.payload];

      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
    removeWishList: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload
      );

      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    },
  },
});

export const { addWishList, removeWishList, setWishList } = wishSlice.actions;
const wishReducer = wishSlice.reducer;

export default wishReducer;
