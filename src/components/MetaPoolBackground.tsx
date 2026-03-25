import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  targetRadius: number;
  color: string;
  secondaryColor: string;
  absorptionCount: number;
  wobble: number;
  wobbleSpeed: number;
}

export const MetaPoolBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const nextIdRef = useRef(0);

    const { customSettings } = config;
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      let animationFrameId: number;

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initBalls();
      };

      const createBall = (x: number, y: number, radius: number, vx?: number, vy?: number, color?: string): Ball => {
        const c = color || config.colors[Math.floor(Math.random() * config.colors.length)];
        return {
          id: nextIdRef.current++,
          x,
          y,
          vx: vx ?? (Math.random() - 0.5) * 4 * config.speed,
          vy: vy ?? (Math.random() - 0.5) * 4 * config.speed,
          radius,
          targetRadius: radius,
          color: c,
          secondaryColor: c,
          absorptionCount: 0,
          wobble: 0,
          wobbleSpeed: 0.1 + Math.random() * 0.1
        };
      };

      const initBalls = () => {
        ballsRef.current = [];
        const count = Math.max(5, Math.floor(config.density / 2));
        for (let i = 0; i < count; i++) {
          ballsRef.current.push(createBall(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20 + Math.random() * 10
          ));
        }
      };

      const blendColors = (c1: string, c2: string): string => {
        // Simple hex blend
        const parse = (c: string) => {
          const r = parseInt(c.slice(1, 3), 16);
          const g = parseInt(c.slice(3, 5), 16);
          const b = parseInt(c.slice(5, 7), 16);
          return [r, g, b];
        };
        const [r1, g1, b1] = parse(c1);
        const [r2, g2, b2] = parse(c2);
        const r = Math.floor((r1 + r2) / 2).toString(16).padStart(2, '0');
        const g = Math.floor((g1 + g2) / 2).toString(16).padStart(2, '0');
        const b = Math.floor((b1 + b2) / 2).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      };

      const splitBall = (ball: Ball) => {
        const count = 4;
        const newRadius = ball.radius / 2;
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const vx = Math.cos(angle) * 3 * config.speed;
          const vy = Math.sin(angle) * 3 * config.speed;
          ballsRef.current.push(createBall(
            ball.x + Math.cos(angle) * ball.radius,
            ball.y + Math.sin(angle) * ball.radius,
            newRadius,
            vx,
            vy,
            ball.color
          ));
        }
      };

      const update = () => {
        const balls = ballsRef.current;

        for (let i = 0; i < balls.length; i++) {
          const b1 = balls[i];
          b1.x += b1.vx;
          b1.y += b1.vy;

          // Bounce off walls
          if (b1.x < b1.radius) { b1.x = b1.radius; b1.vx *= -1; }
          if (b1.x > canvas.width - b1.radius) { b1.x = canvas.width - b1.radius; b1.vx *= -1; }
          if (b1.y < b1.radius) { b1.y = b1.radius; b1.vy *= -1; }
          if (b1.y > canvas.height - b1.radius) { b1.y = canvas.height - b1.radius; b1.vy *= -1; }

          // Smooth radius transition
          b1.radius += (b1.targetRadius - b1.radius) * 0.1;
          
          // Wobble decay
          b1.wobble *= 0.95;

          // Collision detection
          for (let j = i + 1; j < balls.length; j++) {
            const b2 = balls[j];
            const dx = b2.x - b1.x;
            const dy = b2.y - b1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < b1.radius + b2.radius) {
              // Absorption logic
              const bigger = b1.radius >= b2.radius ? b1 : b2;
              const smaller = b1.radius >= b2.radius ? b2 : b1;

              // Merge smaller into bigger
              bigger.secondaryColor = smaller.color;
              bigger.color = blendColors(bigger.color, smaller.color);
              bigger.targetRadius = Math.sqrt(bigger.radius * bigger.radius + smaller.radius * smaller.radius);
              bigger.absorptionCount += 1 + smaller.absorptionCount;
              bigger.wobble = 15; // Start wobble
              
              // Remove smaller
              balls.splice(balls.indexOf(smaller), 1);
              
              // Check for breakdown
              if (bigger.absorptionCount >= 4) {
                splitBall(bigger);
                balls.splice(balls.indexOf(bigger), 1);
              }
              
              break; // Exit inner loop as b1 might be gone or changed
            }
          }
        }
      };

      const draw = () => {
        // Use a temporary canvas for the metaball effect (blur + threshold)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        update();

        // Draw balls with blur for metaball effect
        // To get the "liquid" look, we draw them with a heavy blur and then threshold
        // But for performance and specific "gradient" request, let's draw them as blobs
        ballsRef.current.forEach(ball => {
          const time = Date.now() * 0.005;
          const wobbleX = Math.sin(time * ball.wobbleSpeed) * ball.wobble;
          const wobbleY = Math.cos(time * ball.wobbleSpeed) * ball.wobble;

          const gradient = ctx.createRadialGradient(
            ball.x - ball.radius * 0.3, 
            ball.y - ball.radius * 0.3, 
            ball.radius * 0.1,
            ball.x, 
            ball.y, 
            ball.radius
          );
          gradient.addColorStop(0, ball.color);
          gradient.addColorStop(1, ball.secondaryColor);

          ctx.beginPath();
          // Draw a slightly wobbly circle
          for (let a = 0; a < Math.PI * 2; a += 0.2) {
            const r = ball.radius + Math.sin(a * 3 + time) * (ball.wobble * 0.5);
            const x = ball.x + Math.cos(a) * r;
            const y = ball.y + Math.sin(a) * r;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          
          ctx.fillStyle = gradient;
          ctx.globalAlpha = config.opacity;
          ctx.shadowBlur = 20;
          ctx.shadowColor = ball.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Optional: Randomly add a new small ball if count is low
        if (ballsRef.current.length < 3 && Math.random() < 0.01) {
          ballsRef.current.push(createBall(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            15 + Math.random() * 10
          ));
        }

        // Detach mode: randomly add balls
        if (interactionMode === 'detach' && Math.random() < 0.005 && ballsRef.current.length < 10) {
          ballsRef.current.push(createBall(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20 + Math.random() * 10
          ));
        }

        animationFrameId = requestAnimationFrame(draw);
      };

      const handleClick = (e: MouseEvent) => {
        if (config.interactive && interactionMode === 'attach') {
          ballsRef.current.push(createBall(e.clientX, e.clientY, 25));
        }
      };

    window.addEventListener('resize', resize);
    window.addEventListener('click', handleClick);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
