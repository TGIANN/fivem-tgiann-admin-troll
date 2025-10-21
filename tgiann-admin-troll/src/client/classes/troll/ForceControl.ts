import { cache } from "@communityox/ox_lib";
import MainTroll from ".";
import { forceKeyboardControl } from "../../utils/keyboardControl";
import { ForceControlKey } from "types";

class ForceControl extends MainTroll {
  private activeKeys: ForceControlKey[] = [];
  private tickInterval: number = null;

  async start() {
    onNet(
      `${cache.resource}:forceControlApply`,
      (key: ForceControlKey, action: "released" | "pressed") => {
        if (action === "pressed") {
          if (!this.activeKeys.includes(key)) {
            this.activeKeys = [...this.activeKeys, key];
          }
        } else if (action === "released") {
          this.activeKeys = this.activeKeys.filter(
            (activeKey) => activeKey !== key
          );
        }
      }
    );

    this.tickInterval = setTick(() => {
      for (const key of this.activeKeys) {
        forceKeyboardControl(key);
      }
    });

    return false;
  }

  async stop() {
    if (this.tickInterval) {
      clearTick(this.tickInterval);
      this.tickInterval = null;
    }
    this.activeKeys = [];
    super.stop();
  }
}

export default new ForceControl("force_control_player");
