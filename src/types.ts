export type BackgroundType = 
  | 'mesh' | 'bento' | 'glass' | 'particles' | 'waves' | 'matrix' | 'glitch' | 'circuit' 
  | 'topology' | 'minimal' | 'prism' | 'beams' | 'grainy' | 'blobs' | 'spark' | 'spotlight'
  | 'stripes' | 'columns' | 'ripple' | 'pool' | 'gravity' | 'metapool' | 'aurora' | 'ribbons';

export interface BackgroundConfig {
  type: BackgroundType;
  colors: string[];
  speed: number;
  density: number;
  interactive: boolean;
  opacity: number;
  alignment?: 'left' | 'center' | 'right';
  customSettings?: Record<string, any>;
}

export const DEFAULT_CONFIGS: Record<BackgroundType, BackgroundConfig> = {
  mesh: {
    type: 'mesh',
    colors: ['#6366f1', '#ec4899', '#8b5cf6'],
    speed: 0.5,
    density: 4,
    interactive: false,
    opacity: 0.6,
    alignment: 'center',
    customSettings: {
      blur: 100,
      grain: false,
      animationPath: 'drift',
      blendMode: 'normal'
    }
  },
  bento: {
    type: 'bento',
    colors: ['#334155', '#6366f1'],
    speed: 1,
    density: 20,
    interactive: true,
    opacity: 0.8,
    alignment: 'center',
    customSettings: {
      gap: 1,
      radius: 0,
      pattern: 'standard',
      spotlightSize: 600
    }
  },
  glass: {
    type: 'glass',
    colors: ['#ffffff', '#6366f1'],
    speed: 0.5,
    density: 6,
    interactive: true,
    opacity: 0.3,
    customSettings: {
      blur: 40,
      frost: 5,
      shape: 'rect',
      refraction: 20,
      meshLayer: false
    }
  },
  particles: {
    type: 'particles',
    colors: ['#6366f1', '#a855f7', '#ec4899'],
    speed: 1,
    density: 50,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      connectionDistance: 100,
      particleSize: 2,
      lineWidth: 0.5,
      interactionRadius: 150,
      interactionMode: 'repel'
    }
  },
  waves: {
    type: 'waves',
    colors: ['#3b82f6', '#60a5fa', '#2563eb'],
    speed: 1,
    density: 3,
    interactive: false,
    opacity: 0.3,
    alignment: 'center',
    customSettings: {
      amplitude: 100,
      frequency: 0.005,
      complexity: 3,
      fillMode: 'outline',
      mirror: false
    }
  },
  matrix: {
    type: 'matrix',
    colors: ['#10b981', '#059669'],
    speed: 1,
    density: 20,
    interactive: false,
    opacity: 0.4,
    alignment: 'center',
    customSettings: {
      fontSize: 16,
      trailLength: 0.15,
      glow: true,
      charSet: 'katakana',
      rainbow: false
    }
  },
  glitch: {
    type: 'glitch',
    colors: ['#ef4444', '#3b82f6', '#ffffff'],
    speed: 1,
    density: 10,
    interactive: false,
    opacity: 0.2,
    alignment: 'center',
    customSettings: {
      glitchFrequency: 0.1,
      scanlineIntensity: 0.1,
      rgbShift: 2,
      distortion: 5,
      noiseLevel: 0.05
    }
  },
  circuit: {
    type: 'circuit',
    colors: ['#6366f1', '#4f46e5'],
    speed: 0.5,
    density: 20,
    interactive: true,
    opacity: 0.3,
    customSettings: {
      gridSize: 50,
      pulseSpeed: 2,
      connectionType: 'orthogonal',
      nodeSize: 3,
      showNodes: true
    }
  },
  topology: {
    type: 'topology',
    colors: ['#6366f1', '#4f46e5'],
    speed: 1,
    density: 15,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      noiseScale: 0.002,
      lineSpacing: 30,
      lineWidth: 1,
      complexity: 15,
      interactionRadius: 200
    }
  },
  minimal: {
    type: 'minimal',
    colors: ['#ffffff', '#000000'],
    speed: 0.5,
    density: 50,
    interactive: true,
    opacity: 0.05,
    customSettings: {
      gridType: 'dots',
      gridSpacing: 40,
      elementSize: 1,
      pulseIntensity: 0.5,
      interactionMode: 'scale'
    }
  },
  prism: {
    type: 'prism',
    colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'],
    speed: 0.8,
    density: 12,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      shardType: 'triangles',
      minSize: 50,
      maxSize: 150,
      rotationSpeed: 1,
      floatIntensity: 0.5,
      blurAmount: 0
    }
  },
  beams: {
    type: 'beams',
    colors: ['#ffffff', '#6366f1', '#a855f7'],
    speed: 1,
    density: 15,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      beamWidth: 2,
      beamLength: 600,
      glowIntensity: 0.5,
      interactionMode: 'attach',
      spread: 1.0
    }
  },
  grainy: {
    type: 'grainy',
    colors: ['#1e293b', '#0f172a'],
    speed: 1,
    density: 100,
    interactive: false,
    opacity: 0.03,
    customSettings: {
      grainIntensity: 0.5,
      grainSize: 1,
      meshSpeed: 0.5,
      meshComplexity: 4,
      meshColors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981']
    }
  },
  blobs: {
    type: 'blobs',
    colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b'],
    speed: 1,
    density: 5,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      blobSize: 400,
      gooeyness: 40,
      contrast: 80,
      floatRange: 200,
      blurAmount: 40
    }
  },
  spark: {
    type: 'spark',
    colors: ['#f59e0b', '#ef4444', '#ffffff', '#fbbf24'],
    speed: 1.2,
    density: 50,
    interactive: true,
    opacity: 0.8,
    customSettings: {
      sparkSize: 2,
      sparkLife: 1.0,
      gravity: 0.1,
      friction: 0.98,
      trailLength: 0.1,
      glowIntensity: 1.0,
      interactionMode: 'attach'
    }
  },
  spotlight: {
    type: 'spotlight',
    colors: ['#ffffff', '#6366f1'],
    speed: 1,
    density: 1,
    interactive: true,
    opacity: 0.8,
    customSettings: {
      spotlightSize: 600,
      beamIntensity: 0.6,
      flicker: true,
      glowColor: '#6366f1',
      showBeam: true,
      interactionMode: 'attach'
    }
  },
  stripes: {
    type: 'stripes',
    colors: ['#6366f1', '#ec4899', '#8b5cf6'],
    speed: 1,
    density: 12,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      orientation: 'vertical',
      lineWidth: 1,
      glowIntensity: 0.1
    }
  },
  columns: {
    type: 'columns',
    colors: ['#ffffff', '#6366f1'],
    speed: 0.5,
    density: 20,
    interactive: true,
    opacity: 0.3,
    customSettings: {
      glowWidth: 10,
      showBorders: true,
      scanDirection: 'down',
      interactionMode: 'attach'
    }
  },
  ripple: {
    type: 'ripple',
    colors: ['#6366f1', '#a855f7', '#ec4899'],
    speed: 1,
    density: 15,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      interactionMode: 'attach',
      maxRadius: 200,
      ringCount: 3,
      chainProbability: 0.05,
      lineWidth: 1.5,
      glow: false
    }
  },
  pool: {
    type: 'pool',
    colors: ['#0ea5e9', '#2563eb', '#1d4ed8'],
    speed: 1,
    density: 30,
    interactive: true,
    opacity: 0.5,
    customSettings: {
      interactionMode: 'attach',
      damping: 0.98,
      resolution: 10,
      dropStrength: 20,
      distortion: 1.0
    }
  },
  gravity: {
    type: 'gravity',
    colors: ['#6366f1', '#a855f7', '#ec4899'],
    speed: 0.3,
    density: 40,
    interactive: true,
    opacity: 0.6,
    customSettings: {
      interactionMode: 'attach'
    }
  },
  metapool: {
    type: 'metapool',
    colors: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    speed: 1,
    density: 15,
    interactive: true,
    opacity: 0.8,
    customSettings: {
      interactionMode: 'attach'
    }
  },
  aurora: {
    type: 'aurora',
    colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    speed: 1,
    density: 5,
    interactive: true,
    opacity: 0.4,
    customSettings: {
      blur: 100,
      grain: 0.03,
      animationStyle: 'blobs',
      height: 100
    }
  },
  ribbons: {
    type: 'ribbons',
    colors: ['#0f172a', '#1e293b', '#334155'],
    speed: 0.5,
    density: 40,
    interactive: false,
    opacity: 1,
    customSettings: {
      style: 'smooth',
      texture: 'vertical',
      variation: 'uniform'
    }
  }
};

export const COLOR_PALETTES = [
  { name: 'Midnight', colors: ['#0f172a', '#1e293b', '#334155'] },
  { name: 'Ocean', colors: ['#0ea5e9', '#2563eb', '#1d4ed8'] },
  { name: 'Sunset', colors: ['#f59e0b', '#ef4444', '#db2777'] },
  { name: 'Emerald', colors: ['#10b981', '#059669', '#047857'] },
  { name: 'Cyberpunk', colors: ['#f0abfc', '#818cf8', '#c084fc'] },
  { name: 'Vibrant', colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981'] },
  { name: 'Monochrome', colors: ['#ffffff', '#a3a3a3', '#404040', '#000000'] },
  { name: 'Nord', colors: ['#88c0d0', '#81a1c1', '#5e81ac'] },
  { name: 'Dracula', colors: ['#bd93f9', '#ff79c6', '#8be9fd'] },
];
