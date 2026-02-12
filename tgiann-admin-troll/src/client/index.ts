import { cache } from "@communityox/ox_lib/client";
import ClientPlayerC from "./classes/player/Player";
import { debugPrint, sendNuiMessage } from "../common/utils";
import { PerformAction, Player, TrollActionVariables, TrollName } from "types";
import { getTrollClass } from "./utils/getTrollClass";
import Ufo from "./classes/ufo/Ufo";
import forceControlTarget from "./classes/forceControl/ForceControl";
import config from "@common/config";
import "./gameStream";

const clientPlayer = new ClientPlayerC();
let menuOpenTick: number = null;

RegisterNuiCallback("close", (_: string, cb: (data: unknown) => {}) => {
  SetNuiFocus(false, false);
  emitNet(`${cache.resource}:closeNui`);
  if (menuOpenTick) {
    // Wait for esc key controls to be released
    setTimeout(() => {
      clearTick(menuOpenTick);
      menuOpenTick = null;
    }, 500);
  }
  cb({});
});

RegisterNuiCallback(
  "performAction",
  (data: PerformAction, cb: (data: unknown) => {}) => {
    debugPrint(`Requesting action ${data.actionType} on player ${data.src}`);
    let variables: TrollActionVariables = {};

    if (data.actionType === "force_control_player") {
      forceControlTarget.addPlayer(data.src);
      variables = { onlyStopSrc: cache.serverId };
    }

    emitNet(`${cache.resource}:performAction`, data, variables);

    cb({});
  },
);

RegisterNuiCallback(
  "stopTrollAction",
  (data: PerformAction, cb: (data: unknown) => {}) => {
    debugPrint(
      `Requesting stop troll action ${data.actionType} on player ${data.src}`,
    );

    if (data.actionType === "force_control_player")
      forceControlTarget.removePlayer(data.src);

    emitNet(`${cache.resource}:stopTrollAction`, data);
    cb({});
  },
);

RegisterNuiCallback(
  "setNuiFocusKeepInput",
  (isActive: boolean, cb: (data: unknown) => {}) => {
    SetNuiFocusKeepInput(isActive);
    cb({});
  },
);

onNet(`${cache.resource}:openNui`, (players: Player[]) => {
  SetNuiFocus(true, true);
  SetNuiFocusKeepInput(true);
  sendNuiMessage("open", players);

  debugPrint("NUI opened");
  debugPrint(JSON.stringify(players));

  menuOpenTick = setTick(() => {
    DisablePlayerFiring(cache.ped, true);

    DisableControlAction(0, 1, true); // LookLeftRight
    DisableControlAction(0, 2, true); // LookUpDown
    DisableControlAction(0, 24, true); // Attack
    DisableControlAction(0, 257, true); // Attack 2
    DisableControlAction(0, 263, true); // Melee Attack 1
    DisableControlAction(0, 68, true); // INPUT_VEH_AIM
    DisableControlAction(0, 69, true); // INPUT_VEH_AIM
    DisableControlAction(0, 92, true); // INPUT_VEH_AIM
    DisableControlAction(0, 47, true); // Disable weapon
    DisableControlAction(0, 264, true); // Disable melee
    DisableControlAction(0, 257, true); // Disable melee
    DisableControlAction(0, 140, true); // Disable melee
    DisableControlAction(0, 141, true); // Disable melee
    DisableControlAction(0, 142, true); // Disable melee
    DisableControlAction(0, 143, true); // Disable melee

    DisableControlAction(0, 177, true); // ESC
    DisableControlAction(0, 200, true); // ESC

    DisableFrontendThisFrame(); // Disable ESC menu
  });
});

onNet(`${cache.resource}:playTroll`, (trollName: TrollName) => {
  const TrollClass = getTrollClass(trollName);
  if (!TrollClass)
    return console.error(`Troll class for ${trollName} not found`);

  clientPlayer.playTroll(TrollClass);
});

onNet(`${cache.resource}:stopTroll`, (trollName: TrollName) => {
  const TrollClass = getTrollClass(trollName);
  if (!TrollClass)
    return console.error(`Troll class for ${trollName} not found`);

  clientPlayer.stopTroll(TrollClass);
});

onNet(
  `${cache.resource}:actionPerformed`,
  (data: { actionType: TrollName; src: number }) => {
    sendNuiMessage("actionPerformed", data);
  },
);

onNet(
  `${cache.resource}:trollStopped`,
  (data: { trollName: TrollName; src: number }) => {
    sendNuiMessage("trollStopped", data);
  },
);

onNet(`${cache.resource}:playerDisconnected`, (src: number) => {
  sendNuiMessage("playerDisconnected", src);
  debugPrint(`Player disconnected (src: ${src})`);
});

onNet(`${cache.resource}:playerConnected`, (player: Player) => {
  sendNuiMessage("playerConnected", player);
  debugPrint(`Player connected: ${player.name} (src: ${player.src})`);
});

onNet(
  `${cache.resource}:playerNameUpdated`,
  (data: { name: string; src: number }) => {
    sendNuiMessage("playerNameUpdated", data);
  },
);

onNet(`${cache.resource}:client:spawnUfo`, (coords: number[], src: number) => {
  Ufo.spawnUfo(coords, src);
});

onNet(`${cache.resource}:client:deleteUfo`, (src: number) => {
  Ufo.deleteUfo(src);
});

const init = () => {
  emitNet(`${cache.resource}:playerConnected`);
};

setTimeout(init, 1000);

if (config.keybind.enable) {
  const keyName = `${config.keybind.key}OpenTrollMenu`; // A trick to trick the FiveM cache when the key is changed in the config file.
  RegisterKeyMapping(
    keyName,
    "Toggle Troll Menu (Admin)",
    "keyboard",
    config.keybind.key,
  );

  RegisterCommand(
    keyName,
    () => emitNet(`${cache.resource}:tryOpenMenu`),
    false,
  );
}

// TESTING
// setTimeout(() => {
//   const TrollClass = getTrollClass("ufo_kidnap");
//   clientPlayer.playTroll(TrollClass);
// }, 1000);
