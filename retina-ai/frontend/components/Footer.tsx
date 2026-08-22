import React from 'react';
import Link from 'next/link';
import { Eye, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080B12] border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-bold text-white tracking-tight text-sm">RETINA<span className="text-cyan-400">AI</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Explainable AI-powered Optical Coherence Tomography (OCT) retinal screening platform utilizing Attention U-Net and Grad-CAM spatial attention maps.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Conditions</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition">NORMAL (Healthy Retina)</li>
              <li className="hover:text-cyan-400 transition">DME (Diabetic Macular Edema)</li>
              <li className="hover:text-cyan-400 transition">DRUSEN (Early/Intermediate AMD)</li>
              <li className="hover:text-cyan-400 transition">CNV (Choroidal Neovascularization)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Model Benchmarks</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-400 transition">Attention U-Net (90.4% - Production)</li>
              <li className="hover:text-cyan-400 transition">Residual U-Net (90.5% ResU-Net)</li>
              <li className="hover:text-cyan-400 transition">U-Net + Residual Blocks (88.6%)</li>
              <li className="hover:text-cyan-400 transition">U-Net + Filters (86.8%) / FCN (85.0%)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Medical Disclaimer</h4>
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-normal flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                RetinaAI is an AI-assisted screening research tool. Predictions and attention heatmaps do not constitute medical diagnoses. All clinical decisions must be validated by certified ophthalmologists.
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>(c) 2026 RetinaAI. Explainable AI-Powered OCT Retinal Screening Platform.</p>
          <div className="flex items-center space-x-4">
            <Link href="/analytics" className="hover:text-cyan-400 transition">Dataset & Analytics</Link>
            <Link href="/models" className="hover:text-cyan-400 transition">Model Lab</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
