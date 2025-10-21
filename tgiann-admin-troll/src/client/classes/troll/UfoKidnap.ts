import { cache, sleep } from "@communityox/ox_lib";
import MainTroll from ".";
import { disabeAllControls } from "../../utils/keyboardControl";

class UfoKidnap extends MainTroll {
  private disableControlTick: number;

  private deleteEntity() {
    emitNet(`${cache.resource}:server:deleteUfo`);
  }

  async disabeAllControls() {
    this.disableControlTick = setTick(disabeAllControls);
  }

  async teleportPlayerToFinishWithEffect() {
    DoScreenFadeOut(500);
    await sleep(1000);

    SetEntityCoords(
      cache.ped,
      -1171.714233,
      4926.791016,
      224.198486,
      false,
      false,
      false,
      false
    );
    SetPedToRagdoll(cache.ped, 10000, 10000, 0, false, false, false);

    await sleep(3000);
    DoScreenFadeIn(500);
  }

  async teleportPlayerToUfo(maxHeight: number) {
    let speed = 0.001;
    let currentHeight = GetEntityCoords(cache.ped, false)[2];

    while (currentHeight <= maxHeight) {
      const playerCoords = GetEntityCoords(cache.ped, false);
      currentHeight = playerCoords[2] - 1;

      SetEntityCoords(
        cache.ped,
        playerCoords[0],
        playerCoords[1],
        currentHeight + speed,
        false,
        false,
        false,
        false
      );

      speed += 0.0025;

      await sleep(10);
    }
  }

  async start() {
    FreezeEntityPosition(cache.ped, true);
    this.disabeAllControls();

    const ufoSpawnCoords = GetEntityCoords(cache.ped, false);
    emitNet(`${cache.resource}:server:spawnUfo`, [
      ufoSpawnCoords[0],
      ufoSpawnCoords[1],
      ufoSpawnCoords[2] - 1,
    ]);

    await sleep(5000);

    await this.teleportPlayerToUfo(ufoSpawnCoords[2] + 200);

    await this.teleportPlayerToFinishWithEffect();

    FreezeEntityPosition(cache.ped, false);

    clearTick(this.disableControlTick);
    this.deleteEntity();

    return true;
  }
}

export default new UfoKidnap("ufo_kidnap");
