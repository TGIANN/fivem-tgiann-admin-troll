import { useAppSelector } from "@/app/hooks";
import type { Player, TrollName } from "../../../src/types";

export default function usePlayer(src?: Player["src"]) {
  const playerList = useAppSelector((state) => state.playerList.playerList);
  const activePlayerSrc = useAppSelector(
    (state) => state.playerList.activePlayerSrc
  );

  const playerSrc = src || activePlayerSrc;
  const player = playerList.find((p) => p.src === playerSrc);

  function isTrollActive(trollName: TrollName): boolean {
    if (!player) return false;

    return player.activeTrolls.includes(trollName);
  }

  return { activePlayerSrc, player, isTrollActive };
}
