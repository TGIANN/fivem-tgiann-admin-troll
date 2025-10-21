import MainTroll from ".";
import { cache } from "@communityox/ox_lib";

class UltraSlowWalk extends MainTroll {
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
      SetPedMoveRateOverride(cache.ped, 0.1);
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new UltraSlowWalk("ultra_slow_walk");
