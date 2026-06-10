import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number; // base brightness 0-1
}

interface StarfieldBackgroundProps {
  starCount?: number;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  starCount = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let stars: Star[] = [];
    let animId: number;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateStars();
    };

    const generateStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const brightness = Math.random();
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.3 + Math.random() * 1.5, // very small stars
          opacity: 0.2 + Math.random() * 0.8,
          twinkleSpeed: 0.3 + Math.random() * 2.5, // varied twinkle rates
          twinklePhase: Math.random() * Math.PI * 2,
          brightness,
        });
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        // Twinkle: oscillating opacity
        const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinklePhase);
        const alpha = star.opacity * (0.4 + 0.6 * ((twinkle + 1) / 2));

        // Color: warm white to cool blue based on brightness
        let r: number, g: number, b: number;
        if (star.brightness > 0.7) {
          // Bright blueish-white stars
          r = 200 + Math.floor(star.brightness * 55);
          g = 210 + Math.floor(star.brightness * 45);
          b = 255;
        } else if (star.brightness > 0.4) {
          // Warm white/yellowish
          r = 255;
          g = 240 + Math.floor(star.brightness * 15);
          b = 200 + Math.floor(star.brightness * 40);
        } else {
          // Dimmer, slightly warm gray
          r = 200 + Math.floor(star.brightness * 30);
          g = 195 + Math.floor(star.brightness * 30);
          b = 180 + Math.floor(star.brightness * 30);
        }

        // Glow halo for brighter stars
        if (star.size > 0.9 && alpha > 0.5) {
          const glowRadius = star.size * 4;
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowRadius
          );
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.25})`);
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    resize();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
