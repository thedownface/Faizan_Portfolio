// In Next.js (App Router), add 'use client' as the first line of this file.
import { useEffect, useRef } from 'react';
import { TunnelScene } from './tunnelScene.js';

const loadFonts = () =>
  Promise.race([
    Promise.all([
      document.fonts.load('100px "Titan One"'),
      document.fonts.load('40px "DM Mono"'),
      document.fonts.load('500 40px "DM Mono"'),
    ]),
    new Promise((r) => setTimeout(r, 2500)),
  ]);

// Fixed full-screen stage whose GSAP timeline is scrubbed by page scroll.
// onFrame(time, duration) runs every tick for overlay UI (progress bar, hints).
export default function TunnelScroll({ onFrame }) {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(onFrame);
  frameRef.current = onFrame;

  useEffect(() => {
    let scene;
    let cancelled = false;
    const progress = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      return max > 0 ? scrollY / max : 0;
    };
    const onScroll = () => scene && scene.setProgress(progress());

    loadFonts().then(() => {
      if (cancelled) return;
      scene = new TunnelScene(wrapRef.current, stageRef.current, (t, d) => frameRef.current?.(t, d));
      scene.setProgress(progress());
      scene.start(scene.target);
    });
    addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelled = true;
      removeEventListener('scroll', onScroll);
      scene?.dispose();
    };
  }, []);

  return (
    <div ref={wrapRef} className="tunnel-wrap">
      <div ref={stageRef} className="tunnel-stage" />
    </div>
  );
}
