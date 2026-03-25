import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  color: string;
  size: number;
}

export const SparkBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let sparks: Spark[] = [];
    
    const { customSettings } = config;
    const gravity = customSettings?.gravity ?? 0.1;
    const friction = customSettings?.friction ?? 0.98;
    const sparkSize = customSettings?.sparkSize ?? 2;
    const trailLength = customSettings?.trailLength ?? 0.1;
    const glowIntensity = customSettings?.glowIntensity ?? 1.0;
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    const createSpark = (x: number, y: number, isExplosion = false) => {
      const angle = Math.random() * Math.PI * 2;
      const force = isExplosion ? (Math.random() * 15 + 5) : (Math.random() * 5 + 2);
      const speed = force * config.speed;
      
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: (0.005 + Math.random() * 0.02),
        color: config.colors?.[Math.floor(Math.random() * (config.colors?.length || 1))] || (theme === 'dark' ? '#ffffff' : '#000000'),
        size: sparkSize * (0.5 + Math.random() * 1.5)
      };
    };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      sparks = Array.from({ length: config.density }, () => 
        createSpark(Math.random() * canvas.width, Math.random() * canvas.height)
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
      
      if (config.interactive && interactionMode === 'attach') {
        for (let i = 0; i < 2; i++) {
          sparks.push(createSpark(e.clientX, e.clientY));
        }
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (config.interactive) {
        for (let i = 0; i < 20; i++) {
          sparks.push(createSpark(e.clientX, e.clientY, true));
        }
      }
    };

    const draw = () => {
      // Create trail effect by drawing a semi-transparent rectangle
      ctx.fillStyle = theme === 'dark' ? `rgba(10, 10, 10, ${trailLength})` : `rgba(250, 250, 250, ${trailLength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = config.opacity;

      sparks.forEach((s, i) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * s.life;
        ctx.lineCap = 'round';
        
        // Add glow
        if (glowIntensity > 0) {
          ctx.shadowBlur = 10 * glowIntensity * s.life;
          ctx.shadowColor = s.color;
        }

        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
        ctx.stroke();

        // Reset shadow for next draws
        ctx.shadowBlur = 0;

        // Physics
        s.vx *= friction;
        s.vy *= friction;
        s.vy += gravity;

        // Mouse interaction: only in 'attach' mode or for explosions (handled in handleClick)
        // We remove the magnetic attraction in 'detach' mode as per user request
        
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        // Bounce off edges
        if (s.x < 0 || s.x > canvas.width) s.vx *= -0.8;
        if (s.y > canvas.height) {
          s.y = canvas.height;
          s.vy *= -0.5;
        }

        if (s.life <= 0) {
          if (sparks.length > config.density) {
            sparks.splice(i, 1);
          } else {
            const useMouse = config.interactive && interactionMode === 'attach' && mouseRef.current.active;
            const newX = useMouse ? mouseRef.current.x : Math.random() * canvas.width;
            const newY = useMouse ? mouseRef.current.y : Math.random() * canvas.height;
            sparks[i] = createSpark(newX, newY);
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleClick);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
