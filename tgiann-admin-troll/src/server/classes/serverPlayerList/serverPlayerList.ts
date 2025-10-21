import { debugPrint } from "../../../common/utils";
import { ServerPlayerType } from "../serverPlayer/serverPlayer";
import { cache } from "@communityox/ox_lib";

type playerMap = Map<number, ServerPlayerType>;

class ServerPlayerList {
  private players: playerMap = new Map();

  playerIsAdded(src: number): boolean {
    return this.players.has(src);
  }

  addPlayer(
    src: number,
    player: ServerPlayerType,
    adminFunc?: (event: string, ...args: any[]) => void
  ): void {
    if (this.playerIsAdded(src)) return;

    this.players.set(src, player);

    if (adminFunc) adminFunc(`${cache.resource}:playerConnected`, player);

    debugPrint(`Player added: ${player.name} (src: ${src})`);
  }

  removePlayer(
    src: number,
    adminFunc?: (event: string, ...args: any[]) => void
  ): void {
    if (!this.playerIsAdded(src)) return;

    this.players.delete(src);

    if (adminFunc) adminFunc(`${cache.resource}:playerDisconnected`, src);

    debugPrint(`Player removed (src: ${src})`);
  }

  getPlayer(src: number): ServerPlayerType | null {
    if (!this.playerIsAdded(src)) return null;

    return this.players.get(src);
  }

  getAllPlayers(): playerMap {
    return this.players;
  }

  getAllEntities(): number[] {
    let entites: number[] = [];
    this.players.forEach((player) => {
      entites = [...entites, ...player.getAllEntities()];
    });
    return entites;
  }
}

const global = new ServerPlayerList();

export default global;
