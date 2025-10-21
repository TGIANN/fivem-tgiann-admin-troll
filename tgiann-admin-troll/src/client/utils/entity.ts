import { cache } from "@communityox/ox_lib";
import { requestAnimDict, requestModel } from "@communityox/ox_lib/client";

export function getClosestVehicle(
  radius: number,
  coords?: [number, number, number]
): number | null {
  const gamePool = GetGamePool("CVehicle") as number[];
  let closestVehicle: number | null = null;
  let closestDistance = radius;

  const checkCoords = coords || GetEntityCoords(cache.ped, false);

  for (const vehicle of gamePool) {
    const vehicleCoords = GetEntityCoords(vehicle, false);
    const distance = GetDistanceBetweenCoords(
      checkCoords[0],
      checkCoords[1],
      checkCoords[2],
      vehicleCoords[0],
      vehicleCoords[1],
      vehicleCoords[2],
      true
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestVehicle = vehicle;
    }
  }

  return closestVehicle;
}

export function deleteEntity(entity: number) {
  if (!DoesEntityExist(entity)) return;

  if (NetworkGetEntityIsNetworked(entity)) {
    const netId = NetworkGetNetworkIdFromEntity(entity);
    if (NetworkHasControlOfNetworkId(netId)) {
      emitNet(`${cache.resource}:deleteEntity`, netId);
    }
  }

  SetEntityAsMissionEntity(entity, true, true);
  DeleteEntity(entity);
}

export async function createPed(
  model: number | string,
  coords: number[],
  isNetwork: boolean
): Promise<number> {
  model = typeof model === "string" ? GetHashKey(model) : model;
  await requestModel(model);

  const ped = CreatePed(
    4,
    model,
    coords[0],
    coords[1],
    coords[2],
    0,
    isNetwork,
    false
  );
  SetPedCanRagdoll(ped, false);
  SetBlockingOfNonTemporaryEvents(ped, true);

  if (isNetwork) {
    const netId = NetworkGetNetworkIdFromEntity(ped);
    emitNet(`${cache.resource}:entitySpawned`, netId);
  }

  return ped;
}

export async function createVehicle(
  model: number | string,
  coords: number[],
  isNetwork: boolean
): Promise<number> {
  model = typeof model === "string" ? GetHashKey(model) : model;
  await requestModel(model);

  const veh = CreateVehicle(
    model,
    coords[0],
    coords[1],
    coords[2],
    0,
    isNetwork,
    false
  );
  SetVehicleOnGroundProperly(veh);
  SetEntityAsMissionEntity(veh, true, true);

  if (isNetwork) {
    const netId = NetworkGetNetworkIdFromEntity(veh);
    emitNet(`${cache.resource}:entitySpawned`, netId);
  }

  return veh;
}

export function getEntityBackward(entity: number, distance = 1.5) {
  const entityPos = GetEntityCoords(entity, true);
  const forwardVector = GetEntityForwardVector(entity);
  const behindPos = [
    entityPos[0] - forwardVector[0] * distance,
    entityPos[1] - forwardVector[1] * distance,
    entityPos[2] - 1.0,
  ];
  return behindPos;
}

export function getEntityForward(entity: number, distance = 1.5) {
  const entityPos = GetEntityCoords(entity, true);
  const forwardVector = GetEntityForwardVector(entity);
  const inFrontPos = [
    entityPos[0] + forwardVector[0] * distance,
    entityPos[1] + forwardVector[1] * distance,
    entityPos[2] - 1.0,
  ];
  return inFrontPos;
}

export async function playAnim(
  ped: number,
  animDictionary: string,
  animationName: string,
  blendInSpeed: number = 8.0,
  blendOutSpeed: number = 8.0,
  duration: number = -1,
  flag: number = 38,
  playbackRate: number = 0.0,
  lockX: boolean = false,
  lockY: boolean = false,
  lockZ: boolean = false
) {
  await requestAnimDict(animDictionary);
  TaskPlayAnim(
    ped,
    animDictionary,
    animationName,
    blendInSpeed,
    blendOutSpeed,
    duration,
    flag,
    playbackRate,
    lockX,
    lockY,
    lockZ
  );
  RemoveAnimSet(animDictionary);
}

export async function createObject(
  model: number | string,
  coords: number[],
  isNetwork: boolean
): Promise<number> {
  model = typeof model === "string" ? GetHashKey(model) : model;
  await requestModel(model);
  const object = CreateObject(
    model,
    coords[0],
    coords[1],
    coords[2],
    isNetwork,
    false,
    false
  );
  SetEntityAsMissionEntity(object, true, true);

  if (isNetwork) {
    const netId = NetworkGetNetworkIdFromEntity(object);
    emitNet(`${cache.resource}:entitySpawned`, netId);
  }

  return object;
}
