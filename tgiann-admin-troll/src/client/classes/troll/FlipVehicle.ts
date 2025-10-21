import MainTroll from ".";
import { cache, sleep } from "@communityox/ox_lib";

type Direction = "left" | "right";

const directions: Direction[] = ["left", "right"];
const dirToVector: Record<Direction, [number, number, number]> = {
  left: [2, 0, 0],
  right: [-2, 0, 0],
  // forward: [0, -2, 0],
  // back: [0, 2, 0],
};

class FlipVehicle extends MainTroll {
  getDrivingVehicle = () => {
    return cache.vehicle && cache.seat === -1 ? cache.vehicle : null;
  };

  async start() {
    const vehicle = this.getDrivingVehicle();
    if (!vehicle) return true;

    const randomDir = directions[Math.floor(Math.random() * directions.length)];
    const randomDirVector = dirToVector[randomDir];
    // const force = randomDir === "forward" || randomDir === "back" ? 13.5 : 10;
    const force = 10;

    ApplyForceToEntity(
      vehicle,
      1,
      0,
      0,
      force,
      randomDirVector[0],
      randomDirVector[1],
      randomDirVector[2],
      0,
      true,
      true,
      true,
      false,
      true
    );

    await sleep(2000);

    return true;
  }
}

export default new FlipVehicle("flip_vehicle");
