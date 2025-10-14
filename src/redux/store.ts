import { configureStore } from "@reduxjs/toolkit";
import pasienReducer from "./pasienSlice";
import ranapReducer from "./ranapSlice";

export const store = configureStore({
   reducer: {
      pasien: pasienReducer,
      ranap: ranapReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
