export type TrollName =
  | "fart_type_1"
  | "fart_type_2"
  | "attack_npc"
  | "attack_animal"
  | "kidnap"
  | "flame"
  | "force_control_player"
  | "fake_lag"
  | "reverse_control"
  | "clone_follow"
  | "flip_vehicle"
  | "flip_player"
  | "nuke_alert_sound"
  | "door_open_close"
  | "ultra_slow_walk"
  | "random_time_cycle"
  | "2d_game"
  | "flip_camera"
  | "ghost"
  | "ufo_kidnap"
  | "local_invisibility"
  | "disable_lights"
  | "shrink_player"
  | "breake_vehicle_wheel";

export interface Player {
  name: string;
  id: string;
  src: number;
  activeTrolls: ActiveTrolls;
}

export interface PerformAction {
  actionType: TrollName;
  src: number;
}

export type ActiveTrolls = string[];

export interface TrollActionVariables {
  onlyStopSrc?: number;
}

export type ForceControlKey = "w" | "a" | "s" | "d" | "space";

export interface RequestPeerConnection {
  targetSrc: number;
  peerId: string;
}
