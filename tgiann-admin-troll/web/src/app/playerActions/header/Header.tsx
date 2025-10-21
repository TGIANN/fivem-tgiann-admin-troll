import {
  HeaderButton,
  HeaderContainer,
  HeaderSearch,
  HeaderText,
} from "@/components/Header";
import usePlayer from "@/hooks/usePlayer";
import useApp from "@/hooks/useApp";
import { useAppSelector } from "@/app/hooks";

export default function Header({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) {
  const playerId = useAppSelector((state) => state.playerList.activePlayerId!);
  const { player } = usePlayer(playerId);
  const { changePage } = useApp();

  if (!player) return null;

  const handleClose = () => {
    changePage("playerList");
  };

  return (
    <HeaderContainer className="justify-between">
      <HeaderText>{player.name}</HeaderText>
      <div className="flex flex-row gap-[1.2vh]">
        <HeaderSearch value={searchValue} onChange={setSearchValue} />
        <HeaderButton icon="chevron-left" onClick={handleClose} />
      </div>
    </HeaderContainer>
  );
}
