import React from 'react';
import { Priority } from '@/types';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function PriorityBadge({ priority }: { priority: Priority | string }) {
  if (priority === 'HIGH') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>HIGH PRIORITY</span>
      </span>
    );
  }
  if (priority === 'REVIEW') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>CLINICAL REVIEW</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
      <CheckCircle className="w-3.5 h-3.5" />
      <span>LOW RISK (NORMAL)</span>
    </span>
  );
}
