import React from 'react';
import { BackgroundConfig, BackgroundType } from '../types';
import { ParticleBackground } from './ParticleBackground';
import { MatrixBackground } from './MatrixBackground';
import { WavesBackground } from './WavesBackground';
import { BlobsBackground } from './BlobsBackground';
import { CircuitBackground } from './CircuitBackground';
import { GlitchBackground } from './GlitchBackground';
import { TopologyBackground } from './TopologyBackground';
import { BeamsBackground } from './BeamsBackground';
import { PrismBackground } from './PrismBackground';
import { SparkBackground } from './SparkBackground';
import { MeshBackground } from './MeshBackground';
import { BentoBackground } from './BentoBackground';
import { GlassBackground } from './GlassBackground';
import { SpotlightBackground } from './SpotlightBackground';
import { MinimalBackground } from './MinimalBackground';
import { GrainyBackground } from './GrainyBackground';
import { StripesBackground } from './StripesBackground';
import { ColumnsBackground } from './ColumnsBackground';
import { RippleBackground } from './RippleBackground';
import { PoolBackground } from './PoolBackground';
import { GravityBackground } from './GravityBackground';
import { MetaPoolBackground } from './MetaPoolBackground';
import { AuroraBackground } from './AuroraBackground';
import { RibbonsBackground } from './RibbonsBackground';

const BACKGROUND_COMPONENTS: Record<BackgroundType, React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }>> = {
  mesh: MeshBackground,
  bento: BentoBackground,
  glass: GlassBackground,
  particles: ParticleBackground,
  waves: WavesBackground,
  matrix: MatrixBackground,
  glitch: GlitchBackground,
  circuit: CircuitBackground,
  topology: TopologyBackground,
  minimal: MinimalBackground,
  prism: PrismBackground,
  beams: BeamsBackground,
  grainy: GrainyBackground,
  blobs: BlobsBackground,
  spark: SparkBackground,
  spotlight: SpotlightBackground,
  stripes: StripesBackground,
  columns: ColumnsBackground,
  ripple: RippleBackground,
  pool: PoolBackground,
  gravity: GravityBackground,
  metapool: MetaPoolBackground,
  aurora: AuroraBackground,
  ribbons: RibbonsBackground,
};

export const BackgroundRenderer: React.FC<{ config: BackgroundConfig, theme: 'light' | 'dark' }> = React.memo(({ config, theme }) => {
  const Component = BACKGROUND_COMPONENTS[config.type];
  if (!Component) return null;
  return <Component key={config.type} config={config} theme={theme} />;
}, (prev, next) => prev.config === next.config && prev.theme === next.theme);
