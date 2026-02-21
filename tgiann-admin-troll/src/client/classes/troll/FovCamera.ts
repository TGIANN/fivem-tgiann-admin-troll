import MainTroll from ".";

const MIN_FOV = 40;
const MAX_FOV = 100;
const SPEED = 0.5;

class FovCamera extends MainTroll {
  private cam: number;
  private tick: number;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
    RenderScriptCams(true, false, 0, true, true);

    let fov = MIN_FOV;
    let direction = 1;

    this.tick = setTick(() => {
      fov += direction * SPEED;
      if (fov >= MAX_FOV) direction = -1;
      else if (fov <= MIN_FOV) direction = 1;

      SetCamFov(this.cam, fov);
      const pos = GetGameplayCamCoord();
      const rot = GetGameplayCamRot(2);
      SetCamCoord(this.cam, pos[0], pos[1], pos[2]);
      SetCamRot(this.cam, rot[0], rot[1], rot[2], 2);
    });

    return false;
  }

  stop() {
    this.clearTick();
    RenderScriptCams(false, false, 0, true, true);
    if (this.cam) {
      DestroyCam(this.cam, false);
      this.cam = null;
    }
    super.stop();
  }
}

export default new FovCamera("fov_camera");
