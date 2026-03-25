import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  generation: number;
  delay: number;
}

interface Point {
  x: number;
  y: number;
  cooldown: number;
}

export const RippleBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

    const { customSettings } = config;
    const interactionMode = customSettings?.interactionMode ?? 'attach';
    const maxRadiusBase = customSettings?.maxRadius ?? 200;
    const ringCount = customSettings?.ringCount ?? 3;
    const chainProbability = customSettings?.chainProbability ?? 0.05;
    const lineWidth = customSettings?.lineWidth ?? 1.5;
    const glow = customSettings?.glow ?? false;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let ripples: Ripple[] = [];
      let points: Point[] = [];
      const MAX_RIPPLES = 200;
      const MAX_GENERATIONS = 3;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initPoints();
      };

      const initPoints = () => {
        points = [];
        const count = Math.floor((canvas.width * canvas.height) / (150000 / config.density));
        for (let i = 0; i < count; i++) {
          points.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            cooldown: 0
          });
        }
      };

      const createWave = (x: number, y: number, generation: number = 1, color?: string) => {
        if (ripples.length > MAX_RIPPLES) return;
        if (generation > MAX_GENERATIONS) return;

        const baseColor = color || config.colors[Math.floor(Math.random() * config.colors.length)];
        const baseMaxRadius = (maxRadiusBase + Math.random() * 100) / (generation * 0.8);
        
        // Create concentric ripples for a "wave" effect
        for (let i = 0; i < ringCount; i++) {
          ripples.push({
            x,
            y,
            radius: 0,
            maxRadius: baseMaxRadius,
            opacity: 1 / generation,
            color: baseColor,
            generation,
            delay: i * (15 / config.speed)
          });
        }
      };

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw ripples
        ripples = ripples.filter(ripple => ripple.opacity > 0.01 && ripple.radius < ripple.maxRadius);

        ripples.forEach(ripple => {
          if (ripple.delay > 0) {
            ripple.delay--;
            return;
          }

          ripple.radius += 1.5 * config.speed;
          // Fade out as it reaches max radius
          const lifeProgress = ripple.radius / ripple.maxRadius;
          const currentOpacity = (1 - lifeProgress) * ripple.opacity;

          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = ripple.color;
          ctx.globalAlpha = currentOpacity * config.opacity;
          ctx.lineWidth = lineWidth;
          
          if (glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = ripple.color;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.stroke();

          // Check for point activation - only if not at max generation
          if (ripple.generation < MAX_GENERATIONS) {
            points.forEach(point => {
              if (point.cooldown > 0) {
                point.cooldown--;
                return;
              }

              const dx = point.x - ripple.x;
              const dy = point.y - ripple.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              // If ripple edge hits the point (with some tolerance)
              if (Math.abs(distance - ripple.radius) < 2 && Math.random() < chainProbability / ripple.generation) {
                createWave(point.x, point.y, ripple.generation + 1, ripple.color);
                point.cooldown = 200; // Long cooldown to prevent feedback loops
              }
            });
          }
        });

        // Draw points (subtle)
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
          ctx.fill();
        });

        // Occasional random drop if quiet
        if (ripples.length < 3 && Math.random() < 0.005) {
          createWave(Math.random() * canvas.width, Math.random() * canvas.height, 1);
        }

        // Detach mode: randomly add ripples
        if (interactionMode === 'detach' && Math.random() < 0.02 && ripples.length < 10) {
          createWave(Math.random() * canvas.width, Math.random() * canvas.height, 1);
        }

        animationFrameId = requestAnimationFrame(draw);
      };

      window.addEventListener('resize', resize);
      resize();
      draw();

      const handleClick = (e: MouseEvent) => {
        if (config.interactive && interactionMode === 'attach') {
          createWave(e.clientX, e.clientY, 1);
        }
      };

      window.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('click', handleClick);
        cancelAnimationFrame(animationFrameId);
      };
    }, [config, theme, interactionMode]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
