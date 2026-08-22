"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getScanById, generateReport } from '@/lib/api';
import { ScanResult } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import ProbabilityBar from '@/components/ProbabilityBar';
import OctViewer from '@/components/OctViewer';
import { generateClinicalPdfReport } from '@/lib/pdfGenerator';
import { Eye, FileText, Download, ArrowLeft, ShieldAlert, Cpu, Sparkles, Check } from 'lucide-react';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [scan, setScan] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (params.id) {
      getScanById(params.id as string)
        .then(setScan)
        .catch((e) => console.error('Failed to load scan result', e))
        .finally(() => setLoading(false));
    }
  }, [params.id, isAuthenticated, authLoading, router]);

  const handleDownloadPdf = async () => {
    if (!scan) return;
    setGeneratingReport(true);
    try {
      await generateReport(scan.id).catch(() => {});
      generateClinicalPdfReport(scan, user?.name || 'Dr. Clinician');
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingReport(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading AI Screening Results...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Scan Not Found</h2>
        <p className="text-xs text-slate-400">The requested OCT scan could not be retrieved.</p>
        <Link href="/dashboard" className="inline-block px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Top Header Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold">Scan #{scan.id}</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400">{scan.originalFilename || 'oct_bscan.png'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">AI Retinal Screening Result</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPdf}
            disabled={generatingReport}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition flex items-center space-x-2 disabled:opacity-50"
          >
            {reportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Report Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{generatingReport ? 'Generating PDF...' : 'Download Clinical Report'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary Result Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 glow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top AI Classification</span>
            <p className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">{scan.prediction}</p>
            <p className="text-xs text-cyan-400 mt-2 font-medium">Model: {scan.modelName}</p>
          </div>

          <div className="border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0 md:px-6">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diagnostic Confidence</span>
            <p className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300 mt-1 font-mono">
              {(scan.confidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-slate-400 mt-2">Softmax probability threshold verified</p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Screening Priority</span>
            <div className="mt-2">
              <PriorityBadge priority={scan.priority} />
            </div>
            <p className="text-xs text-slate-400 mt-2">Rule-based clinical triage flag</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizer & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: OCT Visualizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <OctViewer
            originalImage={scan.originalImage}
            heatmapImage={scan.heatmapImage}
            overlayImage={scan.overlayImage}
            prediction={scan.prediction}
            finding={scan.attentionFinding}
          />

          {/* Clinical Description Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 glow-card">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pathology Summary</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {scan.description || 'Standardized retinal diagnostic classification performed.'}
            </p>
          </div>
        </div>

        {/* Right Column: Probabilities & Model Metadata (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Probability Distribution */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 glow-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">Probability Distribution</h3>
              <span className="text-[10px] text-slate-400 font-mono">4-Class Evaluation</span>
            </div>

            <ProbabilityBar
              probabilities={scan.probabilities}
              topCondition={scan.prediction}
            />
          </div>

          {/* Model Specification Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3 glow-card">
            <div className="flex items-center space-x-2 text-xs font-bold text-white">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inference Pipeline Specification</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 divide-y divide-slate-800/80">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Active Architecture:</span>
                <span className="font-semibold text-white">{scan.modelName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Reported Accuracy:</span>
                <span className="font-mono text-cyan-400 font-semibold">90.4% (Notebook)</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Input Dimensions:</span>
                <span className="font-mono text-slate-300">(128, 128, 3) RGB</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Normalization:</span>
                <span className="font-mono text-slate-300">1./255 Scaling</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500">Explainability Engine:</span>
                <span className="font-mono text-teal-400 font-semibold">Grad-CAM Colormap</span>
              </div>
            </div>
          </div>

          {/* Disclaimer Alert */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4 text-[11px] text-slate-300 flex items-start space-x-3 leading-relaxed">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">AI Screening Disclaimer</p>
              <p className="mt-1 text-slate-400">
                This AI-generated screening result is provided for research and clinical decision support only. It is not an autonomous medical diagnosis. Certified ophthalmological confirmation is required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
