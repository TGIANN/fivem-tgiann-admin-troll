import { useAppDispatch } from "@/app/hooks";
import { setPlayerList } from "@/features/playerList";

// Default dev data for testing
import { playerList } from "./const/playerList";
import useApp from "@/hooks/useApp";
import { useEffect } from "react";

export default function dev() {
  const { openApp } = useApp();
  const dispatch = useAppDispatch();

  const devInit = () => {
    console.log("Dev mode initialized");
    openApp();
    dispatch(setPlayerList(playerList));
  };

  useEffect(devInit, []);
}
