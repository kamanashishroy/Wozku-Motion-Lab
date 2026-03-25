import { BackgroundConfig, BackgroundType } from '../types';

export function generateTechnicalPrompt(config: BackgroundConfig, framework: 'react' | 'vanilla'): string {
  const { type, colors, speed, density, interactive, opacity } = config;
  const primaryColor = colors?.[0] || '#ffffff';
  const secondaryColor = colors?.[1] || colors?.[0] || '#000000';
  const allColors = (colors || []).join(', ');
  
  const base = framework === 'react' 
    ? `Act as a senior frontend engineer. Create a high-performance, production-ready React component for a modern "Wozku" background effect. The component must be self-contained, responsive, and optimized for 60fps.`
    : `Act as a senior frontend engineer. Create a high-performance, production-ready Vanilla JavaScript and CSS implementation for a modern "Wozku" background effect. The code must be self-contained, responsive, and optimized for 60fps.`;

  const engineSpecs: Record<BackgroundType, string> = {
    mesh: `
- Visual: A deep-blur mesh gradient using 4-8 overlapping radial-gradient blobs.
- Implementation: ${framework === 'react' ? "Use a container with 'overflow-hidden' and a child motion.div (from motion/react) that is 200% size of the parent." : "Use a container with 'overflow-hidden' and a child <div> that is 200% size of the parent. Use CSS Keyframes for animation."}
- Colors: Use a palette of colors: ${allColors}. Distribute these across the mesh points.
- Animation: Animate the 'background' property or 'background-position' using a slow, non-linear keyframe loop (duration: ${20 / speed}s). 
- Filter: Apply 'filter: blur(100px)' to the entire gradient container.
- Opacity: Set overall container opacity to ${opacity}.`,

    bento: `
- Visual: A "Bento Box" grid background with interactive spotlight effects.
- Implementation: Use a CSS Grid layout with ${density / 2} columns and rows.
- Logic: Each grid cell is a container for a radial gradient spotlight.
- Animation: Spotlights follow the mouse cursor or move automatically in a circular path.
- Customization: Support adjustable gap, border radius, and spotlight size.
- Pattern: Support 'standard' (uniform grid) and 'masonry' (randomly sized cells) patterns.
- Colors: Use ${allColors} for the spotlights and grid lines.`,

    glass: `
- Visual: Floating, translucent "Glass" shapes with realistic refraction and blur.
- Implementation: Use multiple 'motion.div' elements with 'backdrop-filter: blur()'.
- Logic: Each shape has a subtle border and a gradient overlay to simulate light refraction.
- Animation: Shapes float and rotate slowly across the screen based on speed (${speed}).
- Customization: Support adjustable blur intensity, frost (opacity), shape type (rect, circle, pill), and refraction (gradient intensity).
- Layering: Support an optional "Mesh Layer" rendered behind the glass shapes for a rich, colorful background.
- Colors: Use ${allColors} for the refraction gradients and the optional mesh layer.`,

    particles: `
- Visual: A dynamic "Constellation" particle system with connecting lines.
- Implementation: Use HTML5 Canvas. Create a field of ${density * 2} particles with velocity.
- Logic: Draw lines between particles that are within ${config.customSettings?.connectionDistance ?? 100}px of each other.
- Animation: Update particle positions based on velocity and bounce off canvas boundaries.
- Customization: Support adjustable connection distance, particle size, line width, and interaction mode (repel/attract).
- Interactivity: ${interactive ? `Particles ${config.customSettings?.interactionMode || 'repel'} the mouse cursor within a ${config.customSettings?.interactionRadius ?? 150}px radius.` : 'Particles move autonomously.'}
- Colors: Use ${allColors} for the particles and connecting lines.`,

    waves: `
- Visual: Fluid, layered sine wave animations.
- Implementation: Use HTML5 Canvas. Render ${config.customSettings?.complexity ?? 3} overlapping wave layers.
- Logic: Calculate sine wave paths with varying amplitudes (${config.customSettings?.amplitude ?? 100}px) and frequencies (${(config.customSettings?.frequency ?? 0.005).toFixed(4)}).
- Animation: Shift wave phases over time based on speed (${speed}).
- Customization: Support adjustable amplitude, frequency, complexity (layer count), fill mode (outline/solid), and mirror mode (vertical reflection).
- Colors: Use ${allColors} for the wave strokes or fills.`,

    matrix: `
- Visual: A high-performance "Digital Rain" effect inspired by The Matrix.
- Implementation: Use HTML5 Canvas. Render columns of falling characters.
- Logic: Each column has an independent "drop" position that resets once it hits the bottom.
- Customization: Support adjustable font size (${config.customSettings?.fontSize ?? 16}px), trail length (fade speed), character sets (Katakana, Alphanumeric, Binary, Custom), and optional glow/rainbow effects.
- Animation: Update drop positions based on speed (${speed}).
- Colors: Use ${allColors} for the falling characters, with a dark background for contrast.`,

    glitch: `
- Visual: A high-energy "Cyberpunk" glitch effect with digital artifacts.
- Implementation: Use HTML5 Canvas. Layer noise, scanlines, and random rectangular artifacts.
- Logic: Trigger "big" glitches based on frequency (${(config.customSettings?.glitchFrequency ?? 0.1).toFixed(2)}).
- Customization: Support adjustable glitch frequency, RGB shift intensity (${config.customSettings?.rgbShift ?? 2}px), scanline visibility, horizontal distortion, and static noise levels.
- Animation: Randomize artifact positions and displacement based on speed (${speed}).
- Colors: Use ${allColors} for the glitch blocks and RGB shift effects.`,

    circuit: `
- Visual: A technical "Circuit Board" effect with nodes and data pulses.
- Implementation: Use HTML5 Canvas. Place nodes on a grid (${config.customSettings?.gridSize ?? 50}px).
- Logic: Draw connections between nearby nodes. Support orthogonal (90-degree) or direct lines.
- Customization: Support adjustable grid size, pulse speed (${config.customSettings?.pulseSpeed ?? 2}x), connection type (orthogonal/direct), and node visibility.
- Animation: Render moving "data pulses" along the circuit paths.
- Colors: Use ${allColors} for the paths and pulses.`,

    topology: `
- Visual: An organic "Topographic Map" effect with flowing contour lines.
- Implementation: Use HTML5 Canvas. Generate organic lines using a noise-based grid approximation.
- Logic: Render multiple contour levels (${config.customSettings?.complexity ?? 15}) based on a noise field.
- Customization: Support adjustable noise scale (${(config.customSettings?.noiseScale ?? 0.002).toFixed(4)}), line complexity, line width, and interaction radius (${config.customSettings?.interactionRadius ?? 200}px).
- Animation: Shift the noise field over time based on speed (${speed}).
- Colors: Use ${allColors} for the contour lines.`,

    minimal: `
- Visual: A clean, geometric grid background (Dots, Crosses, Squares, or Lines).
- Implementation: Use HTML5 Canvas. Render a grid of elements with adjustable spacing (${config.customSettings?.gridSpacing ?? 40}px).
- Logic: Support multiple grid types and interactive behaviors (Scale, Repel, Attract).
- Customization: Support adjustable element size, pulse intensity, and grid type.
- Animation: Elements pulse subtly based on speed (${speed}).
- Colors: Use ${allColors} for the grid elements.`,

    prism: `
- Visual: A dynamic "Crystal Shard" effect with floating geometric shapes (Triangles, Squares, or Hexagons).
- Implementation: Use HTML5 Canvas. Render multiple floating shards with soft edges or blur (${config.customSettings?.blurAmount ?? 0}px).
- Logic: Shards rotate and float organically. Interaction causes them to spin faster or react to the cursor.
- Customization: Support adjustable shard type, size range (${config.customSettings?.minSize ?? 50}px - ${config.customSettings?.maxSize ?? 150}px), rotation speed, and float intensity.
- Animation: Shards float and spin based on speed (${speed}).
- Colors: Use ${allColors} for the shards.`,

    beams: `
- Visual: A high-energy "Light Beam" effect with radiating lines.
- Implementation: Use HTML5 Canvas. Render beams with linear gradients and glow effects (${config.customSettings?.glowIntensity ?? 0.5}x).
- Logic: Beams can either radiate from a single point (Attach) or have independent floating origins (Detach).
- Customization: Support adjustable beam width (${config.customSettings?.beamWidth ?? 2}px), beam length (${config.customSettings?.beamLength ?? 600}px), and interaction mode.
- Animation: Beams rotate and shift based on speed (${speed}).
- Colors: Use ${allColors} for the beams.`,

    grainy: `
- Visual: A textured "Film Grain" effect overlaying a dynamic "Gradient Mesh".
- Implementation: Use HTML5 Canvas. Render multiple moving radial gradient blobs for the mesh, then overlay random noise pixels.
- Logic: The background mesh flows organically while the grain provides a tactile, analog texture.
- Customization: Support adjustable grain intensity (${(config.customSettings?.grainIntensity ?? 0.5).toFixed(2)}), grain size (${config.customSettings?.grainSize ?? 1}px), mesh speed, and complexity.
- Animation: Mesh blobs drift based on speed (${speed}).
- Colors: Use ${allColors} for the gradient mesh.`,

    blobs: `
- Visual: A "Gooey Metaball" effect similar to a lava lamp.
- Implementation: Use SVG filters (feGaussianBlur and feColorMatrix) to create a liquid merging effect between blurred motion divs.
- Logic: Blobs float and merge organically when they overlap, creating dynamic, fluid shapes.
- Customization: Support adjustable gooeyness (${config.customSettings?.gooeyness ?? 40}), contrast (${config.customSettings?.contrast ?? 80}), blob size, and float range.
- Animation: Blobs drift and scale based on speed (${speed}).
- Colors: Use ${allColors} for the blobs.`,

    spark: `
- Visual: A high-fidelity "Particle Spark" effect with physics and trails.
- Implementation: Use HTML5 Canvas. Render particles with velocity, gravity (${config.customSettings?.gravity ?? 0.1}), and friction (${config.customSettings?.friction ?? 0.98}).
- Logic: Particles leave motion trails (${config.customSettings?.trailLength ?? 0.1}) and explode on click.
- Customization: Support adjustable spark size (${config.customSettings?.sparkSize ?? 2}px), glow intensity (${config.customSettings?.glowIntensity ?? 1.0}x), and interaction mode (${config.customSettings?.interactionMode ?? 'attach'}).
- Animation: Particles bounce off the bottom edge and decay over time.
- Colors: Use ${allColors} for the sparks.`,

    spotlight: `
- Visual: A high-fidelity "Volumetric Spotlight" effect with flicker and dust particles.
- Implementation: Use HTML5 Canvas. Render a radial gradient spotlight with a linear gradient beam (${config.customSettings?.showBeam ?? true}).
- Logic: The spotlight follows the cursor (${config.interactive}) and includes a subtle flicker (${config.customSettings?.flicker ?? true}) for realism.
- Customization: Support adjustable spotlight size (${config.customSettings?.spotlightSize ?? 600}px), beam intensity (${config.customSettings?.beamIntensity ?? 0.6}), and glow color (${config.customSettings?.glowColor ?? config.colors?.[1] ?? '#6366f1'}).
- Animation: Dust particles float within the light beam based on density (${config.density}) and speed (${speed}).
- Colors: Use ${allColors} for the spotlight and beam.`,

    stripes: `
- Visual: Dynamic vertical stripes with internal motion.
- Implementation: A flex container with 'density' number of vertical divs.
- Animation: Each stripe should have a background gradient that slides vertically. 
- Logic: Use 'background-size: 100% 200%' and animate 'background-position-y'.
- Colors: Alternate between ${primaryColor} and ${secondaryColor} or use a single color with varying opacities.`,

    columns: `
- Visual: Interactive vertical columns that react to proximity.
- Implementation: A series of vertical divs.
- Interactivity: ${interactive ? `As the mouse moves across the screen, the column directly under the cursor (and its neighbors) should increase in opacity and scale slightly, or change color to ${secondaryColor}.` : 'Static vertical columns.'}
- Animation: ${framework === 'react' ? "Use Framer Motion 'layout' for smooth width/scale transitions." : "Use vanilla JS to update column classes or styles on mousemove."}`,

    ripple: `
- Visual: A chain-reaction ripple effect (water drop style).
- Implementation: Use HTML5 Canvas. Maintain a grid of potential 'trigger points' (dots).
- Logic: When a ripple (expanding circle) hits a trigger point, that point activates and starts its own ripple.
- Animation: Ripples expand at a rate of ${2 * speed}px per frame and fade out over time.
- Colors: Use ${allColors} for the ripple strokes.
- Interactivity: ${interactive ? 'Clicking on the canvas starts a new ripple at the cursor position.' : 'Ripples start randomly.'}
- Performance: Use 'requestAnimationFrame' and limit the number of active ripples to maintain 60fps.`,

    pool: `
- Visual: A realistic fluid water surface simulation (Pool effect).
- Implementation: Use HTML5 Canvas with a grid-based heightmap.
- Logic: Implement a 2D wave equation (Verlet integration) where each grid cell's height is influenced by its neighbors.
- Animation: Use a damping factor (${0.98}) to make waves naturally dissipate.
- Interactivity: ${interactive ? 'Moving the mouse across the canvas creates "drops" that disturb the water surface.' : 'Random drops are created automatically.'}
- Colors: Use ${primaryColor} for the distorted grid lines that represent the water surface.`,

    gravity: `
- Visual: A physics-based particle system with gravitational attraction (Gravity Well).
- Implementation: Use HTML5 Canvas. Create a field of ${density * 10} particles with mass and velocity.
- Logic: Implement Newton's law of universal gravitation. Particles are attracted to a central "gravity well" and optionally the mouse cursor.
- Animation: Update particle velocities based on gravitational forces and apply a slight drag (${0.98}) to prevent infinite acceleration.
- Interactivity: ${interactive ? 'The mouse cursor acts as a massive attractor, pulling particles towards it.' : 'Particles orbit a central static attractor.'}
- Colors: Use ${allColors} for the particles.`,

    metapool: `
- Visual: A "Liquid Pool Table" with merging blobs (Metaballs).
- Implementation: Use HTML5 Canvas. Maintain a list of liquid "balls" with radius, velocity, and color.
- Logic: When two balls collide, they merge into one larger ball. The new ball's area is the sum of the original areas.
- Animation: Merged balls "wobble" (oscillate their radius) for a few seconds.
- Breakdown: When a ball absorbs 4 others, it splits into 4 smaller balls that move in different directions.
- Colors: Use ${allColors}. When merging, create a radial gradient between the two original colors.`,

    aurora: `
- Visual: A soft, fluid "Aurora" or "Gradient Mesh" background (inspired by SlateHQ).
- Implementation: Use multiple overlapping 'motion.div' blobs with 'radial-gradient'.
- Animation: Each blob moves independently along a random path using 'motion' with large blur (100px).
- Texture: Include a subtle grain/noise overlay (${0.03} opacity) to add depth and texture.
- Colors: Use ${allColors}. Use 'screen' blend mode in dark theme and 'multiply' in light theme for smooth blending.
- Performance: Use CSS hardware acceleration and keep the number of blobs reasonable (${density}).`,

    ribbons: `
- Visual: A textured, "ribbed" or "pleated" background with vertical wavy columns (inspired by SlateHQ).
- Implementation: Use HTML5 Canvas to draw multiple vertical paths.
- Logic: Each path is a wavy line calculated using a combination of sine waves and noise.
- Shading: Apply a linear gradient to each ribbon to simulate 3D lighting and depth.
- Animation: Animate the wave offset and amplitude over time (${speed}).
- Colors: Use ${allColors}. Apply gradients across each ribbon for a rich, textured look.`,
  };

  const customSettingsStr = config.customSettings 
    ? `\nCustom Settings:\n${Object.entries(config.customSettings)
        .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
        .join('\n')}`
    : '';

  const technicalFooter = framework === 'react' 
    ? `
Additional Requirements:
- Use Tailwind CSS for layout and basic styling.
- Use 'motion/react' (Framer Motion) for complex animations.
- Ensure the component is 'fixed inset-0' and 'z-index: -1'.
- Optimize for performance: use 'memo' and avoid unnecessary re-renders.
- Accessibility: Ensure 'pointer-events-none' so it doesn't interfere with UI.`
    : `
Additional Requirements:
- Use standard HTML5, CSS3, and Vanilla JavaScript.
- Use 'requestAnimationFrame' for smooth 60fps animations.
- Ensure the element is 'position: fixed; inset: 0; z-index: -1;'.
- Use CSS Variables for dynamic colors and properties.
- Accessibility: Ensure 'pointer-events: none;' so it doesn't interfere with UI.`;

  return `${base}\n\n--- TECHNICAL SPECIFICATIONS ---\n\nEngine: ${type.toUpperCase()}\n${engineSpecs[type]}\n\nGlobal Config:\n- Speed: ${speed}x\n- Density: ${density}\n- Opacity: ${opacity}\n- Interactive: ${interactive ? 'Yes' : 'No'}${customSettingsStr}\n\n${technicalFooter}`;
}

export function generateExportCode(config: BackgroundConfig): string {
  return `import React, { useEffect, useRef } from 'react';

// Configuration used:
// Type: ${config.type}
// Colors: ${(config.colors || []).join(', ')}
// Speed: ${config.speed}
// Density: ${config.density}

export const WozkuBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Animation logic for ${config.type}...
    // You can copy the full implementation from the Wozku source.
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      zIndex: -1,
      opacity: ${config.opacity}
    }}>
      {/* Background implementation here */}
    </div>
  );
};`;
}
