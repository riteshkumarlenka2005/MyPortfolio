import React, { useEffect, useRef } from 'react';

const COLORS = [
  '#00f3ff', // Electric Blue
  '#9d00ff', // Purple
  '#00ff66', // Neon Green
  '#ffeb3b', // Soft Yellow
  '#ff9900', // Orange
  '#ffffff', // White
];

export const NeuralPattern: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    
    const spacing = 22; // Distance between dots in the grid

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      }
    };

    const initParticles = () => {
      particles = [];
      const cols = Math.ceil(canvas.width / spacing) + 2;
      const rows = Math.ceil(canvas.height / spacing) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          // Staggered grid (offset every other row)
          const xOffset = (j % 2 === 0) ? 0 : spacing / 2;
          const baseX = i * spacing + xOffset;
          const baseY = j * spacing;

          particles.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            baseRadius: Math.random() * 2 + 1, // 1 to 3
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            isFilled: Math.random() > 0.85, // 15% filled, 85% outline
            pulseSpeed: Math.random() * 0.002 + 0.0005,
            pulseOffset: Math.random() * Math.PI * 2,
            floatOffsetX: Math.random() * Math.PI * 2,
            floatOffsetY: Math.random() * Math.PI * 2,
            floatSpeed: Math.random() * 0.001 + 0.0005,
            parallaxFactor: Math.random() * 0.03 + 0.01,
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() * 1.0; // time in ms

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseDx = (mouseRef.current.x - canvas.width / 2);
      const mouseDy = (mouseRef.current.y - canvas.height / 2);

      particles.forEach((p) => {
        // Slow floating movement around their base positions
        const floatX = Math.sin(time * p.floatSpeed + p.floatOffsetX) * 3;
        const floatY = Math.cos(time * p.floatSpeed + p.floatOffsetY) * 3;

        // Gentle parallax based on mouse
        const parallaxX = mouseDx * p.parallaxFactor * -1;
        const parallaxY = mouseDy * p.parallaxFactor * -1;

        p.x = p.baseX + floatX + parallaxX;
        p.y = p.baseY + floatY + parallaxY;

        // X-based fading and sizing
        // Progress from 0 (left) to 1 (right)
        const xProgress = p.x / canvas.width;
        
        // Fades out near the right edge of the canvas area
        const opacityMultiplier = Math.max(0, 1 - Math.pow(xProgress, 1.2));
        const sizeMultiplier = Math.max(0.1, 1 - Math.pow(xProgress, 1.0));

        const baseOpacity = p.isFilled ? 0.3 : 0.5;
        // Random opacity pulsing on a few circles
        const currentOpacity = (baseOpacity + (Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3)) * opacityMultiplier;
        
        if (currentOpacity <= 0.02) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius * sizeMultiplier, 0, Math.PI * 2);
        
        if (p.isFilled) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = currentOpacity * 0.8; 
            ctx.fill();
        } else {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.0 * sizeMultiplier;
            ctx.globalAlpha = currentOpacity;
            ctx.stroke();
        }
      });
      ctx.globalAlpha = 1; // Reset

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
