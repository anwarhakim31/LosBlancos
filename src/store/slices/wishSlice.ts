"use client";

import { TypeWishlist } from "@/services/type.module";
import { wishlistService } from "@/services/wishlist/method";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async ({ id }: { id: string }) => {
    const res = await wishlistService.getWishlist(id);

    return res.data.wishlist;
  }
);

export const postWishlist = createAsyncThunk(
  "wishlist/postWishlist",
  async (
    { user, product }: { user: string; product: string },
    { dispatch }
  ) => {
    const res = await wishlistService.addWishlist(user, product);
    if (res.status === 200) {
      dispatch(getWishlist({ id: user }));
      toast.success(res.data.message);
    }

    return res.data;
  }
);

export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async ({ id, userId }: { id: string; userId: string }, { dispatch }) => {
    const res = await wishlistService.removeWishlist(id);
    if (res.status === 200) {
      dispatch(getWishlist({ id: userId }));
      toast.success(res.data.message);
    }

    return res.data;
  }
);

interface wishSlice {
  wishlist: TypeWishlist[];
  loading: boolean;
  error: string | null;
}

const initialState: wishSlice = {
  wishlist: [],
  loading: true,
  error: null,
};

const wishSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postWishlist.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(postWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add to wishlist";
    });
    builder.addCase(postWishlist.pending, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(getWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
      state.loading = false;
    });
    builder.addCase(getWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch wishlist";
    });
    builder.addCase(getWishlist.pending, (state) => {
      state.error = null;
    });
    builder.addCase(removeWishlist.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(removeWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch wishlist";
    });
    builder.addCase(removeWishlist.pending, (state) => {
      state.error = null;
    });
  },
});
export const whitelistReducer = wishSlice.reducer;
