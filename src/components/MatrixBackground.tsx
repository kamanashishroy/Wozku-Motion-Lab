import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const MatrixBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const fontSize = customSettings?.fontSize ?? 16;
  const trailLength = customSettings?.trailLength ?? 0.15;
  const glow = customSettings?.glow ?? true;
  const charSet = customSettings?.charSet || 'katakana';
  const rainbow = customSettings?.rainbow ?? false;

  const getChars = () => {
    switch (charSet) {
      case 'katakana':
        return "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
      case 'binary':
        return "01";
      case 'alphanumeric':
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      case 'custom':
        return "LUMINA-MOTION-LAB-ENGINE-2024";
      default:
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let columns: number;
    let drops: number[] = [];
    const chars = getChars();

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    let lastTime = 0;
    const draw = (time: number) => {
      const deltaTime = time - lastTime;
      const interval = 50 / config.speed;

      if (deltaTime > interval) {
        ctx.fillStyle = theme === 'dark' 
          ? `rgba(5, 5, 5, ${trailLength})` 
          : `rgba(245, 245, 245, ${trailLength})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${fontSize}px monospace`;
        if (glow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = config.colors?.[0] || (theme === 'dark' ? '#ffffff' : '#000000');
        } else {
          ctx.shadowBlur = 0;
        }

        for (let i = 0; i < drops.length; i++) {
          if (rainbow) {
            ctx.fillStyle = `hsl(${(time / 10 + i * 10) % 360}, 70%, 50%)`;
          } else {
            ctx.fillStyle = config.colors?.[i % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000');
          }

          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        lastTime = time;
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
  }, [config, theme, charSet, fontSize, trailLength, glow, rainbow]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: config.opacity }} />;
};
