import React from 'react';
import { BackgroundConfig } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const StripesBackground: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = ({ config, theme }) => {
  const { colors, customSettings } = config;
  const orientation = customSettings?.orientation || 'vertical';
  const lineWidth = customSettings?.lineWidth ?? 1;
  const glowIntensity = customSettings?.glowIntensity ?? 0.1;

  const stripeCount = Math.floor(config.density / 2);
  const stripes = Array.from({ length: stripeCount });
  const defaultColor = theme === 'dark' ? '#ffffff' : '#000000';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={cn(
        "flex w-full h-full",
        orientation === 'horizontal' ? "flex-col" : "flex-row"
      )}>
        {stripes.map((_, i) => {
          const color1 = colors?.[i % (colors?.length || 1)] || defaultColor;
          const color2 = colors?.[(i + 1) % (colors?.length || 1)] || defaultColor;
          const color3 = colors?.[(i + 2) % (colors?.length || 1)] || defaultColor;

          return (
            <motion.div
              key={i}
              className={cn(
                "relative",
                orientation === 'horizontal' ? "w-full flex-1" : "h-full flex-1"
              )}
              animate={{
                background: [
                  `linear-gradient(${orientation === 'horizontal' ? 'to right' : 'to bottom'}, rgba(0,0,0,0), ${color1}33, rgba(0,0,0,0))`,
                  `linear-gradient(${orientation === 'horizontal' ? 'to right' : 'to bottom'}, rgba(0,0,0,0), ${color2}33, rgba(0,0,0,0))`,
                  `linear-gradient(${orientation === 'horizontal' ? 'to right' : 'to bottom'}, rgba(0,0,0,0), ${color3}33, rgba(0,0,0,0))`,
                  `linear-gradient(${orientation === 'horizontal' ? 'to right' : 'to bottom'}, rgba(0,0,0,0), ${color1}33, rgba(0,0,0,0))`,
                ],
                backgroundColor: [
                  'rgba(0,0,0,0)',
                  `${color1}1a`,
                  `${color2}1a`,
                  `${color3}1a`,
                  'rgba(0,0,0,0)',
                ],
              }}
              transition={{
                duration: (15 + Math.random() * 10) / config.speed,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <motion.div
                className={cn(
                  "absolute opacity-10",
                  theme === 'dark' ? 'bg-white' : 'bg-black',
                  orientation === 'horizontal' ? "h-full" : "w-full"
                )}
                style={{
                  [orientation === 'horizontal' ? 'width' : 'height']: `${lineWidth}px`
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  [orientation === 'horizontal' ? 'width' : 'height']: ['0%', '100%', '0%'],
                  [orientation === 'horizontal' ? 'left' : 'top']: ['0%', '0%', '100%'],
                }}
                transition={{
                  duration: (3 + Math.random() * 3) / config.speed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.1,
                }}
              />
            </motion.div>
          );
        })}
      </div>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${colors?.[0] || defaultColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}, transparent 40%)`,
          opacity: config.interactive ? 1 : 0,
        }}
      />
    </div>
  );
};
