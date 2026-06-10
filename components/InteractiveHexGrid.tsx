import React, { useMemo } from 'react';

interface InteractiveHexGridProps {
  heroMousePos: { x: number; y: number } | null;
  heroWidth: number;
}

export const InteractiveHexGrid: React.FC<InteractiveHexGridProps> = ({ heroMousePos, heroWidth }) => {
  const width = 450;
  const height = 450;
  const r = 32; // Radius of each hexagon

  // Translate global hero section mouse position to local grid coordinates
  const localMousePos = useMemo(() => {
    if (!heroMousePos || heroWidth === 0) return null;
    const leftOffset = heroWidth - width;
    return {
      x: heroMousePos.x - leftOffset,
      y: heroMousePos.y,
    };
  }, [heroMousePos, heroWidth]);

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

  // Generates SVG points for a flat-topped hexagon
  const getHexPoints = (cx: number, cy: number, radius: number) => {
    const w = radius / 2;
    const h = (Math.sqrt(3) / 2) * radius;
    return `${cx + radius},${cy} ${cx + w},${cy + h} ${cx - w},${cy + h} ${cx - radius},${cy} ${cx - w},${cy - h} ${cx + w},${cy - h}`;
  };

  return (
    <div
      className="absolute top-0 right-0 w-[450px] h-[450px] pointer-events-none z-10 select-none overflow-hidden"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
      >
        {hexagons.map((hex) => {
          let hoverMultiplier = 1;
          const hoverRadius = 85;

          if (localMousePos) {
            const dx = hex.cx - localMousePos.x;
            const dy = hex.cy - localMousePos.y;
            const distToMouse = Math.sqrt(dx * dx + dy * dy);

            if (distToMouse < hoverRadius) {
              // Non-linear transition: fully vanished under pointer, fades back in smoothly
              hoverMultiplier = Math.pow(distToMouse / hoverRadius, 2);
            }
          }

          // Very light structure opacities matching the reference dark/green theme
          const strokeOpacity = hex.baseOpacity * hoverMultiplier * 0.12;
          const fillOpacity = hex.baseOpacity * hoverMultiplier * 0.03;

          return (
            <polygon
              key={hex.id}
              points={getHexPoints(hex.cx, hex.cy, r - 1.5)} // slight gap between hexagons
              fill="#00e05a"
              stroke="#00e05a"
              strokeWidth="1"
              style={{
                fillOpacity,
                strokeOpacity,
                transition: 'fill-opacity 0.25s ease-out, stroke-opacity 0.25s ease-out',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};
