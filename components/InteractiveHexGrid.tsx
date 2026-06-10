import React, { useMemo, useEffect, useRef } from 'react';

interface InteractiveHexGridProps {
  heroMousePos?: { x: number; y: number } | null;
  heroWidth?: number;
}

export const InteractiveHexGrid: React.FC<InteractiveHexGridProps> = React.memo(() => {
  const width = 450;
  const height = 450;
  const r = 32; // Radius of each hexagon

  const containerRef = useRef<HTMLDivElement>(null);
  const polygonsRef = useRef<SVGPolygonElement[]>([]);

  const waveState = useRef({
    active: false,
    startTime: 0,
    centerX: 0,
    centerY: 0,
  });

  const mouseState = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  // Pre-calculate hexagons in the grid
  const hexagons = useMemo(() => {
    const list = [];
    const colStep = 1.5 * r;
    const rowStep = Math.sqrt(3) * r;
    const cols = Math.ceil(width / colStep) + 1;
    const rows = Math.ceil(height / rowStep) + 1;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const cx = col * colStep;
        const cy = row * rowStep + (col % 2 === 1 ? rowStep / 2 : 0);

        // Calculate distance from the top-right corner of the grid (width, 0)
        const dx = cx - width;
        const dy = cy - 0;
        const distToTopRight = Math.sqrt(dx * dx + dy * dy);
        
        // Gradient fade: hexagons further from top-right corner are more transparent
        const maxGradDistance = 420;
        const baseOpacity = Math.max(0, 1 - distToTopRight / maxGradDistance);

        // Only include hexagons that will actually be visible
        if (baseOpacity > 0.01) {
          list.push({
            id: `${col}-${row}`,
            cx,
            cy,
            baseOpacity,
          });
        }
      }
    }
    return list;
  }, [width, height, r]);

  // Reset polygonsRef array size
  useEffect(() => {
    polygonsRef.current = polygonsRef.current.slice(0, hexagons.length);
  }, [hexagons.length]);

  // Helper to apply visual styles based on influence
  const applyHexStyle = (polygon: SVGPolygonElement, hex: typeof hexagons[0], influence: number) => {
    if (influence > 0.01) {
      // Glow and scale matching footer cubes effect
      const strokeOpacity = 0.08 + 0.5 * influence;
      const glowBlur = 4 + 14 * influence;
      const fillOpacity = 0.03 + 0.1 * influence;
      const scale = 1 + 0.018 * influence;
      
      polygon.style.strokeOpacity = String(strokeOpacity);
      polygon.style.fillOpacity = String(fillOpacity);
      polygon.style.transform = `scale(${scale})`;
      polygon.style.filter = `drop-shadow(0 0 ${glowBlur}px rgba(0, 255, 136, ${0.18 * influence})) drop-shadow(0 0 ${glowBlur / 2}px rgba(0, 255, 136, ${0.18 * influence}))`;
      polygon.style.animationPlayState = 'paused';
    } else {
      polygon.style.strokeOpacity = '';
      polygon.style.fillOpacity = '';
      polygon.style.transform = '';
      polygon.style.filter = '';
      polygon.style.animationPlayState = 'running';
    }
  };

  // Direct DOM updates for hover-only movements
  const updateGrid = () => {
    const maxDist = 240;

    hexagons.forEach((hex, idx) => {
      const polygon = polygonsRef.current[idx];
      if (!polygon) return;

      if (!mouseState.current.active) {
        applyHexStyle(polygon, hex, 0);
        return;
      }

      const dx = hex.cx - mouseState.current.x;
      const dy = hex.cy - mouseState.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let influence = Math.max(0, 1 - dist / maxDist);
      influence = Math.pow(influence, 2.2);

      applyHexStyle(polygon, hex, influence);
    });
  };

  // Frame animation loop combining wave and mouse updates
  const animate = (now: number) => {
    if (!waveState.current.active) return;

    const elapsed = now - waveState.current.startTime;
    const progress = Math.min(elapsed / 1000, 1); // 1s duration
    const maxRadius = Math.max(width, height) * 1.2;
    const currentRadius = maxRadius * progress;
    const waveWidth = 120;

    hexagons.forEach((hex, idx) => {
      const polygon = polygonsRef.current[idx];
      if (!polygon) return;

      // Mouse influence
      let mouseInfluence = 0;
      if (mouseState.current.active) {
        const dx = hex.cx - mouseState.current.x;
        const dy = hex.cy - mouseState.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        mouseInfluence = Math.max(0, 1 - dist / 240);
        mouseInfluence = Math.pow(mouseInfluence, 2.2);
      }

      // Wave influence
      const wdx = waveState.current.centerX - hex.cx;
      const wdy = waveState.current.centerY - hex.cy;
      const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
      const distFromWave = Math.abs(wdist - currentRadius);
      let waveInfluence = Math.max(0, 1 - distFromWave / waveWidth);
      waveInfluence = Math.pow(waveInfluence, 2) * (1 - progress);

      const totalInfluence = Math.min(1, Math.max(mouseInfluence, waveInfluence * 1.5));
      applyHexStyle(polygon, hex, totalInfluence);
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      waveState.current.active = false;
      updateGrid();
    }
  };

  // Monitor mouse movements over the parent hero section directly to avoid React re-render overrides
  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const heroWidth = rect.width;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if mouse is within bounds of HeroSection
      if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
        const leftOffset = heroWidth - width;
        const mx = mouseX - leftOffset;
        const my = mouseY;

        const wasActive = mouseState.current.active;
        mouseState.current.active = true;
        mouseState.current.x = mx;
        mouseState.current.y = my;

        if (!wasActive) {
          // Trigger entry wake-up wave
          waveState.current.active = true;
          waveState.current.startTime = performance.now();
          waveState.current.centerX = mx;
          waveState.current.centerY = my;
          requestAnimationFrame(animate);
        } else {
          if (!waveState.current.active) {
            updateGrid();
          }
        }
      } else {
        if (mouseState.current.active) {
          mouseState.current.active = false;
          if (!waveState.current.active) {
            updateGrid();
          }
        }
      }
    };

    const handleMouseLeave = () => {
      mouseState.current.active = false;
      if (!waveState.current.active) {
        updateGrid();
      }
    };

    parent.addEventListener('mousemove', handleMouseMove);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', handleMouseMove);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hexagons.length]);

  // Generates SVG points for a flat-topped hexagon
  const getHexPoints = (cx: number, cy: number, radius: number) => {
    const w = radius / 2;
    const h = (Math.sqrt(3) / 2) * radius;
    return `${cx + radius},${cy} ${cx + w},${cy + h} ${cx - w},${cy + h} ${cx - radius},${cy} ${cx - w},${cy - h} ${cx + w},${cy - h}`;
  };

  return (
    <div
      ref={containerRef}
      className="absolute top-0 right-0 w-[450px] h-[450px] pointer-events-none z-10 select-none overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: `
          @keyframes hexIdlePulse {
              0%, 100% {
                  stroke-opacity: 0.08;
                  fill-opacity: 0.02;
                  filter: drop-shadow(0 0 2px rgba(0, 255, 136, 0.0));
              }
              50% {
                  stroke-opacity: 0.18;
                  fill-opacity: 0.05;
                  filter: drop-shadow(0 0 6px rgba(0, 255, 136, 0.15));
              }
          }
          .hex-idle-pulse {
              animation: hexIdlePulse var(--pulse-dur, 8s) ease-in-out infinite;
              animation-delay: var(--pulse-del, 0s);
          }
      `}} />
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        {hexagons.map((hex, idx) => {
          return (
            <polygon
              key={hex.id}
              ref={(el) => { if (el) polygonsRef.current[idx] = el; }}
              points={getHexPoints(hex.cx, hex.cy, r - 1.5)} // slight gap between hexagons
              fill="#00ff88"
              stroke="#00ff88"
              strokeWidth="1.5"
              className="hex-idle-pulse"
              style={{
                opacity: hex.baseOpacity,
                '--pulse-del': '0s',
                '--pulse-dur': '8s',
                transformOrigin: `${hex.cx}px ${hex.cy}px`,
                transform: 'scale(1)',
                transition: 'fill-opacity 0.4s ease, stroke-opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
              } as React.CSSProperties}
            />
          );
        })}
      </svg>
    </div>
  );
});
