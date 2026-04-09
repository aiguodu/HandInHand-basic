import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Pause, Loader , Home } from 'lucide-react';
import { tutorialSteps as steps } from './data/steps';
import { GeometrySVG } from './components/GeometrySVG';
import { generateAndPlayTts, stopCurrentTts } from './ttsService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TtsState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);

  // TTS state
  const [ttsState, setTtsState] = useState<TtsState>('idle');
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop TTS when step changes
  useEffect(() => {
    stopCurrentTts();
    audioRef.current = null;
    setTtsState('idle');
    setTtsError(null);
    setSubtitle(null);
  }, [currentStep]);

  // ---------------------------------------------------------------------------
  // TTS playback
  // ---------------------------------------------------------------------------
  const handlePlayPause = useCallback(async () => {
    if (ttsState === 'loading') return;

    if (ttsState === 'playing') {
      audioRef.current?.pause();
      setTtsState('paused');
      return;
    }

    if (ttsState === 'paused' && audioRef.current) {
      audioRef.current.play();
      setTtsState('playing');
      return;
    }

    // Start fresh
    setTtsState('loading');
    setTtsError(null);
    const ttsText = steps[currentStep].tts;
    setSubtitle(ttsText);

    try {
      const audio = await generateAndPlayTts(
        ttsText,
        undefined,
        () => {
          setTtsState('idle');
        }
      );
      audioRef.current = audio;
      setTtsState('playing');
    } catch (err) {
      console.error('[TTS]', err);
      setTtsError('TTS 生成失败，请检查代理服务。');
      setTtsState('error');
    }
  }, [ttsState, currentStep]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------
  const ttsIcon = () => {
    switch (ttsState) {
      case 'loading': return <Loader className="w-5 h-5 animate-spin" />;
      case 'playing': return <Pause className="w-5 h-5" />;
      default:        return <Play  className="w-5 h-5" />;
    }
  };

  const ttsLabel = () => {
    switch (ttsState) {
      case 'loading': return '生成中…';
      case 'playing': return '暂停讲解';
      case 'paused':  return '继续讲解';
      default:        return 'Tina老师讲解';
    }
  };

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------
  const nextStep = () => setCurrentStep((s: number) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((s: number) => Math.max(s - 1, 0));
  const reset = () => setCurrentStep(0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex items-center justify-center font-sans text-slate-900">
      <div className="flex flex-col w-full max-w-6xl mx-auto bg-slate-50 rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* ── Header ── */}
        <header className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="/" className="text-slate-400 hover:text-blue-600 transition-colors p-1" title="返回主页"><Home className="w-5 h-5" /></a>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-bold">
              几何动点 / 相似模型
            </span>
            <div className="relative cursor-help" onMouseEnter={() => setShowQuestion(true)} onMouseLeave={() => setShowQuestion(false)}>
              <h1 className="text-xl font-bold text-slate-800">
              “手拉手”旋转相似模型精讲
            </h1>
              <AnimatePresence>
                {showQuestion && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute z-50 top-full left-0 mt-2 p-2 bg-white rounded-xl shadow-2xl border border-slate-200 w-[400px]">
                    <div className="text-xs text-slate-400 mb-1 px-1">题目原题预览</div>
                    <img src="/images/12.png" alt="题目原题" className="w-full h-auto rounded-lg border border-slate-100" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            进度 {currentStep + 1} / {steps.length}
          </div>
        </header>

        {/* ── Main Content Area ── */}
        <div className="flex flex-col md:flex-row h-[570px]">
          
          {/* ── Left: Visual Area ── */}
          <div className="w-full md:w-[55%] relative bg-white border-r border-slate-200 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full p-6 flex items-center justify-center">
              <GeometrySVG step={currentStep} />
            </div>

            {/* Subtitle Overlay */}
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.35 }}
                  className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none z-20 flex justify-center"
                >
                  <div className="bg-slate-900/60 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-white/10 w-[90%] max-w-2xl">
                    <p className="text-sm leading-relaxed text-center font-medium tracking-wide">
                      {subtitle}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Explanation Area ── */}
          <div className="w-full md:w-[45%] bg-slate-50 flex flex-col overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-6 flex flex-col gap-4"
              >
                {/* Step title */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-blue-500">
                    {(() => {
                      const Icon = steps[currentStep].icon;
                      if (!Icon) return null;
                      if (React.isValidElement(Icon)) return Icon;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{steps[currentStep].title}</h2>
                </div>

                {/* Description */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
                    {steps[currentStep].desc}
                  </p>
                </div>

                {/* Detail derivation */}
                <div className="bg-slate-100 p-5 rounded-xl border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">详细推导过程</h3>
                  <div className="text-slate-600 leading-loose whitespace-pre-line text-sm">
                    {steps[currentStep].detail}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="bg-white px-6 py-4 border-t border-slate-200 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button 
              onClick={reset}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm px-4 py-2 hover:bg-slate-50 rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              重新开始
            </button>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePlayPause}
              disabled={ttsState === 'loading'}
              className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-full font-bold text-white transition-all shadow-md active:scale-95 ${
                ttsState === 'playing' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
                ttsError ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' :
                'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              } disabled:opacity-70 disabled:cursor-not-allowed text-sm`}
            >
              {ttsIcon()}
              {ttsError ? '重试讲解' : ttsLabel()}
            </button>
          </div>
          
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              上一步
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-1 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
            >
              {currentStep === steps.length - 1 ? '讲解完成' : '下一步'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
