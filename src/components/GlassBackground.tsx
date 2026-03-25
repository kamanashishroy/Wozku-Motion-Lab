import React from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';
import { MeshBackground } from './MeshBackground';

export const GlassBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const cardCount = Math.max(3, Math.floor(config.density / 5));
  const alignment = config.alignment || 'center';
  
  const customSettings = {
    blur: config.customSettings?.blur ?? 40,
    frost: config.customSettings?.frost ?? 5,
    shape: config.customSettings?.shape ?? 'rect',
    refraction: config.customSettings?.refraction ?? 20,
    meshLayer: config.customSettings?.meshLayer ?? false,
    ...config.customSettings
  };

  const getXRange = () => {
    switch (alignment) {
      case 'left': return [0, 50];
      case 'right': return [50, 100];
      default: return [0, 100];
    }
  };

  const xRange = getXRange();
  const getRandomX = () => Math.random() * (xRange[1] - xRange[0]) + xRange[0] + "%";
  const defaultColor = theme === 'dark' ? '#ffffff' : '#000000';
  
  const getShapeClasses = (shape: string) => {
    switch (shape) {
      case 'circle': return 'rounded-full aspect-square w-64 h-64';
      case 'pill': return 'rounded-full w-48 h-80';
      default: return 'rounded-[2rem] w-64 h-80';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {customSettings.meshLayer && (
        <div className="absolute inset-0 z-0">
          <MeshBackground 
            config={{ 
              ...config, 
              type: 'mesh', 
              opacity: config.opacity * 0.8, // Slightly more subtle
              customSettings: { 
                blur: 120, 
                grain: true, 
                animationPath: 'drift',
                blendMode: 'normal'
              } 
            }} 
            theme={theme} 
          />
        </div>
      )}
      {Array.from({ length: cardCount }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute border shadow-2xl ${getShapeClasses(customSettings.shape)} ${
            theme === 'dark' ? 'border-white/10' : 'border-black/10'
          }`}
          initial={{
            left: getRandomX(),
            top: Math.random() * 100 + "%",
            rotate: Math.random() * 360,
          }}
          animate={{
            left: [
              getRandomX(),
              getRandomX(),
              getRandomX(),
            ],
            top: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: (30 + i * 10) / config.speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            opacity: config.opacity,
            backdropFilter: `blur(${customSettings.blur}px)`,
            backgroundColor: theme === 'dark' 
              ? `rgba(255, 255, 255, ${customSettings.frost / 100})` 
              : `rgba(0, 0, 0, ${customSettings.frost / 100})`,
          }}
        >
          <div 
            className={`absolute inset-0 ${customSettings.shape === 'rect' ? 'rounded-[2rem]' : 'rounded-full'}`}
            style={{ 
              background: `linear-gradient(to bottom right, ${config.colors?.[i % (config.colors?.length || 1)] || defaultColor}${Math.floor(customSettings.refraction * 2.55).toString(16).padStart(2, '0')}, rgba(0,0,0,0))` 
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
