import { cache } from "@communityox/ox_lib";
import MainTroll from ".";

class BreakVehicleWheel extends MainTroll {
  async start() {
    if (!cache.vehicle) return true;
    if (cache.seat !== -1) return true;

    const numberOfTires = GetVehicleNumberOfWheels(cache.vehicle);

    for (let i = 0; i < numberOfTires; i++) {
      //@ts-ignore
      const isTireBurst = IsVehicleWheelBrokenOff(cache.vehicle, i);

      if (!isTireBurst)
        BreakOffVehicleWheel(cache.vehicle, i, true, false, true, false);
    }

    return true;
  }
}

export default new BreakVehicleWheel("breake_vehicle_wheel");
