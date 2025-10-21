import { cache } from "@communityox/ox_lib";
import { keyAction } from "../../utils/keyboardControl";
import { ForceControlKey } from "types";
import { debugPrint } from "@common/utils";

const keyboardKeys: Record<ForceControlKey, number> = {
  a: 65,
  d: 68,
  s: 83,
  w: 87,
  space: 32,
};

class ForceControl {
  players: number[] = [];
  private tickInterval: number = null;

  createTickInterval() {
    if (this.tickInterval) return;
    this.tickInterval = setTick(() => {
      for (const key in keyboardKeys) {
        const keyId = keyboardKeys[key as keyof typeof keyboardKeys];

        keyAction(keyId, (action) => {
          if (action === "pressing") return;
          this.players.forEach((src) => {
            debugPrint(
              `Force controlling key: ${key} (${action}) for player src: ${src}`
            );
            emitNet(`${cache.resource}:forceKeyboardControl`, src, key, action);
          });
        });
      }
    });
  }

  clearTickInterval() {
    if (!this.tickInterval) return;
    clearTick(this.tickInterval);
    this.tickInterval = null;
  }

  addPlayer(src: number) {
    if (!this.players.includes(src)) this.players.push(src);
    this.createTickInterval();
  }

  removePlayer(src: number) {
    this.players = this.players.filter((playerSrc) => playerSrc !== src);
    if (this.players.length === 0) this.clearTickInterval();
  }
}

export default new ForceControl();
