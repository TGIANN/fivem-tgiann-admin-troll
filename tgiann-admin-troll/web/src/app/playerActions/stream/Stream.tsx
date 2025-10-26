import { fetchNui } from "@/lib/fetchNui";
import useNuiEvent from "@/hooks/useNuiEvent";
import type { RequestPeerConnection } from "@scriptTypes/index";
import { useEffect, useRef } from "react";
import usePeer from "@/hooks/usePeer";
import AnimateContainer from "@/components/AnimateContainer";

export default function Stream({ playerSrc }: { playerSrc: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const peerOpened = (peerId: string) => {
    fetchNui("requestPeerConnection", {
      targetSrc: playerSrc,
      peerId: peerId,
    } as RequestPeerConnection);
  };

  const peerClosed = () => {
    fetchNui("peerDissconnectMsgToStreamer", { playerSrc });
  };

  const addRemoteStream = (stream: MediaStream) => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  };

  const removeRemoteStream = () => {
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const { isConnected, isError, errorMsg, createPeer, destoryPeer } = usePeer(
    peerOpened,
    peerClosed,
    addRemoteStream,
    removeRemoteStream
  );

  useEffect(() => {
    setTimeout(() => createPeer(), 1000);

    return () => destoryPeer();
  }, []);

  // Listen for disconnection from streamer
  useNuiEvent("peerDisconnectMsgToViewer", () => {
    destoryPeer(true);
  });

  return (
    <AnimateContainer className="fixed! right-[1vh] top-[1vh] w-[40vw] min-h-[20vh] border-1 border-border overflow-hidden">
      {!isConnected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm p-4">
          <div className="mb-2">
            {!isConnected
              ? "Connecting to stream..."
              : isError
              ? errorMsg
              : "Initializing..."}
          </div>
        </div>
      )}
      <video
        className="w-full h-full object-cover"
        ref={videoRef}
        autoPlay
        playsInline
        muted
      />
      {isConnected && (
        <div className="absolute top-2 right-2 bg-[#35ff9f] w-3 h-3 rounded-full"></div>
      )}
    </AnimateContainer>
  );
}
