import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "@/Redux/slices/fileReducer";

export const store = configureStore({
  reducer: {
    fileUpload: fileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
