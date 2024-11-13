import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
// import candidatesSlice from "./slices/candidatesSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


const store = configureStore({
    reducer: {
      user: userSlice.reducer,
    //   candidates: candidatesSlice.reducer,
    },
  });


  export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;

  