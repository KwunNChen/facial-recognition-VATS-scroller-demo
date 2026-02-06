"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Props = {
  showDebug?: boolean;

  onLookDown: () => void;
  onLookUp: () => void;
  onTiltLeft: () => void;
  onTiltRight: () => void;
  onBlink: () => void;

  muted: boolean;
  onToggleMute: () => void;
};

type DebugState = {
  pitchDelta: number;
  rollDelta: number;
  blink: number;
  blinkFrames: number;
  blinkLatched: boolean;
  state: string;

  firedDown: number;
  firedUp: number;
  firedLeft: number;
  firedRight: number;
  firedBlink: number;

  fDown: number;
  fUp: number;
  fLeft: number;
  fRight: number;
};

const UI_MIRROR = true; // Mirrors preview + VATS overlay position (not tracking math)

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export default function FaceScrollController({
  showDebug,
  onLookDown,
  onLookUp,
  onTiltLeft,
  onTiltRight,
  onBlink,
  muted,
  onToggleMute,
}: Props) {
  // ---- Stable callback refs (prevents re-init / loop issues) ----
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

  // ---- MediaPipe / stream refs ----
  // videoRef: always mounted (hidden). Stream attaches here so it never drops.
  // previewRef: visible only when debug panel is shown.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);

  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  // ---- Baselines & timers ----
  const pitchBaselineRef = useRef<number | null>(null);
  const rollBaselineRef = useRef<number | null>(null);
  const recalTimeoutRef = useRef<number | null>(null);

  // ---- Frame accumulators ----
  const downFramesRef = useRef(0);
  const upFramesRef = useRef(0);
  const leftFramesRef = useRef(0);
  const rightFramesRef = useRef(0);

  // ---- Cooldowns ----
  const lastDownTriggerRef = useRef(0);
  const lastUpTriggerRef = useRef(0);
  const lastLeftTriggerRef = useRef(0);
  const lastRightTriggerRef = useRef(0);

  // ---- Blink detection ----
  const blinkFramesCountRef = useRef(0);
  const blinkLatchedRef = useRef(false);
  const lastBlinkTriggerRef = useRef(0);

  // ---- Accurate fired counters (don’t depend on UI throttling) ----
  const firedDownCountRef = useRef(0);
  const firedUpCountRef = useRef(0);
  const firedLeftCountRef = useRef(0);
  const firedRightCountRef = useRef(0);
  const firedBlinkCountRef = useRef(0);

  // ---- UI state ----
  const [status, setStatus] = useState("Starting...");
  const [debug, setDebug] = useState<DebugState>({
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

  // ---- Tunables ----
  const [downThreshold, setDownThreshold] = useState(0.015);
  const [upThreshold, setUpThreshold] = useState(0.03);
  const [tiltThreshold, setTiltThreshold] = useState(0.25);
  const [framesNeeded, setFramesNeeded] = useState(2);

  const [blinkThreshold, setBlinkThreshold] = useState(0.55);
  const [blinkFramesNeeded, setBlinkFramesNeeded] = useState(2);

  // Keep tunables in refs so the loop doesn’t depend on re-renders
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

  // ---- VATS overlay (UI only) ----
  const [hasFace, setHasFace] = useState(false);
  const hasFaceRef = useRef(false);

  const [target, setTarget] = useState({ x: 50, y: 40 }); // percent
  const [lockPulse, setLockPulse] = useState(0);
  const prevFaceRef = useRef(false);

  const vatsX = UI_MIRROR ? 100 - target.x : target.x;
  const vatsY = target.y;

  // ---- Config ----
  const cooldownMs = 1200;
  const blinkCooldownMs = 700;

  function resetFrames() {
    downFramesRef.current = 0;
    upFramesRef.current = 0;
    leftFramesRef.current = 0;
    rightFramesRef.current = 0;
  }

  function recalibrate() {
    pitchBaselineRef.current = null;
    rollBaselineRef.current = null;
    resetFrames();

    blinkFramesCountRef.current = 0;
    blinkLatchedRef.current = false;

    setStatus("Recalibrating…");
    if (recalTimeoutRef.current) window.clearTimeout(recalTimeoutRef.current);
    recalTimeoutRef.current = window.setTimeout(() => setStatus("Face tracking active ✅"), 600);
  }

  // When debug panel is shown again later, re-attach stream to preview element.
  useEffect(() => {
    if (showDebug === false) return;

    const stream = streamRef.current;
    const preview = previewRef.current;
    if (!stream || !preview) return;

    preview.srcObject = stream;
    preview.play().catch(() => {});
  }, [showDebug]);

  useEffect(() => {
    let cancelled = false;

    async function waitForVideoReady(video: HTMLVideoElement) {
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) return;

      await new Promise<void>((resolve) => {
        const onLoaded = () => resolve();
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("loadedmetadata", onLoaded, { once: true });
      });

      // give the browser a beat to populate dimensions
      await new Promise((r) => setTimeout(r, 80));
    }

    function computeRoll(face: { x: number; y: number }[]) {
      // Eye outer corners
      const l = face[33];
      const r = face[263];
      return Math.atan2(r.y - l.y, r.x - l.x);
    }

    async function init() {
      try {
        setStatus("Requesting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;

        const anchor = videoRef.current;
        if (!anchor) return;

        anchor.srcObject = stream;
        await anchor.play();

        // Attach to preview if it exists
        const preview = previewRef.current;
        if (preview) {
          preview.srcObject = stream;
          await preview.play().catch(() => {});
        }

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

        await waitForVideoReady(anchor);
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
      const faceFound = !!results.faceLandmarks?.length;

      let state = "OK";
      let blinkScore = 0;

      // We only set React state on a throttle so we don’t re-render every frame.
      const uiNow = performance.now();
      const shouldUiUpdate = uiNow - lastUiUpdate > 100;

      if (faceFound) {
        const face = results.faceLandmarks![0];

        // Pitch: nose relative to eye line
        const nose = face[1];
        const leftEyeOuter = face[33];
        const rightEyeOuter = face[263];

        const eyeMidY = (leftEyeOuter.y + rightEyeOuter.y) / 2;
        const pitch = nose.y - eyeMidY;

        // Roll: eye line slope
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

        const isTiltLeft = rollDelta > tiltThr;
        const isTiltRight = rollDelta < -tiltThr;


        // Don’t allow nod + tilt to both accumulate
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

        // Triggers
        if (downFramesRef.current >= need && nowMs - lastDownTriggerRef.current > cooldownMs) {
          lastDownTriggerRef.current = nowMs;
          resetFrames();
          firedDownCountRef.current += 1;
          onLookDownRef.current();
        }

        if (upFramesRef.current >= need && nowMs - lastUpTriggerRef.current > cooldownMs) {
          lastUpTriggerRef.current = nowMs;
          resetFrames();
          firedUpCountRef.current += 1;
          onLookUpRef.current();
        }

        if (leftFramesRef.current >= need && nowMs - lastLeftTriggerRef.current > cooldownMs) {
          lastLeftTriggerRef.current = nowMs;
          resetFrames();
          firedLeftCountRef.current += 1;
          onTiltLeftRef.current();
        }

        if (rightFramesRef.current >= need && nowMs - lastRightTriggerRef.current > cooldownMs) {
          lastRightTriggerRef.current = nowMs;
          resetFrames();
          firedRightCountRef.current += 1;
          onTiltRightRef.current();
        }

        // Blink from blendshapes
        const bs = results.faceBlendshapes?.[0]?.categories;
        if (bs) {
          const left = bs.find((c: any) => c.categoryName === "eyeBlinkLeft")?.score ?? 0;
          const right = bs.find((c: any) => c.categoryName === "eyeBlinkRight")?.score ?? 0;
          blinkScore = (left + right) / 2;
        }

        const bThr = blinkThrRef.current;
        const bNeed = blinkFramesRef.current;

        const blinking = blinkScore > bThr;
        blinkFramesCountRef.current = blinking ? blinkFramesCountRef.current + 1 : 0;

        // unlatch after eyes open enough
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

        // VATS target uses nose position in screen-space %
        const tx = clamp(nose.x * 100, 5, 95);
        const ty = clamp(nose.y * 100 - 6, 8, 92);

        if (shouldUiUpdate) {
          lastUiUpdate = uiNow;

          // VATS lock-on pulse on first detection
          if (!prevFaceRef.current) {
            setLockPulse((n) => n + 1);
          }
          prevFaceRef.current = true;

          if (!hasFaceRef.current) {
            hasFaceRef.current = true;
            setHasFace(true);
          }

          setTarget({ x: tx, y: ty });

          setDebug({
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
          });
        }
      } else {
        // No face: drop overlay (throttled)
        prevFaceRef.current = false;

        if (shouldUiUpdate) {
          lastUiUpdate = uiNow;
          if (hasFaceRef.current) {
            hasFaceRef.current = false;
            setHasFace(false);
          }
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

  // ---- Styles ----
  const btnStyle: React.CSSProperties = {
    color: "#00ff9c",
    background: "rgba(0,20,10,0.85)",
    border: "1px solid rgba(0,255,156,0.55)",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
    textShadow: "0 0 6px rgba(0,255,156,0.45)",
    fontFamily: "monospace",
    letterSpacing: 1,
  };

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 12,
    left: 12,
    background: "rgba(0,20,10,0.92)",
    color: "#00ff9c",
    padding: 10,
    borderRadius: 10,
    fontSize: 12,
    zIndex: 40,
    width: 340,
    border: "1px solid rgba(0,255,156,0.55)",
    boxShadow: "0 0 18px rgba(0,255,156,0.25)",
    fontFamily: "monospace",
  };

  const previewStyle: React.CSSProperties = {
    borderRadius: 10,
    width: "100%",
    transform: UI_MIRROR ? "scaleX(-1)" : undefined,
  };

  return (
    <>
      {/* Always-mounted hidden anchor: keeps the stream alive */}
      <video ref={videoRef} playsInline muted style={{ display: "none" }} />

      {/* Full V.A.T.S overlay (mirrored to match preview) */}
      {hasFace && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 30 }}>
          <style>{`
            @keyframes vatsPulse {
              0%   { opacity: 0.2; transform: translate(-50%,-50%) scale(0.92); }
              40%  { opacity: 1;   transform: translate(-50%,-50%) scale(1.02); }
              100% { opacity: 0.75; transform: translate(-50%,-50%) scale(1.00); }
            }
            @keyframes vatsScan {
              0%   { transform: translateY(-120%); opacity: 0; }
              20%  { opacity: 0.35; }
              80%  { opacity: 0.35; }
              100% { transform: translateY(120%); opacity: 0; }
            }
            @keyframes bracketBlink {
              0%, 100% { opacity: 0.6; }
              50%      { opacity: 1; }
            }
          `}</style>

          {/* Scan sweep (inside the target area) */}
          <div
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `${vatsY}%`,
              transform: "translate(-50%, -50%)",
              width: 220,
              height: 260,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -40,
                background:
                  "linear-gradient(to bottom, rgba(0,255,156,0) 0%, rgba(0,255,156,0.25) 45%, rgba(0,255,156,0) 100%)",
                animation: "vatsScan 1.35s linear infinite",
              }}
            />
          </div>

          {/* Lock-on box (pulse when face first appears) */}
          <div
            key={lockPulse}
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `${vatsY}%`,
              width: 220,
              height: 260,
              transform: "translate(-50%, -50%)",
              border: "2px solid rgba(0,255,156,0.75)",
              borderRadius: 10,
              boxShadow: "0 0 18px rgba(0,255,156,0.25)",
              animation: "vatsPulse 420ms ease-out",
            }}
          />

          {/* Corner brackets */}
          {[
            { dx: -110, dy: -130, rot: 0 },
            { dx: 110, dy: -130, rot: 90 },
            { dx: 110, dy: 130, rot: 180 },
            { dx: -110, dy: 130, rot: 270 },
          ].map((b, idx) => (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: `${vatsX}%`,
                top: `${vatsY}%`,
                transform: `translate(calc(-50% + ${b.dx}px), calc(-50% + ${b.dy}px)) rotate(${b.rot}deg)`,
                width: 26,
                height: 26,
                borderLeft: "3px solid rgba(0,255,156,0.95)",
                borderTop: "3px solid rgba(0,255,156,0.95)",
                filter: "drop-shadow(0 0 6px rgba(0,255,156,0.35))",
                animation: "bracketBlink 1.1s ease-in-out infinite",
              }}
            />
          ))}

          {/* Reticle ring */}
          <div
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `${vatsY}%`,
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              border: "2px solid rgba(0,255,156,0.9)",
              borderRadius: 999,
              boxShadow: "0 0 10px rgba(0,255,156,0.35)",
            }}
          />

          {/* Crosshair */}
          <div
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `${vatsY}%`,
              transform: "translate(-50%, -50%)",
              width: 92,
              height: 2,
              background: "rgba(0,255,156,0.65)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `${vatsY}%`,
              transform: "translate(-50%, -50%)",
              width: 2,
              height: 92,
              background: "rgba(0,255,156,0.65)",
            }}
          />

          {/* Label (readable, follows mirrored position but not mirrored text) */}
          <div
            style={{
              position: "absolute",
              left: `${vatsX}%`,
              top: `calc(${vatsY}% - 165px)`,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: "#00ff9c",
              letterSpacing: 2,
              fontSize: 12,
              opacity: 0.95,
              textShadow: "0 0 6px rgba(0,255,156,0.4)",
            }}
          >
            V.A.T.S LOCK-ON
          </div>
        </div>
      )}

      {/* Debug panel */}
      {showDebug !== false && (
        <div style={panelStyle}>
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
                {muted ? "UNMUTE" : "MUTE"}
              </button>

              <button type="button" style={btnStyle} onClick={recalibrate}>
                RECAL
              </button>
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
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
              max="0.12"
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
              max="0.12"
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
              min="0.04"
              max="0.3"
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
              min="0.2"
              max="0.9"
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

          {/* Webcam preview (debug only) */}
          <div style={{ marginTop: 10 }}>
            <video ref={previewRef} width={320} height={190} muted={muted} playsInline style={previewStyle} />
          </div>

          <div style={{ marginTop: 8, opacity: 0.8 }}>Tip: press D to hide this panel.</div>
        </div>
      )}
    </>
  );
}
