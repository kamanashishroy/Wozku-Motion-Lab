import React, { useMemo } from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';

export const BlobsBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const { colors, customSettings } = config;
  
  const blobSize = customSettings?.blobSize ?? 400;
  const gooeyness = customSettings?.gooeyness ?? 40;
  const contrast = customSettings?.contrast ?? 80;
  const floatRange = customSettings?.floatRange ?? 200;
  const blurAmount = customSettings?.blurAmount ?? 40;
  
  const blobCount = Math.max(3, Math.floor(config.density / 2));
  const alignment = config.alignment || 'center';

  const getXRange = () => {
    switch (alignment) {
      case 'left': return [0, 40];
      case 'right': return [60, 100];
      default: return [10, 90];
    }
  };

  const xRange = getXRange();

  const blobs = useMemo(() => {
    return Array.from({ length: blobCount }).map((_, i) => ({
      id: i,
      color: colors?.[i % (colors?.length || 1)] || (theme === 'dark' ? '#ffffff' : '#000000'),
      size: blobSize * (0.8 + Math.random() * 0.4),
      initialX: `${Math.random() * (xRange[1] - xRange[0]) + xRange[0]}vw`,
      initialY: `${Math.random() * 80 + 10}vh`,
      duration: (15 + Math.random() * 15) / config.speed,
      delay: Math.random() * -20,
    }));
  }, [blobCount, colors, theme, blobSize, xRange, config.speed]);

  // Unique filter ID to avoid collisions
  const filterId = `gooey-filter-${config.type}`;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* SVG Filter for the "Gooey" effect */}
      <svg className="hidden">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={gooeyness} result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${contrast} -${contrast / 2}`} 
              result="goo" 
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div 
        className="absolute inset-0 w-full h-full"
        style={{ filter: `url(#${filterId})` }}
      >
        {blobs.map((blob) => (
          <motion.div
            key={blob.id}
            className="absolute rounded-full"
            animate={{
              x: [0, floatRange, -floatRange, 0],
              y: [0, -floatRange, floatRange, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: blob.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: blob.delay,
            }}
            style={{
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              backgroundColor: blob.color,
              left: blob.initialX,
              top: blob.initialY,
              marginLeft: `-${blob.size / 2}px`,
              marginTop: `-${blob.size / 2}px`,
              opacity: config.opacity,
              filter: `blur(${blurAmount}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
