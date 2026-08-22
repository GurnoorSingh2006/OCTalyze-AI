"use client";

import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from '@/lib/api';
import { Database, BarChart2, Cpu, TrendingUp, Layers, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData()
      .then(setData)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const modelComparison = [
    { name: 'Deep CNN', accuracy: 74.0, loss: 0.6899, type: 'Baseline', color: '#64748B' },
    { name: 'FCN', accuracy: 85.0, loss: 0.4936, type: 'Convolutional', color: '#0EA5E9' },
    { name: 'Baseline U-Net', accuracy: 85.0, loss: 0.4070, type: 'Encoder-Decoder', color: '#38BDF8' },
    { name: 'U-Net + Dropout', accuracy: 85.8, loss: 0.3850, type: 'Regularized', color: '#2DD4BF' },
    { name: 'U-Net + Filters', accuracy: 86.8, loss: 0.3620, type: 'Capacity Scaled', color: '#14B8A6' },
    { name: 'U-Net + Res Blocks', accuracy: 88.6, loss: 0.3410, type: 'Residual Variant', color: '#10B981' },
    { name: 'ResU-Net (Eval)', accuracy: 90.5, loss: 0.3124, type: 'Deep Residual', color: '#06B6D4' },
    { name: 'Attention U-Net', accuracy: 90.4, loss: 0.2980, type: 'Champion (Production)', color: '#0891B2' },
  ];

  const datasetPie = [
    { name: 'NORMAL (26,315)', value: 26315, color: '#10B981' },
    { name: 'DME (11,347)', value: 11347, color: '#F59E0B' },
    { name: 'DRUSEN (8,616)', value: 8616, color: '#F97316' },
    { name: 'CNV (37,215)', value: 37215, color: '#EF4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 glow-card">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research & Machine Learning Overview</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Model Benchmarks & Dataset Analytics</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Comprehensive empirical results directly sourced from the research Colab notebook (<code>Major project.ipynb</code>), tracking the architectural evolution from initial CNN baselines to high-capacity Attention U-Nets.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-1.5 glow-card">
          <span className="text-xs text-slate-400">Total Dataset Scans</span>
          <p className="text-3xl font-black text-white font-mono">83,493</p>
          <p className="text-[11px] text-slate-500">OCT2017 Retinal B-scans</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-1.5 glow-card">
          <span className="text-xs text-slate-400">Champion Model</span>
          <p className="text-2xl font-black text-cyan-400">Attention U-Net</p>
          <p className="text-[11px] text-slate-500">Spatial Attention Gates</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-1.5 glow-card">
          <span className="text-xs text-slate-400">Peak Test Accuracy</span>
          <p className="text-3xl font-black text-emerald-400 font-mono">90.5%</p>
          <p className="text-[11px] text-slate-500">ResU-Net Evaluation</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-1.5 glow-card">
          <span className="text-xs text-slate-400">Standard Input Dimensions</span>
          <p className="text-2xl font-black text-teal-300 font-mono">(128, 128, 3)</p>
          <p className="text-[11px] text-slate-500">RGB Normalized 1./255</p>
        </div>
      </div>

      {/* Model Benchmark Accuracy Chart */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 glow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Reported Test Accuracy Across Architectures</h3>
            <p className="text-xs text-slate-400">Comparison of 8 model iterations trained on identical OCT partitions</p>
          </div>
          <span className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-3 py-1 rounded-full font-mono font-medium self-start sm:self-auto">
            Source: Major project.ipynb
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modelComparison} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" interval={0} />
              <YAxis domain={[65, 95]} stroke="#64748b" fontSize={11} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Test Accuracy']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
              />
              <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                {modelComparison.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dataset Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dataset Distribution Pie (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 glow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">OCT2017 Class Distribution</h3>
            <p className="text-xs text-slate-400">Original dataset composition (83,493 scans total)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datasetPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {datasetPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [val.toLocaleString(), 'Images']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 text-center">Dataset downsampled in notebook for balanced class evaluation</p>
        </div>

        {/* Data Preprocessing & Training Methodology (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4 glow-card flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Data Engineering & Training Pipeline</h3>
            <p className="text-xs text-slate-400">Standardized pipeline specifications from the Colab notebook</p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-cyan-400">1. Balanced Dataset Downsampling:</span>
              <p className="text-slate-400 mt-1">
                Downsampled original 83,493 scans into balanced partitions (<code>NORMAL: 6230</code>, <code>DME: 2690</code>, <code>DRUSEN: 2042</code>, <code>CNV: 8829</code>) to mitigate dominant class bias.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-teal-400">2. Data Augmentation & Normalization:</span>
              <p className="text-slate-400 mt-1">
                Applied <code>rotation_range=40</code>, <code>width_shift=0.2</code>, <code>height_shift=0.2</code>, <code>shear_range=0.2</code>, <code>zoom_range=0.2</code>, <code>horizontal_flip=True</code>, and <code>rescale=1./255</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-emerald-400">3. Adaptive Callbacks & Convergence:</span>
              <p className="text-slate-400 mt-1">
                Utilized <code>ReduceLROnPlateau(factor=0.2, patience=5, min_lr=1e-5)</code> and <code>EarlyStopping(patience=10, restore_best_weights=True)</code> for optimal generalization.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800">
            <span>Hardware: TPU / GPU Accelerated Training</span>
            <span>Loss: Categorical Cross-Entropy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
