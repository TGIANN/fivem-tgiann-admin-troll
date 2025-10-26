import useNuiEvent from "@/hooks/useNuiEvent";
import { fetchNui } from "@/lib/fetchNui";
import { useEffect, useRef, useState } from "react";

import type { RequestPeerConnection } from "@scriptTypes/index";
import { GameRender } from "./GameRender";
import usePeer from "@/hooks/usePeer";

export default function StreamScreen() {
  const [isRenderActive, setIsRenderActive] = useState(false);

  const [peerInfo, setPeerInfo] = useState({
    id: "",
    viewerSrc: 0,
  });

  const mirrorRef = useRef<HTMLCanvasElement>(null);

  const peerOpened = () => {};

  const peerClosed = () => {
    fetchNui("peerDisconnectMsgToViewer", {
      viewerSrc: peerInfo.viewerSrc,
    });
  };

  const { createPeer, destoryPeer } = usePeer(peerOpened, peerClosed);

  useNuiEvent(
    "streamMyScreen",
    ({
      data,
      viewerSrc: vSrc,
    }: {
      data: RequestPeerConnection;
      viewerSrc: number;
    }) => {
      if (isRenderActive) return;

      setPeerInfo({
        id: data.peerId,
        viewerSrc: vSrc,
      });
      setIsRenderActive(true);
    }
  );

  useEffect(() => {
    if (!isRenderActive) return;

    setTimeout(() => {
      if (!mirrorRef.current)
        return console.error("(player-2) Canvas ref not available");

      const mediaStream = mirrorRef.current.captureStream(30);

      createPeer(peerInfo.id, mediaStream);
    }, 1000);
  }, [isRenderActive]);

  useNuiEvent("peerDissconnectMsgToStreamer", () => {
    setIsRenderActive(false);
    destoryPeer(true);
  });

  return isRenderActive && <GameRender ref={mirrorRef} />;
}
