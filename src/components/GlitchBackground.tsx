import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const GlitchBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const glitchFrequency = customSettings?.glitchFrequency ?? 0.1;
  const scanlineIntensity = customSettings?.scanlineIntensity ?? 0.1;
  const rgbShift = customSettings?.rgbShift ?? 2;
  const distortion = customSettings?.distortion ?? 5;
  const noiseLevel = customSettings?.noiseLevel ?? 0.05;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;

      // Draw base noise
      if (noiseLevel > 0) {
        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.fillStyle = theme === 'dark' ? `rgba(255, 255, 255, ${noiseLevel})` : `rgba(0, 0, 0, ${noiseLevel})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw scanlines
      if (scanlineIntensity > 0) {
        ctx.strokeStyle = theme === 'dark' ? `rgba(255, 255, 255, ${scanlineIntensity})` : `rgba(0, 0, 0, ${scanlineIntensity})`;
        ctx.lineWidth = 1;
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // Random Glitch Blocks
      if (Math.random() < glitchFrequency) {
        const glitchCount = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < glitchCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const w = Math.random() * 300 * config.speed;
          const h = Math.random() * 40 * config.speed;
          
          // RGB Shift effect
          if (rgbShift > 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(x - rgbShift, y, w, h);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            ctx.fillRect(x + rgbShift, y, w, h);
          }

          ctx.fillStyle = config.colors?.[i % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000');
          ctx.fillRect(x, y, w, h);
        }
      }

      // Horizontal Distortion Lines
      for (let i = 0; i < config.density; i++) {
        const x = (Math.random() * canvas.width + Math.sin(time + i) * distortion) % canvas.width;
        const y = Math.random() * canvas.height;
        const w = Math.random() * 150;
        const h = 1;
        
        ctx.fillStyle = config.colors?.[i % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000');
        ctx.fillRect(x, y, w, h);
      }

      time += 0.05 * config.speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, [config, theme, glitchFrequency, scanlineIntensity, rgbShift, distortion, noiseLevel]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
