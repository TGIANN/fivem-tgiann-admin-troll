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
import LocalInvisiblity from "../classes/troll/LocalInvisiblity";
import DisableLights from "../classes/troll/DisableLights";
import ShrinkPlayer from "../classes/troll/ShrinkPlayer";
import BreakVehicleWheel from "../classes/troll/BreakVehicleWheel";
import UltraFog from "../classes/troll/UltraFog";
import ScaleUpPlayer from "../classes/troll/ScaleUpPlayer";
import MoonGravity from "../classes/troll/VehicleLowGravity";
import Shockwave from "../classes/troll/Shockwave";
import FovCamera from "../classes/troll/FovCamera";
import CloneCircle from "../classes/troll/CloneCircle";
import LowPoly from "../classes/troll/LowPoly";
import SnowWeather from "../classes/troll/SnowWeather";

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
    case "local_invisibility":
      return LocalInvisiblity;
    case "disable_lights":
      return DisableLights;
    case "shrink_player":
      return ShrinkPlayer;
    case "breake_vehicle_wheel":
      return BreakVehicleWheel;
    case "ultra_fog":
      return UltraFog;
    case "scale_up_player":
      return ScaleUpPlayer;
    case "vehicle_low_gravity":
      return MoonGravity;
    case "shockwave":
      return Shockwave;
    case "fov_camera":
      return FovCamera;
    case "clone_circle":
      return CloneCircle;
    case "low_poly":
      return LowPoly;
    case "snow_weather":
      return SnowWeather;
    default:
      return null;
  }
}
