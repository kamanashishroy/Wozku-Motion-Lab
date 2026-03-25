import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const BeamsBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const beamWidth = customSettings?.beamWidth ?? 2;
  const beamLength = customSettings?.beamLength ?? 600;
  const glowIntensity = customSettings?.glowIntensity ?? 0.5;
  const interactionMode = customSettings?.interactionMode || 'attach';
  const spread = customSettings?.spread ?? 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let beams: any[] = [];
    let mouse = { x: 0, y: 0 };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      beams = Array.from({ length: config.density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: beamLength * (0.5 + Math.random() * 0.5),
        width: beamWidth * (0.5 + Math.random() * 1.5),
        speed: (0.005 + Math.random() * 0.01) * config.speed,
        color: config.colors?.[Math.floor(Math.random() * (config.colors?.length || 1))] || (theme === 'dark' ? '#ffffff' : '#000000')
      }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;

      const alignment = config.alignment || 'center';
      let centerX = canvas.width / 2;
      if (alignment === 'left') centerX = canvas.width * 0.25;
      if (alignment === 'right') centerX = canvas.width * 0.75;

      if (config.interactive && interactionMode === 'attach') {
        centerX = mouse.x;
      }
      const centerY = (config.interactive && interactionMode === 'attach') ? mouse.y : canvas.height / 2;

      beams.forEach((beam) => {
        const originX = interactionMode === 'attach' ? centerX : beam.x;
        const originY = interactionMode === 'attach' ? centerY : beam.y;

        let currentAngle = beam.angle;
        if (config.interactive && interactionMode === 'detach') {
          const dx = mouse.x - originX;
          const dy = mouse.y - originY;
          const targetAngle = Math.atan2(dy, dx);
          // Smoothly interpolate towards mouse angle
          const diff = targetAngle - currentAngle;
          currentAngle += Math.sin(diff) * 0.05;
        }

        ctx.save();
        
        // Glow effect
        if (glowIntensity > 0) {
          ctx.shadowBlur = 15 * glowIntensity;
          ctx.shadowColor = beam.color;
        }

        ctx.beginPath();
        const endX = originX + Math.cos(currentAngle) * beam.length;
        const endY = originY + Math.sin(currentAngle) * beam.length;
        
        const gradient = ctx.createLinearGradient(originX, originY, endX, endY);
        gradient.addColorStop(0, beam.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = beam.width;
        ctx.moveTo(originX, originY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        ctx.restore();

        beam.angle += beam.speed;
        
        // If detached, move the origins slightly
        if (interactionMode === 'detach') {
          beam.x += Math.cos(beam.angle) * config.speed;
          beam.y += Math.sin(beam.angle) * config.speed;
          
          // Wrap around screen
          if (beam.x < -beam.length) beam.x = canvas.width + beam.length;
          if (beam.x > canvas.width + beam.length) beam.x = -beam.length;
          if (beam.y < -beam.length) beam.y = canvas.height + beam.length;
          if (beam.y > canvas.height + beam.length) beam.y = -beam.length;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, theme, beamWidth, beamLength, glowIntensity, interactionMode, spread]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
