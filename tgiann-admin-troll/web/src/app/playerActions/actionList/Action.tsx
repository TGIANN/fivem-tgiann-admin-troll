import Icon from "@/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import useLang from "@/hooks/useLang";
import usePlayer from "@/hooks/usePlayer";
import { fetchNui } from "@/lib/fetchNui";
import type { TrollAction } from "@/types/main";

export default function Action(action: TrollAction) {
  const { t } = useLang();
  const { player: activePlayer, isTrollActive } = usePlayer();

  if (!activePlayer) return null;

  const isActive = isTrollActive(action.type);
  const disabled = !action.toggle && isActive;

  const handleClick = () => {
    if (disabled) return;

    if (isActive) {
      fetchNui("stopTrollAction", {
        actionType: action.type,
        src: activePlayer.src,
      });
    } else {
      fetchNui("performAction", {
        actionType: action.type,
        src: activePlayer.src,
      });
    }
  };

  return (
    <Item className="w-full" variant="outline">
      <ItemMedia variant="icon" className="rounded-[0.6vh]">
        <Icon icon={action.icon} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t(action.label)}</ItemTitle>
        <ItemDescription>{t(action.description)}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant={
            isActive
              ? action.toggle
                ? "outLineGreen"
                : "destructive"
              : "outline"
          }
          size="sm"
          onClick={handleClick}
          disabled={disabled}
        >
          {t(action.buttonLabel || "TROLL_ACTION_BUTTON")}
        </Button>
      </ItemActions>
    </Item>
  );
}
