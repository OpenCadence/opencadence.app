"use client";

import { useEffect, useRef, useState } from "react";
import { createCadenceField } from "@/lib/cadence-field";

// Wall-clock limits, not accumulated frames: slow devices cannot stretch the
// automatic introduction beyond three seconds. No automatic motion repeats.
const INTRO_MS = 3000;
const FINAL_PHASE = 3;
const easeOut = (progress: number) =>
  1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);

// Present in server HTML, including without JavaScript or WebGL.
function StaticField() {
  return (
    <svg
      className="cadence-field-static"
      viewBox="0 0 1440 760"
      preserveAspectRatio="none"
      focusable="false"
    >
      {Array.from({ length: 30 }, (_, index) => {
        const offset = (index - 14.5) * 3.8;
        return (
          <g
            key={index}
            fill="none"
            stroke={index > 22 ? "#89966e" : "#287c73"}
            strokeWidth="0.8"
            opacity="0.23"
          >
            <path
              d={`M ${1230 + offset} ${216 - offset * 0.7} C ${1080 + offset} ${48 - offset}, ${520 - offset} ${30 + offset}, ${275 - offset} ${189 + offset}`}
            />
            <path
              d={`M ${235 - offset} ${228 + offset} C ${85 + offset} ${320 + offset}, ${138 - offset} ${462 - offset}, ${303 + offset} ${526 - offset}`}
            />
            <path
              d={`M ${358 + offset} ${551 - offset} C ${619 + offset} ${682 + offset}, ${1050 - offset} ${610 + offset}, ${1260 - offset} ${461 + offset}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function HeroBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<{ startedAt: number | null; finished: boolean }>({
    startedAt: null,
    finished: false,
  });
  const timeRef = useRef(0);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || reduced) {
      setReady(false);
      return;
    }
    let renderer;
    try {
      renderer = createCadenceField(canvas);
    } catch {
      renderer = null;
    }
    if (!renderer) {
      setReady(false);
      return;
    }
    const field = renderer;
    const intro = introRef.current;
    let frame = 0;
    let previousDraw = 0;
    let inView = false;
    let lost = false;
    let disposed = false;
    const canRender = () => !disposed && !lost && inView && !document.hidden;

    function finishIntro() {
      if (intro.startedAt !== null) {
        intro.finished = true;
        timeRef.current = FINAL_PHASE;
      }
    }
    function hasMotion(now: number) {
      return (
        !intro.finished &&
        intro.startedAt !== null &&
        now < intro.startedAt + INTRO_MS
      );
    }
    function draw(now: number) {
      if (!intro.finished && intro.startedAt !== null) {
        timeRef.current =
          FINAL_PHASE * easeOut((now - intro.startedAt) / INTRO_MS);
        if (now >= intro.startedAt + INTRO_MS) finishIntro();
      }
      field.draw(timeRef.current);
    }
    function tick(now: number) {
      frame = 0;
      if (!canRender()) {
        canvas!.dataset.active = "false";
        return;
      }
      const moving = hasMotion(now);
      // Render at most 30fps, plus the exact final state. Do not keep an idle RAF.
      if (!previousDraw || now - previousDraw >= 1000 / 30 || !moving) {
        draw(now);
        previousDraw = now;
      }
      canvas!.dataset.active = String(moving);
      if (moving) frame = requestAnimationFrame(tick);
    }
    function wake() {
      if (!canRender() || frame) return;
      canvas!.dataset.active = "true";
      frame = requestAnimationFrame(tick);
    }
    function reconcile() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousDraw = 0;
      canvas!.dataset.active = "false";
      if (!canRender()) {
        // Leaving the hero or tab ends the introduction rather than replaying it.
        finishIntro();
        return;
      }
      if (intro.startedAt === null) intro.startedAt = performance.now();
      draw(performance.now());
      if (hasMotion(performance.now())) wake();
    }
    function resize() {
      const bounds = host!.getBoundingClientRect();
      field.resize(bounds.width, bounds.height);
      if (canRender()) draw(performance.now());
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      setReady(false);
      reconcile();
    }
    function contextRestored() {
      setContextVersion((version) => version + 1);
    }

    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      reconcile();
    });
    const resizeObserver = new ResizeObserver(resize);
    intersection.observe(host);
    resizeObserver.observe(host);
    document.addEventListener("visibilitychange", reconcile);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    resize();
    setReady(true);

    return () => {
      disposed = true;
      finishIntro();
      cancelAnimationFrame(frame);
      canvas.dataset.active = "false";
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", reconcile);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      field.dispose();
    };
  }, [reduced, contextVersion]);

  return (
    <div
      ref={hostRef}
      className="cadence-field"
      data-renderer={ready ? "webgl" : "static"}
      aria-hidden="true"
    >
      <div className="cadence-field-light" />
      <div className="cadence-field-art">
        <StaticField />
        <canvas ref={canvasRef} className="cadence-field-canvas" />
      </div>
      <div className="cadence-field-grain" />
    </div>
  );
}
