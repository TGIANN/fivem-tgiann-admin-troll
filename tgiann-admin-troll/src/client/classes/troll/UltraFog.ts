import { sleep } from "@communityox/ox_lib";
import MainTroll from ".";
const timecycleModifierName = "prologue_ending_fog";

class UltraFog extends MainTroll {
  private tick: number = null;
  private strength = 0.0;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
      this.strength = 0.0;
      ClearTimecycleModifier();
    }
  }

  async start() {
    this.clearTick();
    this.tick = setTick(async () => {
      SetTimecycleModifier(timecycleModifierName);
      SetTimecycleModifierStrength(this.strength);

      if (this.strength < 0.7) {
        this.strength += 0.01;
      }
      await sleep(100);
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new UltraFog("ultra_fog");
