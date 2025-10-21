import MainTroll from ".";
import { createAggressiveNpc } from "../../utils/aggressiveNpc";
import { getPlayerArroundCoords } from "../../utils/getPlayerArroundCoords";
import { deleteEntity } from "../../utils/entity";

const model = ["s_m_y_blackops_01", "s_m_y_marine_01", "s_m_y_swat_01"];

class AttackNpc extends MainTroll {
  private ped: number = null;

  private deletePed = () => {
    if (this.ped) {
      deleteEntity(this.ped);
      this.ped = null;
    }
  };

  async start() {
    const randomModel = model[Math.floor(Math.random() * model.length)];
    const coords = getPlayerArroundCoords(30);

    this.ped = await createAggressiveNpc(randomModel, coords, "weapon_pistol");

    return false;
  }

  stop() {
    this.deletePed();
    super.stop();
  }
}

export default new AttackNpc("attack_npc");
