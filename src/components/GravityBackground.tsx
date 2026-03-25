import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Attractor {
  x: number;
  y: number;
  mass: number;
}

export const GravityBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const attractors: Attractor[] = [];

    const { customSettings } = config;
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      
      // Add a central attractor
      attractors[0] = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        mass: 5000 * config.speed
      };
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / (20000 / config.density));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          color: config.colors[Math.floor(Math.random() * config.colors.length)]
        });
      }
    };

    let time = 0;
    const draw = () => {
      time += 0.01 * config.speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        // Apply gravity from attractors
        attractors.forEach(a => {
          const dx = a.x - p.x;
          const dy = a.y - p.y;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          
          if (dist > 20) {
            const force = (a.mass * 0.2) / distSq;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        });

        // Apply gravity from mouse
        if (config.interactive) {
          let mx = mouseRef.current.x;
          let my = mouseRef.current.y;
          let active = mouseRef.current.active;

          if (interactionMode === 'detach') {
            mx = canvas.width / 2 + Math.sin(time * 0.5) * (canvas.width * 0.3);
            my = canvas.height / 2 + Math.cos(time * 0.7) * (canvas.height * 0.3);
            active = true;
          }

          if (active) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);
            
            if (dist > 20) {
              const force = (2000 * config.speed) / distSq;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }
        }

        // Apply friction/drag - more viscous
        p.vx *= 0.95;
        p.vy *= 0.95;

        // Update position - scaled by speed
        p.x += p.vx * config.speed;
        p.y += p.vy * config.speed;

        // Wrap around or bounce? Let's bounce with some energy loss
        if (p.x < 0) { p.x = 0; p.vx *= -0.5; }
        if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -0.5; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.5; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.5; }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = config.opacity;
        ctx.fill();
      });

      // Draw central attractor (subtle glow)
      const a = attractors[0];
      if (a) {
        const gradient = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, 50);
        gradient.addColorStop(0, theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 50, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
