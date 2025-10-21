import { cache } from "@communityox/ox_lib";

export function getPlayerArroundCoords(radius = 5) {
  const playerCoords = GetEntityCoords(cache.ped, false);
  const newCoords = [
    playerCoords[0] + radius,
    playerCoords[1] + radius,
    playerCoords[2],
  ];

  const [retval, coords] = GetClosestVehicleNode(
    newCoords[0],
    newCoords[1],
    newCoords[2],
    1,
    10.0,
    10.0
  );

  if (retval) return coords;

  return newCoords;
}
