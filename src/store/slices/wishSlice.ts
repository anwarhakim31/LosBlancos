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
  async ({ user, product }: { user: string; product: string }) => {
    const res = await wishlistService.addWishlist(user, product);
    if (res.status === 200) {
      toast.success(res.data.message);
    }

    return res.data.wishlist;
  }
);

export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async ({ productId, userId }: { productId: string; userId: string }) => {
    const res = await wishlistService.removeWishlist(productId, userId);
    if (res.status === 200) {
      toast.success(res.data.message);
    }

    return res.data.wishlist;
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
    builder.addCase(postWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload;
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
    builder.addCase(removeWishlist.fulfilled, (state, action) => {
      state.wishlist = action.payload;
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
