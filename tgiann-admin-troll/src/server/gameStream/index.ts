import { cache } from "@communityox/ox_lib";
import { RequestPeerConnection } from "types";
import { isAdmin } from "../utils";

onNet(
  `${cache.resource}:server:requestPeerConnection`,
  (data: RequestPeerConnection) => {
    const playerId = global.source;
    if (!isAdmin(playerId)) return;

    emitNet(
      `${cache.resource}:client:requestPeerConnection`,
      data.targetSrc,
      data,
      global.source
    );
  }
);

onNet(
  `${cache.resource}:server:peerDissconnectMsgToStreamer`,
  (playerServerId: number) => {
    emitNet(
      `${cache.resource}:client:peerDissconnectMsgToStreamer`,
      playerServerId
    );
  }
);

onNet(
  `${cache.resource}:server:peerDisconnectMsgToViewer`,
  (playerServerId: number) => {
    emitNet(
      `${cache.resource}:client:peerDisconnectMsgToViewer`,
      playerServerId
    );
  }
);
