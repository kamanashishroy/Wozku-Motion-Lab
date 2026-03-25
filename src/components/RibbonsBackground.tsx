import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const interpolateColors = (colors: string[], factor: number) => {
  if (colors.length === 0) return 'rgb(0,0,0)';
  if (colors.length === 1) return colors[0];
  
  const total = colors.length - 1;
  const scaledFactor = factor * total;
  const index = Math.floor(scaledFactor);
  const nextIndex = Math.min(index + 1, total);
  const localFactor = scaledFactor - index;
  
  const c1 = hexToRgb(colors[index]);
  const c2 = hexToRgb(colors[nextIndex]);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * localFactor);
  const g = Math.round(c1.g + (c2.g - c1.g) * localFactor);
  const b = Math.round(c1.b + (c2.b - c1.b) * localFactor);
  
  return `rgb(${r}, ${g}, ${b})`;
};

export const RibbonsBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const variationsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const style = config.customSettings?.style || 'smooth';
    const texture = config.customSettings?.texture || 'vertical';
    const variation = config.customSettings?.variation || 'uniform';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Initialize variations for 'variable' mode
      const count = Math.floor(config.density * 3) + 40;
      variationsRef.current = Array.from({ length: count }, () => Math.random());
    };

    const getWaveY = (y: number, freq: number, t: number, i: number, amp: number) => {
      if (style === 'angular') {
        // Triangle wave
        const period = 1 / freq;
        const phase = (y + t * 500 + i * 50) % period;
        const normalized = phase / period;
        const triangle = normalized < 0.5 ? normalized * 4 - 1 : 3 - normalized * 4;
        return triangle * amp;
      }
      // Sine wave
      return Math.sin(y * freq + t + i * 0.08) * amp;
    };

    const drawRibbons = (isVertical: boolean) => {
      const ribbonCount = Math.floor(config.density * (isVertical ? 3 : 2));
      const totalSize = isVertical ? canvas.width : canvas.height;
      const spacing = totalSize / (ribbonCount - 1);
      const baseAmplitude = 60;
      const frequency = 0.0015;
      const extraRibbons = 20;

      for (let i = -extraRibbons; i <= ribbonCount + extraRibbons; i++) {
        const posBase = i * spacing;
        const normalizedIndex = Math.max(0, Math.min(1, i / ribbonCount));
        const color = interpolateColors(config.colors, normalizedIndex);
        
        const v = variation === 'variable' ? (variationsRef.current[i + extraRibbons] || 0.5) : 0.5;
        const currentAmplitude = baseAmplitude * (0.5 + v);
        const currentWidth = spacing * (1.5 + v * 1.5);

        ctx.beginPath();
        const step = 10;
        const limit = isVertical ? canvas.height : canvas.width;
        
        for (let p = -20; p <= limit + 20; p += step) {
          const noise = getWaveY(p, frequency, time, i, currentAmplitude);
          const x = isVertical ? posBase + noise : p;
          const y = isVertical ? p : posBase + noise;
          
          if (p === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.lineWidth = currentWidth;
        ctx.strokeStyle = color;
        ctx.globalAlpha = config.opacity;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Shading line
        ctx.beginPath();
        for (let p = -20; p <= limit + 20; p += step) {
          const noise = getWaveY(p, frequency, time, i, currentAmplitude);
          const x = isVertical ? posBase + noise : p;
          const y = isVertical ? p : posBase + noise;
          if (p === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.lineWidth = currentWidth * 0.3;
        ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        ctx.stroke();
      }
    };

    const draw = () => {
      time += 0.005 * config.speed;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (texture === 'woven') {
        drawRibbons(false); // Horizontal
      }
      drawRibbons(true); // Vertical

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
