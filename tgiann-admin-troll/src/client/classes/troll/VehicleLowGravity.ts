import { cache, sleep } from "@communityox/ox_lib";
import MainTroll from ".";

class VehicleLowGravity extends MainTroll {
  private tick: number;
  private lastVehicle: number;

  private resetGravity(vehicle: number) {
    SetVehicleGravityAmount(vehicle, 10.0);
  }

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      if (this.lastVehicle) this.resetGravity(this.lastVehicle);
      this.tick = null;
      this.lastVehicle = null;
    }
  }

  async start() {
    this.tick = setTick(async () => {
      const playerVehicle = GetVehiclePedIsIn(cache.ped, false);

      if (!playerVehicle) {
        if (this.lastVehicle) this.resetGravity(this.lastVehicle);
        this.lastVehicle = null;
        return;
      }

      if (playerVehicle !== this.lastVehicle) {
        if (this.lastVehicle) this.resetGravity(this.lastVehicle);
        this.lastVehicle = playerVehicle;
        SetVehicleGravityAmount(playerVehicle, 2.5);
      }

      await sleep(100);
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new VehicleLowGravity("vehicle_low_gravity");
