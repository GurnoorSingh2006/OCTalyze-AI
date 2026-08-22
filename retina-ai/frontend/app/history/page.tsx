"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserScans, deleteScan } from '@/lib/api';
import { ScanSummary, Condition, Priority } from '@/types';
import PriorityBadge from '@/components/PriorityBadge';
import { Eye, Search, Filter, Trash2, ArrowUpDown, Clock, Plus, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      getUserScans()
        .then(setScans)
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this scan record?')) return;
    try {
      await deleteScan(id);
      setScans((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      alert('Failed to delete scan: ' + e.message);
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.id.toString().includes(searchTerm) ||
      (scan.originalFilename && scan.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCondition = filterCondition === 'ALL' || scan.prediction === filterCondition;
    const matchesPriority = filterPriority === 'ALL' || scan.priority === filterPriority;
    return matchesSearch && matchesCondition && matchesPriority;
  });

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Scan Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Scan History & Archives</h1>
          <p className="text-xs text-slate-400 mt-1">Review, filter, and access previous OCT evaluations.</p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Scan ID or filename..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Condition Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full md:w-auto"
          >
            <option value="ALL">All Conditions</option>
            <option value="NORMAL">NORMAL</option>
            <option value="DME">DME</option>
            <option value="DRUSEN">DRUSEN</option>
            <option value="CNV">CNV</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 w-full md:w-auto"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">HIGH</option>
            <option value="REVIEW">REVIEW</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden glow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
              <tr>
                <th className="py-3 px-4">Scan ID</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Screening Priority</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">#{scan.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{scan.originalFilename || 'oct_scan.png'}</td>
                    <td className="py-3 px-4 font-bold text-white">{scan.prediction}</td>
                    <td className="py-3 px-4 font-mono">{(scan.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={scan.priority} />
                    </td>
                    <td className="py-3 px-4 text-slate-400">{scan.modelName}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(scan.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/results/${scan.id}`}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium transition text-[11px]"
                      >
                        Results
                      </Link>
                      <button
                        onClick={() => handleDelete(scan.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <p>No matching scan records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
