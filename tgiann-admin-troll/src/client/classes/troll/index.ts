import { TrollName } from "types";
import { cache } from "@communityox/ox_lib";

abstract class MainTroll {
  trollName: TrollName;
  abstract start(stopTrollFromPlayerClass?: () => {}): Promise<boolean>;

  constructor(name: TrollName) {
    this.trollName = name;
  }

  stop(): void {
    emitNet(`${cache.resource}:trolStopped`, this.trollName);
  }
}

export default MainTroll;
export { type MainTroll as Troll };
