import React from 'react';
import { Condition, Probabilities } from '@/types';

interface Props {
  probabilities: Probabilities;
  topCondition?: Condition;
}

const CONDITION_COLORS: Record<Condition, { bg: string; fill: string; text: string }> = {
  NORMAL: { bg: 'bg-emerald-950/40', fill: 'bg-emerald-500', text: 'text-emerald-400' },
  DME: { bg: 'bg-amber-950/40', fill: 'bg-amber-500', text: 'text-amber-400' },
  DRUSEN: { bg: 'bg-orange-950/40', fill: 'bg-orange-500', text: 'text-orange-400' },
  CNV: { bg: 'bg-rose-950/40', fill: 'bg-rose-500', text: 'text-rose-400' },
};

export default function ProbabilityBar({ probabilities, topCondition }: Props) {
  const classes: Condition[] = ['NORMAL', 'DME', 'DRUSEN', 'CNV'];

  return (
    <div className="space-y-3">
      {classes.map((cls) => {
        const prob = probabilities ? (probabilities[cls] || 0) : 0;
        const percent = (prob * 100).toFixed(1);
        const isTop = topCondition === cls;
        const color = CONDITION_COLORS[cls];

        return (
          <div key={cls} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${isTop ? color.text : 'text-slate-300'}`}>
                  {cls}
                </span>
                {isTop && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded font-medium">
                    Top Match
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-300 font-medium">{percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${color.fill} transition-all duration-700 ease-out`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
