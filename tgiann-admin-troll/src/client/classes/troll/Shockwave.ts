import { cache } from "@communityox/ox_lib";
import MainTroll from ".";

const RADIUS = 50.0;
const FORCE_MULTIPLIER = 100.0;

const applyShockwave = (entity: number): void => {
  const playerPos = GetEntityCoords(PlayerPedId(), false);
  const entityPos = GetEntityCoords(entity, false);

  const dx = entityPos[0] - playerPos[0];
  const dy = entityPos[1] - playerPos[1];
  const dz = entityPos[2] - playerPos[2];

  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const distanceRate =
    (FORCE_MULTIPLIER / distance) * Math.pow(1.04, 1 - distance);

  const randomTorque = () =>
    Math.random() * (Math.floor(Math.random() * 3) - 1);

  ApplyForceToEntity(
    entity,
    1,
    distanceRate * dx,
    distanceRate * dy,
    distanceRate * dz,
    randomTorque(),
    randomTorque(),
    randomTorque(),
    1,
    false,
    true,
    true,
    true,
    true,
  );
};

class Shockwave extends MainTroll {
  async start() {
    const coords = GetEntityCoords(cache.ped, false);

    const vehicles = GetGamePool("CVehicle") as number[];
    for (const vehicle of vehicles) {
      const vehCoords = GetEntityCoords(vehicle, false);
      const dist = GetDistanceBetweenCoords(
        coords[0],
        coords[1],
        coords[2],
        vehCoords[0],
        vehCoords[1],
        vehCoords[2],
        true,
      );
      if (
        (!cache.vehicle || vehicle !== cache.vehicle) &&
        dist <= RADIUS * 1.2
      ) {
        NetworkRequestControlOfEntity(vehicle);
        applyShockwave(vehicle);
      }
    }

    const peds = GetGamePool("CPed") as number[];
    for (const ped of peds) {
      const pedCoords = GetEntityCoords(ped, false);
      const dist = GetDistanceBetweenCoords(
        coords[0],
        coords[1],
        coords[2],
        pedCoords[0],
        pedCoords[1],
        pedCoords[2],
        true,
      );
      if (ped !== cache.ped && dist <= RADIUS * 1.2) {
        NetworkRequestControlOfEntity(ped);
        SetPedRagdollOnCollision(ped, true);
        SetPedRagdollForceFall(ped);
        applyShockwave(ped);
      }
    }

    return true;
  }
}

export default new Shockwave("shockwave");
