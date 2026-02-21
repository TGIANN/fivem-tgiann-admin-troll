import { cache } from "@communityox/ox_lib";
import MainTroll from ".";
import { deleteEntity } from "../../utils/entity";

const CIRCLE_RADIUS = 3.0;
const MAX_CLONES = 10;

class CloneCircle extends MainTroll {
  private clones: number[] = [];
  private originalPeds: number[] = [];
  private tick: number = null;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  private deleteClones() {
    for (const clone of this.clones) {
      if (DoesEntityExist(clone)) {
        deleteEntity(clone);
      }
    }
    this.clones = [];
  }

  private showOriginalPeds() {
    for (const ped of this.originalPeds) {
      if (DoesEntityExist(ped)) {
        SetEntityVisible(ped, true, false);
      }
    }
    this.originalPeds = [];
  }

  async start() {
    const players = GetActivePlayers() as number[];
    let targetPlayers = players
      .filter((p) => p !== cache.playerId)
      .slice(0, MAX_CLONES);

    if (targetPlayers.length === 0) {
      targetPlayers = Array(5).fill(cache.playerId);
    }

    for (const player of targetPlayers) {
      const ped = GetPlayerPed(player);
      if (!DoesEntityExist(ped)) continue;

      const clone = ClonePed(ped, false, false, true);
      SetEntityInvincible(clone, true);
      SetPedCanRagdoll(clone, false);
      SetBlockingOfNonTemporaryEvents(clone, true);
      this.clones.push(clone);

      if (player !== cache.playerId) {
        this.originalPeds.push(ped);
      }
    }

    if (this.clones.length === 0) return true;

    const angleStep = (2 * Math.PI) / this.clones.length;

    this.tick = setTick(() => {
      const coords = GetEntityCoords(cache.ped, false);

      for (const ped of this.originalPeds) {
        if (DoesEntityExist(ped)) {
          SetEntityVisible(ped, false, false);
        }
      }

      for (let i = 0; i < this.clones.length; i++) {
        const clone = this.clones[i];
        if (!DoesEntityExist(clone)) continue;

        const angle = angleStep * i;
        const x = coords[0] + CIRCLE_RADIUS * Math.cos(angle);
        const y = coords[1] + CIRCLE_RADIUS * Math.sin(angle);
        const z = coords[2] - 1.0;

        const heading = GetHeadingFromVector_2d(coords[0] - x, coords[1] - y);

        TaskGoStraightToCoord(clone, x, y, z, 6.0, 0.1, heading, 0.5);
      }
    });

    return false;
  }

  stop() {
    this.clearTick();
    this.deleteClones();
    this.showOriginalPeds();
    super.stop();
  }
}

export default new CloneCircle("clone_circle");
