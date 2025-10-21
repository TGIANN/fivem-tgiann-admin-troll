import { createObject, deleteEntity } from "../../utils/entity";

const ufoModel = GetHashKey("p_spinning_anus_s");

class Ufo {
  private ufoFlist = new Map<
    number,
    {
      object: number;
      tick: number;
    }
  >();

  public async spawnUfo(coords: number[], src: number) {
    const ufoHeight = 200.0;
    const lightR = 5.0;
    const ufoCooords = [coords[0], coords[1], coords[2] + ufoHeight];

    const ufoObject = await createObject(ufoModel, ufoCooords, false);

    const tick = setTick(() => {
      DrawMarker(
        1,
        ufoCooords[0],
        ufoCooords[1],
        ufoCooords[2] + 5,
        0.0,
        0.0,
        0.0,
        0.0,
        180.0,
        0.0,
        lightR,
        lightR,
        ufoHeight + 5,
        255,
        255,
        255,
        100,
        false,
        true,
        2,
        false,
        null,
        null,
        false
      );

      DrawLightWithRange(
        coords[0],
        coords[1],
        coords[2] + 0.1,
        255,
        255,
        190,
        lightR,
        1.0
      );
    });

    this.ufoFlist.set(src, {
      object: ufoObject,
      tick,
    });
  }

  public deleteUfo(src: number) {
    const ufoData = this.ufoFlist.get(src);
    if (!ufoData) return;

    if (DoesEntityExist(ufoData.object)) deleteEntity(ufoData.object);
    if (ufoData.tick !== undefined) clearTick(ufoData.tick);
    this.ufoFlist.delete(src);
  }
}

export default new Ufo();
