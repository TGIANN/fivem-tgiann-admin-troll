import MainTroll from ".";
import { cache } from "@communityox/ox_lib";

class FlamePlayer extends MainTroll {
  async start() {
    StartEntityFire(cache.ped);

    return false;
  }

  stop() {
    StopEntityFire(cache.ped);
    super.stop();
  }
}

export default new FlamePlayer("flame");
