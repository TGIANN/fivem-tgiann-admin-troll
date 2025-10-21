import MainTroll from ".";
import { cache } from "@communityox/ox_lib";
import { deleteEntity, getEntityBackward } from "../../utils/entity";

class CloneFollow extends MainTroll {
  private ped: number = null;
  private tick: number = null;

  private clearTick = () => {
    if (this.tick) {
      clearTick(this.tick);
      this.tick = null;
    }
  };

  private deletePed = () => {
    if (this.ped) {
      deleteEntity(this.ped);
      this.ped = null;
    }
  };

  private getPlayerBehindPos = () => {
    const behindPos = getEntityBackward(cache.ped);
    return behindPos;
  };

  async start() {
    this.ped = ClonePed(cache.ped, false, false, true);
    const behindPos = this.getPlayerBehindPos();
    SetEntityCoords(
      this.ped,
      behindPos[0],
      behindPos[1],
      behindPos[2],
      false,
      false,
      false,
      false
    );
    SetEntityInvincible(this.ped, true);
    SetPedCanRagdoll(this.ped, false);
    SetBlockingOfNonTemporaryEvents(this.ped, true);

    this.tick = setTick(() => {
      if (!DoesEntityExist(this.ped)) return;

      const behindPos = this.getPlayerBehindPos();

      TaskGoStraightToCoord(
        this.ped,
        behindPos[0],
        behindPos[1],
        behindPos[2],
        6.0,
        0.1,
        GetEntityHeading(cache.ped),
        0.5
      );
    });

    return false;
  }

  stop() {
    this.clearTick();
    this.deletePed();
    super.stop();
  }
}

export default new CloneFollow("clone_follow");
