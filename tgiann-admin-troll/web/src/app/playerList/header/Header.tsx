import {
  HeaderButton,
  HeaderContainer,
  HeaderSearch,
  HeaderText,
} from "@/components/Header";
import useApp from "@/hooks/useApp";

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
      <HeaderText text="test" />
      <div className="flex flex-row gap-[1.2vh]">
        <HeaderSearch value={searchValue} onChange={setSearchValue} />
        <HeaderButton icon="xmark" onClick={handleClose} />
      </div>
    </HeaderContainer>
  );
}
