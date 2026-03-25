import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const PrismBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

    const { customSettings } = config;
    const shardType = customSettings?.shardType || 'triangles';
    const minSize = customSettings?.minSize ?? 50;
    const maxSize = customSettings?.maxSize ?? 150;
    const rotationSpeed = customSettings?.rotationSpeed ?? 1;
    const floatIntensity = customSettings?.floatIntensity ?? 0.5;
    const blurAmount = customSettings?.blurAmount ?? 0;
    const interactionMode = customSettings?.interactionMode ?? 'attach';

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let animationFrameId: number;
      let shards: any[] = [];
      let mouse = { x: 0, y: 0 };

      const init = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        shards = Array.from({ length: config.density }, () => ({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: minSize + Math.random() * (maxSize - minSize),
          angle: Math.random() * Math.PI * 2,
          spin: (0.002 + Math.random() * 0.005) * config.speed * rotationSpeed,
          floatOffset: Math.random() * Math.PI * 2,
          color: config.colors?.[Math.floor(Math.random() * (config.colors?.length || 1))] || (theme === 'dark' ? '#ffffff' : '#000000')
        }));
      };

      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      const drawShard = (size: number) => {
        if (shardType === 'triangles') {
          ctx.beginPath();
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          ctx.fill();
        } else if (shardType === 'squares') {
          ctx.fillRect(-size / 2, -size / 2, size, size);
        } else if (shardType === 'hexagons') {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = (size / 2) * Math.cos(angle);
            const y = (size / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }
      };

      const draw = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = config.opacity;
        
        if (blurAmount > 0) {
          ctx.filter = `blur(${blurAmount}px)`;
        } else {
          ctx.filter = 'none';
        }

        const t = time / 1000;

        shards.forEach(shard => {
          ctx.save();
          
          // Floating animation
          const floatY = Math.sin(t * config.speed + shard.floatOffset) * 20 * floatIntensity;
          const floatX = Math.cos(t * config.speed * 0.7 + shard.floatOffset) * 10 * floatIntensity;
          
          ctx.translate(shard.x + floatX, shard.y + floatY);
          ctx.rotate(shard.angle);

          if (config.interactive) {
            let mx = mouse.x;
            let my = mouse.y;

            if (interactionMode === 'detach') {
              mx = canvas.width / 2 + Math.sin(t * 0.5) * (canvas.width * 0.3);
              my = canvas.height / 2 + Math.cos(t * 0.7) * (canvas.height * 0.3);
            }

            const dx = mx - (shard.x + floatX);
            const dy = my - (shard.y + floatY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 300;
            if (dist < radius) {
              const force = (1 - dist / radius);
              shard.angle += 0.05 * force;
            }
          }

          ctx.fillStyle = shard.color;
          drawShard(shard.size);
          ctx.restore();

          shard.angle += shard.spin;
        });

        animationFrameId = requestAnimationFrame(draw);
      };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    draw(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [config, theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};
