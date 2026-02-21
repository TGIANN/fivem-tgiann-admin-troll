import { addCommand, cache, onClientCallback } from "@communityox/ox_lib/server";
import serverPlayerList from "./classes/serverPlayerList/serverPlayerList";
import ServerPlayer from "./classes/serverPlayer/serverPlayer";
import {
  ForceControlKey,
  PerformAction,
  TrollActionVariables,
  TrollName,
} from "types";
import { debugPrint } from "utils";
import menuOpenedAdminList from "./classes/menuOpenedAdminList/adminList";
import config from "@common/config";
import { isAdmin } from "./utils";
import "./gameStream";

const fetchAllPlayerNamesFromFramework = () => {
  // ESX
  try {
    const ESX = exports["es_extended"]?.getSharedObject?.();
    if (ESX) {
      const xPlayers = ESX.GetExtendedPlayers();

      for (const xPlayer of xPlayers) {
        const src = xPlayer.source;

        const serverPlayer = serverPlayerList.getPlayer(src);
        if (!serverPlayer) return;

        const charName = xPlayer.getName?.();
        if (!charName) continue;

        const name = `[${src}] ${charName}`;
        serverPlayer.updatePlayerName(name);
      }
      return;
    }
  } catch {}

  // QBCore
  try {
    const QBCore = exports["qb-core"]?.GetCoreObject?.();
    if (QBCore) {
      const qbPlayers = QBCore.Functions.GetQBPlayers();
      for (const src in qbPlayers) {
        const player = qbPlayers[src];
        if (!player?.PlayerData?.charinfo) continue;

        const srcNum = Number(src);
        const serverPlayer = serverPlayerList.getPlayer(srcNum);
        if (!serverPlayer) return;

        const { firstname, lastname } = player.PlayerData.charinfo;
        const name = `[${src}] ${firstname} ${lastname}`;
        serverPlayer.updatePlayerName(name);
      }
      return;
    }
  } catch {}
};

const openMenu = async (playerId: number) => {
  if (!playerId) return;
  if (!isAdmin(playerId)) return;

  const allPlayers = serverPlayerList.getAllPlayers();
  emitNet(
    `${cache.resource}:openNui`,
    playerId,
    Array.from(allPlayers.values()),
  );
  menuOpenedAdminList.addAdmin(playerId);
};

if (config.command.enable) {
  addCommand(config.command.name, openMenu, {
    help: "Open the admin troll menu",
    restricted: config.adminGroup,
  });
}

onNet(`${cache.resource}:tryOpenMenu`, () => openMenu(global.source));

onNet(`${cache.resource}:closeNui`, () => {
  const playerId = global.source;
  menuOpenedAdminList.removeAdmin(playerId);
});

onNet(`${cache.resource}:playerConnected`, () => {
  const playerId = global.source;
  const serverPlayer = new ServerPlayer(playerId);
  serverPlayerList.addPlayer(
    playerId,
    serverPlayer,
    menuOpenedAdminList.emitNetToAdmins.bind(menuOpenedAdminList),
  );
});

on("playerDropped", () => {
  const playerId = global.source;

  menuOpenedAdminList.removeAdmin(playerId);

  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  const entityList = serverPlayer.getAllEntities();
  for (const netId of entityList) {
    const entity = NetworkGetEntityFromNetworkId(netId);
    if (!entity || !DoesEntityExist(entity)) continue;

    DeleteEntity(entity);
  }

  serverPlayerList.removePlayer(
    playerId,
    menuOpenedAdminList.emitNetToAdmins.bind(menuOpenedAdminList),
  );
});

onNet(
  `${cache.resource}:performAction`,
  (data: PerformAction, variables: TrollActionVariables) => {
    const playerId = global.source;

    if (!isAdmin(playerId)) return;

    const { actionType, src } = data;
    const serverPlayer = serverPlayerList.getPlayer(src);
    if (!serverPlayer) return;

    debugPrint(
      `Performing action ${actionType} on player ${serverPlayer.name} (src: ${src})`,
    );

    const [success] = serverPlayer.playTroll(actionType, variables);

    if (!success) return;

    menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:actionPerformed`, {
      trollName: actionType,
      src,
    });
  },
);

onNet(`${cache.resource}:stopTrollAction`, (data: PerformAction) => {
  const playerId = global.source;

  if (!isAdmin(playerId)) return;

  const { actionType, src } = data;
  const serverPlayer = serverPlayerList.getPlayer(src);
  if (!serverPlayer) return;

  const actionVars = serverPlayer.getTrollVariables(actionType);
  if (actionVars) {
    if (actionVars.onlyStopSrc && actionVars.onlyStopSrc !== playerId) return;
  }

  serverPlayer.stopTroll(actionType);
});

onNet(`${cache.resource}:trolStopped`, (trollName: TrollName) => {
  const playerId = global.source;
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  serverPlayer.trollStopped(trollName);
  menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:trollStopped`, {
    trollName,
    src: playerId,
  });
});

onNet(`${cache.resource}:playSound`, (soundFile: string) => {
  const playerId = global.source;

  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  if (
    !serverPlayer.trollIsActive("fart_type_1") &&
    !serverPlayer.trollIsActive("fart_type_2")
  )
    return;

  const playerState = Player(global.source);
  playerState.state.set("tgiann_troll_sound", soundFile, true);
});

onNet(`${cache.resource}:stopSound`, () => {
  const playerState = Player(global.source);
  playerState.state.set("tgiann_troll_sound", false, true);
});

onNet(`${cache.resource}:entitySpawned`, (netId: number) => {
  const playerId = global.source;
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  serverPlayer.addEntity(netId);
});

onNet(`${cache.resource}:deleteEntity`, (netId: number) => {
  const playerId = global.source;

  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  if (!serverPlayer.isEntityOwnedByPlayer(netId)) return;

  const entity = NetworkGetEntityFromNetworkId(netId);
  if (!entity || !DoesEntityExist(entity)) return;

  DeleteEntity(entity);

  serverPlayer.removeEntity(netId);
});

onNet(`${cache.resource}:server:spawnUfo`, (coords: number[]) => {
  const playerId = global.source;
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  if (!serverPlayer.trollIsActive("ufo_kidnap")) return;

  emitNet(`${cache.resource}:client:spawnUfo`, -1, coords, global.source);
});

onNet(`${cache.resource}:server:deleteUfo`, () => {
  emitNet(`${cache.resource}:client:deleteUfo`, -1, global.source);
});

onNet(
  `${cache.resource}:forceKeyboardControl`,
  (src: number, key: ForceControlKey, action: "released" | "pressed") => {
    const playerId = global.source;

    if (!isAdmin(playerId)) return;

    emitNet(`${cache.resource}:forceControlApply`, src, key, action);
  },
);

onNet("esx:playerLoaded", (playerId: number, xPlayer: unknown, _: boolean) => {
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  // @ts-ignore
  // Check newnest esx
  if (!xPlayer.name) return;

  // @ts-ignore
  const name = `[${playerId}] ${xPlayer.name}`;
  serverPlayer.updatePlayerName(name);

  menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:playerNameUpdated`, {
    name,
    src: playerId,
  });
});

onNet("QBCore:Server:PlayerLoaded", (xPlayer: unknown) => {
  // @ts-ignore
  const playerId = xPlayer.PlayerData.source;
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  // @ts-ignore
  const name = `[${playerId}] ${xPlayer.PlayerData.charinfo.firstname} ${xPlayer.PlayerData.charinfo.lastname}`;
  serverPlayer.updatePlayerName(name);

  menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:playerNameUpdated`, {
    name,
    src: playerId,
  });
});

onClientCallback(`${cache.resource}:getPlayerCoords`, (playerId, targetSrc: number) => {
  if (!isAdmin(playerId)) return null;

  const targetPed = GetPlayerPed(targetSrc.toString());
  if (!targetPed) return null;

  return GetEntityCoords(targetPed);
});

on("onResourceStop", (resourceName: string) => {
  if (cache.resource !== resourceName) return;

  const allEntities = serverPlayerList.getAllEntities();

  for (const netId of allEntities) {
    const entity = NetworkGetEntityFromNetworkId(netId);
    if (!entity || !DoesEntityExist(entity)) continue;

    DeleteEntity(entity);
  }

  debugPrint(
    `Resource stopping, deleting ${allEntities.length} entities spawned by troll actions.`,
  );
});

on("onResourceStart", (resourceName: string) => {
  if (cache.resource !== resourceName) return;
  setTimeout(() => fetchAllPlayerNamesFromFramework(), 3000);
});
