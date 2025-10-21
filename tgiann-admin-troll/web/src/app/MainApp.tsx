import type { CurrentAppPage } from "@/types/main";
import { cn } from "@/lib/utils";
import PlayerListContainer from "./playerList/PlayerListContainer";
import PlayerActionsContainer from "./playerActions/PlayerActionsContainer";
import useApp from "@/hooks/useApp";
import { AnimatePresence, motion } from "motion/react";
import useNuiEvent from "@/hooks/useNuiEvent";
import {
  addPlayer,
  removePlayer,
  setPlayerActiveTrollValue,
  setPlayerList,
  updatePlayerName,
} from "@/features/playerList";
import { useAppDispatch } from "./hooks";
import type { Player, TrollName } from "../../../src/types";
import { useHotkeys } from "react-hotkeys-hook";
import usePlayer from "@/hooks/usePlayer";

const pageStyles: Record<CurrentAppPage, string> = {
  playerList:
    "w-[80vw] h-[80vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
  playerActions: "w-[30vw] h-[60vh] left-[2vh] top-1/2 -translate-y-1/2",
};

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
    }
  );

  useNuiEvent(
    "trollStopped",
    (data: { trollName: TrollName; src: Player["src"] }) => {
      dispatch(setPlayerActiveTrollValue({ ...data, isActive: false }));
    }
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

  useHotkeys(
    "Escape",
    () => {
      if (!isOpen) return;

      if (currentAppPage === "playerActions") {
        changePage("playerList");
      } else {
        closeApp();
      }
    },
    [isOpen, currentAppPage]
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key={"main"}
          initial={{ opacity: 0.0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.0, scale: 0.8 }}
          className={cn(
            "bg-background text-accent-foreground absolute rounded-[0.6vh]",
            "transition-all duration-300",
            pageStyles[currentAppPage]
          )}
        >
          {GetAppPage(currentAppPage)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
