import type { CurrentAppPage } from "@/types/main";
import PlayerListContainer from "./playerList/PlayerListContainer";
import PlayerActionsContainer from "./playerActions/PlayerActionsContainer";
import useApp from "@/hooks/useApp";
import { AnimatePresence } from "motion/react";
import useNuiEvent from "@/hooks/useNuiEvent";
import {
  addPlayer,
  removePlayer,
  setPlayerActiveTrollValue,
  setPlayerList,
  updatePlayerName,
} from "@/features/playerList";
import { setIsSpectating } from "@/features/main";
import { useAppDispatch } from "./hooks";
import type { Player, TrollName } from "../../../src/types";
import { useHotkeys } from "react-hotkeys-hook";
import usePlayer from "@/hooks/usePlayer";
import StreamScreen from "./streamScreen/StreamScreen";
import AnimateContainer from "@/components/AnimateContainer";

function GetAppPage(page: CurrentAppPage) {
  switch (page) {
    case "playerList":
      return <PlayerListContainer />;
    case "playerActions":
      return <PlayerActionsContainer />;
    default:
      return null;
  }
}

export default function MainApp() {
  const { isOpen, currentAppPage, openApp, closeApp, changePage } = useApp();
  const { activePlayerSrc } = usePlayer();
  const dispatch = useAppDispatch();

  useNuiEvent("open", (data: Player[]) => {
    dispatch(setPlayerList(data));
    openApp();
  });

  useNuiEvent(
    "actionPerformed",
    (data: { trollName: TrollName; src: Player["src"] }) => {
      dispatch(setPlayerActiveTrollValue({ ...data, isActive: true }));
    },
  );

  useNuiEvent(
    "trollStopped",
    (data: { trollName: TrollName; src: Player["src"] }) => {
      dispatch(setPlayerActiveTrollValue({ ...data, isActive: false }));
    },
  );

  useNuiEvent("playerDisconnected", (src: number) => {
    if (activePlayerSrc === src) changePage("playerList");
    dispatch(removePlayer(src));
  });

  useNuiEvent("playerConnected", (player: Player) => {
    dispatch(addPlayer(player));
  });

  useNuiEvent("playerNameUpdated", (data: { name: string; src: number }) => {
    dispatch(updatePlayerName(data));
  });

  useNuiEvent(
    "spectateStateChanged",
    ({ isSpectating }: { isSpectating: boolean }) => {
      dispatch(setIsSpectating(isSpectating));
    },
  );

  useHotkeys(
    "Escape",
    () => {
      if (!isOpen) return;
      closeApp();
    },
    [isOpen, currentAppPage],
  );

  const pageClassName: Record<CurrentAppPage, string> = {
    playerList: "rounded-[0.6vh] w-[80vw] h-[80vh]",
    playerActions: "w-[30vw] h-[60vh] left-[2vh]",
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <AnimateContainer
          key={"main"}
          className={pageClassName[currentAppPage]}
        >
          {GetAppPage(currentAppPage)}
        </AnimateContainer>
      )}
      <StreamScreen />
    </AnimatePresence>
  );
}
