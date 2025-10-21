import MainTroll from ".";
import { cache, sleep } from "@communityox/ox_lib";
import {
  createObject,
  deleteEntity,
  getEntityForward,
} from "../../utils/entity";
import {
  requestAnimDict,
  requestNamedPtfxAsset,
} from "@communityox/ox_lib/client";

const ghostModels = [
  "m23_1_prop_m31_ghostsalton_01a",
  "m23_1_prop_m31_ghostskidrow_01a",
  "m23_1_prop_m31_ghostzombie_01a",
  "m23_1_prop_m31_ghostrurmeth_01a",
  "m23_1_prop_m31_ghostjohnny_01a",
];

class Ghost extends MainTroll {
  private tick: number;
  private object: number;
  private particle: number;
  private currentTime: [number, number, number] = [12, 0, 0];

  private deleteParticle() {
    if (this.particle) {
      StopParticleFxLooped(this.particle, true);
      this.particle = null;
    }
  }

  private deleteEntity() {
    deleteEntity(this.object);
  }

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    let active = true;
    this.currentTime = [GetClockHours(), GetClockMinutes(), GetClockSeconds()];

    const randomModel =
      ghostModels[Math.floor(Math.random() * ghostModels.length)];

    const coords = getEntityForward(cache.ped, 10.0);

    this.object = await createObject(randomModel, coords, false);
    SetEntityHeading(this.object, GetEntityHeading(cache.ped));
    await requestAnimDict("ANIM@SCRIPTED@FREEMODE@IG2_GHOST@");

    PlayEntityAnim(
      this.object,
      "float_1",
      "ANIM@SCRIPTED@FREEMODE@IG2_GHOST@",
      1000.0,
      true,
      true,
      true,
      0,
      136704
    );

    await requestNamedPtfxAsset("scr_srr_hal");
    UseParticleFxAsset("scr_srr_hal");
    this.particle = StartParticleFxLoopedOnEntity(
      "scr_srr_hal_ghost_haze",
      this.object,
      0.0,
      0.0,
      0.7,
      0.0,
      0.0,
      0.0,
      1.0,
      false,
      false,
      false
    );
    SetParticleFxLoopedEvolution(this.particle, "smoke", 10.0, true);
    RemoveNamedPtfxAsset("scr_srr_hal");

    this.clearTick();
    this.tick = setTick(() => {
      NetworkOverrideClockTime(0, 0, 0);

      const playerCoords = GetEntityCoords(cache.ped, false);
      const distance = GetDistanceBetweenCoords(
        playerCoords[0],
        playerCoords[1],
        playerCoords[2],
        coords[0],
        coords[1],
        coords[2],
        true
      );

      if (distance < 5 || distance > 20) active = false;
    });

    while (active) await sleep(250);

    return this.tick !== null;
  }

  stop() {
    this.clearTick();
    this.deleteEntity();
    this.deleteParticle();
    NetworkOverrideClockTime(
      this.currentTime[0],
      this.currentTime[1],
      this.currentTime[2]
    );

    super.stop();
  }
}

export default new Ghost("ghost");
