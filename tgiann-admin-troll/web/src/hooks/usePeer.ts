import { iceServers } from "@/const/stream";
import Peer from "peerjs";
import { useRef, useState } from "react";

export default function usePeer(
  peerOpened: (peerId: string) => void,
  peerClosed: (peerId: string) => void,
  addRemoteStream?: (stream: MediaStream, peerId: string) => void,
  removeRemoteStream?: (peerId: string) => void
) {
  const peer = useRef<Peer | null>(null);
  const peerId = useRef<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cleanUp = (disableTriggerPeerClosed?: boolean) => {
    const myPeer = peer.current;

    if (myPeer) {
      if (myPeer.disconnected || myPeer.destroyed) return;

      if (!disableTriggerPeerClosed) peerClosed(peerId.current || "");
      myPeer.disconnect();
      myPeer.destroy();
    }
    peer.current = null;
    peerId.current = null;
    setIsConnected(false);
    setIsError(false);
    setErrorMsg("");
  };

  const createPeer = (targetPeerId?: string, mediaStream?: MediaStream) => {
    const peerinstance = new Peer(`peer-${Date.now()}`, {
      config: {
        ...iceServers,
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
      },
      debug: 0,
    });

    peer.current = peerinstance;

    peerinstance.on("disconnected", () => cleanUp());
    peerinstance.on("close", () => cleanUp());
    peerinstance.on("error", () => cleanUp());

    peerinstance.on("open", (id: string) => {
      peerId.current = id;
      peerOpened(id);
      setIsConnected(true);

      if (targetPeerId && mediaStream) {
        peerinstance.call(targetPeerId, mediaStream);
      }
    });

    peerinstance.on("call", (call) => {
      // Answer the call with an A/V stream.
      call.answer(new MediaStream());

      // Play the remote stream
      call.on("stream", (remoteStream) => {
        if (addRemoteStream) addRemoteStream(remoteStream, call.peer);
      });

      call.on("close", () => {
        if (removeRemoteStream) removeRemoteStream(call.peer);
      });

      call.on("error", () => {
        if (removeRemoteStream) removeRemoteStream(call.peer);
      });
    });

    return peerinstance;
  };

  return {
    peer: peer.current,
    peerId,
    isConnected,
    isError,
    errorMsg,
    createPeer,
    destoryPeer: cleanUp,
  };
}
