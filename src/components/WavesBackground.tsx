import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const WavesBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const amplitude = customSettings?.amplitude ?? 100;
  const frequency = customSettings?.frequency ?? 0.005;
  const complexity = customSettings?.complexity ?? 3;
  const fillMode = customSettings?.fillMode || 'outline';
  const mirror = customSettings?.mirror ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;

      for (let i = 0; i < complexity; i++) {
        const color = config.colors?.[i % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000');
        const waveAmplitude = amplitude * (1 - i * 0.2);
        const waveFrequency = frequency * (1 + i * 0.1);
        const waveOffset = offset + i * Math.PI / 2;

        const drawWave = (yOffset: number, isMirrored: boolean) => {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = color;
          ctx.fillStyle = color;

          const startY = yOffset;
          ctx.moveTo(0, startY);

          for (let x = 0; x <= canvas.width; x += 5) {
            const y = startY + 
                      Math.sin(x * waveFrequency + waveOffset) * waveAmplitude * (isMirrored ? -1 : 1);
            ctx.lineTo(x, y);
          }

          if (fillMode === 'solid') {
            ctx.lineTo(canvas.width, isMirrored ? 0 : canvas.height);
            ctx.lineTo(0, isMirrored ? 0 : canvas.height);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.stroke();
          }
        };

        drawWave(canvas.height / 2, false);
        if (mirror) {
          drawWave(canvas.height / 2, true);
        }
      }

      offset += 0.02 * config.speed;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
