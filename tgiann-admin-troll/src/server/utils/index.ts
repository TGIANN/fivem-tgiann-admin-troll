import config from "@common/config";

export function isAdmin(source: number): boolean {
  return IsPlayerAceAllowed(source.toString(), config.adminGroup);
}
