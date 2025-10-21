import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Player, TrollName } from "../../../src/types";

// Define a type for the slice state
interface State {
  playerList: Player[];
  activePlayerSrc: Player["src"] | null;
}

// Define the initial state using that type
const initialState: State = {
  playerList: [],
  activePlayerSrc: null,
};

export const counterSlice = createSlice({
  name: "playerList",
  initialState,
  reducers: {
    setPlayerList: (state, action: PayloadAction<State["playerList"]>) => {
      state.playerList = action.payload;
    },
    setActivePlayerSrc: (
      state,
      action: PayloadAction<State["activePlayerSrc"]>
    ) => {
      state.activePlayerSrc = action.payload;
    },
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.playerList = [...state.playerList, action.payload];
    },
    removePlayer: (state, action: PayloadAction<Player["src"]>) => {
      state.playerList = state.playerList.filter(
        (p) => p.src !== action.payload
      );
    },
    setPlayerActiveTrollValue: (
      state,
      action: PayloadAction<{
        src: Player["src"];
        trollName: TrollName;
        isActive: boolean;
      }>
    ) => {
      const { src, trollName, isActive } = action.payload;
      const player = state.playerList.map((p) => {
        if (p.src === src) {
          const activeTrolls = isActive
            ? [...p.activeTrolls, trollName]
            : p.activeTrolls.filter((t) => t !== trollName);

          return { ...p, activeTrolls: activeTrolls };
        }
        return p;
      });

      state.playerList = player;
    },
    updatePlayerName: (
      state,
      action: PayloadAction<{ name: string; src: number }>
    ) => {
      const { name, src } = action.payload;
      const player = state.playerList.map((p) => {
        if (p.src === src) return { ...p, name };
        return p;
      });
      state.playerList = player;
    },
  },
});

export const {
  setPlayerList,
  setActivePlayerSrc,
  setPlayerActiveTrollValue,
  updatePlayerName,
  addPlayer,
  removePlayer,
} = counterSlice.actions;
export default counterSlice.reducer;
