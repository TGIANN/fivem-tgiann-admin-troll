import MainTroll from ".";
import { createPed, createVehicle, deleteEntity } from "../../utils/entity";
import { getPlayerArroundCoords } from "../../utils/getPlayerArroundCoords";
import { cache, sleep } from "@communityox/ox_lib";
import { disabeAllControls } from "../../utils/keyboardControl";

class Kidnap extends MainTroll {
  private vehicle: number;
  private disableControlTick: number;
  private peds: { driver: number; ped1: number; ped2: number } = {
    driver: null,
    ped1: null,
    ped2: null,
  };

  async CreatePed(coords: number[], model: number | string) {
    const ped = await createPed(model, coords, true);
    SetEntityInvincible(ped, true);
    return ped;
  }

  async createVehicle(coords: number[]) {
    const veh = await createVehicle("burrito", coords, true);
    SetEntityInvincible(veh, true);

    return veh;
  }

  async playKidnapAnimation() {
    const targetPosition = GetEntityCoords(this.vehicle, true);
    const targetRotation = GetEntityRotation(this.vehicle, 2);

    const KidnapScene = NetworkCreateSynchronisedScene(
      targetPosition[0],
      targetPosition[1],
      targetPosition[2],
      targetRotation[0],
      targetRotation[1],
      targetRotation[2],
      2,
      false,
      false,
      1065353216,
      0,
      1.0
    );

    const AnimDic = "random@kidnap_girl";

    NetworkAddPedToSynchronisedScene(
      this.peds.ped1,
      KidnapScene,
      AnimDic,
      "ig_1_guy1_drag_into_van",
      1.5,
      -4.0,
      1,
      16,
      1148846080,
      0
    );
    NetworkAddPedToSynchronisedScene(
      this.peds.ped2,
      KidnapScene,
      AnimDic,
      "ig_1_guy2_drag_into_van",
      1.5,
      -4.0,
      1,
      16,
      1148846080,
      0
    );
    NetworkAddPedToSynchronisedScene(
      cache.ped,
      KidnapScene,
      AnimDic,
      "ig_1_girl_drag_into_van",
      1.5,
      -4.0,
      1,
      16,
      1148846080,
      0
    );
    NetworkAddEntityToSynchronisedScene(
      this.vehicle,
      KidnapScene,
      AnimDic,
      "drag_into_van_burr",
      1.0,
      1.0,
      1
    );
    NetworkStartSynchronisedScene(KidnapScene);
    await sleep(GetAnimDuration(AnimDic, "drag_into_van_burr") * 750);

    TaskWarpPedIntoVehicle(this.peds.ped1, this.vehicle, 0);
    TaskWarpPedIntoVehicle(this.peds.ped2, this.vehicle, 1);
    TaskWarpPedIntoVehicle(cache.ped, this.vehicle, 2);
  }

  async prapareVehicleAndPeds() {
    const spawnCoords = getPlayerArroundCoords(20);

    this.peds.driver = await this.CreatePed(spawnCoords, "s_m_y_dealer_01");
    this.peds.ped1 = await this.CreatePed(spawnCoords, "s_m_y_dealer_01");
    this.peds.ped2 = await this.CreatePed(spawnCoords, "s_m_y_dealer_01");

    this.vehicle = await this.createVehicle(spawnCoords);

    TaskWarpPedIntoVehicle(this.peds.driver, this.vehicle, -1);
    TaskWarpPedIntoVehicle(this.peds.ped1, this.vehicle, 0);
    TaskWarpPedIntoVehicle(this.peds.ped2, this.vehicle, 1);
  }

  async goToCoords(speed: number, coords?: number[]) {
    const vehicleModel = GetEntityModel(this.vehicle);
    const startedTime = GetGameTimer();

    SetDriverAbility(this.peds.driver, 1.0);
    SetDriverAggressiveness(this.peds.driver, 0.0);

    while (true) {
      const vehicleCoords = GetEntityCoords(this.vehicle, true);
      const gotLocation = coords || GetEntityCoords(cache.ped, false);

      const distance = GetDistanceBetweenCoords(
        gotLocation[0],
        gotLocation[1],
        gotLocation[2],
        vehicleCoords[0],
        vehicleCoords[1],
        vehicleCoords[2],
        true
      );

      TaskVehicleDriveToCoord(
        this.peds.driver,
        this.vehicle,
        gotLocation[0],
        gotLocation[1],
        gotLocation[2],
        speed,
        0.0,
        vehicleModel,
        786475,
        1.0,
        1
      );

      if (distance < 9) {
        TaskVehicleTempAction(this.peds.driver, this.vehicle, 27, 6000);
        break;
      }

      if (GetGameTimer() - startedTime > 30000) {
        SetEntityCoords(
          this.vehicle,
          gotLocation[0],
          gotLocation[1],
          gotLocation[2] - 1.0,
          false,
          false,
          false,
          false
        );
        break;
      }

      await sleep(1000);
    }
  }

  async goToPlayer() {
    await this.goToCoords(25.0);
  }

  async goToFinalPoint() {
    const finishCoords = getPlayerArroundCoords(150);
    await this.goToCoords(45.0, finishCoords);
  }

  async disabeAllControls() {
    this.disableControlTick = setTick(disabeAllControls);
  }

  async finishKidnap() {
    DoScreenFadeOut(500);

    await sleep(1000);

    if (this.disableControlTick) {
      clearTick(this.disableControlTick);
      this.disableControlTick = null;
    }

    deleteEntity(this.vehicle);
    deleteEntity(this.peds.driver);
    deleteEntity(this.peds.ped1);
    deleteEntity(this.peds.ped2);

    SetEntityCoords(
      cache.ped,
      -1629.098877,
      -1058.479126,
      4.712769,
      false,
      false,
      false,
      false
    );
    SetPedToRagdoll(cache.ped, 10000, 10000, 0, false, false, false);

    await sleep(3000);

    DoScreenFadeIn(500);
  }

  async start() {
    await this.prapareVehicleAndPeds();

    await this.goToPlayer();

    this.disabeAllControls();

    await this.playKidnapAnimation();

    await this.goToFinalPoint();

    await this.finishKidnap();

    return true;
  }
}

export default new Kidnap("kidnap");
