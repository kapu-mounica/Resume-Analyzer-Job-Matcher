import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Code2,
  FileCheck,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  X,
  XCircle,
} from 'lucide-react';
import { runTestSuite, TestSuiteReport } from '../services/api.js';

interface TestSuiteModalProps {
  onClose: () => void;
}

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({ onClose }) => {
  const [report, setReport] = useState<TestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any | null>(null);

  const executeTests = async () => {
    setIsRunning(true);
    try {
      const res = await runTestSuite();
      setReport(res);
      if (res.results.length > 0) {
        setSelectedTestCase(res.results[0]);
      }
    } catch (err) {
      console.error('Test run failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    executeTests();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-fadeIn">
        {/* Header */}
        <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="font-bold text-sm sm:text-base">
                Automated System Test Runner
              </h2>
              <p className="text-[11px] text-slate-400">
                Verifies PDF/DOCX ingestion, NLP skills extraction, matching scores & boundary conditions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={executeTests}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Running...' : 'Re-Run All Tests'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Summary Progress Bar */}
          {report && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  report.failed === 0
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                }`}>
                  {report.passed}/{report.totalTests}
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {report.failed === 0 ? 'All Test Suites Passed' : `${report.failed} Tests Failed`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Execution time: {report.durationMs}ms • Automated assertion checks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {report.passed} Passed
                </span>
                {report.failed > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {report.failed} Failed
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Test Cases Table */}
          {report ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Test Cases List */}
              <div className="md:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {report.results.map(tc => (
                  <button
                    key={tc.testId}
                    onClick={() => setSelectedTestCase(tc)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedTestCase?.testId === tc.testId
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tc.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {tc.testName}
                        </div>
                        <div className="text-[10px] text-slate-400">{tc.durationMs}ms</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Column: Selected Test Details */}
              <div className="md:col-span-7 bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[380px] border border-slate-800">
                {selectedTestCase ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-indigo-400">{selectedTestCase.testName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedTestCase.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {selectedTestCase.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block mb-1">Execution Details:</span>
                      <p className="text-slate-300 text-[11px]">{selectedTestCase.details}</p>
                    </div>

                    {selectedTestCase.metrics && (
                      <div>
                        <span className="text-slate-400 text-[11px] block mb-1">Collected Assertions & Metrics:</span>
                        <pre className="bg-slate-900 p-2.5 rounded-lg text-[10px] text-indigo-300 overflow-x-auto">
                          {JSON.stringify(selectedTestCase.metrics, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500">Select a test case on the left to inspect assertions.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto text-indigo-500 animate-spin mb-3" />
              <p className="text-xs text-slate-400">Executing automated test matrix on backend server...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
