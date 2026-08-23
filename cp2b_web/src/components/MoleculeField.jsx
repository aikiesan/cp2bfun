import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ambient backdrop: methane molecules drifting slowly upward, a few of which
 * convert into a spark of energy on the way and fade out.
 *
 * It is decoration, so it stays deliberately quiet — a dozen particles at low
 * opacity, no interaction, aria-hidden, and behind the content. The point is
 * that the identity of the centre (CH4 -> energia) is present, not that anyone
 * notices it.
 *
 * Mounted once in the app layout (src/App.jsx) so it persists across route
 * changes rather than remounting per page. It reads its own route via
 * useLocation and turns the density down everywhere except Home, where the
 * "O Centro em Números" band gives it room to actually read as a field.
 *
 * Costs nothing when off-screen or on a hidden tab: the animation loop stops.
 * With prefers-reduced-motion it paints one static frame and never animates.
 */

// Density rather than a fixed count, so a wide desktop viewport is not
// covered by the same dozen molecules as a phone. Roughly 34 on a 1280x800
// screen at full density — enough to read as a field, sparse enough to stay
// quiet. Every other page runs at a fraction of that so the effect reads as
// ambient texture, not as the page's subject.
const DENSITY = 1 / 30000; // molecules per square pixel at density = 1
const MIN_COUNT = 4;
const MAX_COUNT = 70;
const HOME_DENSITY = 1;
const OTHER_PAGES_DENSITY = 0.4;

const BOND = 7;          // distance from carbon to each hydrogen, px
const CARBON_R = 2.3;
const HYDROGEN_R = 1.15;
const CONVERT_MS = 2200; // how long the CH4 -> energy transition takes

// Read once from the stylesheet so the field follows the design tokens
// instead of pinning its own hex values.
const readTokens = (el) => {
  const cs = getComputedStyle(el);
  const pick = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  return {
    molecule: pick('--cp2b-verde', '#5CA032'),
    energy: pick('--cp2b-ambar', '#D37402'),
  };
};

const random = (min, max) => min + Math.random() * (max - min);

const spawn = (width, height, atBottom) => ({
  x: random(0, width),
  y: atBottom ? height + random(10, 80) : random(0, height),
  // Slow: a molecule takes the better part of a minute to cross the band.
  vy: random(-0.16, -0.07),
  drift: random(-0.05, 0.05),
  spin: random(-0.0035, 0.0035),
  angle: random(0, Math.PI * 2),
  scale: random(0.75, 1.25),
  alpha: random(0.5, 1),
  // Only some molecules convert, and only once they are well into the band.
  convertsAt: Math.random() < 0.55 ? random(0.25, 0.65) : null,
  converting: 0,
});

const MoleculeField = () => {
  const canvasRef = useRef(null);
  const { pathname } = useLocation();
  // Read inside the animation loop via a ref rather than as an effect
  // dependency: re-running the effect on every route change would tear the
  // canvas down and rebuild it, restarting every molecule's drift.
  const densityRef = useRef(pathname === '/' ? HOME_DENSITY : OTHER_PAGES_DENSITY);
  densityRef.current = pathname === '/' ? HOME_DENSITY : OTHER_PAGES_DENSITY;
  // Set by the effect below to the current retarget() closure, so a route
  // change can adjust the particle count without re-running the whole
  // effect (which would tear down and rebuild the canvas).
  const retargetRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    // No 2D context in jsdom, and none in a browser that has canvas disabled.
    // The field is decoration, so the page simply goes without it.
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tokens = readTokens(canvas);

    let particles = [];
    let width = 0;
    let height = 0;
    let frame = null;
    let last = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      retarget();
    };

    // Adjusts the particle count for the current width/height/route without
    // touching the canvas backing store — cheap enough to call on every
    // route change, unlike resize() which re-measures the DOM.
    const retarget = () => {
      if (width <= 0 || height <= 0) return;
      const target = Math.max(
        MIN_COUNT,
        Math.min(MAX_COUNT, Math.round(width * height * DENSITY * densityRef.current))
      );
      // Grow or shrink in place, so the existing molecules keep their
      // positions instead of the whole field jumping.
      while (particles.length < target) particles.push(spawn(width, height, false));
      if (particles.length > target) particles.length = target;
    };
    retargetRef.current = retarget;

    const drawMolecule = (p) => {
      // 0 while it is still methane, 1 once it has become energy.
      const t = p.converting > 0 ? Math.min(p.converting / CONVERT_MS, 1) : 0;
      const eased = t * t * (3 - 2 * t);

      // Bonds contract as the molecule converts, then the spark flares out.
      const bond = BOND * p.scale * (1 - eased * 0.85);
      const flare = eased * 9 * p.scale;
      // Fades out over the second half of the conversion.
      const alpha = p.alpha * (1 - Math.max(0, eased - 0.45) / 0.55);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = t > 0 ? tokens.energy : tokens.molecule;
      ctx.strokeStyle = ctx.fillStyle;

      // Carbon
      ctx.beginPath();
      ctx.arc(0, 0, CARBON_R * p.scale * (1 + eased * 0.5), 0, Math.PI * 2);
      ctx.fill();

      // Four hydrogens, with their bonds
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = alpha * 0.45;
      for (let i = 0; i < 4; i += 1) {
        const a = (i / 4) * Math.PI * 2;
        const hx = Math.cos(a) * bond;
        const hy = Math.sin(a) * bond;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(hx, hy, HYDROGEN_R * p.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha * 0.45;
      }

      // The energy release: four short rays once conversion is under way.
      if (flare > 0) {
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = 0.9;
        for (let i = 0; i < 4; i += 1) {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * flare * 0.4, Math.sin(a) * flare * 0.4);
          ctx.lineTo(Math.cos(a) * flare, Math.sin(a) * flare);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const step = (now) => {
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.y += p.vy * (dt / 16);
        p.x += p.drift * (dt / 16);
        p.angle += p.spin * (dt / 16);

        if (p.converting > 0) {
          p.converting += dt;
        } else if (p.convertsAt !== null && p.y < height * p.convertsAt) {
          p.converting = 1;
        }

        drawMolecule(p);

        const spent = p.converting > CONVERT_MS;
        if (spent || p.y < -20) {
          Object.assign(p, spawn(width, height, true));
        }
      }

      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (frame === null && visible && !reduceMotion) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    };

    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const paintOnce = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(drawMolecule);
    };

    resize();
    // Paint immediately so the band is never blank between mount and the
    // first animation frame — and so it still shows something on a hidden
    // or throttled tab, where rAF may not fire at all.
    paintOnce();

    if (reduceMotion) {
      // One still frame: the identity is there, nothing moves.
      return () => {};
    }

    // Only animate while the band is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      // Resizing resets the backing store, which clears it.
      if (frame === null) paintOnce();
    });
    resizeObserver.observe(canvas);

    start();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // densityRef is already updated above on every render; this just tells
  // the running loop to actually apply the new count for the new route.
  useEffect(() => {
    retargetRef.current?.();
  }, [pathname]);

  return <canvas ref={canvasRef} className="molecule-field" aria-hidden="true" />;
};

export default MoleculeField;
