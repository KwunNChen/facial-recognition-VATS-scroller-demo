"use client";
import FaceScrollController from "@/components/FaceScrollController";
import { useEffect, useRef, useState } from "react";

const reels = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Reel ${i + 1}`,
}));

export default function Home() {
  const [liked, setLiked] = useState<boolean[]>(Array(reels.length).fill(false));
  const [saved, setSaved] = useState<boolean[]>(Array(reels.length).fill(false));
  const [index, setIndex] = useState(0);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const indexRef = useRef(0);
  function toggleLike() {
  setLiked((arr) => {
    const copy = [...arr];
    copy[indexRef.current] = !copy[indexRef.current];
    return copy;
  });
}

function toggleSave() {
  setSaved((arr) => {
    const copy = [...arr];
    copy[indexRef.current] = !copy[indexRef.current];
    return copy;
  });
}

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
  }

  function prev() {
    const i = Math.max(indexRef.current - 1, 0);
    setIndex(i);
    scrollTo(i);
  }

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
    <main style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}>
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 10,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
        <div style={{ background: "white", padding: "4px 8px", borderRadius: 6 }}>
          {index + 1}/{reels.length}
        </div>
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
            display: "grid",
            placeItems: "center",
            fontSize: 56,
            borderBottom: "1px solid #ddd",
          }}
        >
          <div style={{ textAlign: "center" }}>
          <div>{r.title}</div>
          <div style={{ marginTop: 12, fontSize: 18 }}>
            ❤️ {liked[i] ? "Liked" : "Not liked"} &nbsp; | &nbsp; 🔖 {saved[i] ? "Saved" : "Not saved"}
          </div>
        </div>

        </div>
      ))}
      <FaceScrollController
      onLookDown={next}
      onLookUp={prev}
      onTiltLeft={toggleLike}
      onTiltRight={toggleSave}
/>


    </main>
  );
}
