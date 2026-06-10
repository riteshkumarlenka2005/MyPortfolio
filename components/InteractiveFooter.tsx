import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const InteractiveFooter: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cellsRef = useRef<HTMLDivElement[]>([]);
    
    const [grid, setGrid] = useState({ cols: 0, rows: 0, cellSize: 72, gap: 10 });

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

    // Handle screen resize and calculate grid density
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                
                const isMobile = window.innerWidth < 768;
                const cellSize = isMobile ? 48 : 56;
                const gap = isMobile ? 5 : 6;
                
                const cols = Math.floor(width / (cellSize + gap));
                const rows = Math.floor(height / (cellSize + gap));
                
                setGrid({ cols: Math.max(cols, 1), rows: Math.max(rows, 1), cellSize, gap });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const totalCells = grid.cols * grid.rows;

    // Reset cellsRef array size
    useEffect(() => {
        cellsRef.current = cellsRef.current.slice(0, totalCells);
    }, [totalCells]);

    // Compute cell center position in grid-local coordinates
    const getCellCenter = (r: number, c: number) => {
        const { cellSize, gap } = grid;
        const step = cellSize + gap;
        return {
            cx: c * step + cellSize / 2,
            cy: r * step + cellSize / 2,
        };
    };

    // Get grid offset (top-left of grid relative to container)
    const getGridOffset = () => {
        if (!containerRef.current) return { ox: 0, oy: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        const { cols, rows, cellSize, gap } = grid;
        const step = cellSize + gap;
        const gridWidth = cols * step - gap;
        const gridHeight = rows * step - gap;
        return {
            ox: (rect.width - gridWidth) / 2,
            oy: (rect.height - gridHeight) / 2,
        };
    };

    // Apply style to a single cell based on influence (0..1)
    const applyCellStyle = (cell: HTMLDivElement, influence: number) => {
        if (influence > 0.01) {
            // Green edge glow + outer glow bleeding through gaps
            const glowSpread = 2 + 8 * influence;
            const glowBlur = 4 + 14 * influence;
            cell.style.boxShadow = `0 0 ${glowBlur}px ${glowSpread}px rgba(0, 255, 136, ${0.18 * influence})`;
            cell.style.borderColor = `rgba(0, 255, 136, ${0.08 + 0.5 * influence})`;
            cell.style.transform = `scale(${1 + 0.018 * influence})`;
        } else {
            cell.style.boxShadow = '';
            cell.style.borderColor = '';
            cell.style.transform = '';
        }
    };

    // Update grid style when only mouse is active (no wave animation running)
    const updateGridWithMouseOnly = () => {
        if (!containerRef.current) return;
        const { cellSize, gap } = grid;
        const { ox, oy } = getGridOffset();
        const maxDist = 240;

        cellsRef.current.forEach((cell) => {
            if (!cell) return;

            if (!mouseState.current.active) {
                applyCellStyle(cell, 0);
                return;
            }

            const r = parseInt(cell.getAttribute('data-row') || '0', 10);
            const c = parseInt(cell.getAttribute('data-col') || '0', 10);
            const { cx, cy } = getCellCenter(r, c);

            const gmx = mouseState.current.x - ox;
            const gmy = mouseState.current.y - oy;

            const dx = gmx - cx;
            const dy = gmy - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let mouseInfluence = Math.max(0, 1 - dist / maxDist);
            mouseInfluence = Math.pow(mouseInfluence, 2.2);

            applyCellStyle(cell, mouseInfluence);
        });
    };

    // Frame-by-frame animation loop combining wave and mouse positions
    const animateWave = (now: number) => {
        if (!waveState.current.active || !containerRef.current) return;

        const { cols, rows, cellSize, gap } = grid;
        const step = cellSize + gap;
        const gridWidth = cols * step - gap;
        const gridHeight = rows * step - gap;
        const { ox, oy } = getGridOffset();

        const elapsed = now - waveState.current.startTime;
        const progress = Math.min(elapsed / 800, 1);
        const maxRadius = Math.max(gridWidth, gridHeight) * 0.9;
        const currentRadius = maxRadius * progress;
        const waveWidth = 160;

        cellsRef.current.forEach((cell) => {
            if (!cell) return;

            const r = parseInt(cell.getAttribute('data-row') || '0', 10);
            const c = parseInt(cell.getAttribute('data-col') || '0', 10);
            const { cx, cy } = getCellCenter(r, c);

            // Mouse influence
            let mouseInfluence = 0;
            if (mouseState.current.active) {
                const gmx = mouseState.current.x - ox;
                const gmy = mouseState.current.y - oy;
                const dx = gmx - cx;
                const dy = gmy - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                mouseInfluence = Math.max(0, 1 - dist / 240);
                mouseInfluence = Math.pow(mouseInfluence, 2.2);
            }

            // Wave influence
            const wdx = waveState.current.centerX - cx;
            const wdy = waveState.current.centerY - cy;
            const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
            const distFromWave = Math.abs(wdist - currentRadius);
            let waveInfluence = Math.max(0, 1 - distFromWave / waveWidth);
            waveInfluence = Math.pow(waveInfluence, 2) * (1 - progress);

            const totalInfluence = Math.min(1, Math.max(mouseInfluence, waveInfluence * 1.5));
            applyCellStyle(cell, totalInfluence);
        });

        if (progress < 1) {
            requestAnimationFrame(animateWave);
        } else {
            waveState.current.active = false;
            updateGridWithMouseOnly();
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        mouseState.current.x = mx;
        mouseState.current.y = my;

        if (!waveState.current.active) {
            updateGridWithMouseOnly();
        }
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        mouseState.current.active = true;
        mouseState.current.x = mx;
        mouseState.current.y = my;

        // Trigger wake-up wave
        const { ox, oy } = getGridOffset();
        waveState.current.active = true;
        waveState.current.startTime = performance.now();
        waveState.current.centerX = mx - ox;
        waveState.current.centerY = my - oy;

        requestAnimationFrame(animateWave);
    };

    const handleMouseLeave = () => {
        mouseState.current.active = false;

        if (!waveState.current.active) {
            updateGridWithMouseOnly();
        }
    };

    const { cols, rows, cellSize, gap } = grid;
    const step = cellSize + gap;
    const gridWidth = cols * step - gap;
    const gridHeight = rows * step - gap;

    return (
        <footer 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative py-12 md:py-16 px-6 md:px-12 overflow-hidden select-none"
            style={{ background: 'transparent' }}
        >
            {/* Embedded CSS for idle floating pulse */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes tileIdlePulse {
                    0%, 100% {
                        border-color: rgba(0, 255, 136, 0.08);
                        box-shadow: 0 0 4px 1px rgba(0, 255, 136, 0.0);
                    }
                    50% {
                        border-color: rgba(0, 255, 136, 0.18);
                        box-shadow: 0 0 8px 2px rgba(0, 255, 136, 0.05);
                    }
                }
                .tile-idle-pulse {
                    animation: tileIdlePulse var(--pulse-dur, 8s) ease-in-out infinite;
                    animation-delay: var(--pulse-del, 0s);
                }
            `}} />

            {/* Layer 1: Preserved centered logo watermark */}
            <div 
                className="absolute inset-0 opacity-[0.12] scale-[1.5] md:scale-[2] bg-no-repeat bg-contain bg-center pointer-events-none z-0" 
                style={{ backgroundImage: "url('/logo.png')" }} 
            />

            {/* Layer 2: 3D tile grid */}
            <div 
                className="absolute pointer-events-none z-10"
                style={{
                    width: gridWidth > 0 ? gridWidth : '100%',
                    height: gridHeight > 0 ? gridHeight : '100%',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
                    gap: `${gap}px`,
                }}
            >
                {Array.from({ length: totalCells }).map((_, idx) => {
                    const r = Math.floor(idx / (cols || 1));
                    const c = idx % (cols || 1);
                    
                    const pulseDel = `${(Math.random() * -14).toFixed(2)}s`;
                    const pulseDur = `${(6 + Math.random() * 6).toFixed(2)}s`;
                    
                    return (
                        <div
                            key={idx}
                            ref={(el) => { if (el) cellsRef.current[idx] = el; }}
                            data-row={r}
                            data-col={c}
                            className="tile-idle-pulse transform-gpu"
                            style={{
                                '--pulse-del': pulseDel,
                                '--pulse-dur': pulseDur,
                                width: cellSize,
                                height: cellSize,
                                borderRadius: '10px',
                                background: 'transparent',
                                border: '1px solid rgba(0, 255, 136, 0.08)',
                                transition: 'box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease',
                            } as React.CSSProperties}
                        />
                    );
                })}
            </div>

            {/* Layer 4: Footer content */}
            <div className="max-w-6xl mx-auto relative z-30 pointer-events-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 text-center md:text-left">
                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4 flex flex-col items-center md:items-start relative">
                        <div className="font-display text-2xl font-bold tracking-widest text-white">ARCHIVIST</div>
                        <p className="font-serif text-sm leading-relaxed max-w-sm mx-auto md:mx-0 text-zinc-400">
                            A digital sanctuary for thoughtful work and enduring ideas.
                            Crafted with intention, preserved with care.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-500">Navigate</h4>
                        <ul className="space-y-3 font-serif text-sm flex flex-col items-center md:items-start tracking-wide text-zinc-400">
                            <li><Link to="/about" className="hover:text-green-400 transition-colors">About</Link></li>
                            <li><Link to="/projects" className="hover:text-green-400 transition-colors">Projects</Link></li>
                            <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4 flex flex-col items-center md:items-start">
                        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-zinc-500">Connect</h4>
                        <ul className="space-y-3 font-serif text-sm flex flex-col items-center md:items-start tracking-wide text-zinc-400">
                            <li><a href="https://github.com" className="hover:text-green-400 transition-colors">GitHub</a></li>
                            <li><a href="https://linkedin.com" className="hover:text-green-400 transition-colors">LinkedIn</a></li>
                            <li><a href="https://twitter.com" className="hover:text-green-400 transition-colors">Twitter</a></li>
                            <li><a href="mailto:hello@archivist.dev" className="hover:text-green-400 transition-colors">Email</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-center text-zinc-500">
                    <p className="font-serif text-xs">
                        © 2024 Archivist. All rights preserved.
                    </p>
                    <p className="font-serif text-xs italic">
                        "Knowledge, once recorded, becomes eternal."
                    </p>
                </div>
            </div>
        </footer>
    );
};
