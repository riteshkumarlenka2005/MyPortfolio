import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface Stick {
  p0: Point;
  p1: Point;
  length: number;
}

export interface Attachment {
  nodeIndex: number;
  ref: React.RefObject<HTMLElement | null>;
  offsetX?: number;
  offsetY?: number;
}

interface JourneyRopePhysicsProps {
  numNodes?: number;
  attachments?: Attachment[];
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const JourneyRopePhysics: React.FC<JourneyRopePhysicsProps> = ({
  numNodes = 60,
  attachments = [],
  containerRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragInfo = useRef<{ node: Point | null; offsetX: number; offsetY: number }>({ node: null, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    
    const setCanvasSize = () => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    };
    setCanvasSize();

    // ─── Create rope points ───
    const points: Point[] = [];
    const sticks: Stick[] = [];
    const segmentLength = height / (numNodes - 1);

    // On mobile (< 768px), anchor the rope to the left third for card clearance
    const getRopeX = (w: number) => w < 768 ? w * 0.12 : w / 2;

    for (let i = 0; i < numNodes; i++) {
      const x = getRopeX(width);
      const y = i * segmentLength;
      points.push({
        x, y,
        oldX: x + (Math.random() - 0.5) * 0.5, // tiny initial jitter for life
        oldY: y,
        pinned: i === 0 || i === numNodes - 1,
      });
    }

    for (let i = 0; i < numNodes - 1; i++) {
      sticks.push({
        p0: points[i],
        p1: points[i + 1],
        length: segmentLength,
      });
    }

    // ─── Physics constants ───
    const GRAVITY = 0.35;
    const FRICTION = 0.92;
    const BOUNCE = 0.85;
    const CONSTRAINT_ITERS = 8;

    let animationFrameId: number;

    // ─── Physics update ───
    const updatePoints = () => {
      for (const p of points) {
        if (p.pinned) continue;
        if (dragInfo.current.node === p) {
          p.oldX = p.x;
          p.oldY = p.y;
          continue;
        }
        const vx = (p.x - p.oldX) * FRICTION;
        const vy = (p.y - p.oldY) * FRICTION;
        p.oldX = p.x;
        p.oldY = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;

        // Boundary constraints
        if (p.x > width - 5) { p.x = width - 5; p.oldX = p.x + vx * BOUNCE; }
        if (p.x < 5) { p.x = 5; p.oldX = p.x + vx * BOUNCE; }
      }
    };

    const updateSticks = () => {
      for (let iter = 0; iter < CONSTRAINT_ITERS; iter++) {
        for (const s of sticks) {
          const dx = s.p1.x - s.p0.x;
          const dy = s.p1.y - s.p0.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) continue;
          const diff = (s.length - dist) / dist / 2;
          const ox = dx * diff;
          const oy = dy * diff;
          if (!s.p0.pinned && dragInfo.current.node !== s.p0) { s.p0.x -= ox; s.p0.y -= oy; }
          if (!s.p1.pinned && dragInfo.current.node !== s.p1) { s.p1.x += ox; s.p1.y += oy; }
        }
      }
    };

    // ─── Hyper-realistic rope drawing ───
    const drawRopeSegment = (
      p0x: number, p0y: number,
      p1x: number, p1y: number,
      _index: number,
      totalSegments: number,
      segIdx: number,
    ) => {
      const dx = p1x - p0x;
      const dy = p1y - p0y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;
      const angle = Math.atan2(dy, dx);
      const nx = -Math.sin(angle); // normal x
      const ny = Math.cos(angle);  // normal y
      const ropeRadius = 6;

      // Base rope body with gradient for 3D cylinder effect
      const grad = ctx.createLinearGradient(
        p0x + nx * ropeRadius, p0y + ny * ropeRadius,
        p0x - nx * ropeRadius, p0y - ny * ropeRadius
      );
      grad.addColorStop(0, '#a07848');
      grad.addColorStop(0.15, '#c8a06c');
      grad.addColorStop(0.35, '#d4b080');
      grad.addColorStop(0.5, '#dfc496');
      grad.addColorStop(0.65, '#d4b080');
      grad.addColorStop(0.85, '#b08850');
      grad.addColorStop(1, '#7a5c38');

      ctx.beginPath();
      ctx.moveTo(p0x, p0y);
      ctx.lineTo(p1x, p1y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = ropeRadius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Twisted fiber strands (spiral pattern)
      const strands = 3;
      for (let s = 0; s < strands; s++) {
        const phase = (s / strands) * Math.PI * 2;
        ctx.beginPath();
        const steps = Math.max(4, Math.floor(len / 3));
        for (let t = 0; t <= steps; t++) {
          const frac = t / steps;
          const ix = p0x + dx * frac;
          const iy = p0y + dy * frac;
          // Spiral offset: oscillate perpendicular to the segment
          const spiralPhase = phase + (segIdx + frac) * 2.8;
          const spiralAmp = ropeRadius * 0.55;
          const sx = ix + nx * Math.sin(spiralPhase) * spiralAmp;
          const sy = iy + ny * Math.sin(spiralPhase) * spiralAmp;
          if (t === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        // Darker fiber color for depth
        const fiberAlpha = 0.22 + (s * 0.06);
        ctx.strokeStyle = `rgba(80, 50, 20, ${fiberAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Highlight strand for specular shine
      ctx.beginPath();
      const hSteps = Math.max(3, Math.floor(len / 4));
      for (let t = 0; t <= hSteps; t++) {
        const frac = t / hSteps;
        const ix = p0x + dx * frac;
        const iy = p0y + dy * frac;
        const spiralPhase = (segIdx + frac) * 2.8 + 0.8;
        const sx = ix + nx * Math.sin(spiralPhase) * ropeRadius * 0.3;
        const sy = iy + ny * Math.sin(spiralPhase) * ropeRadius * 0.3;
        if (t === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.strokeStyle = 'rgba(255, 240, 200, 0.18)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Subtle edge shadow for depth
      ctx.beginPath();
      ctx.moveTo(p0x + nx * ropeRadius * 0.9, p0y + ny * ropeRadius * 0.9);
      ctx.lineTo(p1x + nx * ropeRadius * 0.9, p1y + ny * ropeRadius * 0.9);
      ctx.strokeStyle = 'rgba(40, 25, 10, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p0x - nx * ropeRadius * 0.9, p0y - ny * ropeRadius * 0.9);
      ctx.lineTo(p1x - nx * ropeRadius * 0.9, p1y - ny * ropeRadius * 0.9);
      ctx.strokeStyle = 'rgba(40, 25, 10, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Knot bumps at some segment junctions for realism
      if (segIdx > 0 && segIdx % 8 === 0 && segIdx < totalSegments - 1) {
        ctx.beginPath();
        ctx.arc(p0x, p0y, ropeRadius * 1.3, 0, Math.PI * 2);
        const knotGrad = ctx.createRadialGradient(p0x - 1, p0y - 1, 1, p0x, p0y, ropeRadius * 1.3);
        knotGrad.addColorStop(0, '#d4b080');
        knotGrad.addColorStop(0.5, '#b08850');
        knotGrad.addColorStop(1, '#7a5c38');
        ctx.fillStyle = knotGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(60, 35, 15, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    };

    const drawRope = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle rope shadow on background
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      ctx.strokeStyle = 'rgba(120, 80, 40, 0.15)';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // Draw each segment with hyper-realistic rendering
      for (let i = 0; i < numNodes - 1; i++) {
        drawRopeSegment(
          points[i].x, points[i].y,
          points[i + 1].x, points[i + 1].y,
          i, numNodes - 1, i
        );
      }

      // Attachment knot markers (small decorative loops where milestones attach)
      attachments.forEach(att => {
        if (att.ref.current && points[att.nodeIndex]) {
          const p = points[att.nodeIndex];
          const ox = att.offsetX || 0;
          const oy = att.offsetY || 0;

          // Draw a small tie/knot where attachments connect
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#8a6538';
          ctx.fill();
          ctx.strokeStyle = 'rgba(60,35,15,0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();

          att.ref.current.style.transform = `translate(${p.x + ox}px, ${p.y + oy}px) translate(-50%, -50%)`;
        }
      });
    };

    const loop = () => {
      updatePoints();
      updateSticks();
      drawRope();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    // ─── Auto-sway animation on load ───
    // Creates a gentle traveling wave so users discover the rope is interactive
    const SWAY_DELAY = 400; // ms after page load
    const SWAY_DURATION = 1800; // ms for the wave (fast settle)
    const SWAY_AMPLITUDE = 2.5; // subtle sway sideways
    let swayStart = 0;
    let swayFrameId: number;

    const swayAnimation = (timestamp: number) => {
      if (!swayStart) swayStart = timestamp;
      const elapsed = timestamp - swayStart;
      if (elapsed > SWAY_DURATION) return; // done

      const progress = elapsed / SWAY_DURATION;
      // Fade out the amplitude over time
      const fadeFactor = 1 - progress;

      for (let i = 1; i < points.length - 1; i++) {
        if (points[i].pinned || dragInfo.current.node === points[i]) continue;
        const normalizedPos = i / (points.length - 1);
        // Traveling sine wave from top to bottom
        const wave = Math.sin((normalizedPos * 3 - progress * 4) * Math.PI);
        // Stronger in the middle, weaker at ends
        const envelope = Math.sin(normalizedPos * Math.PI);
        const push = wave * envelope * fadeFactor * SWAY_AMPLITUDE * 0.4;
        points[i].x += push;
      }

      swayFrameId = requestAnimationFrame(swayAnimation);
    };

    const swayTimer = setTimeout(() => {
      swayFrameId = requestAnimationFrame(swayAnimation);
    }, SWAY_DELAY);


    // ─── Resize ───
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      setCanvasSize();

      // Reset pin positions
      const ropeX = getRopeX(width);
      points[0].x = ropeX;
      points[0].y = 0;
      points[numNodes - 1].x = ropeX;
      points[numNodes - 1].y = height;
    };
    window.addEventListener('resize', handleResize);

    // ─── Interaction ───
    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ('touches' in e && (e as TouchEvent).touches.length > 0) {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e);
      let closestNode: Point | null = null;
      let minDist = 50;
      for (let i = 1; i < points.length - 1; i++) {
        const p = points[i];
        const d = Math.hypot(pos.x - p.x, pos.y - p.y);
        if (d < minDist) { minDist = d; closestNode = p; }
      }
      if (closestNode) {
        dragInfo.current = {
          node: closestNode,
          offsetX: closestNode.x - pos.x,
          offsetY: closestNode.y - pos.y,
        };
        canvas.style.cursor = 'grabbing';
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragInfo.current.node) return;
      if (e.cancelable) e.preventDefault();
      const pos = getMousePos(e);
      dragInfo.current.node.x = pos.x + dragInfo.current.offsetX;
      dragInfo.current.node.y = pos.y + dragInfo.current.offsetY;
    };

    const handleEnd = () => {
      dragInfo.current.node = null;
      canvas.style.cursor = 'grab';
    };

    canvas.addEventListener('mousedown', handleStart, { passive: false });
    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (swayFrameId) cancelAnimationFrame(swayFrameId);
      clearTimeout(swayTimer);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [numNodes, containerRef, attachments]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        className="block pointer-events-auto w-full h-full"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
};
