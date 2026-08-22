"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getDashboardStats } from '@/lib/api';
import { DashboardStats } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { Eye, Activity, AlertTriangle, CheckCircle, FileText, Upload, ArrowRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getDashboardStats()
        .then(setStats)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Clinical Dashboard...</p>
        </div>
      </div>
    );
  }

  const chartData = stats?.conditionDistribution
    ? [
        { name: 'NORMAL', count: stats.conditionDistribution.NORMAL || 0, color: '#10B981' },
        { name: 'DME', count: stats.conditionDistribution.DME || 0, color: '#F59E0B' },
        { name: 'DRUSEN', count: stats.conditionDistribution.DRUSEN || 0, color: '#F97316' },
        { name: 'CNV', count: stats.conditionDistribution.CNV || 0, color: '#EF4444' },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 glow-card">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">Screening Dashboard</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Attention U-Net Active</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-400 mt-1">Review active scans, priority alerts, and recent patient analyses.</p>
        </div>
        <Link
          href="/analyze"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New OCT</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2 glow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Scans</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-mono">{stats?.totalScans || 0}</p>
          <p className="text-[11px] text-slate-500">Evaluated scans</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2 glow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>High Priority Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-extrabold text-red-400 font-mono">{stats?.highPriorityScans || 0}</p>
          <p className="text-[11px] text-slate-500">CNV or high-fluid DME detected</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2 glow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Normal Results</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{stats?.normalScans || 0}</p>
          <p className="text-[11px] text-slate-500">Intact stratified retina</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-2 glow-card">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Reports Generated</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-3xl font-extrabold text-teal-400 font-mono">{stats?.reportsGenerated || 0}</p>
          <p className="text-[11px] text-slate-500">Clinical PDF summaries</p>
        </div>
      </div>

      {/* Activity Chart & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 glow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Condition Distribution</h3>
            <p className="text-xs text-slate-400">Total detected cases by diagnostic class</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 text-center">Data reflects user scan history</div>
        </div>

        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 glow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Analyses</h3>
              <p className="text-xs text-slate-400">Latest OCT screenings evaluated by Attention U-Net</p>
            </div>
            <Link href="/history" className="text-xs text-cyan-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {stats?.recentScans && stats.recentScans.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2.5">Scan ID</th>
                    <th className="pb-2.5">Condition</th>
                    <th className="pb-2.5">Confidence</th>
                    <th className="pb-2.5">Priority</th>
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {stats.recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 font-mono text-cyan-400 font-semibold">#{scan.id}</td>
                      <td className="py-3 font-semibold text-white">{scan.prediction}</td>
                      <td className="py-3 font-mono">{(scan.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3">
                        <PriorityBadge priority={scan.priority} />
                      </td>
                      <td className="py-3 text-slate-400">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/results/${scan.id}`}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-medium transition text-[11px]"
                        >
                          View Results
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <Eye className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No scan history recorded yet.</p>
                <Link
                  href="/analyze"
                  className="inline-block px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-xs font-semibold"
                >
                  Run First OCT Analysis
                </Link>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800">
            <span>Model: Attention U-Net (90.4% Accuracy)</span>
            <span>Grad-CAM Explainability Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
