import { ResourceName, IsBrowser } from "./resource";
import config from "@common/config";

export function LoadFile(path: string) {
  return LoadResourceFile(ResourceName, path);
}

export function LoadJsonFile<T = unknown>(path: string): T {
  if (!IsBrowser) return JSON.parse(LoadFile(path)) as T;

  const resp = fetch(`/${path}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  return resp.then((response) => response.json()) as T;
}

export function debugPrint(message: string) {
  if (!config.debugEnable) return;
  console.log(message);
}

export function sendNuiMessage(action: string, data?: any) {
  SendNUIMessage({ action, data: data || {} });
}
