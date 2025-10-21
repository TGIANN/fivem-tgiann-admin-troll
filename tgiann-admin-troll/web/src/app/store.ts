import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "@/features/main";
import playerListReducer from "@/features/playerList";
import langReducer from "@/features/lang";

const store = configureStore({
  reducer: {
    main: mainReducer,
    playerList: playerListReducer,
    lang: langReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
