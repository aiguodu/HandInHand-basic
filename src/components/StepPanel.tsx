import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { StepData } from '../data/steps';

interface StepPanelProps {
  steps: StepData[];
  currentStep: number;
}

export function StepPanel({ steps, currentStep }: StepPanelProps) {
  return (
    <div className="w-full h-full bg-slate-50 border-l border-slate-200 overflow-y-auto p-6 scroll-smooth">
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isPast || isActive ? 1 : 0.3, y: 0 }}
              className={cn(
                "relative pl-6 border-l-2 transition-colors duration-300",
                isActive ? "border-blue-500" : isPast ? "border-slate-300" : "border-transparent"
              )}
            >
              {/* 节点指示器 */}
              <div className={cn(
                "absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white transition-colors duration-300",
                isActive ? "border-blue-500 text-blue-500" : isPast ? "border-slate-300 text-slate-400" : "border-slate-200 text-slate-200"
              )}>
                <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-blue-500" : isPast ? "bg-slate-300" : "bg-transparent")} />
              </div>

              <div className={cn("flex items-center gap-2 mb-2", isActive ? "text-slate-900" : "text-slate-500")}>
                {step.icon}
                <h3 className="font-bold text-lg">{step.title}</h3>
              </div>
              
              <p className={cn("text-sm mb-3", isActive ? "text-slate-600" : "text-slate-400")}>
                {step.desc}
              </p>

              {/* 详细推导过程 (仅在当前步骤或已完成步骤显示) */}
              <motion.div 
                initial={false}
                animate={{ height: isActive || isPast ? 'auto' : 0, opacity: isActive || isPast ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className={cn(
                  "p-4 rounded-lg text-sm leading-relaxed",
                  isActive ? "bg-white shadow-sm border border-slate-100" : "bg-slate-100/50 text-slate-500"
                )}>
                  {step.detail}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
