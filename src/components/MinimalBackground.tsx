import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const MinimalBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const gridType = customSettings?.gridType || 'dots';
  const gridSpacing = customSettings?.gridSpacing ?? 40;
  const elementSize = customSettings?.elementSize ?? 1;
  const pulseIntensity = customSettings?.pulseIntensity ?? 0.5;
  const interactionMode = customSettings?.interactionMode || 'scale';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: 0, y: 0 };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;
      ctx.fillStyle = config.colors?.[0] || (theme === 'dark' ? '#ffffff' : '#000000');
      ctx.strokeStyle = config.colors?.[0] || (theme === 'dark' ? '#ffffff' : '#000000');

      const t = time / 1000;

      for (let x = gridSpacing / 2; x < canvas.width; x += gridSpacing) {
        for (let y = gridSpacing / 2; y < canvas.height; y += gridSpacing) {
          let currentSize = elementSize;
          let offsetX = 0;
          let offsetY = 0;
          
          const pulse = Math.sin(t * config.speed + (x + y) * 0.01) * pulseIntensity;
          currentSize += pulse;

          if (config.interactive) {
            let mx = mouse.x;
            let my = mouse.y;
            let active = true;

            if (interactionMode === 'detach') {
              active = false; // Detach means ignore mouse
            }

            if (active) {
              const dx = mx - x;
              const dy = my - y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const radius = 200;

              if (dist < radius) {
                const force = (1 - dist / radius);
                
                if (interactionMode === 'scale') {
                  currentSize += force * 5;
                } else if (interactionMode === 'repel') {
                  offsetX = -dx / dist * force * 20;
                  offsetY = -dy / dist * force * 20;
                } else if (interactionMode === 'attract') {
                  offsetX = dx / dist * force * 20;
                  offsetY = dy / dist * force * 20;
                }
              }
            }
          }

          const px = x + offsetX;
          const py = y + offsetY;

          ctx.beginPath();
          if (gridType === 'dots') {
            ctx.arc(px, py, Math.max(0.1, currentSize), 0, Math.PI * 2);
            ctx.fill();
          } else if (gridType === 'crosses') {
            const s = currentSize * 4;
            ctx.moveTo(px - s, py);
            ctx.lineTo(px + s, py);
            ctx.moveTo(px, py - s);
            ctx.lineTo(px, py + s);
            ctx.stroke();
          } else if (gridType === 'squares') {
            const s = currentSize * 2;
            ctx.fillRect(px - s, py - s, s * 2, s * 2);
          } else if (gridType === 'lines') {
            const s = currentSize * 10;
            ctx.moveTo(px - s, py);
            ctx.lineTo(px + s, py);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, theme, gridType, gridSpacing, elementSize, pulseIntensity, interactionMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
