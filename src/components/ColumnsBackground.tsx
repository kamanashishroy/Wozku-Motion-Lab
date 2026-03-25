import React, { useState, useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const ColumnsBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [autoX, setAutoX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { colors, customSettings } = config;
  const glowWidth = customSettings?.glowWidth ?? 10;
  const showBorders = customSettings?.showBorders ?? true;
  const scanDirection = customSettings?.scanDirection || 'down';
  const interactionMode = customSettings?.interactionMode || 'attach';

  useEffect(() => {
    if (interactionMode === 'detach') {
      let angle = 0;
      const interval = setInterval(() => {
        angle += 0.02 * config.speed;
        setAutoX(50 + Math.sin(angle) * 40);
      }, 16);
      return () => clearInterval(interval);
    }

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
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactionMode, config.speed]);

  const columnCount = Math.floor(config.density / 2);
  const columns = Array.from({ length: columnCount });
  const defaultColor = theme === 'dark' ? '#ffffff' : '#000000';
  const gridLineColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const getScanAnimation = (index: number) => {
    switch (scanDirection) {
      case 'up': return ['100%', '-50%'];
      case 'random': return Math.random() > 0.5 ? ['-50%', '100%'] : ['100%', '-50%'];
      default: return ['-50%', '100%'];
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: config.opacity }}
    >
      <div 
        className={cn(
          "flex w-full h-full",
          showBorders ? "gap-px" : "gap-0"
        )} 
        style={{ backgroundColor: showBorders ? gridLineColor : 'transparent' }}
      >
        {columns.map((_, i) => {
          const columnWidth = 100 / columnCount;
          const columnX = (i * columnWidth) + (columnWidth / 2);
          const mouseXPercent = interactionMode === 'detach' 
            ? autoX 
            : (mouse.x / (containerRef.current?.clientWidth || 1)) * 100;
          const dist = Math.abs(columnX - mouseXPercent);
          const isActive = config.interactive && dist < glowWidth;

          return (
            <div key={i} className="flex-1 relative overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: isActive 
                    ? `linear-gradient(to bottom, rgba(0,0,0,0), ${colors?.[1] || colors?.[0] || defaultColor}40, rgba(0,0,0,0))`
                    : `linear-gradient(to bottom, rgba(0,0,0,0), ${colors?.[i % (colors?.length || 1)] || defaultColor}10, rgba(0,0,0,0))`,
                  opacity: isActive ? 1 : 0.3,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              />
              <motion.div
                className={`absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent ${theme === 'dark' ? 'via-white/5' : 'via-black/5'} to-transparent`}
                animate={{
                  top: getScanAnimation(i),
                }}
                transition={{
                  duration: (5 + Math.random() * 5) / config.speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
