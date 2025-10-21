import MainTroll from ".";
import { cache, sleep } from "@communityox/ox_lib";

class FakeLag extends MainTroll {
  private timeout: CitizenTimer = null;

  private clearTimeout() {
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  private async fakeLag() {
    const currentCoords = GetEntityCoords(cache.ped, false);
    const forwardVector = GetEntityForwardVector(cache.ped);

    const newX = currentCoords[0] + forwardVector[0] * 3.5;
    const newY = currentCoords[1] + forwardVector[1] * 3.5;

    if (cache.vehicle) {
      SetEntityCoordsNoOffset(
        cache.vehicle,
        newX,
        newY,
        currentCoords[2],
        false,
        false,
        false
      );
      sleep(500);
      SetEntityCoordsNoOffset(
        cache.vehicle,
        currentCoords[0],
        currentCoords[1],
        currentCoords[2] - 1,
        false,
        false,
        false
      );
    } else {
      SetEntityCoords(
        cache.ped,
        newX,
        newY,
        currentCoords[2],
        false,
        false,
        false,
        true
      );
      await sleep(500);
      SetEntityCoords(
        cache.ped,
        currentCoords[0],
        currentCoords[1],
        currentCoords[2] - 1,
        false,
        false,
        false,
        true
      );
    }

    this.timeout = setTimeout(() => {
      this.fakeLag();
    }, 15000);
  }

  async start() {
    this.clearTimeout();
    this.fakeLag();

    return false;
  }

  stop() {
    this.clearTimeout();
    super.stop();
  }
}

export default new FakeLag("fake_lag");
