import { cache } from "@communityox/ox_lib";
import MainTroll from ".";
import scaleEntity from "../../utils/scaleEntity";

class ScaleUpPlayer extends MainTroll {
  private tick: number;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    const randomScale = 1.2 + Math.random() * 0.8;

    this.tick = setTick(() => {
      scaleEntity(cache.ped, randomScale);
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new ScaleUpPlayer("scale_up_player");
