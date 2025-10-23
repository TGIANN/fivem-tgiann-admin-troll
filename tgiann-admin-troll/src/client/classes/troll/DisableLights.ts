import MainTroll from ".";

class DisableLights extends MainTroll {
  private tick: number;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.tick = setTick(() => {
      SetArtificialLightsState(true);
      SetArtificialLightsStateAffectsVehicles(false);
    });

    return false;
  }

  stop() {
    this.clearTick();
    SetArtificialLightsState(false);
    super.stop();
  }
}

export default new DisableLights("disable_lights");
