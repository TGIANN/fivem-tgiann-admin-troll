import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import lang from "../const/lang";
import type { TrollName } from "@scriptTypes/index";

export type CurrentAppPage = "playerList" | "playerActions";

export type Lang = typeof lang;

export interface TrollAction {
  type: TrollName;
  label: keyof Lang;
  description: keyof Lang;
  buttonLabel: keyof Lang;
  icon: IconProp;
  toggle: boolean;
  isSync: boolean;
}
