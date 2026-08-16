import React, { useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { JobMatchResult, ResumeAnalysis } from '../types/index.js';
import { matchResumeWithJob } from '../services/api.js';
import { SampleJobItem, SampleResumeItem } from '../../server/sampleData.js';
import { TabType } from './Navbar.js';

interface JobMatcherViewProps {
  activeResume: ResumeAnalysis | null;
  sampleJobs: SampleJobItem[];
  sampleResumes: SampleResumeItem[];
  onMatchSuccess: (result: JobMatchResult) => void;
  setActiveTab: (tab: TabType) => void;
}

export const JobMatcherView: React.FC<JobMatcherViewProps> = ({
  activeResume,
  sampleJobs,
  sampleResumes,
  onMatchSuccess,
  setActiveTab,
}) => {
  const [jobText, setJobText] = useState(sampleJobs[0]?.rawText || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunMatch = async () => {
    if (!activeResume) {
      setError('Please upload or select a resume first in the Resume Analyzer tab.');
      return;
    }

    if (!jobText.trim() || jobText.trim().length < 15) {
      setError('Please paste or select a valid Job Description with at least 15 characters.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const { result } = await matchResumeWithJob(activeResume, jobText);
      onMatchSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Match calculation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSampleJob = (job: SampleJobItem) => {
    setJobText(job.rawText);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Resume-Job Matching Engine</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare your parsed resume against a target job description to compute hard skill matches, TF-IDF semantic overlap, and gap analysis.
        </p>
      </div>

      {/* Dual Column Matcher Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Resume Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target Candidate Resume
                </span>
                <button
                  onClick={() => setActiveTab('resume-analyzer')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Change Resume →
                </button>
              </div>

              {activeResume ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        {activeResume.contact.name ? activeResume.contact.name[0] : 'R'}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {activeResume.contact.name || activeResume.filename}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {activeResume.skills.length} Detected Skills • {activeResume.sections.wordCount} Words
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Top Candidate Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {activeResume.skills.slice(0, 16).map(s => (
                        <span
                          key={s.skill}
                          className="px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50"
                        >
                          {s.skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Resume parsed & ready for mathematical matching.</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No Resume Loaded
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 mb-4">
                    Please upload or load a sample resume to continue.
                  </p>
                  <button
                    onClick={() => setActiveTab('resume-analyzer')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Go to Resume Upload
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Scoring Weights: <strong>40% Skills</strong> + <strong>25% TF-IDF Cosine</strong> + <strong>20% Job Reqs</strong> + <strong>15% Quality</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Job Description Textarea & Sample Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Job Description (JD)
              </span>

              {/* Sample Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] text-slate-400 whitespace-nowrap">Load Preset:</span>
                {sampleJobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => handleSelectSampleJob(job)}
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {job.title.split('(')[0].trim().slice(0, 18)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                id="job-description-input"
                value={jobText}
                onChange={e => setJobText(e.target.value)}
                placeholder="Paste the target job description here (including roles, responsibilities, required technical skills, qualifications)..."
                rows={11}
                className="w-full text-xs font-mono p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Match Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setJobText('')}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Text</span>
              </button>

              <button
                id="btn-calculate-match"
                onClick={handleRunMatch}
                disabled={isLoading || !activeResume}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Calculating NLP Similarity & Hard Skill Matches...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Dynamic Match Score</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
