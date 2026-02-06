"use client";

import FaceScrollController from "@/components/FaceScrollController";
import React, { useEffect, useMemo, useRef, useState } from "react";

type Reel = {
  id: number;
  src: string;
};

// Content hardcoded for demo purposes (Fallout NV / West Coast)
const REELS: Reel[] = [
  { id: 1, src: "/videos/MaximumNCR.mp4" },
  { id: 2, src: "/videos/NCRArrives.mp4" },
  { id: 3, src: "/videos/NewVegasEdit.mp4" },
  { id: 4, src: "/videos/OpSunburst.mp4" },
  { id: 5, src: "/videos/NVTrailer.mp4" },
  { id: 6, src: "/videos/RangerArmor.mp4" },
];

const ACTION_COOLDOWN_MS = 650;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export default function Home() {
  // Boot screen
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 1400);
    return () => window.clearTimeout(t);
  }, []);

  const reels = REELS;

  // Refs/state for reels
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const indexRef = useRef(0);
  const lastActionRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const [liked, setLiked] = useState<boolean[]>(() => Array(reels.length).fill(false));
  const [saved, setSaved] = useState<boolean[]>(() => Array(reels.length).fill(false));

  const [progressPct, setProgressPct] = useState(0);
  const [showDebug, setShowDebug] = useState(true);

  const progRafRef = useRef<number | null>(null);
  const lastProgUiRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // Toggle debug with "D"
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "d") setShowDebug((s) => !s);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function canAct() {
    const now = Date.now();
    if (now - lastActionRef.current < ACTION_COOLDOWN_MS) return false;
    lastActionRef.current = now;
    return true;
  }

  function scrollTo(i: number) {
    reelRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  }

  function goTo(i: number) {
    setIndex(i);
    scrollTo(i);
  }

  function next() {
    if (!canAct()) return;
    goTo(Math.min(indexRef.current + 1, reels.length - 1));
  }

  function prev() {
    if (!canAct()) return;
    goTo(Math.max(indexRef.current - 1, 0));
  }

  function toggleMuted() {
    if (!canAct()) return;
    setMuted((m) => !m);
  }

  function togglePause() {
    if (!canAct()) return;
    setPaused((p) => !p);
  }

  function toggleAtIndex(setter: React.Dispatch<React.SetStateAction<boolean[]>>) {
    if (!canAct()) return;
    setter((arr) => {
      const copy = [...arr];
      const i = indexRef.current;
      copy[i] = !copy[i];
      return copy;
    });
  }

  function toggleLike() {
    toggleAtIndex(setLiked);
  }

  function toggleSave() {
    toggleAtIndex(setSaved);
  }

  // Keep index in sync with manual scroll
  useEffect(() => {
    const els = reelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;

        for (const e of entries) {
          if (!e.isIntersecting) continue;

          const idx = els.indexOf(e.target as HTMLDivElement);
          if (idx === -1) continue;

          const ratio = e.intersectionRatio;
          if (!best || ratio > best.ratio) best = { idx, ratio };
        }

        if (best && best.ratio >= 0.6) setIndex(best.idx);
      },
      { threshold: [0.1, 0.25, 0.5, 0.6, 0.75, 0.9] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Playback policy: only active reel plays; apply muted + paused
  useEffect(() => {
    for (let i = 0; i < videoRefs.current.length; i++) {
      const v = videoRefs.current[i];
      if (!v) continue;

      v.muted = muted;

      if (i === index) {
        if (paused) v.pause();
        else v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    }

    setProgressPct(0);
  }, [index, muted, paused]);

  // Smooth progress loop (rAF) for active reel
  useEffect(() => {
    if (progRafRef.current) cancelAnimationFrame(progRafRef.current);

    function tick() {
      const v = videoRefs.current[index];

      if (v && isFinite(v.duration) && v.duration > 0) {
        const pct = clamp01(v.currentTime / v.duration);

        const now = performance.now();
        if (now - lastProgUiRef.current > 50) {
          lastProgUiRef.current = now;
          setProgressPct(pct);
        }
      } else {
        setProgressPct(0);
      }

      progRafRef.current = requestAnimationFrame(tick);
    }

    progRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (progRafRef.current) cancelAnimationFrame(progRafRef.current);
    };
  }, [index]);

  const topControls = useMemo(
    () => (
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          gap: 8,
          alignItems: "center",
          pointerEvents: "none",
          opacity: 0.35,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center", pointerEvents: "auto" }}>
          <button onClick={prev}>Prev</button>
          <button onClick={next}>Next</button>
          <div style={{ background: "white", padding: "4px 8px", borderRadius: 6 }}>
            {index + 1}/{reels.length}
          </div>
        </div>
      </div>
    ),
    [index, reels.length]
  );

  if (booting) {
    return (
      <div
        style={{
          height: "100vh",
          background: "black",
          color: "#00ff9c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Courier New, monospace",
          fontSize: 28,
          letterSpacing: 2,
        }}
      >
        VAULT-TEC SYSTEM BOOTING...
      </div>
    );
  }

  return (
    <main style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
      {topControls}

      {/* Control instructions overlay */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "rgba(0,20,10,0.85)",
          padding: 14,
          borderRadius: 10,
          border: "1px solid rgba(0,255,156,0.4)",
          fontSize: 13,
          lineHeight: 1.6,
          zIndex: 50,
          color: "#00ff9c",
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        <b>PIP-BOY CONTROL LINK</b>
        <br />
        Nod ↓ : Next
        <br />
        Nod ↑ : Previous
        <br />
        Tilt ← : Like
        <br />
        Tilt → : Save
        <br />
        Blink : Pause
      </div>

      {reels.map((r, i) => (
        <div
          key={r.id}
          ref={(el) => {
            reelRefs.current[i] = el;
          }}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            background: "black",
            overflow: "hidden",
            borderBottom: "1px solid #111",
          }}
        >
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={r.src}
            muted={muted}
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 4,
              width: "100%",
              background: "rgba(255,255,255,0.18)",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(i === index ? progressPct : 0) * 100}%`,
                background: "white",
              }}
            />
          </div>

          {/* Bottom-left status */}
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 22,
              color: "white",
              maxWidth: "70%",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
              pointerEvents: "none",
            }}
          >
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              {paused ? "SIGNAL PAUSED" : "BROADCASTING"} • {muted ? "AUDIO OFF" : "AUDIO LIVE"}
            </div>
          </div>

          {/* Right-side actions */}
          <div
            style={{
              position: "absolute",
              right: 14,
              bottom: 90,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "center",
              color: "white",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
              pointerEvents: "none",
            }}
          >
            <button
              onClick={toggleLike}
              style={{
                pointerEvents: "auto",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                borderRadius: 999,
                padding: "10px 12px",
                cursor: "pointer",
              }}
              aria-label="Like"
              title="Like"
            >
              {liked[i] ? "❤️" : "🤍"}
            </button>

            <button
              onClick={toggleSave}
              style={{
                pointerEvents: "auto",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                borderRadius: 999,
                padding: "10px 12px",
                cursor: "pointer",
              }}
              aria-label="Save"
              title="Save"
            >
              {saved[i] ? "🔖" : "📑"}
            </button>

            <button
              onClick={togglePause}
              style={{
                pointerEvents: "auto",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                borderRadius: 999,
                padding: "10px 12px",
                cursor: "pointer",
              }}
              aria-label="Pause/Play"
              title="Pause/Play"
            >
              {paused ? "▶️" : "⏸️"}
            </button>
          </div>

          {/* Small tag */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.45)",
              color: "white",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
              pointerEvents: "none",
            }}
          >
            TAPE {i + 1}
          </div>
        </div>
      ))}

      <FaceScrollController
        onLookDown={next}
        onLookUp={prev}
        onTiltLeft={toggleLike}
        onTiltRight={toggleSave}
        onBlink={togglePause}
        muted={muted}
        onToggleMute={toggleMuted}
        showDebug={showDebug}
      />
    </main>
  );
}
