import { TrollName } from "types";
import { Troll } from "../classes/troll";
import { debugPrint } from "@common/utils";

import FartOne from "../classes/troll/FartOne";
import FartTwo from "../classes/troll/FartTwo";
import ReverseControl from "../classes/troll/ReverseControl";
import FakeLag from "../classes/troll/FakeLag";
import RandomTimeCycle from "../classes/troll/RandomTimeCycle";
import UltraSlowWalk from "../classes/troll/UltraSlowWalk";
import VehicleDoorOpenClose from "../classes/troll/VehicleDoorOpenClose";
import NukeSound from "../classes/troll/NukeSound";
import FlipVehicle from "../classes/troll/FlipVehicle";
import FlamePlayer from "../classes/troll/FlamePlayer";
import TwoDGame from "../classes/troll/TwoDGame";
import FlipCamera from "../classes/troll/FlipCamera";
import CloneFollow from "../classes/troll/CloneFollow";
import AttackNpc from "../classes/troll/AttackNpc";
import AttackAnimal from "../classes/troll/AttackAnimal";
import FlipPlayer from "../classes/troll/FlipPlayer";
import Kidnap from "../classes/troll/Kidnap";
import Ghost from "../classes/troll/Ghost";
import UfoKidnap from "../classes/troll/UfoKidnap";
import ForceControl from "../classes/troll/ForceControl";

export function getTrollClass(troll: TrollName): Troll {
  debugPrint("Getting troll class for:" + troll);
  switch (troll) {
    case "fart_type_1":
      return FartOne;
    case "fart_type_2":
      return FartTwo;
    case "reverse_control":
      return ReverseControl;
    case "fake_lag":
      return FakeLag;
    case "random_time_cycle":
      return RandomTimeCycle;
    case "ultra_slow_walk":
      return UltraSlowWalk;
    case "door_open_close":
      return VehicleDoorOpenClose;
    case "nuke_alert_sound":
      return NukeSound;
    case "flip_vehicle":
      return FlipVehicle;
    case "flip_player":
      return FlipPlayer;
    case "flame":
      return FlamePlayer;
    case "2d_game":
      return TwoDGame;
    case "flip_camera":
      return FlipCamera;
    case "clone_follow":
      return CloneFollow;
    case "attack_npc":
      return AttackNpc;
    case "attack_animal":
      return AttackAnimal;
    case "kidnap":
      return Kidnap;
    case "ghost":
      return Ghost;
    case "ufo_kidnap":
      return UfoKidnap;
    case "force_control_player":
      return ForceControl;
    default:
      return null;
  }
}
