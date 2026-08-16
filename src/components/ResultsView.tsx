import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Layers,
  Lightbulb,
  Printer,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import confetti from 'canvas-confetti';
import { JobMatchResult, SkillCategory } from '../types/index.js';
import { PrintableReport } from './PrintableReport.js';

interface ResultsViewProps {
  result: JobMatchResult | null;
  onRunNewMatch: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onRunNewMatch }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'requirements' | 'keywords' | 'roadmap'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  if (!result) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 animate-fadeIn">
        <Target className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Active Match Results</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-5">
          Select a resume and job description in the Job Matcher tab to generate a dynamic similarity breakdown.
        </p>
        <button
          onClick={onRunNewMatch}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/20"
        >
          Go to Job Matcher
        </button>
      </div>
    );
  }

  const { scoreBreakdown, matchingSkills, missingSkills, partialMatches, keywordCoverage, requirementsEvaluation } = result;

  // Trigger confetti for excellent matches (80%+)
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Export as JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `match_report_${result.resumeSummary.candidateName || 'candidate'}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportFeedback('Exported as JSON successfully.');
    setTimeout(() => setExportFeedback(null), 3000);
  };

  // Export as CSV
  const handleExportCSV = () => {
    let csv = 'Match Score Report\n';
    csv += `Overall Score,${scoreBreakdown.overallScore}%\n`;
    csv += `Grade,${scoreBreakdown.grade}\n`;
    csv += `Hard Skill Score,${scoreBreakdown.hardSkillScore}%\n`;
    csv += `TF-IDF Semantic Score,${scoreBreakdown.semanticTfidfScore}%\n`;
    csv += `Job Title,${result.jobSummary.title}\n\n`;

    csv += 'Matching Skills,Category,Importance\n';
    matchingSkills.forEach(s => {
      csv += `"${s.name}","${s.category}","${s.importance}"\n`;
    });

    csv += '\nMissing Skills,Category,Importance\n';
    missingSkills.forEach(s => {
      csv += `"${s.name}","${s.category}","${s.importance}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `match_analysis_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setExportFeedback('Exported as CSV successfully.');
    setTimeout(() => setExportFeedback(null), 3000);
  };

  // Radar chart data for skill categories
  const categoryStats: Record<string, { matched: number; missing: number }> = {};
  matchingSkills.forEach(s => {
    if (!categoryStats[s.category]) categoryStats[s.category] = { matched: 0, missing: 0 };
    categoryStats[s.category].matched += 1;
  });
  missingSkills.forEach(s => {
    if (!categoryStats[s.category]) categoryStats[s.category] = { matched: 0, missing: 0 };
    categoryStats[s.category].missing += 1;
  });

  const radarData = Object.entries(categoryStats).map(([cat, stats]) => ({
    category: cat.replace('&', '+').slice(0, 16),
    matched: stats.matched,
    missing: stats.missing,
    fullMark: Math.max(stats.matched + stats.missing, 5),
  }));

  // Bar chart data for scoring weights
  const scoreData = [
    { name: 'Hard Skills (40%)', score: scoreBreakdown.hardSkillScore, fill: '#6366f1' },
    { name: 'TF-IDF Overlap (25%)', score: scoreBreakdown.semanticTfidfScore, fill: '#06b6d4' },
    { name: 'Req Coverage (20%)', score: scoreBreakdown.requirementCoverageScore, fill: '#10b981' },
    { name: 'ATS Quality (15%)', score: scoreBreakdown.resumeQualityScore, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Evaluation Result
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{new Date(result.analyzedAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5">
            {result.jobSummary.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Candidate: <strong>{result.resumeSummary.candidateName || result.resumeSummary.filename}</strong>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
            title="Generate Printable PDF Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer shadow-2xs"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onRunNewMatch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>New Match</span>
          </button>
        </div>
      </div>

      {exportFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Animated Score Gauge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className={`${
                    scoreBreakdown.overallScore >= 75 ? 'stroke-emerald-400' :
                    scoreBreakdown.overallScore >= 50 ? 'stroke-amber-400' :
                    'stroke-rose-400'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * scoreBreakdown.overallScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {scoreBreakdown.overallScore}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Match Score
                </span>
              </div>
            </div>

            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  scoreBreakdown.overallScore >= 75
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : scoreBreakdown.overallScore >= 50
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {scoreBreakdown.grade}
              </span>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {scoreBreakdown.overallScore >= 75
                  ? 'Strong alignment across core technical requirements and qualifications.'
                  : scoreBreakdown.overallScore >= 50
                  ? 'Moderate fit. Key missing competencies should be bridged.'
                  : 'Low correlation with required technology stack and job keywords.'}
              </p>
            </div>
          </div>

          {/* Right: 4 Weighted Component Progress Bars */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Mathematical Score Component Breakdown
            </h3>

            <div className="space-y-3.5">
              {/* Hard Skills */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">Hard Technical Skill Match (40% Weight)</span>
                  <span className="text-indigo-300">{scoreBreakdown.hardSkillScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${scoreBreakdown.hardSkillScore}%` }}
                  />
                </div>
              </div>

              {/* TF-IDF Cosine */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">Semantic & TF-IDF Vector Similarity (25% Weight)</span>
                  <span className="text-cyan-300">{scoreBreakdown.semanticTfidfScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${scoreBreakdown.semanticTfidfScore}%` }}
                  />
                </div>
              </div>

              {/* Requirement Coverage */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">Job Requirements & Experience Coverage (20% Weight)</span>
                  <span className="text-emerald-300">{scoreBreakdown.requirementCoverageScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${scoreBreakdown.requirementCoverageScore}%` }}
                  />
                </div>
              </div>

              {/* Resume Quality */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-200">ATS Quality, Metrics & Action Verbs (15% Weight)</span>
                  <span className="text-violet-300">{scoreBreakdown.resumeQualityScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${scoreBreakdown.resumeQualityScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics Summary */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Matching Skills</span>
                <p className="text-base font-bold text-emerald-400">{matchingSkills.length}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Missing Skills</span>
                <p className="text-base font-bold text-rose-400">{missingSkills.length}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Partial Alignment</span>
                <p className="text-base font-bold text-amber-400">{partialMatches.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Skill Distribution Radar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Category Skill Distribution (Matched vs Missing)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Comparison of detected skills vs missing requirements across technical taxonomy categories.
          </p>

          <div className="h-64 w-full">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" opacity={0.3} />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar name="Matched Skills" dataKey="matched" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                  <Radar name="Missing Skills" dataKey="missing" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                Insufficient skill category distribution to display radar map.
              </div>
            )}
          </div>
        </div>

        {/* Score Component Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <span>Weighted Scoring Performance</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Performance breakdown across each individual mathematical dimension (0-100%).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
                <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={120} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deep-Dive Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'skills'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Matching & Missing Skills ({matchingSkills.length} matched / {missingSkills.length} missing)
          </button>

          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'requirements'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Job Requirements Coverage ({requirementsEvaluation.coveredCount}/{requirementsEvaluation.totalRequirements})
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'keywords'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            TF-IDF Keyword Matrix
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Improvement Roadmap & Bullets
          </button>
        </div>

        {/* Tab 1: Matching & Missing Skills */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Matching Skills */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Matching Skills ({matchingSkills.length})</span>
                </h3>
              </div>

              {matchingSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {matchingSkills.map(skill => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 ml-5 block mt-0.5">
                          {skill.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                        {skill.importance}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No overlapping skills detected for this target job.</p>
              )}
            </div>

            {/* Missing Skills */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>Missing Job Skills ({missingSkills.length})</span>
                </h3>
              </div>

              {missingSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {missingSkills.map(skill => (
                    <div
                      key={skill.name}
                      className="p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {skill.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            skill.importance === 'required'
                              ? 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {skill.importance}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {skill.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Congratulations! All job technical skills appear present in the resume.
                </p>
              )}
            </div>

            {/* Partial Matches */}
            {partialMatches.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Transferable / Partial Matches ({partialMatches.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partialMatches.map((pm, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="text-slate-500 dark:text-slate-400 line-through">{pm.jobSkill}</span>
                        <span className="text-amber-600">↔</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{pm.relatedResumeSkill}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{pm.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Job Requirements Checklist */}
        {activeTab === 'requirements' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluation of qualification sentences and responsibility clauses detected in the job description:
            </p>

            <div className="space-y-2.5">
              {requirementsEvaluation.items.map((req, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                    req.matched
                      ? 'border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/30 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {req.matched ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs ${req.matched ? 'font-semibold text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>
                      {req.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {req.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{req.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: TF-IDF Keyword Matrix */}
        {activeTab === 'keywords' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-frequency domain keywords extracted via TF-IDF analysis from the job description:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {keywordCoverage.map(kw => (
                <div
                  key={kw.keyword}
                  className={`p-2.5 rounded-xl border text-center ${
                    kw.inResume
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 font-normal line-through'
                  } text-xs`}
                >
                  <span>{kw.keyword}</span>
                  <div className="text-[10px] opacity-70 mt-0.5">
                    {kw.inResume ? '✓ In Resume' : '✗ Missing'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Improvement Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized, actionable optimization steps to maximize interview callback probability:
            </p>

            <div className="space-y-3">
              {result.improvementRoadmap.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>{item.title}</span>
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'High'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside pt-1">
                    {item.actionItems.map((ai, i) => (
                      <li key={i}>{ai}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Printable Report Modal */}
      {showPrintModal && (
        <PrintableReport result={result} onClose={() => setShowPrintModal(false)} />
      )}
    </div>
  );
};
