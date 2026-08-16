import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  Zap,
} from 'lucide-react';
import { HistoryRecord, JobMatchResult, ResumeAnalysis } from '../types/index.js';
import { SampleJobItem, SampleResumeItem } from '../../server/sampleData.js';
import { TabType } from './Navbar.js';

interface DashboardViewProps {
  history: HistoryRecord[];
  activeResume: ResumeAnalysis | null;
  activeResult: JobMatchResult | null;
  sampleResumes: SampleResumeItem[];
  sampleJobs: SampleJobItem[];
  onSelectSamplePair: (resume: SampleResumeItem, job: SampleJobItem) => void;
  onViewHistoryItem: (item: HistoryRecord) => void;
  setActiveTab: (tab: TabType) => void;
  onOpenTestSuite: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  history,
  activeResume,
  activeResult,
  sampleResumes,
  sampleJobs,
  onSelectSamplePair,
  onViewHistoryItem,
  setActiveTab,
  onOpenTestSuite,
}) => {
  // Aggregate stats
  const totalAnalyses = history.length;
  const latestScore = history[0]?.matchScore ?? (activeResult?.scoreBreakdown.overallScore || 0);
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.matchScore, 0) / history.length)
      : latestScore;

  // Aggregate missing skills across all history
  const missingSkillsFrequency: Record<string, number> = {};
  history.forEach(h => {
    (h.missingSkills || []).forEach(s => {
      missingSkillsFrequency[s] = (missingSkillsFrequency[s] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(missingSkillsFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated NLP Resume & Job Matcher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Analyze Resumes, Quantify ATS Match, & Bridge Skill Gaps
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Extract technical skills from PDF/DOCX resumes using real tokenization, TF-IDF vector similarity, and transparent weighted scoring against any job description.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              id="dash-upload-resume-btn"
              onClick={() => setActiveTab('resume-analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Resume (PDF/DOCX)</span>
            </button>
            <button
              id="dash-match-job-btn"
              onClick={() => setActiveTab('job-matcher')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm cursor-pointer transition-all"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Match With Target Job</span>
            </button>
            <button
              id="dash-run-tests-banner-btn"
              onClick={onOpenTestSuite}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 font-medium text-xs sm:text-sm cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Run Automated Test Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Analyses
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {totalAnalyses}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Stored in session history</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Latest Match Score
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-bold ${
                latestScore >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                latestScore >= 50 ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}>
                {latestScore}%
              </span>
              <span className="text-xs font-medium text-slate-400">
                {latestScore >= 80 ? 'Excellent' : latestScore >= 68 ? 'Strong' : latestScore >= 48 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Most recent job evaluation</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Match Score
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {avgScore}%
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Across all candidate evaluations</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ATS Quality Grade
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {activeResume?.qualityAudit.grade || 'A'}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                {activeResume?.qualityAudit.overallScore || 92}/100
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Resume completeness rating</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 1-Click Test Presets Row */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant Test Pairs (One-Click Testing)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Load realistic industry profiles and job specs to instantly test the dynamic NLP matching engine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pair 1: Senior Full-Stack */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Senior Full-Stack Pair
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Expected High Match
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mt-1">
                Alex Rivera vs Senior Full-Stack
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                React, TypeScript, Node.js, PostgreSQL, Docker, AWS EC2/S3.
              </p>
            </div>
            <button
              onClick={() => onSelectSamplePair(sampleResumes[0], sampleJobs[0])}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Load & Run Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pair 2: AI / ML Engineer */}
          <div className="p-4 rounded-xl border border-cyan-100 dark:border-slate-800 bg-cyan-50/40 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Data Science & ML Pair
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Expected High Match
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mt-1">
                Priya Sharma vs ML & NLP Engineer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PyTorch, Python, NLP, Hugging Face Transformers, FastAPI.
              </p>
            </div>
            <button
              onClick={() => onSelectSamplePair(sampleResumes[1], sampleJobs[1])}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Load & Run Analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pair 3: Unrelated Job Test */}
          <div className="p-4 rounded-xl border border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-800/40 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Unrelated Field Test
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold">
                  Expected Low Match
                </span>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm mt-1">
                Junior Dev vs Graphic Designer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Verifies algorithm does not produce fake high scores on non-matching domains.
              </p>
            </div>
            <button
              onClick={() => onSelectSamplePair(sampleResumes[3], sampleJobs[3])}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Verify Low Score Behavior</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Top Missing Skills & Recent Analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Frequently Missing Skills */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs lg:col-span-1">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Frequent Skill Gaps</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Top missing skills identified across your evaluated job descriptions.
          </p>

          <div className="mt-4 space-y-3">
            {topMissingSkills.length > 0 ? (
              topMissingSkills.map(([skill, count]) => (
                <div
                  key={skill}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {skill}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      Missing in {count} {count === 1 ? 'Job' : 'Jobs'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Run more job matches to populate aggregated skill gap trends.
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('skills')}
              className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Explore 400+ Skill Taxonomy & Gap Matrix →
            </button>
          </div>
        </div>

        {/* Recent Analyses List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Recent Analysis History</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed record of past resume extractions and calculated match percentages.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              View All ({history.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Candidate / Resume</th>
                  <th className="py-2.5 px-3">Target Job</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3">Matching Skills</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.slice(0, 4).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.candidateName || item.resumeFilename}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{item.resumeFilename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.jobTitle}
                      </div>
                      {item.companyName && (
                        <div className="text-[11px] text-slate-400">{item.companyName}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block font-bold text-xs px-2 py-0.5 rounded-full ${
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
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(item.matchingSkills || []).slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {(item.matchingSkills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{(item.matchingSkills || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onViewHistoryItem(item)}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
