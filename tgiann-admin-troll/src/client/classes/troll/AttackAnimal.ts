import MainTroll from ".";
import { createAggressiveNpc } from "../../utils/aggressiveNpc";
import { getPlayerArroundCoords } from "../../utils/getPlayerArroundCoords";
import { deleteEntity } from "../../utils/entity";

const model = ["a_c_chimp", "a_c_husky", "a_c_retriever", "a_c_shepherd"];

class AttackAnimal extends MainTroll {
  private ped: number = null;

  private deletePed = () => {
    if (this.ped) {
      deleteEntity(this.ped);
      this.ped = null;
    }
  };

  async start() {
    const randomModel = model[Math.floor(Math.random() * model.length)];
    const coords = getPlayerArroundCoords(20);

    this.ped = await createAggressiveNpc(randomModel, coords);

    return false;
  }

  stop() {
    this.deletePed();
    super.stop();
  }
}

export default new AttackAnimal("attack_animal");
