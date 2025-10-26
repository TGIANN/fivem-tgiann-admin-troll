import { sendNuiMessage } from "@common/utils";
import { cache } from "@communityox/ox_lib";
import { RequestPeerConnection } from "types";

RegisterNuiCallback(
  "requestPeerConnection",
  async (data: RequestPeerConnection, cb: (data: unknown) => {}) => {
    cb({});

    // Admin Opening player action menu and get targer player's peer connection
    emitNet(`${cache.resource}:server:requestPeerConnection`, data);
  }
);

onNet(
  `${cache.resource}:client:requestPeerConnection`,
  (data: RequestPeerConnection, viewerSrc: number) => {
    sendNuiMessage("streamMyScreen", { data, viewerSrc });
  }
);

// For Steamer
RegisterNuiCallback(
  "peerDissconnectMsgToStreamer",
  (data: { playerSrc: number }, cb: (data: unknown) => {}) => {
    emitNet(
      `${cache.resource}:server:peerDissconnectMsgToStreamer`,
      data.playerSrc
    );
    cb({});
  }
);

onNet(`${cache.resource}:client:peerDissconnectMsgToStreamer`, () => {
  sendNuiMessage("peerDissconnectMsgToStreamer");
});

// For Viewer
RegisterNuiCallback(
  "peerDisconnectMsgToViewer",
  (data: { viewerSrc: number }, cb: (data: unknown) => {}) => {
    cb({});
    emitNet(
      `${cache.resource}:server:peerDisconnectMsgToViewer`,
      data.viewerSrc
    );
  }
);

onNet(`${cache.resource}:client:peerDisconnectMsgToViewer`, () => {
  sendNuiMessage("peerDisconnectMsgToViewer");
});
