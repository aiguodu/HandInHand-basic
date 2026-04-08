import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface GeometrySVGProps {
  step: number;
}

// 核心坐标点计算 (严格按照 3:4:5 比例和题目相对位置)
const pts = {
  A: { x: 200, y: 80 },
  B: { x: 200, y: 260 },
  C: { x: 440, y: 260 },
  D: { x: 148.4, y: 153.7 },
  E: { x: 246.7, y: 222.5 },
  F: { x: 175.1, y: 208.5 },
  G: { x: 200, y: 213.4 }
};

// 辅助函数：生成圆弧路径
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export function GeometrySVG({ step }: GeometrySVGProps) {
  return (
    // 防遮挡策略：pt-8 pb-24 将图形重心上移，为底部字幕留出空间
    <div className="w-full h-full flex items-start justify-center pt-8 pb-24 relative">
      <svg 
        viewBox="80 50 400 250" 
        className="w-full h-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
            <circle cx="5" cy="5" r="5" fill="#334155" />
          </marker>
        </defs>

        {/* 基础直角标记 */}
        <path d="M 200 245 L 215 245 L 215 260" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M 155.3 143.9 L 165.1 150.7 L 158.2 160.6" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

        {/* 基础图形：△ABC 和 △ADE */}
        <polygon 
          points={`${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}`}
          fill="none" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round"
        />
        <polygon 
          points={`${pts.A.x},${pts.A.y} ${pts.D.x},${pts.D.y} ${pts.E.x},${pts.E.y}`}
          fill="none" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round"
        />

        {/* 动画层：高亮与辅助线 */}
        <AnimatePresence>
          {/* Step 1: 核心角高亮 */}
          {step === 1 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* ∠BAC */}
              <path d={describeArc(pts.A.x, pts.A.y, 40, 36.87, 90)} fill="none" stroke="#3b82f6" strokeWidth="3" />
              {/* ∠DAE */}
              <path d={describeArc(pts.A.x, pts.A.y, 45, 71.87, 125)} fill="none" stroke="#ef4444" strokeWidth="3" />
              
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }}
                d={describeArc(pts.A.x, pts.A.y, 55, 90, 125)} fill="none" stroke="#10b981" strokeWidth="4" 
              />
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1 }}
                d={describeArc(pts.A.x, pts.A.y, 55, 36.87, 71.87)} fill="none" stroke="#10b981" strokeWidth="4" 
              />
            </motion.g>
          )}

          {/* Step 2 & 3: 新的相似三角形 △DAB 和 △EAC */}
          {step >= 2 && step <= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.polygon 
                points={`${pts.D.x},${pts.D.y} ${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y}`}
                fill="rgba(59, 130, 246, 0.15)" stroke="none"
              />
              <motion.polygon 
                points={`${pts.E.x},${pts.E.y} ${pts.A.x},${pts.A.y} ${pts.C.x},${pts.C.y}`}
                fill="rgba(16, 185, 129, 0.15)" stroke="none"
              />
            </motion.g>
          )}

          {/* 辅助线 BD 和 CE (从 Step 2 开始出现) */}
          {step >= 2 && (
            <motion.g>
              <motion.line 
                x1={pts.D.x} y1={pts.D.y} x2={pts.B.x} y2={pts.B.y}
                stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <motion.line 
                x1={pts.E.x} y1={pts.E.y} x2={pts.C.x} y2={pts.C.y}
                stroke="#10b981" strokeWidth="2" strokeDasharray="4 4"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
            </motion.g>
          )}

          {/* Step 4: 转移目标角 (延长 CE 交 BD 于 F) */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* 延长线 EF */}
              <motion.line 
                x1={pts.E.x} y1={pts.E.y} x2={pts.F.x} y2={pts.F.y}
                stroke="#f59e0b" strokeWidth="2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
              />
              {/* 高亮 △BFG 和 △CAG */}
              <polygon points={`${pts.B.x},${pts.B.y} ${pts.F.x},${pts.F.y} ${pts.G.x},${pts.G.y}`} fill="rgba(245, 158, 11, 0.2)" />
              <polygon points={`${pts.C.x},${pts.C.y} ${pts.A.x},${pts.A.y} ${pts.G.x},${pts.G.y}`} fill="rgba(245, 158, 11, 0.2)" />
              
              {/* 标记对顶角 */}
              <path d={describeArc(pts.G.x, pts.G.y, 15, 191, 270)} fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d={describeArc(pts.G.x, pts.G.y, 15, 11, 90)} fill="none" stroke="#ef4444" strokeWidth="2" />
            </motion.g>
          )}

          {/* Step 5: 最终计算，高亮大直角三角形 */}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* 延长线 EF 保持 */}
              <line x1={pts.E.x} y1={pts.E.y} x2={pts.F.x} y2={pts.F.y} stroke="#f59e0b" strokeWidth="2" />
              <polygon points={`${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}`} fill="rgba(239, 68, 68, 0.1)" />
              <path d={describeArc(pts.A.x, pts.A.y, 30, 36.87, 90)} fill="none" stroke="#ef4444" strokeWidth="3" />
              <path d={describeArc(pts.F.x, pts.F.y, 20, 11.9, 64.2)} fill="none" stroke="#ef4444" strokeWidth="3" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* 顶点标签 (置于最顶层) */}
        <g className="font-serif italic text-[14px] fill-slate-700 select-none">
          <text x={pts.A.x} y={pts.A.y - 10} textAnchor="middle">A</text>
          <text x={pts.B.x - 10} y={pts.B.y + 15} textAnchor="end">B</text>
          <text x={pts.C.x + 10} y={pts.C.y + 15} textAnchor="start">C</text>
          <text x={pts.D.x - 10} y={pts.D.y} textAnchor="end">D</text>
          <text x={pts.E.x + 5} y={pts.E.y + 15} textAnchor="start">E</text>
          {step >= 4 && (
            <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={pts.F.x - 10} y={pts.F.y + 5} textAnchor="end">F</motion.text>
          )}
          {step >= 4 && (
            <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={pts.G.x + 8} y={pts.G.y - 5} textAnchor="start">G</motion.text>
          )}
        </g>
      </svg>
    </div>
  );
}
