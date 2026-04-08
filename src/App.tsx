import React, { useState, useEffect } from 'react';
import { GeometrySVG } from './components/GeometrySVG';
import { StepPanel } from './components/StepPanel';
import { SubtitleOverlay } from './components/SubtitleOverlay';
import { tutorialSteps } from './data/steps';
import { ttsService } from './services/ttsService';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  // 当步骤改变时，自动触发 TTS 朗读
  useEffect(() => {
    ttsService.play(tutorialSteps[currentStep].tts);
    return () => ttsService.stop();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center px-6 justify-between shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full tracking-wider">
              几何动点 / 相似模型
            </span>
            <h1 className="text-lg font-bold text-slate-800">
              “手拉手”旋转相似模型精讲
            </h1>
          </div>
          <div className="text-sm text-slate-400 font-medium">
            步骤 {currentStep + 1} / {tutorialSteps.length}
          </div>
        </header>

        {/* Main Content Area (Fixed Height 570px) */}
        <main className="flex flex-col md:flex-row h-[570px] relative">
          
          {/* Left: Geometry Visuals (55%) */}
          <section className="w-full md:w-[55%] h-full relative bg-white">
            <GeometrySVG step={currentStep} />
            <SubtitleOverlay />
          </section>

          {/* Right: Logic Steps (45%) */}
          <section className="w-full md:w-[45%] h-full relative">
            <StepPanel steps={tutorialSteps} currentStep={currentStep} />
          </section>

        </main>

        {/* Footer Controls */}
        <footer className="h-16 border-t border-slate-100 bg-white flex items-center justify-between px-6 shrink-0 z-10">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 font-medium text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-5 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-50 border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </button>
            <button 
              onClick={handleNext}
              disabled={currentStep === tutorialSteps.length - 1}
              className="flex items-center gap-1 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
