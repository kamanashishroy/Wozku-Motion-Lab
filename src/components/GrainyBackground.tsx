import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const GrainyBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const grainIntensity = customSettings?.grainIntensity ?? 0.5;
  const grainSize = customSettings?.grainSize ?? 1;
  const meshSpeed = customSettings?.meshSpeed ?? 0.5;
  const meshComplexity = customSettings?.meshComplexity ?? 4;
  const meshColors = customSettings?.meshColors || config.colors || ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let blobs: any[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      blobs = Array.from({ length: meshComplexity }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.max(canvas.width, canvas.height) * (0.5 + Math.random() * 0.5),
        color: meshColors[i % meshColors.length],
        vx: (Math.random() - 0.5) * 2 * meshSpeed,
        vy: (Math.random() - 0.5) * 2 * meshSpeed,
      }));
    };

    const draw = (time: number) => {
      const t = time / 1000;
      
      // 1. Draw Gradient Mesh
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      
      // Base background
      ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      blobs.forEach(blob => {
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update blob position
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < 0 || blob.x > canvas.width) blob.vx *= -1;
        if (blob.y < 0 || blob.y > canvas.height) blob.vy *= -1;
      });

      // 2. Overlay Grain Noise
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = config.opacity * grainIntensity;
      
      const alignment = config.alignment || 'center';
      const density = config.density * 20;

      const getXRange = () => {
        switch (alignment) {
          case 'left': return [0, canvas.width * 0.5];
          case 'right': return [canvas.width * 0.5, canvas.width];
          default: return [0, canvas.width];
        }
      };

      const xRange = getXRange();

      for (let i = 0; i < density; i++) {
        const x = Math.random() * (xRange[1] - xRange[0]) + xRange[0];
        const y = Math.random() * canvas.height;
        ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
        ctx.fillRect(x, y, grainSize, grainSize);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, [config, theme, grainIntensity, grainSize, meshSpeed, meshComplexity, meshColors]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
