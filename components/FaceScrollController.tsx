"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Props = {
  onLookDown: () => void;
  onLookUp: () => void;
  onTiltLeft: () => void;
  onTiltRight: () => void;
  onBlink: () => void;

  muted: boolean;
  onToggleMute: () => void;
};

export default function FaceScrollController({
  onLookDown,
  onLookUp,
  onTiltLeft,
  onTiltRight,
  onBlink,
  muted,
  onToggleMute,
}: Props) {
  // Stable callbacks (won't restart camera/model)
  const onLookDownRef = useRef(onLookDown);
  const onLookUpRef = useRef(onLookUp);
  const onTiltLeftRef = useRef(onTiltLeft);
  const onTiltRightRef = useRef(onTiltRight);
  const onBlinkRef = useRef(onBlink);

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
  useEffect(() => {
    onBlinkRef.current = onBlink;
  }, [onBlink]);

  // ✅ Accurate fired counters (never miss because of UI throttling)
  const firedDownCountRef = useRef(0);
  const firedUpCountRef = useRef(0);
  const firedLeftCountRef = useRef(0);
  const firedRightCountRef = useRef(0);
  const firedBlinkCountRef = useRef(0);

  // Model/video refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  // Baselines + misc refs
  const pitchBaselineRef = useRef<number | null>(null);
  const rollBaselineRef = useRef<number | null>(null);
  const recalTimeoutRef = useRef<number | null>(null);

  // Frame counters
  const downFramesRef = useRef(0);
  const upFramesRef = useRef(0);
  const leftFramesRef = useRef(0);
  const rightFramesRef = useRef(0);

  // Cooldowns
  const lastDownTriggerRef = useRef(0);
  const lastUpTriggerRef = useRef(0);
  const lastLeftTriggerRef = useRef(0);
  const lastRightTriggerRef = useRef(0);

  // Blink refs
  const blinkFramesCountRef = useRef(0);
  const blinkLatchedRef = useRef(false);
  const lastBlinkTriggerRef = useRef(0);

  const [status, setStatus] = useState("Starting...");

  // Debug UI
  const [debug, setDebug] = useState({
    pitchDelta: 0,
    rollDelta: 0,
    blink: 0,
    blinkFrames: 0,
    blinkLatched: false,
    state: "—",
    firedDown: 0,
    firedUp: 0,
    firedLeft: 0,
    firedRight: 0,
    firedBlink: 0,
    fDown: 0,
    fUp: 0,
    fLeft: 0,
    fRight: 0,
  });

  // Tunables (sliders)
  const [downThreshold, setDownThreshold] = useState(0.015);
  const [upThreshold, setUpThreshold] = useState(0.03);
  const [tiltThreshold, setTiltThreshold] = useState(0.25);
  const [framesNeeded, setFramesNeeded] = useState(2);

  const [blinkThreshold, setBlinkThreshold] = useState(0.55);
  const [blinkFramesNeeded, setBlinkFramesNeeded] = useState(2);

  // Keep tunables in refs for loop
  const downThrRef = useRef(downThreshold);
  const upThrRef = useRef(upThreshold);
  const tiltThrRef = useRef(tiltThreshold);
  const framesRef = useRef(framesNeeded);

  const blinkThrRef = useRef(blinkThreshold);
  const blinkFramesRef = useRef(blinkFramesNeeded);

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

  useEffect(() => {
    blinkThrRef.current = blinkThreshold;
  }, [blinkThreshold]);
  useEffect(() => {
    blinkFramesRef.current = blinkFramesNeeded;
  }, [blinkFramesNeeded]);

  const cooldownMs = 1200;
  const blinkCooldownMs = 700;

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
      const leftEyeOuter = face[33];
      const rightEyeOuter = face[263];
      const dx = rightEyeOuter.x - leftEyeOuter.x;
      const dy = rightEyeOuter.y - leftEyeOuter.y;
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
          outputFaceBlendshapes: true,
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
      let blinkScore = 0;

      if (results.faceLandmarks?.length) {
        const face = results.faceLandmarks[0];

        // Nod signal: nose relative to eye line
        const nose = face[1];
        const leftEyeOuter = face[33];
        const rightEyeOuter = face[263];
        const eyeMidY = (leftEyeOuter.y + rightEyeOuter.y) / 2;
        const pitch = nose.y - eyeMidY;

        const roll = computeRoll(face);

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

        const isTiltLeft = rollDelta < -tiltThr;
        const isTiltRight = rollDelta > tiltThr;

        // accumulate tilt frames using the SAME threshold you show in UI
        leftFramesRef.current = isTiltLeft ? leftFramesRef.current + 1 : 0;
        rightFramesRef.current = isTiltRight ? rightFramesRef.current + 1 : 0;

        const tilting = leftFramesRef.current > 0 || rightFramesRef.current > 0;

        const isDown = !tilting && isDownRaw;
        const isUp = !tilting && isUpRaw;

        downFramesRef.current = isDown ? downFramesRef.current + 1 : 0;
        upFramesRef.current = isUp ? upFramesRef.current + 1 : 0;

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

          firedDownCountRef.current += 1;
          onLookDownRef.current();
        }

        // UP trigger
        if (upFramesRef.current >= need && nowMs - lastUpTriggerRef.current > cooldownMs) {
          lastUpTriggerRef.current = nowMs;
          upFramesRef.current = 0;
          downFramesRef.current = 0;
          leftFramesRef.current = 0;
          rightFramesRef.current = 0;

          firedUpCountRef.current += 1;
          onLookUpRef.current();
        }

        // TILT LEFT trigger  ✅ FIXED: increments LEFT
        if (leftFramesRef.current >= need && nowMs - lastLeftTriggerRef.current > cooldownMs) {
          lastLeftTriggerRef.current = nowMs;
          leftFramesRef.current = 0;
          rightFramesRef.current = 0;
          downFramesRef.current = 0;
          upFramesRef.current = 0;

          firedLeftCountRef.current += 1; // ✅ was wrong before
          onTiltLeftRef.current();
        }

        // TILT RIGHT trigger
        if (rightFramesRef.current >= need && nowMs - lastRightTriggerRef.current > cooldownMs) {
          lastRightTriggerRef.current = nowMs;
          rightFramesRef.current = 0;
          leftFramesRef.current = 0;
          downFramesRef.current = 0;
          upFramesRef.current = 0;

          firedRightCountRef.current += 1;
          onTiltRightRef.current();
        }

        // Blink from blendshapes
        const bs = results.faceBlendshapes?.[0]?.categories;
        if (bs) {
          const left = bs.find((c) => c.categoryName === "eyeBlinkLeft")?.score ?? 0;
          const right = bs.find((c) => c.categoryName === "eyeBlinkRight")?.score ?? 0;
          blinkScore = (left + right) / 2;
        }

        const bThr = blinkThrRef.current;
        const bNeed = blinkFramesRef.current;

        const blinking = blinkScore > bThr;
        blinkFramesCountRef.current = blinking ? blinkFramesCountRef.current + 1 : 0;

        if (!blinking && blinkLatchedRef.current && blinkScore < bThr * 0.5) {
          blinkLatchedRef.current = false;
        }

        if (
          blinkFramesCountRef.current >= bNeed &&
          !blinkLatchedRef.current &&
          nowMs - lastBlinkTriggerRef.current > blinkCooldownMs
        ) {
          lastBlinkTriggerRef.current = nowMs;
          blinkLatchedRef.current = true;
          blinkFramesCountRef.current = 0;

          firedBlinkCountRef.current += 1;
          onBlinkRef.current();
        }

        // UI updates (throttled)
        const now = performance.now();
        if (now - lastUiUpdate > 100) {
          lastUiUpdate = now;
          setDebug(() => ({
            pitchDelta: Number(pitchDelta.toFixed(3)),
            rollDelta: Number(rollDelta.toFixed(3)),
            blink: Number(blinkScore.toFixed(2)),
            blinkFrames: blinkFramesCountRef.current,
            blinkLatched: blinkLatchedRef.current,
            state,

            firedDown: firedDownCountRef.current,
            firedUp: firedUpCountRef.current,
            firedLeft: firedLeftCountRef.current,
            firedRight: firedRightCountRef.current,
            firedBlink: firedBlinkCountRef.current,

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
      if (recalTimeoutRef.current) window.clearTimeout(recalTimeoutRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      landmarkerRef.current?.close?.();
    };
  }, []);

  const btnStyle: React.CSSProperties = {
    color: "white",
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: 10,
        borderRadius: 10,
        fontSize: 12,
        zIndex: 20,
        width: 340,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div style={{ fontWeight: 700 }}>
          {status}{" "}
          <span style={{ fontWeight: 500, opacity: 0.85 }}>
            | blink {debug.blink.toFixed(2)} | bf {debug.blinkFrames} |{" "}
            {debug.blinkLatched ? "latched" : "armed"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={btnStyle} onClick={onToggleMute}>
            {muted ? "Unmute" : "Mute"}
          </button>

          <button
            type="button"
            style={btnStyle}
            onClick={() => {
              pitchBaselineRef.current = null;
              rollBaselineRef.current = null;
              downFramesRef.current = 0;
              upFramesRef.current = 0;
              leftFramesRef.current = 0;
              rightFramesRef.current = 0;
              blinkFramesCountRef.current = 0;
              blinkLatchedRef.current = false;

              setStatus("Recalibrating…");

              if (recalTimeoutRef.current) window.clearTimeout(recalTimeoutRef.current);
              recalTimeoutRef.current = window.setTimeout(() => {
                setStatus("Face tracking active ✅");
              }, 600);
            }}
          >
            Recalibrate
          </button>
        </div>
      </div>

      <div style={{ marginTop: 8, fontFamily: "monospace" }}>
        state: <b>{debug.state}</b>
        <br />
        pitch Δ: {debug.pitchDelta} | f: {debug.fDown}/{debug.fUp}
        <br />
        roll Δ: {debug.rollDelta} | fL/fR: {debug.fLeft}/{debug.fRight}
        <br />
        blink: {debug.blink} frames: {debug.blinkFrames} fired: {debug.firedBlink}
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Blink threshold</span>
          <span style={{ fontFamily: "monospace" }}>{blinkThreshold.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.20"
          max="0.90"
          step="0.01"
          value={blinkThreshold}
          onChange={(e) => setBlinkThreshold(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Blink frames</span>
          <span style={{ fontFamily: "monospace" }}>{blinkFramesNeeded}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={blinkFramesNeeded}
          onChange={(e) => setBlinkFramesNeeded(Number(e.target.value))}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <video
          ref={videoRef}
          width={320}
          height={190}
          muted={muted}
          playsInline
          style={{ borderRadius: 10, width: "100%" }}
        />
      </div>

      <div style={{ marginTop: 8, opacity: 0.8 }}>
        Tip: if left/right feel swapped, swap handlers in page.tsx.
      </div>
    </div>
  );
}
