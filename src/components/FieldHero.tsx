'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export function FieldHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let frame = 0;
    let raf = 0;
    let width = 0; let height = 0; let dpr = 1;
    let pointerX = 0; let pointerY = 0;
    const bars = Array.from({ length: 155 }, (_, i) => ({
      x: (i * 131.7 % 1000) / 1000,
      y: (i * 67.3 % 1000) / 1000,
      length: 18 + (i * 17 % 58),
      speed: 0.08 + (i * 7 % 18) / 100,
      depth: 0.25 + (i * 13 % 75) / 100,
      bright: i % 19 === 0,
    }));
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = bounds.width; height = bounds.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (event: PointerEvent) => {
      pointerX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 18;
      pointerY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 12;
    };
    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#05070a'; context.fillRect(0, 0, width, height);
      const horizon = height * 0.18;
      bars.forEach((bar, i) => {
        bar.y += bar.speed * (0.2 + bar.depth * 0.8);
        if (bar.y > 1.08) bar.y = -0.08;
        const perspective = 0.32 + bar.y * 0.86;
        const x = bar.x * width + pointerX * bar.depth;
        const y = horizon + bar.y * (height - horizon) + pointerY * bar.depth;
        const length = bar.length * perspective;
        const blue = bar.bright && i % 2 === 0;
        context.globalAlpha = 0.18 + bar.depth * 0.42;
        context.strokeStyle = blue ? '#2575ff' : (i % 3 === 0 ? '#b2becd' : '#536171');
        context.lineWidth = bar.bright ? 2.2 * perspective : 1.15 * perspective;
        context.beginPath(); context.moveTo(x, y); context.lineTo(x, y + length); context.stroke();
      });
      context.globalAlpha = 1;
      frame += 1;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches || frame % 90 === 0) raf = requestAnimationFrame(draw);
    };
    resize(); window.addEventListener('resize', resize); window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
  }, []);

  return <section className="hero-field">
    <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />
    <div className="hero-grid" aria-hidden="true" />
    <div className="hero-copy">
      <div className="eyebrow"><span className="pulse-dot" /> THE FIELD ENGINEER’S PLAYBOOK <span className="eyebrow-line" /></div>
      <h1>Make software<br /><span>work in the real world.</span></h1>
      <p>Learn the craft of a Forward Deployed Engineer — one real-world challenge at a time.</p>
      <div className="hero-buttons"><Link className="button button-blue" href="/map/">Start your journey <span>↗</span></Link><Link className="button button-outline" href="/level/L0-recruit/">Explore Level 0 <span>↓</span></Link></div>
      <div className="hero-foot"><span><b>06</b> FIELD LEVELS</span><span className="hero-divider" /><span><b>36</b> SHORT LESSONS</span><span className="hero-divider" /><span><b>01</b> MISSION AT A TIME</span></div>
    </div>
    <div className="hero-side-note"><span>FIELD NOTES</span><span>001—006</span></div>
    <div className="hero-bottom-left"><span className="corner-mark">+</span> LEARN · BUILD · DEPLOY</div>
    <div className="hero-bottom-right">SCROLL TO BEGIN <span>↓</span></div>
  </section>;
}
