import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings2, 
  Zap, 
  Palette, 
  Plus, 
  Trash2, 
  ChevronDown,
  X,
  Code,
  Sun,
  Moon
} from 'lucide-react';
import { Logo } from '../Logo';
import { BackgroundConfig, BackgroundType, DEFAULT_CONFIGS, COLOR_PALETTES } from '../../types';
import { cn } from '../../lib/utils';
import { HexColorPicker } from 'react-colorful';

interface SidebarProps {
  config: BackgroundConfig;
  setConfig: (config: BackgroundConfig) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: 'all' | 'geometric' | 'fluid' | 'data';
  setActiveCategory: (cat: 'all' | 'geometric' | 'fluid' | 'data') => void;
  openPickerIndex: number | null;
  setOpenPickerIndex: (index: number | null) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const CATEGORIES: Record<BackgroundType, 'geometric' | 'fluid' | 'data'> = {
  mesh: 'fluid',
  bento: 'geometric',
  glass: 'fluid',
  particles: 'data',
  waves: 'fluid',
  matrix: 'data',
  glitch: 'data',
  circuit: 'data',
  topology: 'geometric',
  minimal: 'geometric',
  prism: 'geometric',
  beams: 'fluid',
  grainy: 'data',
  blobs: 'fluid',
  spark: 'data',
  spotlight: 'fluid',
  stripes: 'geometric',
  columns: 'geometric',
  ripple: 'fluid',
  pool: 'fluid',
  metapool: 'fluid',
  aurora: 'fluid',
  ribbons: 'fluid',
  gravity: 'data'
};

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  setConfig,
  showSidebar,
  setShowSidebar,
  isEditing,
  setIsEditing,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  openPickerIndex,
  setOpenPickerIndex,
  theme,
  setTheme
}) => {
  const pickerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        // Only close if we didn't click a trigger button
        const isTrigger = (event.target as HTMLElement).closest('.color-picker-trigger');
        if (!isTrigger) {
          setOpenPickerIndex(null);
        }
      }
    };

    if (openPickerIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openPickerIndex, setOpenPickerIndex]);

  const handleTypeChange = (type: BackgroundType) => {
    setConfig(DEFAULT_CONFIGS[type]);
    setIsEditing(true);
  };

  return (
    <>
      <AnimatePresence>
        {showSidebar && (
          <motion.div 
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="absolute left-6 top-6 bottom-6 w-80 flex flex-col gap-4 pointer-events-auto z-60"
          >
            {/* Engine Selection Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-5 rounded-2xl flex-1 flex flex-col min-h-0"
            >
              <AnimatePresence mode="wait">
                {!isEditing ? (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block">
                        Motion Gallery
                      </label>
                      <button 
                        onClick={() => setShowSidebar(false)}
                        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search patterns..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
                        {(['all', 'geometric', 'fluid', 'data'] as const).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                              activeCategory === cat 
                                ? "bg-indigo-600 text-white" 
                                : "bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 scrollbar-hide flex-1 content-start">
                      {(Object.keys(DEFAULT_CONFIGS) as BackgroundType[])
                        .filter(type => {
                          const matchesSearch = type.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesCategory = activeCategory === 'all' || CATEGORIES[type] === activeCategory;
                          return matchesSearch && matchesCategory;
                        })
                        .map((type) => (
                          <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center text-center",
                              config.type === type 
                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10 hover:border-black/10 dark:hover:border-white/10"
                            )}
                          >
                            {type.toUpperCase()}
                          </button>
                        ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="controls"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-start gap-3 mb-6">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="p-1 mt-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 block leading-none mb-1">
                          Specific Controls
                        </label>
                        <h3 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider leading-none">{config.type}</h3>
                      </div>
                      <button 
                        onClick={() => setShowSidebar(false)}
                        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-8 overflow-y-auto pr-1 scrollbar-hide">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block">
                            Preset
                          </label>
                          <div className="flex gap-2">
                            <div className="relative group/select">
                              <select 
                                value={COLOR_PALETTES.find(p => JSON.stringify(p.colors) === JSON.stringify(config.colors))?.name || ""}
                                onChange={(e) => {
                                  const palette = COLOR_PALETTES.find(p => p.name === e.target.value);
                                  if (palette) {
                                    setConfig({ ...config, colors: palette.colors });
                                  }
                                }}
                                className="appearance-none bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 pr-6 text-[10px] font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:border-indigo-500/50"
                              >
                                <option value="" disabled>Presets</option>
                                {COLOR_PALETTES.map(p => (
                                  <option key={p.name} value={p.name}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 dark:text-neutral-400" />
                            </div>
                              {(config.colors?.length || 0) < 5 && (
                                <button 
                                  onClick={() => setConfig({ ...config, colors: [...(config.colors || []), '#ffffff'] })}
                                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all text-neutral-500 dark:text-neutral-400 hover:text-indigo-500"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {(config.colors || []).map((color, index) => (
                            <div key={index} className="flex items-center gap-2 group">
                              <div className="relative w-8 h-8 shrink-0">
                                <button 
                                  onClick={() => setOpenPickerIndex(openPickerIndex === index ? null : index)}
                                  className="color-picker-trigger absolute inset-0 rounded-lg border border-white/10 shadow-lg transition-transform hover:scale-105"
                                  style={{ backgroundColor: color }}
                                />
                                <AnimatePresence>
                                  {openPickerIndex === index && (
                                    <motion.div 
                                      ref={pickerRef}
                                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                      className="absolute z-[100] top-full left-0 mt-2 p-3 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl"
                                    >
                                      <HexColorPicker 
                                        color={color || '#ffffff'} 
                                        onChange={(newColor) => {
                                          const newColors = [...(config.colors || [])];
                                          newColors[index] = newColor || '#ffffff';
                                          setConfig({ ...config, colors: newColors });
                                        }} 
                                      />
                                      <div className="mt-3 flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-mono text-neutral-400 uppercase">{color}</span>
                                        <button 
                                          onClick={() => setOpenPickerIndex(null)}
                                          className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 px-2 py-1 rounded-md hover:bg-indigo-500/10 transition-colors"
                                        >
                                          Done
                                        </button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <input 
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const newColors = [...(config.colors || [])];
                                  newColors[index] = e.target.value;
                                  setConfig({ ...config, colors: newColors });
                                }}
                                className="flex-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-indigo-500/50 transition-all uppercase"
                              />
                              {(config.colors?.length || 0) > 2 && (
                                <button 
                                  onClick={() => {
                                    const newColors = (config.colors || []).filter((_, i) => i !== index);
                                    setConfig({ ...config, colors: newColors });
                                  }}
                                  className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all text-neutral-500 hover:text-red-400"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                        <div className="space-y-6">
                          {config.type === 'mesh' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blur</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.blur ?? 100}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="200" step="1"
                                    value={config.customSettings?.blur ?? 100}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, blur: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Grain Texture</span>
                                  <button
                                    onClick={() => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, grain: !config.customSettings?.grain } 
                                    })}
                                    className={cn(
                                      "w-8 h-4 rounded-full transition-all relative",
                                      config.customSettings?.grain ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                                      config.customSettings?.grain ? "left-5" : "left-1"
                                    )} />
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Animation Path</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.animationPath || 'drift'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['drift', 'orbit'] as const).map((p) => (
                                      <button
                                        key={p}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, animationPath: p } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.animationPath || 'drift') === p 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blend Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.blendMode || 'normal'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['normal', 'screen', 'overlay'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, blendMode: m } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.blendMode || 'normal') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'ribbons' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">RIBBONS</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Style</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.style || 'smooth'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['smooth', 'angular'] as const).map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, style: s } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.style || 'smooth') === s 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Texture</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.texture || 'vertical'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['vertical', 'woven'] as const).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, texture: t } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.texture || 'vertical') === t 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {t}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Variation</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.variation || 'uniform'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['uniform', 'variable'] as const).map((v) => (
                                      <button
                                        key={v}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, variation: v } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.variation || 'uniform') === v 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'waves' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">WAVES</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Amplitude</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.amplitude ?? 100}px</span>
                                  </div>
                                  <input 
                                    type="range" min="10" max="300" step="1"
                                    value={config.customSettings?.amplitude ?? 100}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, amplitude: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Frequency</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.frequency ?? 0.005).toFixed(4)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.001" max="0.02" step="0.001"
                                    value={config.customSettings?.frequency ?? 0.005}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, frequency: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Complexity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.complexity ?? 3} Layers</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" step="1"
                                    value={config.customSettings?.complexity ?? 3}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, complexity: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Fill Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.fillMode || 'outline'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['outline', 'solid'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, fillMode: m } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.fillMode || 'outline') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Mirror Mode</span>
                                  <button
                                    onClick={() => setConfig({
                                      ...config,
                                      customSettings: { ...config.customSettings, mirror: !config.customSettings?.mirror }
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full transition-colors relative",
                                      config.customSettings?.mirror ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                      config.customSettings?.mirror ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'particles' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">PARTICLES</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Connection Distance</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.connectionDistance ?? 100}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="300" step="1"
                                    value={config.customSettings?.connectionDistance ?? 100}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, connectionDistance: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Particle Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.particleSize ?? 2}px</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" step="0.5"
                                    value={config.customSettings?.particleSize ?? 2}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, particleSize: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Line Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.lineWidth ?? 0.5}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.1" max="5" step="0.1"
                                    value={config.customSettings?.lineWidth ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, lineWidth: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'repel'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['repel', 'attract', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'repel') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'glitch' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">GLITCH</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Glitch Frequency</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.glitchFrequency ?? 0.1).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.5" step="0.01"
                                    value={config.customSettings?.glitchFrequency ?? 0.1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glitchFrequency: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>RGB Shift</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.rgbShift ?? 2}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="20" step="1"
                                    value={config.customSettings?.rgbShift ?? 2}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, rgbShift: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Scanlines</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.scanlineIntensity ?? 0.1).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.5" step="0.01"
                                    value={config.customSettings?.scanlineIntensity ?? 0.1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, scanlineIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Distortion</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.distortion ?? 5}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="50" step="1"
                                    value={config.customSettings?.distortion ?? 5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, distortion: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Noise Level</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.noiseLevel ?? 0.05).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.2" step="0.01"
                                    value={config.customSettings?.noiseLevel ?? 0.05}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, noiseLevel: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'circuit' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">CIRCUIT</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grid Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.gridSize ?? 50}px</span>
                                  </div>
                                  <input 
                                    type="range" min="20" max="100" step="1"
                                    value={config.customSettings?.gridSize ?? 50}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, gridSize: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Pulse Speed</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.pulseSpeed ?? 2}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0.1" max="10" step="0.1"
                                    value={config.customSettings?.pulseSpeed ?? 2}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, pulseSpeed: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Connection Type</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.connectionType || 'orthogonal'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['orthogonal', 'direct'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, connectionType: m } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.connectionType || 'orthogonal') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Show Nodes</span>
                                  <button
                                    onClick={() => setConfig({
                                      ...config,
                                      customSettings: { ...config.customSettings, showNodes: !config.customSettings?.showNodes }
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full transition-colors relative",
                                      config.customSettings?.showNodes ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                      config.customSettings?.showNodes ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'matrix' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">MATRIX</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Font Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.fontSize ?? 16}px</span>
                                  </div>
                                  <input 
                                    type="range" min="8" max="32" step="1"
                                    value={config.customSettings?.fontSize ?? 16}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, fontSize: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Trail Length</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.trailLength ?? 0.15}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.01" max="0.5" step="0.01"
                                    value={config.customSettings?.trailLength ?? 0.15}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, trailLength: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Character Set</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.charSet || 'katakana'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['katakana', 'binary', 'alphanumeric', 'custom'] as const).map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, charSet: s } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.charSet || 'katakana') === s 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {s.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Glow Effect</span>
                                  <button
                                    onClick={() => setConfig({
                                      ...config,
                                      customSettings: { ...config.customSettings, glow: !config.customSettings?.glow }
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full transition-colors relative",
                                      config.customSettings?.glow ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                      config.customSettings?.glow ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Rainbow Mode</span>
                                  <button
                                    onClick={() => setConfig({
                                      ...config,
                                      customSettings: { ...config.customSettings, rainbow: !config.customSettings?.rainbow }
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full transition-colors relative",
                                      config.customSettings?.rainbow ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                      config.customSettings?.rainbow ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'topology' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">TOPOLOGY</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Noise Scale</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.noiseScale ?? 0.002).toFixed(4)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.0005" max="0.01" step="0.0005"
                                    value={config.customSettings?.noiseScale ?? 0.002}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, noiseScale: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Complexity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.complexity ?? 15} Layers</span>
                                  </div>
                                  <input 
                                    type="range" min="5" max="50" step="1"
                                    value={config.customSettings?.complexity ?? 15}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, complexity: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Line Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.lineWidth ?? 1}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="5" step="0.5"
                                    value={config.customSettings?.lineWidth ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, lineWidth: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Radius</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.interactionRadius ?? 200}px</span>
                                  </div>
                                  <input 
                                    type="range" min="50" max="500" step="10"
                                    value={config.customSettings?.interactionRadius ?? 200}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, interactionRadius: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'minimal' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">MINIMAL</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grid Type</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.gridType || 'dots'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['dots', 'crosses', 'squares', 'lines'] as const).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, gridType: t } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.gridType || 'dots') === t 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {t.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grid Spacing</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.gridSpacing ?? 40}px</span>
                                  </div>
                                  <input 
                                    type="range" min="20" max="100" step="1"
                                    value={config.customSettings?.gridSpacing ?? 40}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, gridSpacing: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Element Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.elementSize ?? 1}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="5" step="0.1"
                                    value={config.customSettings?.elementSize ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, elementSize: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Pulse Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.pulseIntensity ?? 0.5).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="2" step="0.01"
                                    value={config.customSettings?.pulseIntensity ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, pulseIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'scale'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['scale', 'repel', 'attract', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'scale') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'gravity' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">GRAVITY</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'prism' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">PRISM</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Shard Type</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.shardType || 'triangles'}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['triangles', 'squares', 'hexagons'] as const).map((t) => (
                                      <button
                                        key={t}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, shardType: t } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.shardType || 'triangles') === t 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {t.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Size Range</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.minSize ?? 50} - {config.customSettings?.maxSize ?? 150}px</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <input 
                                      type="range" min="10" max="100" step="1"
                                      value={config.customSettings?.minSize ?? 50}
                                      onChange={(e) => setConfig({ 
                                        ...config, 
                                        customSettings: { ...config.customSettings, minSize: parseInt(e.target.value) } 
                                      })}
                                      className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <input 
                                      type="range" min="100" max="300" step="1"
                                      value={config.customSettings?.maxSize ?? 150}
                                      onChange={(e) => setConfig({ 
                                        ...config, 
                                        customSettings: { ...config.customSettings, maxSize: parseInt(e.target.value) } 
                                      })}
                                      className="flex-1 h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Rotation Speed</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.rotationSpeed ?? 1}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="5" step="0.1"
                                    value={config.customSettings?.rotationSpeed ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, rotationSpeed: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Float Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.floatIntensity ?? 0.5}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="2" step="0.1"
                                    value={config.customSettings?.floatIntensity ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, floatIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blur Amount</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.blurAmount ?? 0}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="20" step="1"
                                    value={config.customSettings?.blurAmount ?? 0}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, blurAmount: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'beams' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">BEAMS</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Beam Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.beamWidth ?? 2}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="10" step="0.5"
                                    value={config.customSettings?.beamWidth ?? 2}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, beamWidth: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Beam Length</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.beamLength ?? 600}px</span>
                                  </div>
                                  <input 
                                    type="range" min="100" max="1500" step="50"
                                    value={config.customSettings?.beamLength ?? 600}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, beamLength: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Glow Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.glowIntensity ?? 0.5}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="2" step="0.1"
                                    value={config.customSettings?.glowIntensity ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glowIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'grainy' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">GRAINY</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grain Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.grainIntensity ?? 0.5).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={config.customSettings?.grainIntensity ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, grainIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grain Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.grainSize ?? 1}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="5" step="0.5"
                                    value={config.customSettings?.grainSize ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, grainSize: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Mesh Speed</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.meshSpeed ?? 0.5}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="2" step="0.1"
                                    value={config.customSettings?.meshSpeed ?? 0.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, meshSpeed: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Mesh Complexity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.meshComplexity ?? 4} Blobs</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" step="1"
                                    value={config.customSettings?.meshComplexity ?? 4}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, meshComplexity: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'blobs' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">BLOBS</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Gooeyness</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.gooeyness ?? 40}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="100" step="1"
                                    value={config.customSettings?.gooeyness ?? 40}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, gooeyness: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Contrast</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.contrast ?? 80}</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="200" step="1"
                                    value={config.customSettings?.contrast ?? 80}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, contrast: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blob Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.blobSize ?? 400}px</span>
                                  </div>
                                  <input 
                                    type="range" min="100" max="1000" step="10"
                                    value={config.customSettings?.blobSize ?? 400}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, blobSize: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Float Range</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.floatRange ?? 200}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="500" step="10"
                                    value={config.customSettings?.floatRange ?? 200}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, floatRange: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'spark' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">SPARK</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Spark Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.sparkSize ?? 2}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="10" step="0.5"
                                    value={config.customSettings?.sparkSize ?? 2}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, sparkSize: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Gravity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.gravity ?? 0.1}</span>
                                  </div>
                                  <input 
                                    type="range" min="-1" max="1" step="0.05"
                                    value={config.customSettings?.gravity ?? 0.1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, gravity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Friction</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.friction ?? 0.98}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.8" max="1" step="0.01"
                                    value={config.customSettings?.friction ?? 0.98}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, friction: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Trail Length</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.trailLength ?? 0.1}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.01" max="0.5" step="0.01"
                                    value={config.customSettings?.trailLength ?? 0.1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, trailLength: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Glow Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.glowIntensity ?? 1.0}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="3" step="0.1"
                                    value={config.customSettings?.glowIntensity ?? 1.0}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glowIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'glass' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">GLASS</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blur</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.blur ?? 40}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="100" step="1"
                                    value={config.customSettings?.blur ?? 40}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, blur: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Frost</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.frost ?? 5}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="40" step="1"
                                    value={config.customSettings?.frost ?? 5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, frost: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Refraction</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.refraction ?? 20}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="100" step="1"
                                    value={config.customSettings?.refraction ?? 20}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, refraction: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Shape</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.shape || 'rect'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['rect', 'circle', 'pill'] as const).map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, shape: s } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.shape || 'rect') === s 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {s.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Mesh Layer</span>
                                  <button
                                    onClick={() => setConfig({
                                      ...config,
                                      customSettings: { ...config.customSettings, meshLayer: !config.customSettings?.meshLayer }
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full transition-colors relative",
                                      config.customSettings?.meshLayer ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                      config.customSettings?.meshLayer ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'spotlight' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">SPOTLIGHT</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Spotlight Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.spotlightSize ?? 600}px</span>
                                  </div>
                                  <input 
                                    type="range" min="200" max="1500" step="10"
                                    value={config.customSettings?.spotlightSize ?? 600}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, spotlightSize: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Beam Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{(config.customSettings?.beamIntensity ?? 0.6).toFixed(2)}</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="1" step="0.05"
                                    value={config.customSettings?.beamIntensity ?? 0.6}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, beamIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Flicker</span>
                                  <button 
                                    onClick={() => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, flicker: !config.customSettings?.flicker } 
                                    })}
                                    className={cn(
                                      "w-8 h-4 rounded-full relative transition-colors",
                                      (config.customSettings?.flicker ?? true) ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-2 h-2 bg-white rounded-full transition-all",
                                      (config.customSettings?.flicker ?? true) ? "left-5" : "left-1"
                                    )} />
                                  </button>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Show Beam</span>
                                  <button 
                                    onClick={() => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, showBeam: !config.customSettings?.showBeam } 
                                    })}
                                    className={cn(
                                      "w-8 h-4 rounded-full relative transition-colors",
                                      (config.customSettings?.showBeam ?? true) ? "bg-indigo-600" : "bg-black/20 dark:bg-white/20"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-2 h-2 bg-white rounded-full transition-all",
                                      (config.customSettings?.showBeam ?? true) ? "left-5" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'bento' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">BENTO</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Gap</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.gap ?? 1}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="20" step="1"
                                    value={config.customSettings?.gap ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, gap: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Radius</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.radius ?? 0}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="40" step="1"
                                    value={config.customSettings?.radius ?? 0}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, radius: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Spotlight Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.spotlightSize ?? 600}px</span>
                                  </div>
                                  <input 
                                    type="range" min="200" max="1200" step="10"
                                    value={config.customSettings?.spotlightSize ?? 600}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, spotlightSize: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Pattern</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.pattern || 'standard'}</span>
                                  </div>
                                  <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['standard', 'masonry'] as const).map((p) => (
                                      <button
                                        key={p}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, pattern: p } 
                                        })}
                                        className={cn(
                                          "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.pattern || 'standard') === p 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {p.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'columns' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">COLUMNS</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Glow Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.glowWidth ?? 10}%</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="50" step="1"
                                    value={config.customSettings?.glowWidth ?? 10}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glowWidth: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Scan Direction</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.scanDirection || 'down'}</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['up', 'down', 'random'] as const).map((d) => (
                                      <button
                                        key={d}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, scanDirection: d } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.scanDirection || 'down') === d 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {d.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Show Borders</span>
                                  <button 
                                    onClick={() => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, showBorders: !(config.customSettings?.showBorders ?? true) } 
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full relative transition-colors",
                                      (config.customSettings?.showBorders ?? true) ? "bg-indigo-600" : "bg-neutral-300 dark:bg-neutral-700"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                      (config.customSettings?.showBorders ?? true) ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'stripes' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">STRIPES</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Orientation</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.orientation || 'vertical'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['vertical', 'horizontal'] as const).map((o) => (
                                      <button
                                        key={o}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, orientation: o } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.orientation || 'vertical') === o 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {o.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Line Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.lineWidth ?? 1}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="10" step="0.5"
                                    value={config.customSettings?.lineWidth ?? 1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, lineWidth: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Glow Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{((config.customSettings?.glowIntensity ?? 0.1) * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="1" step="0.01"
                                    value={config.customSettings?.glowIntensity ?? 0.1}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glowIntensity: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'ripple' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">RIPPLE</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Ripple Size</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.maxRadius ?? 200}px</span>
                                  </div>
                                  <input 
                                    type="range" min="50" max="600" step="10"
                                    value={config.customSettings?.maxRadius ?? 200}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, maxRadius: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Ring Count</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.ringCount ?? 3}</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" step="1"
                                    value={config.customSettings?.ringCount ?? 3}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, ringCount: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Chain Probability</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{((config.customSettings?.chainProbability ?? 0.05) * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.5" step="0.01"
                                    value={config.customSettings?.chainProbability ?? 0.05}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, chainProbability: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Line Width</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.lineWidth ?? 1.5}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0.5" max="10" step="0.5"
                                    value={config.customSettings?.lineWidth ?? 1.5}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, lineWidth: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="flex items-center justify-between py-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">Glow Effect</span>
                                  <button 
                                    onClick={() => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, glow: !(config.customSettings?.glow ?? false) } 
                                    })}
                                    className={cn(
                                      "w-10 h-5 rounded-full relative transition-colors",
                                      (config.customSettings?.glow ?? false) ? "bg-indigo-600" : "bg-neutral-300 dark:bg-neutral-700"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                      (config.customSettings?.glow ?? false) ? "left-6" : "left-1"
                                    )} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'metapool' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">METAPOOL</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'pool' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">POOL</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Interaction Mode</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.interactionMode || 'attach'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['attach', 'detach'] as const).map((m) => (
                                      <button
                                        key={m}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, interactionMode: m } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.interactionMode || 'attach') === m 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {m.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Damping</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.damping ?? 0.98}</span>
                                  </div>
                                  <input 
                                    type="range" min="0.9" max="0.99" step="0.01"
                                    value={config.customSettings?.damping ?? 0.98}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, damping: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Resolution</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.resolution ?? 10}px</span>
                                  </div>
                                  <input 
                                    type="range" min="5" max="30" step="1"
                                    value={config.customSettings?.resolution ?? 10}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, resolution: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Drop Strength</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.dropStrength ?? 20}</span>
                                  </div>
                                  <input 
                                    type="range" min="5" max="100" step="5"
                                    value={config.customSettings?.dropStrength ?? 20}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, dropStrength: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Distortion</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.distortion ?? 1.0}x</span>
                                  </div>
                                  <input 
                                    type="range" min="0.1" max="5" step="0.1"
                                    value={config.customSettings?.distortion ?? 1.0}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, distortion: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {config.type === 'aurora' && (
                            <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 block mb-2">
                                Specific Controls
                                <span className="ml-2 text-indigo-500 dark:text-indigo-400">AURORA</span>
                              </label>
                              
                              <div className="space-y-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Animation Style</span>
                                    <span className="text-indigo-500 dark:text-indigo-400 capitalize">{config.customSettings?.animationStyle || 'blobs'}</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                                    {(['blobs', 'waves'] as const).map((s) => (
                                      <button
                                        key={s}
                                        onClick={() => setConfig({ 
                                          ...config, 
                                          customSettings: { ...config.customSettings, animationStyle: s } 
                                        })}
                                        className={cn(
                                          "py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                          (config.customSettings?.animationStyle || 'blobs') === s 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                      >
                                        {s.toUpperCase()}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Blur</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.blur ?? 100}px</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="200" step="1"
                                    value={config.customSettings?.blur ?? 100}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, blur: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Grain Intensity</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{((config.customSettings?.grain ?? 0.03) * 100).toFixed(0)}%</span>
                                  </div>
                                  <input 
                                    type="range" min="0" max="0.2" step="0.01"
                                    value={config.customSettings?.grain ?? 0.03}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, grain: parseFloat(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                                    <span>Height</span>
                                    <span className="text-indigo-500 dark:text-indigo-400">{config.customSettings?.height ?? 100}%</span>
                                  </div>
                                  <input 
                                    type="range" min="10" max="100" step="5"
                                    value={config.customSettings?.height ?? 100}
                                    onChange={(e) => setConfig({ 
                                      ...config, 
                                      customSettings: { ...config.customSettings, height: parseInt(e.target.value) } 
                                    })}
                                    className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                            <span>SPEED</span>
                            <span className="text-indigo-500 dark:text-indigo-400">{config.speed.toFixed(1)}X</span>
                          </div>
                          <input 
                            type="range" min="0.1" max="5" step="0.1"
                            value={config.speed}
                            onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                            <span>DENSITY</span>
                            <span className="text-indigo-500 dark:text-indigo-400">{config.density}</span>
                          </div>
                          <input 
                            type="range" min="5" max="100" step="1"
                            value={config.density}
                            onChange={(e) => setConfig({ ...config, density: parseInt(e.target.value) })}
                            className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                            <span>ALIGNMENT</span>
                            <span className="text-indigo-500 dark:text-indigo-400 uppercase">{config.alignment || 'center'}</span>
                          </div>
                          <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
                            {(['left', 'center', 'right'] as const).map((align) => (
                              <button
                                key={align}
                                onClick={() => setConfig({ ...config, alignment: align })}
                                className={cn(
                                  "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                                  (config.alignment || 'center') === align 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                              >
                                {align.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                            <span>OPACITY</span>
                            <span className="text-indigo-500 dark:text-indigo-400">{(config.opacity * 100).toFixed(0)}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="1" step="0.01"
                            value={config.opacity}
                            onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
                            className="w-full h-1 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
