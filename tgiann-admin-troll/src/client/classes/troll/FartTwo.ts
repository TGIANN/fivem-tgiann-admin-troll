import MainTroll from ".";
import { playNetworkSound, stopNetworkSound } from "../../utils/playSound";
import { sleep } from "@communityox/ox_lib";

class FartTwo extends MainTroll {
  private soundId: number;

  async start() {
    this.soundId = await playNetworkSound("fart2");

    while (this.soundId !== null && !HasSoundFinished(this.soundId))
      await sleep(100);

    if (this.soundId === null) return false;

    return true;
  }

  stop() {
    stopNetworkSound();
    this.soundId = null;
    super.stop();
  }
}

export default new FartTwo("fart_type_2");
