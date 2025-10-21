import { ActiveTrolls, TrollActionVariables, TrollName } from "types";
import { Player } from "types";
import { cache } from "@communityox/ox_lib/server";
import { debugPrint } from "@common/utils";

export interface ServerPlayerType extends Player {
  updatePlayerName(name: string): void;
  playTroll(
    troll: string,
    variables: TrollActionVariables
  ): [boolean, string | null];
  stopTroll(troll: string): void;
  trollStopped(troll: string): void;
  trollIsActive(troll: string): boolean;
  playerIsOnline(): boolean;
  addEntity(netId: number): void;
  removeEntity(netId: number): void;
  getAllEntities(): number[];
  getTrollVariables(troll: TrollName): TrollActionVariables | null;
}

class ServerPlayer implements ServerPlayerType {
  src: number;
  name: string;
  activeTrolls: ActiveTrolls = [];
  trollVariables: Map<TrollName, TrollActionVariables> = new Map();
  entityList: number[] = [];
  id: string;

  constructor(src: number) {
    this.src = src;
    const stringSrc = src.toString();
    this.name = `[${src}] ${GetPlayerName(stringSrc) || "Unknown"}`;
    this.id =
      GetPlayerIdentifierByType(stringSrc, "steam") ||
      GetPlayerIdentifierByType(stringSrc, "licance") ||
      GetPlayerIdentifierByType(stringSrc, "licance2");
  }

  updatePlayerName(name: string): void {
    this.name = name;
    debugPrint(`Player name updated to: ${name} (src: ${this.src})`);
  }

  addEntity(netId: number): void {
    this.entityList = [...this.entityList, netId];
    debugPrint(`Entity spawned with netId: ${netId} (src: ${this.src})`);
  }

  getAllEntities(): number[] {
    return this.entityList;
  }

  removeEntity(netId: number): void {
    this.entityList = this.entityList.filter((id) => id !== netId);
    debugPrint(`Entity removed with netId: ${netId} (src: ${this.src})`);
  }

  playerIsOnline(): boolean {
    return GetPlayerName(this.src.toString()) !== null;
  }

  trollIsActive(troll: TrollName): boolean {
    return this.activeTrolls.includes(troll);
  }

  playTroll(
    troll: TrollName,
    variables: TrollActionVariables
  ): [boolean, string | null] {
    if (this.trollIsActive(troll)) return [false, "trollActive"];
    if (!this.playerIsOnline()) return [false, "playerOffline"];

    this.activeTrolls.push(troll);
    this.trollVariables.set(troll, variables);

    emitNet(`${cache.resource}:playTroll`, this.src, troll);
    return [true, null];
  }

  stopTroll(troll: TrollName): void {
    if (!this.trollIsActive(troll)) return;

    emitNet(`${cache.resource}:stopTroll`, this.src, troll);
  }

  trollStopped(troll: TrollName): void {
    if (!this.trollIsActive(troll)) return;
    this.activeTrolls = this.activeTrolls.filter((t) => t !== troll);
    this.trollVariables.delete(troll);
  }

  getTrollVariables(troll: TrollName): TrollActionVariables | null {
    return this.trollVariables.get(troll) || null;
  }
}

export default ServerPlayer;
