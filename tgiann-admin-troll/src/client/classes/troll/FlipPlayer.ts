import MainTroll from ".";
import { cache, sleep } from "@communityox/ox_lib";

class FlipVehicle extends MainTroll {
  async start() {
    SetPedToRagdoll(cache.ped, 200, 0, 0, true, true, false);

    ApplyForceToEntity(
      cache.ped,
      1,
      0,
      0,
      10,
      2,
      0,
      0,
      0,
      true,
      true,
      true,
      false,
      true
    );

    await sleep(2000);

    return true;
  }
}

export default new FlipVehicle("flip_player");
