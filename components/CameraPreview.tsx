"use client";

import { useEffect, useRef, useState } from "react";

export default function CameraPreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("Camera OK");
      } catch {
        setStatus("Camera blocked");
      }
    }

    start();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 10,
        background: "white",
        padding: 8,
        borderRadius: 8,
      }}
    >
      <div style={{ fontSize: 12, marginBottom: 6 }}>{status}</div>
      <video
        ref={videoRef}
        width={160}
        height={120}
        style={{ borderRadius: 8 }}
        muted
        playsInline
      />
    </div>
  );
}
