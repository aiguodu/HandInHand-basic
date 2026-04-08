import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Loader2, Pause } from 'lucide-react';
import { ttsService, TTSState } from '../services/ttsService';

export function SubtitleOverlay() {
  const [state, setState] = useState<TTSState>('idle');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((newState, newSubtitle) => {
      setState(newState);
      setSubtitle(newSubtitle);
    });
    return unsubscribe;
  }, []);

  return (
    <AnimatePresence>
      {state !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-h-[120px] bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 flex items-start gap-4 z-50"
        >
          <div className="shrink-0 mt-1">
            {state === 'loading' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
            {state === 'playing' && <Volume2 className="w-5 h-5 text-emerald-400 animate-pulse" />}
            {state === 'paused' && <Pause className="w-5 h-5 text-amber-400" />}
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium tracking-wide">
              {subtitle}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
