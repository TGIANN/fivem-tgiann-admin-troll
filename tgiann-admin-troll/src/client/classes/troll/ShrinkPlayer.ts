import { cache } from "@communityox/ox_lib";
import MainTroll from ".";

const normalizeVector = (
  vector: number[],
  scale: number
): { x: number; y: number; z: number } => {
  const length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
  if (length === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: (vector[0] / length) * scale,
    y: (vector[1] / length) * scale,
    z: (vector[2] / length) * scale,
  };
};

class ShrinkPlayer extends MainTroll {
  private tick: number;

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  async start() {
    const randomScale = Math.random() * 0.8 + 0.1;

    this.tick = setTick(() => {
      if (cache.vehicle) return;

      const [forward, right, upVector, position] = GetEntityMatrix(cache.ped);

      // Normalize vectors and apply scale
      const forwardNorm = normalizeVector(forward, randomScale);
      const rightNorm = normalizeVector(right, randomScale);
      const upNorm = normalizeVector(upVector, randomScale);

      const entitySpeed = GetEntitySpeed(cache.ped);
      const entityHeightAboveGround = GetEntityHeightAboveGround(cache.ped);

      const adjustedZ =
        entitySpeed <= 0 && entityHeightAboveGround < 2
          ? entityHeightAboveGround - randomScale
          : GetEntityUprightValue(cache.ped) - randomScale;

      // Disable look at the around to prevent flickering
      TaskLookAtEntity(cache.ped, cache.ped, 1, 2048, 3);

      SetEntityMatrix(
        cache.ped,
        forwardNorm.x,
        forwardNorm.y,
        forwardNorm.z,
        rightNorm.x,
        rightNorm.y,
        rightNorm.z,
        upNorm.x,
        upNorm.y,
        upNorm.z,
        position[0],
        position[1],
        position[2] - adjustedZ
      );
    });

    return false;
  }

  stop() {
    this.clearTick();
    super.stop();
  }
}

export default new ShrinkPlayer("shrink_player");
