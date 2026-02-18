/**
 * FabricFeel — Subtle elastic/sheen interaction on product images.
 * Technique: CSS 3D perspective tilt (±3°) + radial-gradient sheen overlay.
 * Runs on requestAnimationFrame with lerp smoothing. Zero extra libraries.
 * Automatically disabled when prefers-reduced-motion is set.
 */

import { useRef, useEffect, useState, useCallback } from 'react';

interface FabricFeelProps {
  children: React.ReactNode;
  /** Pass true to suspend the effect (e.g. when image is zoomed) */
  disabled?: boolean;
}

const MAX_TILT    = 3;     // degrees — premium subtlety
const SCALE_HOVER = 1.018;
const LERP_SPEED  = 0.07;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function FabricFeel({ children, disabled = false }: FabricFeelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef     = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  // Mutable state kept in a ref to avoid re-renders inside rAF loop
  const s = useRef({
    rotX: 0, rotY: 0, shinX: 50, shinY: 50, scale: 1,
    tRotX: 0, tRotY: 0, tShinX: 50, tShinY: 50, tScale: 1,
  });

  const [hintVisible, setHintVisible] = useState(false);
  const hintShownRef = useRef(false);

  // Detect reduced-motion once (synchronous so no flicker)
  const reduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // rAF loop — only touches DOM via refs
  const tick = useCallback(() => {
    const v = s.current;
    v.rotX  = lerp(v.rotX,  v.tRotX,  LERP_SPEED);
    v.rotY  = lerp(v.rotY,  v.tRotY,  LERP_SPEED);
    v.shinX = lerp(v.shinX, v.tShinX, LERP_SPEED);
    v.shinY = lerp(v.shinY, v.tShinY, LERP_SPEED);
    v.scale = lerp(v.scale, v.tScale, LERP_SPEED);

    if (innerRef.current) {
      innerRef.current.style.transform =
        `perspective(700px) rotateX(${v.rotX.toFixed(3)}deg) rotateY(${v.rotY.toFixed(3)}deg) scale(${v.scale.toFixed(4)})`;
    }
    if (overlayRef.current) {
      const alpha = 0.12 + 0.06 * Math.abs(v.rotY / MAX_TILT);
      overlayRef.current.style.background =
        `radial-gradient(circle at ${v.shinX.toFixed(1)}% ${v.shinY.toFixed(1)}%, rgba(255,255,255,${alpha.toFixed(3)}) 0%, rgba(255,255,255,0.04) 40%, transparent 68%)`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (reduced.current) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // Reset targets when disabled changes
  useEffect(() => {
    if (disabled) {
      const v = s.current;
      v.tRotX = 0; v.tRotY = 0;
      v.tShinX = 50; v.tShinY = 50;
      v.tScale = 1;
    }
  }, [disabled]);

  function getRelativePos(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left)  / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top)   / rect.height)),
    };
  }

  function applyMove(x: number, y: number) {
    const v = s.current;
    v.tRotX  = (0.5 - y) * MAX_TILT;
    v.tRotY  = (x - 0.5) * MAX_TILT;
    v.tShinX = x * 100;
    v.tShinY = y * 100;
    v.tScale = SCALE_HOVER;
  }

  function resetTargets() {
    const v = s.current;
    v.tRotX = 0; v.tRotY = 0;
    v.tShinX = 50; v.tShinY = 50;
    v.tScale = 1;
  }

  // ── Event handlers ────────────────────────────────────────────────────────

  function onMouseMove(e: React.MouseEvent) {
    if (reduced.current || disabled) return;
    const pos = getRelativePos(e.clientX, e.clientY);
    if (pos) applyMove(pos.x, pos.y);
  }

  function onMouseEnter() {
    if (reduced.current || disabled) return;
    s.current.tScale = SCALE_HOVER;

    // Show hint label once
    if (!hintShownRef.current) {
      hintShownRef.current = true;
      setHintVisible(true);
      setTimeout(() => setHintVisible(false), 2800);
    }
  }

  function onMouseLeave() {
    if (reduced.current) return;
    resetTargets();
  }

  function onTouchMove(e: React.TouchEvent) {
    if (reduced.current || disabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    const pos = getRelativePos(touch.clientX, touch.clientY);
    if (pos) applyMove(pos.x, pos.y);
  }

  function onTouchEnd() {
    if (reduced.current) return;
    resetTargets();
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Inner wrapper — receives the 3D tilt + scale */}
      <div
        ref={innerRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: 'center center' }}
      >
        {children}

        {/* Sheen overlay — sits above image, below UI chrome */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none select-none"
          style={{ mixBlendMode: 'soft-light' }}
          aria-hidden
        />
      </div>

      {/* Hint label */}
      {!reduced.current && (
        <div
          className="absolute bottom-3 inset-x-0 flex justify-center z-20 pointer-events-none"
          aria-hidden
        >
          <span
            className={`
              bg-black/55 text-white text-[10px] font-medium px-3.5 py-1.5
              rounded-full backdrop-blur-sm whitespace-nowrap
              transition-all duration-500 ease-in-out
              ${hintVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
            `}
          >
            Kumaşı hissetmek için üzerinde gezdir
          </span>
        </div>
      )}
    </div>
  );
}
