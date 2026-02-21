import MainTroll from ".";

const LOD_SCALE = 0.1;

class LowPoly extends MainTroll {
  private tick: number = null;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.tick = setTick(() => {
      OverrideLodscaleThisFrame(LOD_SCALE);
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new LowPoly("low_poly");
