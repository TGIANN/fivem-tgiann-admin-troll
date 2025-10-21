import { cache } from "@communityox/ox_lib/client";
import { createPed } from "./entity";

export async function createAggressiveNpc(
  model: number | string,
  coords: number[],
  weapon?: string
) {
  const ped = await createPed(model, coords, true);

  SetEntityInvincible(ped, true);

  if (weapon) {
    const weaponHash = GetHashKey(weapon);
    GiveWeaponToPed(ped, weaponHash, 9999, false, true);
    SetCurrentPedWeapon(ped, weaponHash, true);
    SetPedInfiniteAmmo(ped, true, weaponHash);
  }

  TaskCombatPed(ped, cache.ped, 0, 16);

  return ped;
}
