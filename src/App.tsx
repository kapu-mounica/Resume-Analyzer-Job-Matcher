import React, { useEffect, useState } from 'react';
import { HistoryRecord, JobMatchResult, ResumeAnalysis } from './types/index.js';
import { Navbar, TabType } from './components/Navbar.js';
import { DashboardView } from './components/DashboardView.js';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView.js';
import { JobMatcherView } from './components/JobMatcherView.js';
import { ResultsView } from './components/ResultsView.js';
import { HistoryView } from './components/HistoryView.js';
import { SkillsAnalysisView } from './components/SkillsAnalysisView.js';
import { MethodologyView } from './components/MethodologyView.js';
import { TestSuiteModal } from './components/TestSuiteModal.js';
import {
  analyzeResumeText,
  fetchHistory,
  fetchSamples,
  matchResumeWithJob,
} from './services/api.js';
import { SampleJobItem, SampleResumeItem } from '../server/sampleData.js';
import { Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  const [activeResume, setActiveResume] = useState<ResumeAnalysis | null>(null);
  const [activeResult, setActiveResult] = useState<JobMatchResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [sampleResumes, setSampleResumes] = useState<SampleResumeItem[]>([]);
  const [sampleJobs, setSampleJobs] = useState<SampleJobItem[]>([]);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load initial data and pre-populate an initial analysis
  useEffect(() => {
    async function initApp() {
      try {
        const [samplesRes, historyRes] = await Promise.all([
          fetchSamples().catch(() => ({ resumes: [], jobs: [] })),
          fetchHistory().catch(() => []),
        ]);

        setSampleResumes(samplesRes.resumes);
        setSampleJobs(samplesRes.jobs);
        setHistory(historyRes);

        // Pre-parse the first sample resume if available
        if (samplesRes.resumes.length > 0 && samplesRes.jobs.length > 0) {
          const sampleR = samplesRes.resumes[0];
          const sampleJ = samplesRes.jobs[0];

          const parsedResume = await analyzeResumeText(sampleR.rawText, `${sampleR.id}.pdf`);
          setActiveResume(parsedResume);

          const { result } = await matchResumeWithJob(parsedResume, sampleJ.rawText);
          setActiveResult(result);

          // Refresh history after initial match
          const updatedHistory = await fetchHistory();
          setHistory(updatedHistory);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    }

    initApp();
  }, []);

  const refreshHistoryList = async () => {
    try {
      const updated = await fetchHistory();
      setHistory(updated);
    } catch (err) {
      console.error('Failed to refresh history:', err);
    }
  };

  const handleSelectSamplePair = async (resume: SampleResumeItem, job: SampleJobItem) => {
    try {
      const parsedResume = await analyzeResumeText(resume.rawText, `${resume.id}.pdf`);
      setActiveResume(parsedResume);

      const { result } = await matchResumeWithJob(parsedResume, job.rawText);
      setActiveResult(result);
      await refreshHistoryList();
      setActiveTab('results');
    } catch (err) {
      console.error('Failed to run sample pair match:', err);
    }
  };

  const handleMatchSuccess = async (result: JobMatchResult) => {
    setActiveResult(result);
    await refreshHistoryList();
    setActiveTab('results');
  };

  const handleViewHistoryItem = (item: HistoryRecord) => {
    setActiveResult(item.resultData);
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenTestSuite={() => setIsTestSuiteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            history={history}
            activeResume={activeResume}
            activeResult={activeResult}
            sampleResumes={sampleResumes}
            sampleJobs={sampleJobs}
            onSelectSamplePair={handleSelectSamplePair}
            onViewHistoryItem={handleViewHistoryItem}
            setActiveTab={setActiveTab}
            onOpenTestSuite={() => setIsTestSuiteOpen(true)}
          />
        )}

        {activeTab === 'resume-analyzer' && (
          <ResumeAnalyzerView
            activeResume={activeResume}
            setActiveResume={setActiveResume}
            sampleResumes={sampleResumes}
            onProceedToMatching={() => setActiveTab('job-matcher')}
          />
        )}

        {activeTab === 'job-matcher' && (
          <JobMatcherView
            activeResume={activeResume}
            sampleJobs={sampleJobs}
            sampleResumes={sampleResumes}
            onMatchSuccess={handleMatchSuccess}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'results' && (
          <ResultsView
            result={activeResult}
            onRunNewMatch={() => setActiveTab('job-matcher')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={res => {
              setActiveResult(res);
              setActiveTab('results');
            }}
            onRefreshHistory={refreshHistoryList}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsAnalysisView
            activeResume={activeResume}
            activeResult={activeResult}
          />
        )}

        {activeTab === 'methodology' && <MethodologyView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Resume Analyzer & Job Matcher
            </span>
            <span>•</span>
            <span>Deterministic NLP & TF-IDF Similarity Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTestSuiteOpen(true)}
              className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Automated Test Runner</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('methodology')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Scoring Methodology
            </button>
          </div>
        </div>
      </footer>

      {/* Test Suite Modal */}
      {isTestSuiteOpen && (
        <TestSuiteModal onClose={() => setIsTestSuiteOpen(false)} />
      )}
    </div>
  );
}
