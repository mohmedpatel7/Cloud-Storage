import { configureStore } from "@reduxjs/toolkit";
import fileUploadReducer from "./slices/fileReducer";

export const store = configureStore({
  reducer: {
    fileUpload: fileUploadReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
