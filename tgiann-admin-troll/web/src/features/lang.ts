import type { Lang } from "@/types/main";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import lang from "../const/lang";

const initialState: Lang = lang;

export const counterSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLang: (_, action: PayloadAction<Lang>) => {
      return action.payload;
    },
  },
});

export const { setLang } = counterSlice.actions;
export default counterSlice.reducer;
