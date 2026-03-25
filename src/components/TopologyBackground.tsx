import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const TopologyBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

    const { customSettings } = config;
    const noiseScale = customSettings?.noiseScale ?? 0.002;
    const lineSpacing = customSettings?.lineSpacing ?? 30;
    const lineWidth = customSettings?.lineWidth ?? 1;
    const complexity = customSettings?.complexity ?? 15;
    const interactionRadius = customSettings?.interactionRadius ?? 200;
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let time = 0;
      let mouse = { x: 0, y: 0 };

      const init = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      // Simple noise approximation using multiple sine waves
      const getNoise = (x: number, y: number, t: number) => {
        let val = Math.sin(x * noiseScale + t) * Math.cos(y * noiseScale + t);
        val += Math.sin(x * noiseScale * 2.1 + t * 1.2) * Math.cos(y * noiseScale * 1.8 + t * 0.8) * 0.5;
        val += Math.sin(x * noiseScale * 4.3 + t * 0.5) * Math.cos(y * noiseScale * 3.7 + t * 1.5) * 0.25;
        
        if (config.interactive) {
          let mx = mouse.x;
          let my = mouse.y;

          if (interactionMode === 'detach') {
            mx = canvas.width / 2 + Math.sin(t * 0.5) * (canvas.width * 0.3);
            my = canvas.height / 2 + Math.cos(t * 0.7) * (canvas.height * 0.3);
          }

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < interactionRadius) {
            const force = (1 - dist / interactionRadius) * 0.5;
            val += force;
          }
        }
        
        return val;
      };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;
      ctx.lineWidth = lineWidth;

      const step = 20; // Resolution of the grid for drawing lines
      const cols = Math.ceil(canvas.width / step);
      const rows = Math.ceil(canvas.height / step);

      // Draw contour lines
      for (let level = 0; level < complexity; level++) {
        const targetVal = (level / complexity) * 2 - 1; // Map level to noise range [-1, 1]
        ctx.beginPath();
        ctx.strokeStyle = config.colors?.[level % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000');

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const px = x * step;
            const py = y * step;
            
            const v1 = getNoise(px, py, time);
            const v2 = getNoise(px + step, py, time);
            const v3 = getNoise(px, py + step, time);
            
            // Simple marching squares approximation for contour lines
            if ((v1 > targetVal && v2 <= targetVal) || (v1 <= targetVal && v2 > targetVal)) {
              const t = (targetVal - v1) / (v2 - v1);
              ctx.moveTo(px + step * t, py);
              ctx.lineTo(px + step * t, py + 2); // Small segment
            }
            if ((v1 > targetVal && v3 <= targetVal) || (v1 <= targetVal && v3 > targetVal)) {
              const t = (targetVal - v1) / (v3 - v1);
              ctx.moveTo(px, py + step * t);
              ctx.lineTo(px + 2, py + step * t); // Small segment
            }
          }
        }
        ctx.stroke();
      }

      time += 0.01 * config.speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, theme, noiseScale, lineSpacing, lineWidth, complexity, interactionRadius]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
