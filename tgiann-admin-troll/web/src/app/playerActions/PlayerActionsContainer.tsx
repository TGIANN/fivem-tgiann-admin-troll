import { useState } from "react";
import ActionList from "./actionList/ActionList";
import Header from "./header/Header";
import Stream from "./stream/Stream";
import usePlayer from "@/hooks/usePlayer";

export default function PlayerActionsContainer() {
  const [searchValue, setSearchValue] = useState("");
  const { activePlayerSrc } = usePlayer();

  if (!activePlayerSrc) return null;

  return (
    <>
      <div className="flex flex-col overflow-hidden ">
        <Header searchValue={searchValue} setSearchValue={setSearchValue} />
        <ActionList searchValue={searchValue} />
      </div>

      <Stream playerSrc={activePlayerSrc} />
    </>
  );
}
