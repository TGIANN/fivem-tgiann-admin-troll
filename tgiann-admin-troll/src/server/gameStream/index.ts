import { cache } from "@communityox/ox_lib";
import { RequestPeerConnection } from "types";

onNet(
  `${cache.resource}:server:requestPeerConnection`,
  (data: RequestPeerConnection) => {
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
