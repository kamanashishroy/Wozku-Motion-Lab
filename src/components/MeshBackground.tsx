import React from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';

export const MeshBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const { colors, customSettings } = config;
  const blur = customSettings?.blur ?? 100;
  const grain = customSettings?.grain ?? false;
  const animationPath = customSettings?.animationPath || 'drift';
  const blendMode = customSettings?.blendMode || 'normal';
  const alignment = config.alignment || 'center';
  const defaultColor = theme === 'dark' ? '#ffffff' : '#000000';
  const c1 = colors?.[0] || defaultColor;
  const c2 = colors?.[1] || colors?.[0] || defaultColor;
  const c3 = colors?.[2] || colors?.[0] || defaultColor;
  const c4 = colors?.[3] || colors?.[1] || colors?.[0] || defaultColor;
  const c5 = colors?.[4] || colors?.[2] || colors?.[0] || defaultColor;

  const getX = (base: number) => {
    if (alignment === 'left') return base * 0.5;
    if (alignment === 'right') return 50 + base * 0.5;
    return base;
  };

  const animate = animationPath === 'orbit' 
    ? {
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }
    : {
        background: [
          `radial-gradient(at ${getX(0)}% 0%, ${c1} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(50)}% 0%, ${c2} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(100)}% 0%, ${c3} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(0)}% 50%, ${c4} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(100)}% 50%, ${c5} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(0)}% 100%, ${c1} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(50)}% 100%, ${c2} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(100)}% 100%, ${c3} 0px, rgba(0,0,0,0) 50%)`,
          `radial-gradient(at ${getX(100)}% 100%, ${c5} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(0)}% 0%, ${c4} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(50)}% 50%, ${c3} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(100)}% 0%, ${c2} 0px, rgba(0,0,0,0) 50%)`,
          `radial-gradient(at ${getX(50)}% 0%, ${c1} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(100)}% 50%, ${c3} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(0)}% 100%, ${c5} 0px, rgba(0,0,0,0) 50%),
           radial-gradient(at ${getX(50)}% 50%, ${c2} 0px, rgba(0,0,0,0) 50%)`,
        ],
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0],
      };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-[-100%]"
        animate={animate}
        transition={{
          duration: 30 / config.speed,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
        style={{
          opacity: config.opacity,
          filter: `blur(${blur}px)`,
          mixBlendMode: blendMode as any,
        }}
      />
      {grain && (
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </div>
  );
};
