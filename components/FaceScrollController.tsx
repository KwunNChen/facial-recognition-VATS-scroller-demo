"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Props = {
  onLookDown: () => void;
  onLookUp: () => void;
  onTiltLeft: () => void;
  onTiltRight: () => void;
};

export default function FaceScrollController({
  onLookDown,
  onLookUp,
  onTiltLeft,
  onTiltRight,
}: Props) {
  // Stable callbacks (won't restart camera/model)
  const onLookDownRef = useRef(onLookDown);
  const onLookUpRef = useRef(onLookUp);
  const onTiltLeftRef = useRef(onTiltLeft);
  const onTiltRightRef = useRef(onTiltRight);

  useEffect(() => {
    onLookDownRef.current = onLookDown;
  }, [onLookDown]);
  useEffect(() => {
    onLookUpRef.current = onLookUp;
  }, [onLookUp]);
  useEffect(() => {
    onTiltLeftRef.current = onTiltLeft;
  }, [onTiltLeft]);
  useEffect(() => {
    onTiltRightRef.current = onTiltRight;
  }, [onTiltRight]);

  // Model/video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  // Baselines + frame counters
  const pitchBaselineRef = useRef<number | null>(null);
  const rollBaselineRef = useRef<number | null>(null);

  const downFramesRef = useRef(0);
  const upFramesRef = useRef(0);
  const leftFramesRef = useRef(0);
  const rightFramesRef = useRef(0);

  // Cooldowns
  const lastDownTriggerRef = useRef(0);
  const lastUpTriggerRef = useRef(0);
  const lastLeftTriggerRef = useRef(0);
  const lastRightTriggerRef = useRef(0);

  const [status, setStatus] = useState("Starting...");

  // Debug UI
  const [debug, setDebug] = useState({
    pitch: 0,
    pitchBase: 0,
    pitchDelta: 0,
    roll: 0,
    rollBase: 0,
    rollDelta: 0,
    state: "—",
    firedDown: 0,
    firedUp: 0,
    firedLeft: 0,
    firedRight: 0,
    fDown: 0,
    fUp: 0,
    fLeft: 0,
    fRight: 0,
  });

  // Tunables (sliders)
  const [downThreshold, setDownThreshold] = useState(0.04); // pitchDelta > => DOWN
  const [upThreshold, setUpThreshold] = useState(0.04); // pitchDelta < - => UP
  const [tiltThreshold, setTiltThreshold] = useState(0.15); // rollDelta magnitude
  const [framesNeeded, setFramesNeeded] = useState(3);

  // Keep tunables in refs for loop
  const downThrRef = useRef(downThreshold);
  const upThrRef = useRef(upThreshold);
  const tiltThrRef = useRef(tiltThreshold);
  const framesRef = useRef(framesNeeded);

  useEffect(() => {
    downThrRef.current = downThreshold;
  }, [downThreshold]);
  useEffect(() => {
    upThrRef.current = upThreshold;
  }, [upThreshold]);
  useEffect(() => {
    tiltThrRef.current = tiltThreshold;
  }, [tiltThreshold]);
  useEffect(() => {
    framesRef.current = framesNeeded;
  }, [framesNeeded]);

  const cooldownMs = 1200;

  useEffect(() => {
    let cancelled = false;

    async function waitForVideoReady(video: HTMLVideoElement) {
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) return;
      await new Promise<void>((resolve) => {
        const onLoaded = () => resolve();
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
      });
      await new Promise((r) => setTimeout(r, 100));
    }

    function computeRoll(face: { x: number; y: number }[]) {
      // Roll proxy using outer eye corners:
      // 33 = left eye outer corner, 263 = right eye outer corner
      const leftEyeOuter = face[33];
      const rightEyeOuter = face[263];
      const dx = rightEyeOuter.x - leftEyeOuter.x;
      const dy = rightEyeOuter.y - leftEyeOuter.y;

      // atan2(dy, dx) ~ roll angle in radians
      return Math.atan2(dy, dx);
    }

    async function init() {
      try {
        setStatus("Requesting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();

        setStatus("Loading face model...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (cancelled) return;

        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        await waitForVideoReady(video);
        if (cancelled) return;

        setStatus("Face tracking active ✅");
        loop();
      } catch (err) {
        console.error(err);
        setStatus("Camera/model error ❌");
      }
    }

    let lastUiUpdate = 0;

    function loop() {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker) return;

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const results = landmarker.detectForVideo(video, performance.now());

      let state = "OK";
      let firedDownInc = 0;
      let firedUpInc = 0;
      let firedLeftInc = 0;
      let firedRightInc = 0;

      if (results.faceLandmarks?.length) {
        const face = results.faceLandmarks[0];

        // Pitch proxy: nose vs forehead y-distance
// ✅ Better nod signal: nose relative to the eye line
        const nose = face[1];
        const leftEyeOuter = face[33];
        const rightEyeOuter = face[263];
        const eyeMidY = (leftEyeOuter.y + rightEyeOuter.y) / 2;

        const pitch = nose.y - eyeMidY;


        // Roll proxy: eye-line tilt
        const roll = computeRoll(face);

        // Calibrate baselines once
        if (pitchBaselineRef.current === null) pitchBaselineRef.current = pitch;
        if (rollBaselineRef.current === null) rollBaselineRef.current = roll;

        const pitchBase = pitchBaselineRef.current ?? pitch;
        const rollBase = rollBaselineRef.current ?? roll;

        const pitchDelta = pitch - pitchBase;
        const rollDelta = roll - rollBase;

        const downThr = downThrRef.current;
        const upThr = upThrRef.current;
        const tiltThr = tiltThrRef.current;
        const need = framesRef.current;

        const isDownRaw = pitchDelta > downThr;
        const isUpRaw = pitchDelta < -upThr;

        // Roll...
        const DEADZONE = tiltThr * 0.5; // ignore small head wobble
        const isTiltLeft = rollDelta < -tiltThr;
        const isTiltRight = rollDelta > tiltThr;

        // Only block nod if we're currently accumulating tilt frames (real tilt)
        const tilting = leftFramesRef.current > 0 || rightFramesRef.current > 0;

        const isDown = !tilting && isDownRaw;
        const isUp = !tilting && isUpRaw;

        // Frame accumulation
        downFramesRef.current = isDown ? downFramesRef.current + 1 : 0;
        upFramesRef.current = isUp ? upFramesRef.current + 1 : 0;
        leftFramesRef.current = isTiltLeft ? leftFramesRef.current + 1 : 0;
        rightFramesRef.current = isTiltRight ? rightFramesRef.current + 1 : 0;

        if (isDown) state = "DOWN";
        else if (isUp) state = "UP";
        else if (isTiltLeft) state = "TILT_L";
        else if (isTiltRight) state = "TILT_R";

        const nowMs = Date.now();

        // DOWN trigger
        if (downFramesRef.current >= need && nowMs - lastDownTriggerRef.current > cooldownMs) {
          lastDownTriggerRef.current = nowMs;
          downFramesRef.current = 0;
          upFramesRef.current = 0;
          leftFramesRef.current = 0;
          rightFramesRef.current = 0;
          firedDownInc = 1;
          onLookDownRef.current();
        }

        // UP trigger
        if (upFramesRef.current >= need && nowMs - lastUpTriggerRef.current > cooldownMs) {
          lastUpTriggerRef.current = nowMs;
          upFramesRef.current = 0;
          downFramesRef.current = 0;
          leftFramesRef.current = 0;
          rightFramesRef.current = 0;
          firedUpInc = 1;
          onLookUpRef.current();
        }

        // TILT LEFT trigger
        if (leftFramesRef.current >= need && nowMs - lastLeftTriggerRef.current > cooldownMs) {
          lastLeftTriggerRef.current = nowMs;
          leftFramesRef.current = 0;
          rightFramesRef.current = 0;
          downFramesRef.current = 0;
          upFramesRef.current = 0;
          firedLeftInc = 1;
          onTiltLeftRef.current();
        }

        // TILT RIGHT trigger
        if (rightFramesRef.current >= need && nowMs - lastRightTriggerRef.current > cooldownMs) {
          lastRightTriggerRef.current = nowMs;
          rightFramesRef.current = 0;
          leftFramesRef.current = 0;
          downFramesRef.current = 0;
          upFramesRef.current = 0;
          firedRightInc = 1;
          onTiltRightRef.current();
        }

        // UI updates (throttled)
        const now = performance.now();
        if (now - lastUiUpdate > 100) {
          lastUiUpdate = now;
          setDebug((prev) => ({
            pitch: Number(pitch.toFixed(3)),
            pitchBase: Number(pitchBase.toFixed(3)),
            pitchDelta: Number(pitchDelta.toFixed(3)),
            roll: Number(roll.toFixed(3)),
            rollBase: Number(rollBase.toFixed(3)),
            rollDelta: Number(rollDelta.toFixed(3)),
            state,
            firedDown: prev.firedDown + firedDownInc,
            firedUp: prev.firedUp + firedUpInc,
            firedLeft: prev.firedLeft + firedLeftInc,
            firedRight: prev.firedRight + firedRightInc,
            fDown: downFramesRef.current,
            fUp: upFramesRef.current,
            fLeft: leftFramesRef.current,
            fRight: rightFramesRef.current,
          }));
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    init();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  return (
    <div style={{
    position: "fixed",
    bottom: 12,
    left: 12,
    background: "rgba(0,0,0,0.75)",
    color: "white",
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    zIndex: 20,
    width: 320,
    }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>{status}</div>
        <button
          onClick={() => {
            pitchBaselineRef.current = null;
            rollBaselineRef.current = null;
            downFramesRef.current = 0;
            upFramesRef.current = 0;
            leftFramesRef.current = 0;
            rightFramesRef.current = 0;
            setStatus("Face tracking active ✅ (recalibrating)");
          }}
        >
          Recalibrate
        </button>
      </div>

      <div style={{ marginTop: 8, fontFamily: "monospace" }}>
        state: <b>{debug.state}</b>
        <br />
        pitch: {debug.pitch} base: {debug.pitchBase} Δ: {debug.pitchDelta} | f: {debug.fDown}/{debug.fUp}
        <br />
        roll: {debug.roll} base: {debug.rollBase} Δ: {debug.rollDelta} | fL/fR: {debug.fLeft}/{debug.fRight}
        <br />
        fired: D {debug.firedDown} / U {debug.firedUp} / L {debug.firedLeft} / R {debug.firedRight}
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Down threshold</span>
          <span style={{ fontFamily: "monospace" }}>{downThreshold.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="0.001"
          max="0.120"
          step="0.001"
          value={downThreshold}
          onChange={(e) => setDownThreshold(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Up threshold</span>
          <span style={{ fontFamily: "monospace" }}>{upThreshold.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="0.001"
          max="0.120"
          step="0.001"
          value={upThreshold}
          onChange={(e) => setUpThreshold(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tilt threshold</span>
          <span style={{ fontFamily: "monospace" }}>{tiltThreshold.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="0.040"
          max="0.300"
          step="0.005"
          value={tiltThreshold}
          onChange={(e) => setTiltThreshold(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Frames needed</span>
          <span style={{ fontFamily: "monospace" }}>{framesNeeded}</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          step="1"
          value={framesNeeded}
          onChange={(e) => setFramesNeeded(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <video
          ref={videoRef}
          width={300}
          height={180}
          muted
          playsInline
          style={{ borderRadius: 10 }}
        />
      </div>

      <div style={{ marginTop: 8, opacity: 0.8 }}>
        Tip: if left/right feel swapped, just swap the handlers in page.tsx.
      </div>
    </div>
  );
}
