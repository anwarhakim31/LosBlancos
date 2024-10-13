import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import actionReducer from "./slices/actionSlice";
import wishReducer from "./slices/wishSlice";
import { productReducer } from "./slices/productSlice";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

const rootReducer = combineReducers({
  wishlist: wishReducer,
  action: actionReducer,
  product: productReducer,
});

const persistConfig = {
  key: "losblancos",
  storage,
  whitelist: ["wishlist, action"],
  timeout: 1000,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

const store = makeStore();
export const persistor = persistStore(store);

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
