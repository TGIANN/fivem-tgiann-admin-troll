import type { Player } from "@scriptTypes/index";

export const playerList: Player[] = Array.from({ length: 100 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: `Player${i + 1}`,
  src: i + 1,
  activeTrolls: [],
}));
