import { cache } from "@communityox/ox_lib";
import { triggerServerCallback } from "@communityox/ox_lib/client";

class Spectate {
  private _isSpectating = false;
  private originalCoords: number[] = null;
  private _targetSrc: number = null;
  private tick: number = null;

  get isSpectating() {
    return this._isSpectating;
  }

  get targetSrc() {
    return this._targetSrc;
  }

  private clearTick() {
    if (this.tick !== null) {
      clearTick(this.tick);
      this.tick = null;
    }
  }

  switchTarget() {
    this.clearTick();
    NetworkSetInSpectatorMode(false, cache.ped);
    this._isSpectating = false;
    this._targetSrc = null;
  }

  async start(targetSrc: number) {
    this._targetSrc = targetSrc;
    if (!this.originalCoords) {
      this.originalCoords = GetEntityCoords(cache.ped, false);
    }

    const coords = await triggerServerCallback<number[]>(
      `${cache.resource}:getPlayerCoords`,
      null,
      targetSrc,
    );

    if (!coords) return;

    SetEntityCoords(
      cache.ped,
      coords[0],
      coords[1],
      coords[2] - 100,
      false,
      false,
      false,
      false,
    );

    this.tick = setTick(() => {
      const targetPlayer = GetPlayerFromServerId(this._targetSrc);
      const targetPed = targetPlayer !== -1 ? GetPlayerPed(targetPlayer) : 0;

      if (targetPed && DoesEntityExist(targetPed)) {
        this.clearTick();
        this.enableSpectate(targetPed);
      }
    });
  }

  private enableSpectate(targetPed: number) {
    this._isSpectating = true;
    NetworkSetInSpectatorMode(true, targetPed);

    this.tick = setTick(() => {
      const targetPlayer = GetPlayerFromServerId(this._targetSrc);
      const targetPed = targetPlayer !== -1 ? GetPlayerPed(targetPlayer) : 0;

      if (targetPed && DoesEntityExist(targetPed)) {
        const coords = GetEntityCoords(targetPed, false);
        SetEntityCoords(
          cache.ped,
          coords[0],
          coords[1],
          coords[2] - 100,
          false,
          false,
          false,
          false,
        );
      }
    });
  }

  stop() {
    this.clearTick();
    NetworkSetInSpectatorMode(false, cache.ped);

    if (this.originalCoords) {
      SetEntityCoords(
        cache.ped,
        this.originalCoords[0],
        this.originalCoords[1],
        this.originalCoords[2],
        false,
        false,
        false,
        false,
      );
      this.originalCoords = null;
    }

    this._isSpectating = false;
    this._targetSrc = null;
  }
}

export default new Spectate();
