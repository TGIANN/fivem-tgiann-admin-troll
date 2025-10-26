import {
  HeaderButton,
  HeaderContainer,
  HeaderSearch,
  HeaderText,
} from "@/components/Header";
import useApp from "@/hooks/useApp";

const trollQuotes = [
  "Trolling players annoys them, but raises your laughter.",
  "Every click breaks a heart... but we’re having fun.",
  "Trolling: because sometimes justice lags.",
  "Your FPS drops, your mood drops, but the troll never gives up.",
  "CTRL + ALT + Troll",
  "It’s not lag, bro — it’s just my job.",
  "Some are 'admins', some are 'gods'... we are 'trolls'.",
  "Empathy is gone... because I’m in TROLL mode.",
  "Looking for justice? Type /troll instead of /ban.",
  "Every troll deserves a bug.",
  "Code doesn’t lie. But trolls sometimes do.",
  "If you’re seeing this menu… it’s already too late.",
];

export default function Header({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) {
  const { closeApp } = useApp();

  const handleClose = () => {
    closeApp();
  };

  return (
    <HeaderContainer className="justify-between">
      <HeaderText
        text={trollQuotes[Math.floor(Math.random() * trollQuotes.length)]}
      />
      <div className="flex flex-row gap-[1.2vh]">
        <HeaderSearch value={searchValue} onChange={setSearchValue} />
        <HeaderButton icon="xmark" onClick={handleClose} />
      </div>
    </HeaderContainer>
  );
}
