import { iceServers } from "@/const/stream";
import Peer from "peerjs";
import { useRef, useState } from "react";

export default function useStream(
  isStreamer: boolean,
  onOpen?: (id: string, peer: Peer) => void,
  onClose?: () => void
) {
  const peerRef = useRef<Peer | null>(null);
  const [connected, setConnected] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [streamSrc, setStreamSrc] = useState<MediaStream | null>(null);

  const createPeer = (mediaStream = new MediaStream()) => {
    const peerInstance = new Peer({
      config: iceServers,
      debug: 3, // Enable debug for troubleshooting
    });

    peerInstance.on("open", function (id) {
      if (onOpen) onOpen(id, peerInstance);
    });

    peerInstance.on("call", (call) => {
      call.answer(mediaStream);

      call.on("stream", (remoteStream) => {
        setStreamSrc(remoteStream);
        setConnected(true);
        setErrorMsg(null);
      });

      call.on("error", (error) => {
        setErrorMsg(error.message);
        setConnected(false);
        if (onClose) onClose();
      });

      call.on("close", () => {
        setErrorMsg("Peer connection closed.");
        setConnected(false);
        if (onClose) onClose();
      });
    });

    peerInstance.on("error", (error) => {
      setErrorMsg(error.message);
      setConnected(false);
      if (onClose) onClose();
    });

    peerInstance.on("disconnected", () => {
      setErrorMsg("Peer disconnected.");
      setConnected(false);
      if (onClose) onClose();
    });

    peerRef.current = peerInstance;
  };

  return {
    connected,
    errorMsg,
    streamSrc,
    createPeer,
    peer: peerRef.current,
  };
}
