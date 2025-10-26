export const iceServers = {
  iceServers: [
    // Primary Google STUN servers
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" },

    // Alternative STUN servers for redundancy
    { urls: "stun:global.stun.twilio.com:3478" },
    { urls: "stun:stun.voip.blackberry.com:3478" },

    // Free TURN servers with proper credentials
    {
      urls: "turn:turn.bistri.com:80",
      username: "homeo",
      credential: "homeo",
    },
    {
      urls: "turn:numb.viagenie.ca",
      username: "webrtc@live.com",
      credential: "muazkh",
    },
  ],
  iceCandidatePoolSize: 10,
};

// Stream quality presets
export const streamQualityPresets = {
  low: { width: 640, height: 360, fps: 15, bitrate: 500000 },
  medium: { width: 1280, height: 720, fps: 24, bitrate: 1500000 },
  high: { width: 1920, height: 1080, fps: 30, bitrate: 3000000 },
  ultra: { width: 2560, height: 1440, fps: 60, bitrate: 6000000 },
};

// Adaptive quality settings
export const adaptiveStreamSettings = {
  connectionThresholds: {
    excellent: { rtt: 50, packetLoss: 0.01 },
    good: { rtt: 150, packetLoss: 0.05 },
    poor: { rtt: 300, packetLoss: 0.1 },
  },
  qualityMap: {
    excellent: "ultra",
    good: "high",
    medium: "medium",
    poor: "low",
  },
};
