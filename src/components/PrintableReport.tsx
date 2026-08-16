import React from 'react';
import { Download, Printer, X } from 'lucide-react';
import { JobMatchResult } from '../types/index.js';

interface PrintableReportProps {
  result: JobMatchResult;
  onClose: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ result, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Resume Analysis & Job Match Report</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 bg-white" id="printable-report-content">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Candidate Evaluation Report
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Target Role: <strong>{result.jobSummary.title}</strong> {result.jobSummary.company && `• ${result.jobSummary.company}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Candidate: <strong>{result.resumeSummary.candidateName || result.resumeSummary.filename}</strong>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold text-indigo-700">
                {result.scoreBreakdown.overallScore}%
              </div>
              <div className="text-xs font-bold text-slate-600 uppercase">
                {result.scoreBreakdown.grade}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Generated: {new Date(result.analyzedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Mathematical Score Summary */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Hard Skills (40%)</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{result.scoreBreakdown.hardSkillScore}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">TF-IDF Vector (25%)</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{result.scoreBreakdown.semanticTfidfScore}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">Req Coverage (20%)</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{result.scoreBreakdown.requirementCoverageScore}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500">ATS Quality (15%)</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{result.scoreBreakdown.resumeQualityScore}%</p>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-200 pb-1 mb-2">
                Matching Skills ({result.matchingSkills.length})
              </h3>
              <ul className="text-xs space-y-1">
                {result.matchingSkills.map(s => (
                  <li key={s.name} className="flex justify-between">
                    <span className="font-semibold text-slate-800">• {s.name}</span>
                    <span className="text-slate-500 text-[10px]">{s.category}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 border-b border-rose-200 pb-1 mb-2">
                Missing Skills ({result.missingSkills.length})
              </h3>
              <ul className="text-xs space-y-1">
                {result.missingSkills.map(s => (
                  <li key={s.name} className="flex justify-between">
                    <span className="font-semibold text-slate-800">• {s.name}</span>
                    <span className="text-rose-600 text-[10px] font-medium">{s.importance}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              Analytical Observations & Strengths
            </h3>
            <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
              {result.strengths.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
              ATS Optimization Roadmap
            </h3>
            <div className="space-y-2">
              {result.improvementRoadmap.map((item, i) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-slate-900">{i + 1}. {item.title}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center">
            Report generated by Resume Analyzer & Job Matcher Engine. This analytical similarity score is a statistical comparison metric and does not constitute a guarantee of interview invitation or employment offer.
          </div>
        </div>
      </div>
    </div>
  );
};
