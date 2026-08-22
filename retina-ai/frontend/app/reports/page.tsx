"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserReports } from '@/lib/api';
import { ReportItem } from '@/types';
import { generateClinicalPdfReport } from '@/lib/pdfGenerator';
import PriorityBadge from '@/components/PriorityBadge';
import { FileText, Download, Eye, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

export default function ReportsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getUserReports()
        .then(setReports)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDownload = (report: ReportItem) => {
    if (report.scanData) {
      generateClinicalPdfReport(report.scanData, user?.name || 'Dr. Clinician');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Clinical Reports Archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clinical Screening Reports</h1>
          <p className="text-xs text-slate-400 mt-1">Generated diagnostic summaries with full probability profiles.</p>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((rpt) => (
            <div key={rpt.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 glow-card flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">{rpt.reportNumber}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                    {rpt.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {rpt.scanData?.prediction || 'Retinal Scan'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scan ID #{rpt.scanId} - {(rpt.scanData?.confidence ? rpt.scanData.confidence * 100 : 0).toFixed(1)}% Confidence
                  </p>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {rpt.clinicalSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/results/${rpt.scanId}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  View Scan
                </Link>

                <button
                  onClick={() => handleDownload(rpt)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Reports Generated Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            After analyzing an OCT scan, generate and download comprehensive clinical PDF reports directly from the result page.
          </p>
          <Link
            href="/analyze"
            className="inline-block px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Start New Screening
          </Link>
        </div>
      )}
    </div>
  );
}
