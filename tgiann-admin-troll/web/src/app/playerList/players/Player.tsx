import { useAppDispatch } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { setActivePlayerSrc } from "@/features/playerList";
import useApp from "@/hooks/useApp";
import useLang from "@/hooks/useLang";
import type { Player as PlayerType } from "@scriptTypes/index";

function Player(player: PlayerType) {
  const { t } = useLang();
  const { changePage } = useApp();
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setActivePlayerSrc(player.src));
    changePage("playerActions");
  };

  return (
    <Item className="flex-1/5" variant="outline">
      <ItemContent>
        <ItemTitle>{player.name}</ItemTitle>
        {/* <ItemDescription>
          Outlined style with clear borders and transparent background.
        </ItemDescription> */}
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm" onClick={handleClick}>
          {t("ACTION_PLAYER_BUTTON")}
        </Button>
      </ItemActions>
    </Item>
  );
}

export default Player;
