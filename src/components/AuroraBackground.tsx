import React from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';

export const AuroraBackground: React.FC<{ config: BackgroundConfig; theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const { colors, speed, opacity, density, customSettings } = config;
  
  const blur = customSettings?.blur ?? 100;
  const grain = customSettings?.grain ?? 0.03;
  const animationStyle = customSettings?.animationStyle ?? 'blobs';
  const height = customSettings?.height ?? 100;

  // Create a set of blobs based on density
  const blobCount = Math.max(3, Math.min(15, density));
  const blobs = Array.from({ length: blobCount }).map((_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: animationStyle === 'waves' ? (60 + Math.random() * 40) : (40 + Math.random() * 40),
    duration: (20 + Math.random() * 20) / speed,
    delay: Math.random() * -20,
    x: animationStyle === 'waves' 
      ? [`${(i / blobCount) * 100 - 20}%`, `${(i / blobCount) * 100 + 20}%`, `${(i / blobCount) * 100 - 20}%`]
      : [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
    y: animationStyle === 'waves'
      ? [`${100 - height}%`, `${100 - height + 10}%`, `${100 - height}%`]
      : [`${Math.random() * height}%`, `${Math.random() * height}%`, `${Math.random() * height}%`, `${Math.random() * height}%`],
    scale: [1, 1.2, 0.8, 1.1, 1],
    rotate: animationStyle === 'waves' ? [0, 5, -5, 0] : [0, 0, 0, 0],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-transparent">
      <div 
        className="absolute inset-0"
        style={{ 
          filter: `blur(${blur}px)`,
          opacity: opacity 
        }}
      >
        {blobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full"
            animate={{
              x: blob.x,
              y: blob.y,
              scale: blob.scale,
              rotate: blob.rotate,
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: blob.delay,
            }}
            style={{
              width: animationStyle === 'waves' ? '150%' : `${blob.size}%`,
              height: animationStyle === 'waves' ? '40%' : `${blob.size}%`,
              background: animationStyle === 'waves' 
                ? `linear-gradient(to bottom, transparent, ${blob.color}, transparent)`
                : `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              left: animationStyle === 'waves' ? '-25%' : '-25%',
              top: animationStyle === 'waves' ? '0%' : '-25%',
              mixBlendMode: theme === 'dark' ? 'screen' : 'multiply',
            }}
          />
        ))}
      </div>
      
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: grain,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
