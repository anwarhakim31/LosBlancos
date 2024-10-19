import { configureStore } from "@reduxjs/toolkit";
import { whitelistReducer } from "./slices/wishSlice";
import actionReducer from "./slices/actionSlice";
import cartReducer from "./slices/cartSlice";
import checkReducer from "./slices/chechkoutSlice";
import ongkirReduce from "./slices/ongkirSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      wishlist: whitelistReducer,
      action: actionReducer,
      cart: cartReducer,
      check: checkReducer,
      ongkir: ongkirReduce,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
