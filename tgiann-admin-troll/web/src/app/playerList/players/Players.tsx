import { useAppSelector } from "@/app/hooks";
import Player from "./Player";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Players({ searchValue }: { searchValue: string }) {
  const playerList = useAppSelector((state) => state.playerList.playerList);

  const filteredPlayers =
    searchValue !== ""
      ? playerList.filter((player) =>
          player.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      : playerList;

  return (
    <ScrollArea className="h-[74vh]">
      <div className="w-full p-[1vh] flex flex-wrap gap-[1vh]">
        {filteredPlayers.map((player) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
    </ScrollArea>
  );
}
