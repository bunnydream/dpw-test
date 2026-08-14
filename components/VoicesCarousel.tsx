"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type Voice = {
  text: ReactNode;
  attr: ReactNode;
};

const GAP = 20;

export default function VoicesCarousel({ voices }: { voices: Voice[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [idx, setIdx] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const total = voices.length;

  useEffect(() => {
    function computeWidth() {
      const outerEl = outerRef.current;
      if (!outerEl) return;
      const pl = parseFloat(getComputedStyle(outerEl).paddingLeft) || 0;
      const visW = outerEl.offsetWidth - pl;
      const cw =
        window.innerWidth <= 768
          ? Math.max(200, Math.floor(visW - pl))
          : Math.max(200, Math.floor((visW - GAP) / 2.5));
      setCardWidth(cw);
    }
    computeWidth();
    window.addEventListener("resize", computeWidth);
    return () => window.removeEventListener("resize", computeWidth);
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card) => {
      if (card) card.style.flexBasis = cardWidth + "px";
    });
  }, [cardWidth]);

  useEffect(() => {
    if (!trackRef.current) return;
    const offset = idx * (cardWidth + GAP);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
  }, [idx, cardWidth]);

  function goTo(i: number) {
    setIdx(Math.max(0, Math.min(i, total - 1)));
  }

  return (
    <>
      <div className="voices-carousel-outer reveal d1" ref={outerRef}>
        <div className="voices-carousel-track" id="carouselTrack" ref={trackRef}>
          {voices.map((voice, i) => (
            <div
              className="voice-card"
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <div className="voice-mark">&ldquo;</div>
              <p className="voice-text">{voice.text}</p>
              <p className="voice-attr">{voice.attr}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-footer">
        <div className="carousel-dots" role="tablist" aria-label="Quote navigation">
          {voices.map((_, i) => (
            <button
              key={i}
              className={`c-dot${i === idx ? " c-dot--active" : ""}`}
              role="tab"
              aria-label={`Quote ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <div className="carousel-arrows">
          <button
            className="carousel-btn"
            aria-label="Previous quote"
            disabled={idx === 0}
            suppressHydrationWarning
            onClick={() => goTo(idx - 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M11 13L7 9l4-4" stroke="#1E272E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="carousel-btn"
            aria-label="Next quote"
            disabled={idx >= total - 1}
            suppressHydrationWarning
            onClick={() => goTo(idx + 1)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M7 5l4 4-4 4" stroke="#1E272E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
