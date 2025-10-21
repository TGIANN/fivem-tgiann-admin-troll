import { cache } from "@communityox/ox_lib";
import { ForceControlKey } from "types";

/**
 * @param key https://cherrytree.at/misc/vk.htm
 **/
export function keyAction(
  key: number,
  action: (action: "released" | "pressed" | "pressing") => void
) {
  if (IsRawKeyPressed(key)) {
    action("pressed");
  } else if (IsRawKeyReleased(key)) {
    action("released");
  }

  if (IsRawKeyDown(key)) action("pressing");
}

export function forceKeyboardControl(key: ForceControlKey) {
  if (key === "w") {
    /*  const [x, y, z] = GetOffsetFromEntityInWorldCoords(
      cache.ped,
      0.0,
      0.2,
      0.0
    );
    TaskGoStraightToCoord(
      cache.ped,
      x,
      y,
      z,
      6.0,
      -1,
      GetEntityHeading(cache.ped),
      0.0
    ); */
    // To press the W key, you have to go to the player's house and press the key on the keyboard! I can't force the player to press the d key with anything else.

    SetControlNormal(0, 71, 1.0); // Vehicle accelerate
  } else if (key === "s") {
    SetControlNormal(0, 31, 1.0);
    SetControlNormal(0, 72, 1.0); // Vehicle brake
  } else if (key === "a") {
    // To press the A key, you have to go to the player's house and press the key on the keyboard! I can't force the player to press the d key with anything else.
    SetControlNormal(0, 133, 1.0); // Vehicle left
    SetControlNormal(0, 89, 1.0); // Vehicle left
    SetControlNormal(0, 63, 1.0); // Vehicle left
  } else if (key === "d") {
    SetControlNormal(0, 30, 1.0);
    SetControlNormal(0, 59, 1.0); // Vehicle right
  } else if (key === "space") {
    if (cache.vehicle) {
      SetControlNormal(0, 76, 1.0); // Vehicle handbrake
    } else {
      if (!IsPedJumping(cache.ped)) TaskJump(cache.ped, false);
    }
  }
}

export function disabeAllControls() {
  DisablePlayerFiring(cache.ped, true);
  DisableAllControlActions(0);
  EnableControlAction(0, 1, true); // LookLeftRight
  EnableControlAction(0, 2, true); // LookUpDown
}
