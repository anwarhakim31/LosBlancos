import { configureStore } from "@reduxjs/toolkit";
import { whitelistReducer } from "./slices/wishSlice";
import actionReducer from "./slices/actionSlice";
import cartReducer from "./slices/cartSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      wishlist: whitelistReducer,
      action: actionReducer,
      cart: cartReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
