import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Search,
  Trash2,
  Zap,
} from 'lucide-react';
import { HistoryRecord, JobMatchResult } from '../types/index.js';
import { clearAllHistory, deleteHistoryRecord } from '../services/api.js';

interface HistoryViewProps {
  history: HistoryRecord[];
  onSelectResult: (result: JobMatchResult) => void;
  onRefreshHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onRefreshHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredHistory = history.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (item.candidateName && item.candidateName.toLowerCase().includes(query)) ||
      item.jobTitle.toLowerCase().includes(query) ||
      item.resumeFilename.toLowerCase().includes(query) ||
      (item.companyName && item.companyName.toLowerCase().includes(query)) ||
      (item.matchingSkills || []).some(s => s.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (scoreFilter === 'high') return item.matchScore >= 75;
    if (scoreFilter === 'moderate') return item.matchScore >= 50 && item.matchScore < 75;
    if (scoreFilter === 'low') return item.matchScore < 50;

    return true;
  });

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      await deleteHistoryRecord(id);
      onRefreshHistory();
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err) {
      alert('Failed to delete history record.');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all analysis history?')) return;
    try {
      await clearAllHistory();
      onRefreshHistory();
      setSelectedRecord(null);
    } catch (err) {
      alert('Failed to clear history.');
    }
  };

  const handleExportAllCSV = () => {
    let csv = 'ID,Date,Candidate,Resume Filename,Job Title,Company,Match Score,Grade,Matching Skills Count,Missing Skills Count\n';
    history.forEach(item => {
      csv += `"${item.id}","${item.timestamp}","${item.candidateName || ''}","${item.resumeFilename}","${item.jobTitle}","${item.companyName || ''}",${item.matchScore},"${item.grade}",${item.matchingSkillsCount},${item.missingSkillsCount}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `resume_analysis_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Analysis History & Audit Archive</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, inspect, and export previous candidate-to-job matching evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExportAllCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 text-rose-700 dark:text-rose-300 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate, job, skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Score:</span>
          </span>
          {(['all', 'high', 'moderate', 'low'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setScoreFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-colors ${
                scoreFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'high' ? '≥75% (High)' : filter === 'moderate' ? '50-74%' : '<50% (Low)'}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Candidate & Resume</th>
                  <th className="py-3 px-4">Target Job</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4">Skill Match Overview</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectResult(item.resultData)}
                    className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {item.candidateName || item.resumeFilename}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <FileText className="w-3 h-3" />
                        <span>{item.resumeFilename}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.jobTitle}
                      </div>
                      {item.companyName && (
                        <div className="text-[11px] text-slate-400">{item.companyName}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block font-extrabold text-xs px-2.5 py-0.5 rounded-full ${
                          item.matchScore >= 75
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : item.matchScore >= 50
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.matchScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ {item.matchingSkillsCount} matched
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          ✗ {item.missingSkillsCount} missing
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectResult(item.resultData);
                          }}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 cursor-pointer"
                          title="Open Full Analysis Results"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={e => handleDeleteItem(item.id, e)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-6">
            <History className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No History Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery
                ? 'No evaluations match your search criteria.'
                : 'Run your first resume-to-job match to record analyses here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
