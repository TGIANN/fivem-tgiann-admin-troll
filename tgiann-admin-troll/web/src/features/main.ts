import type { CurrentAppPage } from "@/types/main";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface CounterState {
  isOpen: boolean;
  currentAppPage: CurrentAppPage;
}

// Define the initial state using that type
const initialState: CounterState = {
  isOpen: false,
  currentAppPage: "playerList",
};

export const counterSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    changeAppPage: (state, action: PayloadAction<CurrentAppPage>) => {
      state.currentAppPage = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { changeAppPage, setIsOpen } = counterSlice.actions;
export default counterSlice.reducer;
