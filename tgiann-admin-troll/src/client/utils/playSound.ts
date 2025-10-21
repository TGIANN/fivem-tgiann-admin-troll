import { debugPrint } from "@common/utils";
import { sleep } from "@communityox/ox_lib";
import { cache } from "@communityox/ox_lib/client";

const activeSounds: Map<number, number> = new Map();

async function requestScriptAudioBank() {
  while (!RequestScriptAudioBank("tgiannadmintroll/sounds", false))
    await sleep(100);
}

export async function playSound(soundFile: string, entity: number = cache.ped) {
  await requestScriptAudioBank();

  const soundId = GetSoundId();

  debugPrint(
    `Playing sound ${soundFile} with soundId ${soundId} on entity ${entity} | My Ped: ${cache.ped}`
  );

  PlaySoundFromEntity(
    soundId,
    soundFile,
    entity,
    "tgiann_admin_troll",
    false,
    0
  );
  ReleaseNamedScriptAudioBank("tgiannadmintroll/sounds");

  return soundId;
}

export async function playSoundFrontend(soundFile: string) {
  await requestScriptAudioBank();

  const soundId = GetSoundId();

  debugPrint(`Playing sound ${soundFile} with soundId ${soundId} on frontend`);

  PlaySoundFrontend(soundId, soundFile, "tgiann_admin_troll", false);
  ReleaseNamedScriptAudioBank("tgiannadmintroll/sounds");

  return soundId;
}

export function stopSound(soundId: number) {
  StopSound(soundId);
  ReleaseSoundId(soundId);
  debugPrint(`Stopped sound with soundId ${soundId}`);
}

export async function playNetworkSound(soundFile: string) {
  emitNet(`${cache.resource}:playSound`, soundFile);
  let soundId = undefined;
  while (soundId === undefined) {
    soundId = activeSounds.get(cache.serverId);
    await sleep(100);
  }
  return soundId;
}

export function stopNetworkSound() {
  debugPrint("Stopping network sound");
  emitNet(`${cache.resource}:stopSound`);
}

AddStateBagChangeHandler(
  "tgiann_troll_sound",
  null,
  async (bagName: string, key: string, value: string | null) => {
    const ply = GetPlayerFromStateBagName(bagName);
    if (ply === 0) return;

    const ped = GetPlayerPed(ply);
    const serverId = GetPlayerServerId(ply);

    debugPrint(
      `tgiann_troll_sound state bag changed: ${value} for ${serverId}`
    );

    if (value) {
      const soundId = await playSound(value, ped);
      activeSounds.set(serverId, soundId);
    } else {
      const soundId = activeSounds.get(serverId);
      if (soundId !== undefined) {
        stopSound(soundId);
        activeSounds.delete(serverId);
      }
    }
  }
);
