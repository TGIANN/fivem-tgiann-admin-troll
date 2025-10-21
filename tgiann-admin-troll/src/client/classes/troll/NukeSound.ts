import MainTroll from ".";
import { playSoundFrontend, stopSound } from "../../utils/playSound";
import { sleep } from "@communityox/ox_lib";

class NukeSound extends MainTroll {
  private soundId: number;

  async start() {
    this.soundId = await playSoundFrontend("siren");

    while (!HasSoundFinished(this.soundId)) await sleep(100);

    if (this.soundId === null) return false;

    stopSound(this.soundId);

    return true;
  }

  stop() {
    stopSound(this.soundId);
    this.soundId = null;
    super.stop();
  }
}

export default new NukeSound("nuke_alert_sound");
