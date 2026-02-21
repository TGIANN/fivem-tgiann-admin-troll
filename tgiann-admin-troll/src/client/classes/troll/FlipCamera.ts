import MainTroll from ".";

class FlipCamera extends MainTroll {
  private flippedCamera: number;
  private tick: number;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.flippedCamera = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
    RenderScriptCams(true, true, 700, true, true);

    this.tick = setTick(() => {
      const coord = GetGameplayCamCoord();
      const rot = GetGameplayCamRot(2);
      const fov = GetGameplayCamFov();

      SetCamParams(
        this.flippedCamera,
        coord[0],
        coord[1],
        coord[2],
        rot[0],
        180.0,
        rot[2],
        fov,
        700,
        0,
        0,
        2,
      );
    });

    return false;
  }

  stop() {
    this.clearTick();
    RenderScriptCams(false, true, 700, true, true);
    DestroyCam(this.flippedCamera, true);
    super.stop();
  }
}

export default new FlipCamera("flip_camera");
