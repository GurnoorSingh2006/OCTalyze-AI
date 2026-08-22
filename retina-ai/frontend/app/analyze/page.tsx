"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { uploadAndAnalyzeScan } from '@/lib/api';
import { Eye, Upload, FileImage, AlertCircle, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Validating & Uploading OCT Scan...',
  'Preprocessing to (128, 128, 3) & Normalizing (1./255)...',
  'Executing Attention U-Net Inference...',
  'Computing Grad-CAM Spatial Heatmap...',
  'Structuring Clinical Probabilities & Rationale...',
];

export default function AnalyzePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid PNG, JPG, or JPEG OCT image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Image file exceeds the 20MB limit.');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setAnalyzing(true);
    setCurrentStepIndex(0);
    setError('');

    // Progressive step interval
    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const result = await uploadAndAnalyzeScan(selectedFile);
      clearInterval(stepTimer);
      router.push(`/results/${result.id}`);
    } catch (err: any) {
      clearInterval(stepTimer);
      setError(err.message || 'Inference pipeline failed.');
      setAnalyzing(false);
    }
  };

  const loadSample = async (type: string) => {
    // Generate synthetic sample canvas matching selected pathology
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark background
    ctx.fillStyle = '#10141e';
    ctx.fillRect(0, 0, 128, 128);

    // Retinal Layer Base
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(0, 45, 128, 40);

    // RPE Layer
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 75);

    if (type === 'NORMAL') {
      ctx.quadraticCurveTo(64, 60, 128, 75);
    } else if (type === 'DME') {
      ctx.quadraticCurveTo(64, 75, 128, 75);
      // Fluid pockets
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(50, 60, 8, 0, Math.PI * 2);
      ctx.arc(75, 58, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'DRUSEN') {
      ctx.lineTo(30, 75);
      ctx.lineTo(45, 65);
      ctx.lineTo(60, 75);
      ctx.lineTo(85, 68);
      ctx.lineTo(100, 75);
      ctx.lineTo(128, 75);
    } else if (type === 'CNV') {
      ctx.quadraticCurveTo(64, 75, 128, 75);
      // Subretinal hyperreflective membrane
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 70, 30, 10);
    }
    ctx.stroke();

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], `sample_${type.toLowerCase()}_oct.png`, { type: 'image/png' });
        handleFileSelect(sampleFile);
      }
    }, 'image/png');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Eye className="w-3.5 h-3.5" />
          <span>Clinical Screening Studio</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Upload Retinal OCT Scan</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Upload an Optical Coherence Tomography B-scan for instant classification, Grad-CAM attention localization, and automated report generation.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-400 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Analysis Error</p>
            <p className="text-slate-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !previewUrl && fileInputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
          previewUrl
            ? 'border-cyan-500/40 bg-slate-900/90'
            : 'border-slate-800 hover:border-cyan-500/50 bg-slate-900/50 cursor-pointer glow-card'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />

        {previewUrl ? (
          <div className="space-y-6">
            <div className="relative aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-cyan-400 border border-slate-700">
                Ready for Analysis
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={analyzing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Change Image
              </button>

              <button
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Attention U-Net Screening</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-white">Drop your OCT scan here</p>
              <p className="text-xs text-slate-400 mt-1">Supports high-res PNG, JPG, or JPEG retinal B-scans</p>
            </div>
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700 transition"
            >
              Browse Local Files
            </button>
          </div>
        )}
      </div>

      {/* Analyzing Progress Overlay */}
      {analyzing && (
        <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 space-y-4 glow-cyan">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-white">AI Inference in Progress</span>
            </div>
            <span className="text-xs font-mono text-cyan-400">{Math.round(((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100)}%</span>
          </div>

          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
              style={{ width: `${((currentStepIndex + 1) / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 font-mono">
            {ANALYSIS_STEPS[currentStepIndex]}
          </p>
        </div>
      )}

      {/* Quick Sample Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Quick Test: Load Sample OCT Scans</span>
          <span className="text-[10px] text-slate-500">1-Click Evaluation</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'NORMAL', label: 'Healthy Retina', color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400' },
            { id: 'DME', label: 'Diabetic Edema', color: 'hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-400' },
            { id: 'DRUSEN', label: 'Drusen Deposits', color: 'hover:border-orange-500/50 hover:bg-orange-950/20 text-orange-400' },
            { id: 'CNV', label: 'Neovascular CNV', color: 'hover:border-rose-500/50 hover:bg-rose-950/20 text-rose-400' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => loadSample(item.id)}
              type="button"
              className={`p-3 rounded-xl bg-slate-950 border border-slate-800 text-left transition flex flex-col justify-between space-y-1 ${item.color}`}
            >
              <span className="text-xs font-bold text-white">{item.id}</span>
              <span className="text-[10px] text-slate-400">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
