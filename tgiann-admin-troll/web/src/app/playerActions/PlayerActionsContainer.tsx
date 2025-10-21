import { useState } from "react";
import ActionList from "./actionList/ActionList";
import Header from "./header/Header";

export default function PlayerActionsContainer() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col overflow-hidden">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <ActionList searchValue={searchValue} />
    </div>
  );
}
