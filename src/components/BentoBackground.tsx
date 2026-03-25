import React, { useEffect, useRef, useState } from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';

export const BentoBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(0);

  const { customSettings } = config;
  const gap = customSettings?.gap ?? 1;
  const radius = customSettings?.radius ?? 0;
  const pattern = customSettings?.pattern || 'standard';
  const spotlightSize = customSettings?.spotlightSize ?? 600;
  const interactionMode = customSettings?.interactionMode ?? 'attach';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouse({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = (t: number) => {
      setTime(t / 1000);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const gridSize = Math.floor(config.density / 2);
  const cells = Array.from({ length: gridSize * gridSize });

  const alignment = config.alignment || 'center';
  const getAutoX = () => {
    const base = Math.sin(time * 0.2 * config.speed) * 20 + 50;
    if (alignment === 'left') return base * 0.5;
    if (alignment === 'right') return 50 + base * 0.5;
    return base;
  };
  const autoY = Math.cos(time * 0.15 * config.speed) * 20 + 50;

  const getSpotlightPos = () => {
    if (!config.interactive) return { x: `${getAutoX()}%`, y: `${autoY}%` };
    if (interactionMode === 'attach') return { x: `${mouse.x}px`, y: `${mouse.y}px` };
    
    // Detached mode: floating around
    const dx = Math.sin(time * 0.5 * config.speed) * 30 + 50;
    const dy = Math.cos(time * 0.7 * config.speed) * 30 + 50;
    return { x: `${dx}%`, y: `${dy}%` };
  };

  const pos = getSpotlightPos();
  const defaultColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridLineColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none p-4"
      style={{ opacity: config.opacity }}
    >
      <div 
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: `${gap}px`,
          backgroundColor: pattern === 'standard' ? gridLineColor : 'transparent'
        }}
      >
        {cells.map((_, i) => {
          const isLarge = pattern === 'masonry' && (i % 7 === 0 || i % 11 === 0);
          return (
            <div 
              key={i} 
              className="relative overflow-hidden"
              style={{
                borderRadius: `${radius}px`,
                gridColumn: isLarge ? 'span 2' : 'span 1',
                gridRow: isLarge ? 'span 2' : 'span 1',
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: `radial-gradient(${spotlightSize}px circle at ${pos.x} ${pos.y}, ${config.colors?.[1] || config.colors?.[0] || defaultColor}33, rgba(0,0,0,0) 40%)`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <div className={`absolute inset-0 border ${theme === 'dark' ? 'border-white/5' : 'border-black/5'}`} style={{ borderRadius: `${radius}px` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
