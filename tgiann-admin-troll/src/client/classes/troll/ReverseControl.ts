import MainTroll from ".";
import { forceKeyboardControl, keyAction } from "../../utils/keyboardControl";

class ReverseControl extends MainTroll {
  private tick: number = null;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.clearTick();

    this.tick = setTick(() => {
      // W
      keyAction(87, (action) => {
        if (action === "pressing") {
          DisableControlAction(0, 32, true); // W
          forceKeyboardControl("s");
        }
      });

      // S
      keyAction(83, (action) => {
        if (action === "pressing") {
          DisableControlAction(0, 31, true); // S
          DisableControlAction(0, 33, true); // S
          forceKeyboardControl("w");
        }
      });

      // A
      keyAction(65, (action) => {
        if (action === "pressing") {
          DisableControlAction(0, 34, true); // A
          forceKeyboardControl("d");
        }
      });

      // D
      keyAction(68, (action) => {
        if (action === "pressing") {
          DisableControlAction(0, 30, true); // D
          DisableControlAction(0, 35, true); // D
          forceKeyboardControl("a");
        }
      });
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new ReverseControl("reverse_control");
