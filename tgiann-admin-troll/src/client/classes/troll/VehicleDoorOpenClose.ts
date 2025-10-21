import MainTroll from ".";
import { cache } from "@communityox/ox_lib";
import { getClosestVehicle } from "../../utils/entity";

class VehicleDoorOpenClose extends MainTroll {
  private timeout: CitizenTimer = null;

  private clearTimeout() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private async closestVehicleDoorControl() {
    let vehicle = null;
    if (cache.vehicle) {
      vehicle = cache.vehicle;
    } else {
      vehicle = getClosestVehicle(15.0);
    }

    if (vehicle) {
      const doorCount = GetNumberOfVehicleDoors(vehicle);
      const doorIndex = Math.floor(Math.random() * doorCount);

      const isDoorOpen = GetVehicleDoorAngleRatio(vehicle, doorIndex) > 0.0;
      if (isDoorOpen) {
        SetVehicleDoorShut(vehicle, doorIndex, false);
      } else {
        SetVehicleDoorOpen(vehicle, doorIndex, false, false);
      }
    }

    this.timeout = setTimeout(() => {
      this.closestVehicleDoorControl();
    }, Math.floor(Math.random() * 1000) + 500);
  }

  async start() {
    this.clearTimeout();
    this.closestVehicleDoorControl();

    return false;
  }

  stop() {
    this.clearTimeout();
    super.stop();
  }
}

export default new VehicleDoorOpenClose("door_open_close");
