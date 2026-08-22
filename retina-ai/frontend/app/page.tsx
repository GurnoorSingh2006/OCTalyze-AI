"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Activity, ShieldCheck, Cpu, ArrowRight, Layers, CheckCircle2, Sparkles, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable AI-Powered OCT Retinal Screening</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          See Beyond <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">the Scan.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          AI-assisted optical coherence tomography screening with transparent spatial attention maps and multi-class probability scoring.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Analyze OCT Scan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/models"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition flex items-center justify-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Explore Technology</span>
          </Link>
        </div>

        {/* Retinal Visual Graphic */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-2xl overflow-hidden relative group">
          <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 flex items-center justify-center border border-slate-800/80">
            <svg viewBox="0 0 800 450" className="w-full h-full">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0B0F19" />
                  <stop offset="100%" stopColor="#050810" />
                </linearGradient>
                <linearGradient id="layerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect width="800" height="450" fill="url(#bgGrad)" />
              <path d="M 0 160 Q 200 170 400 220 T 800 160 L 800 240 Q 600 280 400 280 T 0 240 Z" fill="#1e293b" opacity="0.6" />
              <path d="M 0 200 Q 200 210 400 250 T 800 200" stroke="url(#layerGrad)" strokeWidth="4" fill="none" />
              <path d="M 0 240 Q 200 250 400 275 T 800 240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,4" fill="none" />
              <ellipse cx="400" cy="250" rx="90" ry="40" fill="url(#heatGrad)" opacity="0.75" />
              <circle cx="400" cy="250" r="8" fill="#ef4444" className="animate-ping" />
              <circle cx="400" cy="250" r="4" fill="#ffffff" />
            </svg>

            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs flex items-center space-x-2 text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Model: <strong>Attention U-Net (90.4%)</strong></span>
            </div>

            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs flex items-center space-x-2 text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Grad-CAM Spatial Heatmap Overlay Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Screening Workflow</h2>
          <p className="text-3xl font-extrabold text-white">How RetinaAI Evaluates Scans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            { step: '01', title: 'Upload OCT', desc: 'Securely upload high-resolution B-scan in PNG or JPEG format.' },
            { step: '02', title: 'Standardize', desc: 'Preprocessed to 128x128x3 with 1./255 pixel normalization.' },
            { step: '03', title: 'Attention U-Net', desc: 'Gated convolutional blocks identify pathological retinal patterns.' },
            { step: '04', title: 'Grad-CAM Map', desc: 'Generates spatial heatmaps showing exactly where the AI focused.' },
            { step: '05', title: 'Clinical Report', desc: 'Download comprehensive PDF report with priority score & disclaimer.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 relative space-y-2 glow-card">
              <span className="text-2xl font-mono font-black text-cyan-500/40">{item.step}</span>
              <h3 className="text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORTED CONDITIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">Target Pathologies</h2>
          <p className="text-3xl font-extrabold text-white">4-Class Retinal Classification</p>
          <p className="text-xs text-slate-400 mt-2">Trained on the standardized OCT2017 medical dataset</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'NORMAL',
              badge: 'Healthy Tissue',
              color: 'text-emerald-400',
              border: 'border-emerald-500/30',
              bg: 'bg-emerald-500/10',
              desc: 'Intact continuous foveal depression with well-defined retinal pigment epithelium (RPE) and absence of fluid or drusen.',
            },
            {
              name: 'DME',
              badge: 'Diabetic Macular Edema',
              color: 'text-amber-400',
              border: 'border-amber-500/30',
              bg: 'bg-amber-500/10',
              desc: 'Characterized by intraretinal cystoid fluid accumulation and retinal thickening leading to visual impairment.',
            },
            {
              name: 'DRUSEN',
              badge: 'Age-Related AMD',
              color: 'text-orange-400',
              border: 'border-orange-500/30',
              bg: 'bg-orange-500/10',
              desc: 'Focal sub-RPE nodular lipid and protein deposits between the retinal pigment epithelium and Bruch membrane.',
            },
            {
              name: 'CNV',
              badge: 'Neovascular AMD',
              color: 'text-rose-400',
              border: 'border-rose-500/30',
              bg: 'bg-rose-500/10',
              desc: 'Active pathologic choroidal neovascular membrane complex breaking through Bruch membrane with subretinal hyperreflectivity.',
            },
          ].map((cond, idx) => (
            <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 glow-card flex flex-col justify-between">
              <div>
                <div className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold ${cond.bg} ${cond.color} ${cond.border} border mb-3`}>
                  {cond.badge}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{cond.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cond.desc}</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Input: (128, 128, 3)</span>
                <CheckCircle2 className={`w-4 h-4 ${cond.color}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Analyze your first OCT scan in seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience explainable AI screening with instant multi-class probabilities, Grad-CAM attention visualizer, and automated clinical reports.
          </p>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Launch Screening Studio</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
