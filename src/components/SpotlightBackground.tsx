import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const SpotlightBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const { customSettings } = config;
    const spotlightSize = customSettings?.spotlightSize ?? 600;
    const beamIntensity = customSettings?.beamIntensity ?? 0.6;
    const flicker = customSettings?.flicker ?? true;
    const showBeam = customSettings?.showBeam ?? true;
    const glowColor = customSettings?.glowColor ?? config.colors?.[1] ?? '#6366f1';
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const draw = () => {
      time += 0.01 * config.speed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let x = canvas.width / 2;
      let y = canvas.height / 2;

      if (config.interactive) {
        if (interactionMode === 'attach' && mouseRef.current.active) {
          x = mouseRef.current.x;
          y = mouseRef.current.y;
        } else if (interactionMode === 'detach') {
          x = canvas.width / 2 + Math.sin(time * 0.5) * (canvas.width * 0.3);
          y = canvas.height / 2 + Math.cos(time * 0.7) * (canvas.height * 0.3);
        }
      }

      // Base overlay (darkness)
      const overlayOpacity = theme === 'dark' ? 0.85 : 0.15;
      ctx.fillStyle = theme === 'dark' ? `rgba(0, 0, 0, ${overlayOpacity})` : `rgba(255, 255, 255, ${overlayOpacity})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Flicker effect
      let currentIntensity = beamIntensity;
      if (flicker) {
        currentIntensity *= (0.9 + Math.random() * 0.2);
        if (Math.random() > 0.98) currentIntensity *= 0.5; // Occasional dip
      }

      // Spotlight Glow
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, spotlightSize);
      const baseColor = config.colors?.[0] ?? '#ffffff';
      
      // Convert hex to rgba for gradient
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      ctx.globalCompositeOperation = theme === 'dark' ? 'screen' : 'multiply';
      
      gradient.addColorStop(0, hexToRgba(baseColor, currentIntensity * config.opacity));
      gradient.addColorStop(0.2, hexToRgba(glowColor, currentIntensity * 0.5 * config.opacity));
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Beam effect (volumetric light)
      if (showBeam) {
        ctx.beginPath();
        const beamWidth = spotlightSize * 0.4;
        const beamGradient = ctx.createLinearGradient(x, 0, x, y);
        beamGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        beamGradient.addColorStop(1, hexToRgba(baseColor, currentIntensity * 0.2 * config.opacity));
        
        ctx.fillStyle = beamGradient;
        ctx.moveTo(x - beamWidth, 0);
        ctx.lineTo(x + beamWidth, 0);
        ctx.lineTo(x + 20, y);
        ctx.lineTo(x - 20, y);
        ctx.fill();
      }

      // Add some "dust" particles in the spotlight
      if (config.density > 0) {
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < 20 * config.density; i++) {
          const px = (Math.sin(i + time) * 0.5 + 0.5) * canvas.width;
          const py = (Math.cos(i * 1.2 + time * 0.8) * 0.5 + 0.5) * canvas.height;
          
          const dx = px - x;
          const dy = py - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < spotlightSize) {
            const alpha = (1 - dist / spotlightSize) * 0.3 * currentIntensity;
            ctx.fillStyle = hexToRgba(baseColor, alpha);
            ctx.beginPath();
            ctx.arc(px, py, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.globalCompositeOperation = 'source-over';
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
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
