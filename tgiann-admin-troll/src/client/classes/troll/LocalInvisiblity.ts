import MainTroll from ".";
import { cache } from "@communityox/ox_lib";

class localInvisibility extends MainTroll {
  private timeout: CitizenTimer = null;
  private tick: number = null;
  private isInvisible: boolean = false;

  private destoryInvisibility() {
    this.isInvisible = false;
    SetEntityLocallyVisible(cache.ped);
    this.clearTimeout();
    this.clearTick();
    this.isInvisible = false;
  }

  private clearTimeout() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  private async toggleInvisible() {
    this.timeout = setTimeout(() => {
      this.isInvisible = !this.isInvisible;
      this.toggleInvisible();
    }, Math.floor(Math.random() * 2500) + 1);
  }

  async start() {
    this.isInvisible = true;

    this.destoryInvisibility();
    this.toggleInvisible();

    this.tick = setTick(() => {
      if (this.isInvisible) SetEntityLocallyInvisible(cache.ped);
    });

    return false;
  }

  stop() {
    this.destoryInvisibility();
    super.stop();
  }
}

export default new localInvisibility("local_invisibility");
