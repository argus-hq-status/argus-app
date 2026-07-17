"use client";

import { useState, useRef, useCallback } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface UseAnimateNumberOptions {
  start?: number;
  end: number;
  duration?: number;
  onComplete?: () => void;
}

export function useAnimateNumber(options: UseAnimateNumberOptions) {
  const [value, setValue] = useState(options.start ?? 0);
  const frameRef = useRef<number>(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const start = useCallback(() => {
    const { start: from, end: to, duration = 1000, onComplete } = optionsRef.current;
    const startedAt = performance.now();

    function tick(now: number) {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      setValue((from ?? 0) + ((to ?? 0) - (from ?? 0)) * easeOutCubic(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    }

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setValue(optionsRef.current.start ?? 0);
  }, []);

  return { value, start, reset };
}
