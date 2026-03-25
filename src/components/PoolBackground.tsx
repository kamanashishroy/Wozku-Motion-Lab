import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const PoolBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const interactionMode = customSettings?.interactionMode ?? 'attach';
  const damping = customSettings?.damping ?? 0.98;
  const resolution = customSettings?.resolution ?? 10;
  const dropStrength = customSettings?.dropStrength ?? 20;
  const distortion = customSettings?.distortion ?? 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let gridW: number, gridH: number;
    let buffer1: Float32Array, buffer2: Float32Array;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gridW = Math.ceil(canvas.width / resolution) + 2;
      gridH = Math.ceil(canvas.height / resolution) + 2;
      buffer1 = new Float32Array(gridW * gridH);
      buffer2 = new Float32Array(gridW * gridH);
    };

    const drop = (x: number, y: number, radius: number, strength: number) => {
      const gx = Math.floor(x / resolution);
      const gy = Math.floor(y / resolution);
      
      for (let j = -radius; j <= radius; j++) {
        for (let i = -radius; i <= radius; i++) {
          const dist = Math.sqrt(i * i + j * j);
          if (dist < radius) {
            const idx = (gx + i) + (gy + j) * gridW;
            if (idx >= 0 && idx < buffer1.length) {
              buffer1[idx] += strength * (1 - dist / radius);
            }
          }
        }
      }
    };

    const update = () => {
      for (let y = 1; y < gridH - 1; y++) {
        for (let x = 1; x < gridW - 1; x++) {
          const i = x + y * gridW;
          buffer2[i] = (
            (buffer1[i - 1] + 
             buffer1[i + 1] + 
             buffer1[i - gridW] + 
             buffer1[i + gridW]) / 2 - buffer2[i]
          ) * damping;
        }
      }
      
      // Swap buffers
      const temp = buffer1;
      buffer1 = buffer2;
      buffer2 = temp;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      update();

      const color = config.colors[0] || '#0ea5e9';
      ctx.strokeStyle = color;
      ctx.globalAlpha = config.opacity;
      ctx.lineWidth = 1;

      // Draw grid lines distorted by water height
      // Horizontal lines
      for (let y = 1; y < gridH - 1; y += 2) {
        ctx.beginPath();
        for (let x = 1; x < gridW - 1; x++) {
          const i = x + y * gridW;
          const h = buffer1[i] * distortion;
          ctx.lineTo(x * resolution, y * resolution + h);
        }
        ctx.stroke();
      }

      // Vertical lines
      for (let x = 1; x < gridW - 1; x += 2) {
        ctx.beginPath();
        for (let y = 1; y < gridH - 1; y++) {
          const i = x + y * gridW;
          const h = buffer1[i] * distortion;
          ctx.lineTo(x * resolution + h * 0.5, y * resolution + h);
        }
        ctx.stroke();
      }

      // Random drops (Ambient)
      if (Math.random() < 0.02 * config.speed) {
        drop(Math.random() * canvas.width, Math.random() * canvas.height, 2, dropStrength * 2.5);
      }

      // Detach mode: random drops
      if (interactionMode === 'detach' && Math.random() < 0.05 * config.speed) {
        drop(Math.random() * canvas.width, Math.random() * canvas.height, 3, dropStrength);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (config.interactive && interactionMode === 'attach') {
        drop(e.clientX, e.clientY, 3, dropStrength);
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, theme, interactionMode, damping, resolution, dropStrength, distortion]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
