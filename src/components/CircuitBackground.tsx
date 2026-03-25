import React, { useEffect, useRef } from 'react';
import { BackgroundConfig } from '../types';

export const CircuitBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { customSettings } = config;
  const gridSize = customSettings?.gridSize ?? 50;
  const pulseSpeed = customSettings?.pulseSpeed ?? 2;
  const connectionType = customSettings?.connectionType || 'orthogonal';
  const nodeSize = customSettings?.nodeSize ?? 3;
  const showNodes = customSettings?.showNodes ?? true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: any[] = [];
    let pulses: any[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Create nodes on a grid
      nodes = [];
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);
      
      for (let i = 0; i < config.density; i++) {
        nodes.push({
          x: Math.floor(Math.random() * cols) * gridSize,
          y: Math.floor(Math.random() * rows) * gridSize,
          color: config.colors?.[i % (config.colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000')
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = config.opacity;

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return;
          const dx = Math.abs(node.x - other.x);
          const dy = Math.abs(node.y - other.y);
          
          if (dx + dy < gridSize * 3) {
            ctx.beginPath();
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 0.5;
            
            if (connectionType === 'orthogonal') {
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, node.y);
              ctx.lineTo(other.x, other.y);
            } else {
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(other.x, other.y);
            }
            ctx.stroke();

            // Add pulse occasionally
            if (Math.random() < 0.005 * config.speed) {
              pulses.push({
                start: node,
                end: other,
                progress: 0,
                color: node.color
              });
            }
          }
        });

        if (showNodes) {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw pulses
      pulses = pulses.filter(p => p.progress < 1);
      pulses.forEach(p => {
        p.progress += 0.01 * pulseSpeed;
        const x = p.start.x + (p.end.x - p.start.x) * p.progress;
        const y = p.start.y + (p.end.y - p.start.y) * p.progress;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow for pulse
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

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
