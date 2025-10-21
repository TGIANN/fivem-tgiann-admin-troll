import { useState } from "react";
import Header from "./header/Header";
import Players from "./players/Players";

export default function PlayerListContainer() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      <Players searchValue={searchValue} />
    </div>
  );
}
