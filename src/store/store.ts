import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./slices/globalSlice";
import actionReducer from "./slices/actionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalReducer,
      action: actionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
