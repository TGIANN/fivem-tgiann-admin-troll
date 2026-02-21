import {
  HeaderButton,
  HeaderContainer,
  HeaderSearch,
  HeaderText,
} from "@/components/Header";
import usePlayer from "@/hooks/usePlayer";
import useApp from "@/hooks/useApp";
import { useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import Icon from "@/components/Icon";
import { fetchNui } from "@/lib/fetchNui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) {
  const playerId = useAppSelector((state) => state.playerList.activePlayerSrc!);
  const isSpectating = useAppSelector((state) => state.main.isSpectating);
  const { player } = usePlayer(playerId);
  const { changePage } = useApp();

  if (!player) return null;

  const handleClose = () => {
    changePage("playerList");
  };

  const handleSpectate = () => {
    fetchNui("spectate", { src: player.src });
  };

  return (
    <HeaderContainer className="justify-between">
      <HeaderText>{player.name}</HeaderText>
      <div className="flex flex-row gap-[1.2vh]">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isSpectating ? "outLineGreen" : "ghost"}
              onClick={handleSpectate}
            >
              <Icon icon="eye" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Spectate</TooltipContent>
        </Tooltip>
        <HeaderSearch value={searchValue} onChange={setSearchValue} />
        <HeaderButton icon="chevron-left" onClick={handleClose} />
      </div>
    </HeaderContainer>
  );
}
