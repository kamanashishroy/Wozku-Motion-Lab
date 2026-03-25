import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';
import { BackgroundConfig } from '../../types';
import { cn } from '../../lib/utils';
import copy from 'copy-to-clipboard';
import { generateTechnicalPrompt, generateExportCode } from '../../services/promptService';

interface CodeModalProps {
  config: BackgroundConfig;
  showCode: boolean;
  setShowCode: (show: boolean) => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  config,
  showCode,
  setShowCode
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'prompt'>('code');
  const [framework, setFramework] = useState<'react' | 'vanilla'>('react');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = activeTab === 'prompt' 
      ? generateTechnicalPrompt(config, framework)
      : generateExportCode(config);
    
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {showCode && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCode(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl glass rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] dark:bg-neutral-900"
          >
            <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Motion Architect</h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Export production-ready code or technical specs for your AI developer</p>
                </div>
              </div>
              <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-black/5 dark:border-white/10">
                <button 
                  onClick={() => setActiveTab('code')}
                  className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", activeTab === 'code' ? "bg-indigo-600 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
                >
                  CODE
                </button>
                <button 
                  onClick={() => setActiveTab('prompt')}
                  className={cn("px-4 py-1.5 rounded-md text-xs font-bold transition-all", activeTab === 'prompt' ? "bg-indigo-600 text-white shadow-lg" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white")}
                >
                  PROMPT
                </button>
              </div>
              {activeTab === 'prompt' && (
                <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-black/5 dark:border-white/10 ml-4">
                  <button 
                    onClick={() => setFramework('react')}
                    className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all", framework === 'react' ? "bg-black/10 dark:bg-white/10 text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white")}
                  >
                    REACT
                  </button>
                  <button 
                    onClick={() => setFramework('vanilla')}
                    className={cn("px-3 py-1 rounded-md text-[10px] font-bold transition-all", framework === 'vanilla' ? "bg-black/10 dark:bg-white/10 text-neutral-900 dark:text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white")}
                  >
                    VANILLA
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-hidden p-6 bg-neutral-900/50">
              <div className="relative h-full rounded-xl overflow-hidden border border-white/5 bg-black/40">
                <pre className="p-6 text-sm font-mono text-neutral-300 overflow-auto h-full scrollbar-hide">
                  <code>{activeTab === 'prompt' ? generateTechnicalPrompt(config, framework) : generateExportCode(config)}</code>
                </pre>
                <button 
                  onClick={handleCopy}
                  className="absolute top-4 right-4 p-2.5 glass rounded-xl hover:bg-white/10 transition-all text-white group"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/10 flex justify-end">
              <button 
                onClick={() => setShowCode(false)}
                className="px-6 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-900 dark:text-white text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
