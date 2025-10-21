import MainTroll from ".";
import { cache } from "@communityox/ox_lib";

const CAMERA_OFFSET_MAX = 20.0;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

class TwoDGame extends MainTroll {
  private camera: number;
  private tick: number;
  private lastPos: number[];
  private cameraOffset: [number, number, number];

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    this.camera = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);
    SetCamAffectsAiming(this.camera, false);

    this.lastPos = GetEntityCoords(cache.ped, false);
    this.cameraOffset = [0, 0, 0];

    this.tick = setTick(() => {
      const pos = GetEntityCoords(cache.ped, false);

      const targetCameraOffset: [number, number, number] = [
        clamp(
          lerp(
            -CAMERA_OFFSET_MAX,
            CAMERA_OFFSET_MAX,
            0.5 + (pos[0] - this.lastPos[0]) / 3
          ),
          -CAMERA_OFFSET_MAX,
          CAMERA_OFFSET_MAX
        ),
        clamp(
          lerp(
            -CAMERA_OFFSET_MAX,
            CAMERA_OFFSET_MAX,
            0.5 + (pos[1] - this.lastPos[1]) / 3
          ),
          -CAMERA_OFFSET_MAX,
          CAMERA_OFFSET_MAX
        ),
        0,
      ];

      this.lastPos = pos;
      this.cameraOffset = [
        lerp(
          this.cameraOffset[0],
          targetCameraOffset[0],
          clamp(
            Math.abs(targetCameraOffset[0] - this.cameraOffset[0]) * 0.2,
            0,
            1
          )
        ),
        lerp(
          this.cameraOffset[1],
          targetCameraOffset[1],
          clamp(
            Math.abs(targetCameraOffset[1] - this.cameraOffset[1]) * 0.2,
            0,
            1
          )
        ),
        0,
      ];

      SetCamFov(this.camera, 70);
      SetCamCoord(
        this.camera,
        pos[0] + this.cameraOffset[0],
        pos[1] + this.cameraOffset[1],
        pos[2] + 20
      );
      SetCamRot(this.camera, -90, 0, GetEntityHeading(cache.ped), 0);
      RenderScriptCams(true, true, 500, false, false);
    });

    return false;
  }

  stop() {
    this.clearTick();
    RenderScriptCams(false, true, 500, false, false);
    DestroyCam(this.camera, true);
    super.stop();
  }
}

export default new TwoDGame("2d_game");
