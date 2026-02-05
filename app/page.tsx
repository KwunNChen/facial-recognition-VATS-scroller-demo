"use client";

import FaceScrollController from "@/components/FaceScrollController";
import { useEffect, useRef, useState } from "react";

const reels = [
  {
    id: 1,
    user: "nature_daily",
    caption: "Morning light over the ridge 🌄",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: 2,
    user: "cityvibes",
    caption: "Night drive through downtown 🚗",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: 3,
    user: "sports_clipz",
    caption: "That finish was unreal 😮",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: 4,
    user: "travelwithme",
    caption: "Tiny roads, big views ✈️",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: 5,
    user: "foodmode",
    caption: "Crunch test ✅",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 6,
    user: "random",
    caption: "POV: you found a better workflow",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lastActionRef = useRef(0);
  const ACTION_COOLDOWN_MS = 700;

  function canAct() {
    const now = Date.now();
    if (now - lastActionRef.current < ACTION_COOLDOWN_MS) return false;
    lastActionRef.current = now;
    return true;
  }

  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [liked, setLiked] = useState<boolean[]>(Array(reels.length).fill(false));
  const [saved, setSaved] = useState<boolean[]>(Array(reels.length).fill(false));

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  function scrollTo(i: number) {
    reelRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  }

  function next() {
    const i = Math.min(indexRef.current + 1, reels.length - 1);
    setIndex(i);
    scrollTo(i);
    lastActionRef.current = Date.now();
  }

  function prev() {
    const i = Math.max(indexRef.current - 1, 0);
    setIndex(i);
    scrollTo(i);
  }

  function toggleLike() {
    if (!canAct()) return;
    setLiked((arr) => {
      const copy = [...arr];
      const i = indexRef.current;
      copy[i] = !copy[i];
      return copy;
    });
  }

  function toggleSave() {
    if (!canAct()) return;
    setSaved((arr) => {
      const copy = [...arr];
      const i = indexRef.current;
      copy[i] = !copy[i];
      return copy;
    });
  }
  
  function togglePlay() {
  const v = videoRefs.current[indexRef.current];
  if (!v) return;

  if (v.paused) {
    v.play().catch(() => {});
  } else {
    v.pause();
  }
}

  // Auto-play current reel, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.play().catch(() => {});
      } else {
        v.pause();
        try {
          v.currentTime = 0;
        } catch {}
      }
    });
  }, [index]);

  // Update index when user scrolls manually
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

  return (
    <main
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "black",
      }}
    >
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
          }}
        >
          {/* Video */}
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={r.src}
            muted
            playsInline
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Top counter pill */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "6px 10px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.45)",
              color: "white",
              fontSize: 12,
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            }}
          >
            {i + 1}/{reels.length}
          </div>

          {/* Bottom-left overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 16,
              right: 90,
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.65)",
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>@{r.user}</div>
            <div style={{ opacity: 0.95 }}>{r.caption}</div>
          </div>

          {/* Right-side actions */}
          <div
            style={{
              position: "absolute",
              right: 14,
              bottom: 80,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "center",
              color: "white",
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            }}
          >
            <button
              onClick={toggleLike}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              {liked[i] ? "❤️" : "🤍"}
            </button>

            <button
              onClick={toggleSave}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.35)",
                color: "white",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              {saved[i] ? "🔖" : "📑"}
            </button>
          </div>
        </div>
      ))}

      {/* Face controls */}
      <FaceScrollController
        onLookDown={next}
        onLookUp={prev}
        onTiltLeft={toggleLike}
        onTiltRight={toggleSave}
        onBlink={togglePlay}
      />

    </main>
  );
}
