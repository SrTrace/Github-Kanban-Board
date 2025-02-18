import { configureStore } from "@reduxjs/toolkit";
import repoReducer from "./slices/repoSlice";

export const store = configureStore({
  reducer: {
    repo: repoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
