import { createSlice } from "@reduxjs/toolkit";
import { TypeProduct } from "@/services/type.module";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "@/services/product/method";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const res = await productService.getall();

    const data = res.data.products;

    return data;
  }
);

interface ProductState {
  products: TypeProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const productReducer = productSlice.reducer;
