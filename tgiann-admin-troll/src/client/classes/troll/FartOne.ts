import MainTroll from ".";
import { playNetworkSound, stopNetworkSound } from "../../utils/playSound";
import { sleep } from "@communityox/ox_lib";

class FartOne extends MainTroll {
  async start() {
    const soundId = await playNetworkSound("fart1");

    while (!HasSoundFinished(soundId)) await sleep(100);

    stopNetworkSound();

    return true;
  }
}

export default new FartOne("fart_type_1");
