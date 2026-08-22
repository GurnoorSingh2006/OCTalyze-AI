"use client";

import React, { useState } from 'react';
import { Eye, Layers, Sparkles } from 'lucide-react';

interface Props {
  originalImage?: string;
  heatmapImage?: string;
  overlayImage?: string;
  prediction?: string;
  finding?: string;
}

export default function OctViewer({ originalImage, heatmapImage, overlayImage, prediction, finding }: Props) {
  const [activeTab, setActiveTab] = useState<'overlay' | 'heatmap' | 'original'>('overlay');

  const getCurrentImage = () => {
    if (activeTab === 'original') return originalImage || overlayImage;
    if (activeTab === 'heatmap') return heatmapImage || overlayImage;
    return overlayImage || originalImage;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 glow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>OCT Visualizer & Attention Map</span>
          </h3>
          <p className="text-xs text-slate-400">Grad-CAM spatial activation highlighting salient biomarkers</p>
        </div>

        <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('original')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              activeTab === 'original'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Original OCT
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              activeTab === 'heatmap'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('overlay')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              activeTab === 'overlay'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overlay
          </button>
        </div>
      </div>

      <div className="relative aspect-[4/3] w-full max-h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group">
        {getCurrentImage() ? (
          <img
            src={getCurrentImage()}
            alt="OCT Scan View"
            className="w-full h-full object-contain transition-all duration-300"
          />
        ) : (
          <div className="text-center p-6 text-slate-500">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No scan image available</p>
          </div>
        )}

        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700 text-[11px] text-slate-300 flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="capitalize">{activeTab} View</span>
        </div>
      </div>

      {finding && (
        <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-3.5 flex items-start space-x-3">
          <div className="w-6 h-6 rounded-md bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-cyan-300">Model Attention Rationale</p>
            <p className="text-xs text-slate-300 leading-relaxed">{finding}</p>
          </div>
        </div>
      )}
    </div>
  );
}
