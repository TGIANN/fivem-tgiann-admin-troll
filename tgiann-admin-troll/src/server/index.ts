import { addCommand, cache } from "@communityox/ox_lib/server";
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

addCommand(
  "troll",
  async (playerId) => {
    if (!playerId) return;
    const allPlayers = serverPlayerList.getAllPlayers();
    emitNet(
      `${cache.resource}:openNui`,
      playerId,
      Array.from(allPlayers.values())
    );
    menuOpenedAdminList.addAdmin(playerId);
  },
  {
    help: "Open the admin troll menu",
    restricted: config.adminGroup,
  }
);

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
    menuOpenedAdminList.emitNetToAdmins.bind(menuOpenedAdminList)
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
    menuOpenedAdminList.emitNetToAdmins.bind(menuOpenedAdminList)
  );
});

onNet(
  `${cache.resource}:performAction`,
  (data: PerformAction, variables: TrollActionVariables) => {
    const { actionType, src } = data;
    const serverPlayer = serverPlayerList.getPlayer(src);
    if (!serverPlayer) return;

    debugPrint(
      `Performing action ${actionType} on player ${serverPlayer.name} (src: ${src})`
    );

    const [success] = serverPlayer.playTroll(actionType, variables);

    if (!success) return;

    menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:actionPerformed`, {
      trollName: actionType,
      src,
    });
  }
);

onNet(`${cache.resource}:stopTrollAction`, (data: PerformAction) => {
  const playerId = global.source;
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

  const entity = NetworkGetEntityFromNetworkId(netId);
  if (!entity || !DoesEntityExist(entity)) return;

  DeleteEntity(entity);

  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;
  serverPlayer.removeEntity(netId);
});

onNet(`${cache.resource}:server:spawnUfo`, (coords: number[]) => {
  emitNet(`${cache.resource}:client:spawnUfo`, -1, coords, global.source);
});

onNet(`${cache.resource}:server:deleteUfo`, () => {
  emitNet(`${cache.resource}:client:deleteUfo`, -1, global.source);
});

onNet(
  `${cache.resource}:forceKeyboardControl`,
  (src: number, key: ForceControlKey, action: "released" | "pressed") => {
    emitNet(`${cache.resource}:forceControlApply`, src, key, action);
  }
);

onNet("esx:playerLoaded", (playerId: number, xPlayer: unknown, _: boolean) => {
  const serverPlayer = serverPlayerList.getPlayer(playerId);
  if (!serverPlayer) return;

  // @ts-ignore
  // Check newnest esx
  if (!xPlayer.variables) return;

  // @ts-ignore
  const name = `[${playerId}] ${xPlayer.variables.firstName} ${xPlayer.variables.lastName}`;
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
  const name = `[${playerId}] ${xPlayer.PlayerData.charinfo.firstName} ${xPlayer.PlayerData.charinfo.lastName}`;
  serverPlayer.updatePlayerName(name);

  menuOpenedAdminList.emitNetToAdmins(`${cache.resource}:playerNameUpdated`, {
    name,
    src: playerId,
  });
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
    `Resource stopping, deleting ${allEntities.length} entities spawned by troll actions.`
  );
});
