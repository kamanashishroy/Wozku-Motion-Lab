import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const ParticleBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { customSettings } = config;
  const connectionDistance = customSettings?.connectionDistance ?? 100;
  const particleSize = customSettings?.particleSize ?? 2;
  const lineWidth = customSettings?.lineWidth ?? 0.5;
  const interactionRadius = customSettings?.interactionRadius ?? 150;
  const interactionMode = customSettings?.interactionMode || 'repel';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * particleSize + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        if (config.interactive) {
          if (interactionMode === 'detach') return;
          
          const dx = mouseRef.current.x - this.x;
          const dy = mouseRef.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < interactionRadius) {
            const force = (interactionRadius - dist) / interactionRadius;
            if (interactionMode === 'repel') {
              this.x -= dx * force * 0.1;
              this.y -= dy * force * 0.1;
            } else if (interactionMode === 'attract') {
              this.x += dx * force * 0.1;
              this.y += dy * force * 0.1;
            }
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = config.colors?.[Math.floor(Math.random() * (config.colors?.length || 1))] || (theme === 'dark' ? '#ffffff' : '#000000');
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: config.density * 2 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;

      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = config.colors?.[1] || config.colors?.[0] || (theme === 'dark' ? '#ffffff' : '#000000');
            ctx.lineWidth = lineWidth * (1 - dist / connectionDistance);
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
