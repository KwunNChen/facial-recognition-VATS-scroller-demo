"use client";

import FaceScrollController from "@/components/FaceScrollController";
import { useEffect, useMemo, useRef, useState } from "react";

type Reel = {
  id: number;
  src: string;
};

const REELS: Reel[] = [
  {
    id: 1,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 2,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: 3,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 5,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 6,
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

const ACTION_COOLDOWN_MS = 650;

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

export default function Home() {
  const reels = REELS;

  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const indexRef = useRef(0);
  const lastActionRef = useRef(0);

  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);

  const [liked, setLiked] = useState<boolean[]>(() => Array(reels.length).fill(false));
  const [saved, setSaved] = useState<boolean[]>(() => Array(reels.length).fill(false));

  const [progressPct, setProgressPct] = useState(0); // 0..1
  const progRafRef = useRef<number | null>(null);
  const lastProgUiRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

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

        // throttle React updates (~20fps)
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

  return (
    <main style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
      {topControls}

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

          {/* Progress bar (smooth) */}
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
                transition: "none",
              }}
            />
          </div>

          {/* Bottom-left overlay */}
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
            <div style={{ fontWeight: 800, fontSize: 16 }}>@{r.user}</div>
            <div style={{ marginTop: 6, fontSize: 14, opacity: 0.95 }}>{r.caption}</div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
              {paused ? "Paused" : "Playing"} • {muted ? "Muted" : "Sound on"}
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

          {/* Small tag (top-right) */}
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
            Reel {i + 1}
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
      />
    </main>
  );
}
