import React, { ReactNode } from 'react';
import { Lightbulb, Search, Scissors, Ruler, Move, Calculator } from 'lucide-react';

export interface StepData {
  title: string;
  icon: ReactNode;
  desc: string;
  detail: ReactNode;
  tts: string;
}

export const tutorialSteps: StepData[] = [
  {
    title: "解题思路：寻找隐藏模型",
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    desc: "将复杂图形转化为经典“手拉手”模型",
    detail: (
      <div className="space-y-2 text-slate-700">
        <p>遇到共顶点的两个相似三角形，我们要立刻想到利用<strong className="text-blue-600">旋转相似</strong>，去寻找新的相似三角形。</p>
        <p>本题中，△ABC 和 △ADE 都是直角三角形，且边长比例相同，它们共顶点 A，这是一个标准的“手拉手”几何模型。</p>
      </div>
    ),
    tts: "同学们，这道题看起来条件很多，但其实是一个非常经典的“手拉手”几何模型。遇到共顶点的两个相似三角形，我们要立刻想到利用旋转相似，去寻找新的相似三角形。让我们一步步来拆解。"
  },
  {
    title: "第一步：挖掘隐含条件",
    icon: <Search className="w-5 h-5 text-blue-500" />,
    desc: "证明核心夹角相等",
    detail: (
      <div className="space-y-2 text-slate-700 font-serif">
        <p>∵ △ABC ∽ △ADE</p>
        <p>∴ ∠BAC = ∠DAE</p>
        <p>等式两边同时减去公共角 ∠BAE：</p>
        <p>∠BAC - ∠BAE = ∠DAE - ∠BAE</p>
        <p className="font-bold text-blue-600">∴ ∠EAC = ∠DAB</p>
      </div>
    ),
    tts: "首先，因为两个直角三角形的边长比例相同，所以它们是相似的。这就意味着它们的顶角相等。我们把这两个重叠的角同时减去中间的公共角，就能得到两个关键的夹角相等，也就是角 DAB 等于 角 EAC。"
  },
  {
    title: "第二步：证明新的相似",
    icon: <Scissors className="w-5 h-5 text-emerald-500" />,
    desc: "利用 SAS 证明 △DAB ∽ △EAC",
    detail: (
      <div className="space-y-2 text-slate-700 font-serif">
        <p>在 △DAB 和 △EAC 中：</p>
        <p>∵ △ABC ∽ △ADE</p>
        <p>∴ AB/AC = AD/AE = 3/5</p>
        <p>又 ∵ ∠DAB = ∠EAC</p>
        <p className="font-bold text-emerald-600">∴ △DAB ∽ △EAC (SAS)</p>
      </div>
    ),
    tts: "接着，我们看这两对边。根据原来的相似三角形，对应边的比例是相等的。结合我们刚才证明的夹角相等，根据“边角边”定理，我们就可以证明三角形 DAB 和三角形 EAC 相似啦。"
  },
  {
    title: "第三步：解决第一问",
    icon: <Ruler className="w-5 h-5 text-purple-500" />,
    desc: "利用相似比求线段比值",
    detail: (
      <div className="space-y-2 text-slate-700 font-serif">
        <p>∵ △DAB ∽ △EAC</p>
        <p>∴ BD/CE = AD/AE</p>
        <p>在 Rt△ADE 中，AD/DE = 3/4</p>
        <p>设 AD=3x, DE=4x，由勾股定理得 AE=5x</p>
        <p>∴ AD/AE = 3/5</p>
        <p className="font-bold text-purple-600">∴ BD/CE = 3/5</p>
      </div>
    ),
    tts: "既然这两个三角形相似，那么它们对应边的比值就等于相似比。要求 BD 比 CE，其实就是求 AD 比 AE。在直角三角形 ADE 中，利用勾股定理很容易算出 AD 比 AE 等于 5分之3。第一问就迎刃而解了。"
  },
  {
    title: "第四步：转移目标角",
    icon: <Move className="w-5 h-5 text-orange-500" />,
    desc: "利用相似和对顶角转移 ∠BFC",
    detail: (
      <div className="space-y-2 text-slate-700 font-serif">
        <p>设 AB 交 CE 于点 G。</p>
        <p>∵ △DAB ∽ △EAC</p>
        <p>∴ ∠ABD = ∠ACE (即 ∠FBG = ∠ACG)</p>
        <p>在 △BFG 和 △CAG 中：</p>
        <p>∠FBG = ∠ACG, ∠BGF = ∠AGC (对顶角)</p>
        <p className="font-bold text-orange-600">∴ ∠BFC = ∠BAC</p>
      </div>
    ),
    tts: "第二问要求角 BFC 的正弦值。我们设 AB 和 CE 交于点 G。利用刚才的相似三角形，我们知道角 ABD 等于 角 ACE。再结合对顶角相等，通过三角形内角和，我们可以把未知的角 BFC 巧妙地转移到角 BAC 上。它们是相等的！"
  },
  {
    title: "第五步：计算最终结果",
    icon: <Calculator className="w-5 h-5 text-red-500" />,
    desc: "在 Rt△ABC 中计算正弦值",
    detail: (
      <div className="space-y-2 text-slate-700 font-serif">
        <p>∵ ∠BFC = ∠BAC</p>
        <p>在 Rt△ABC 中，∠ABC = 90°</p>
        <p>AB/BC = 3/4，设 AB=3k, BC=4k</p>
        <p>由勾股定理得 AC=5k</p>
        <p>sin∠BAC = BC/AC = 4k/5k = 4/5</p>
        <p className="font-bold text-red-600">∴ sin∠BFC = 4/5</p>
      </div>
    ),
    tts: "最后一步，既然角 BFC 等于角 BAC，我们只需要在直角三角形 ABC 中求出角 BAC 的正弦值就可以了。根据对边比斜边，答案就是 5分之4。这道题我们就完美解决了！"
  }
];
