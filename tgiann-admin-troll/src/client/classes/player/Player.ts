import { ActiveTrolls, TrollName } from "types";
import { Troll } from "../troll";

class ClientPlayerC {
  activeTrolls: ActiveTrolls = [];

  trollIsActive(troll: TrollName): boolean {
    return this.activeTrolls.includes(troll);
  }

  async playTroll(trollClass: Troll) {
    if (this.trollIsActive(trollClass.trollName)) return;

    this.activeTrolls.push(trollClass.trollName);
    const needStop = await trollClass.start();
    if (needStop) this.stopTroll(trollClass);
  }

  stopTroll(trollClass: Troll): void {
    if (!this.trollIsActive(trollClass.trollName)) return;

    trollClass.stop();
    this.activeTrolls = this.activeTrolls.filter(
      (t) => t !== trollClass.trollName
    );
  }
}

export default ClientPlayerC;
