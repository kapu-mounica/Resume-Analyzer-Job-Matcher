import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Edit3,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  TrendingUp,
  UploadCloud,
  XCircle,
  Zap,
} from 'lucide-react';
import { ResumeAnalysis, SkillCategory } from '../types/index.js';
import { analyzeResumeFile, analyzeResumeText } from '../services/api.js';
import { SampleResumeItem } from '../../server/sampleData.js';

interface ResumeAnalyzerViewProps {
  activeResume: ResumeAnalysis | null;
  setActiveResume: (resume: ResumeAnalysis) => void;
  sampleResumes: SampleResumeItem[];
  onProceedToMatching: () => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  activeResume,
  setActiveResume,
  sampleResumes,
  onProceedToMatching,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsLoading(true);

    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setError('Please upload a PDF (.pdf), Microsoft Word (.docx), or Text (.txt) document.');
      setIsLoading(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds maximum size of 10MB.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await analyzeResumeFile(file);
      setActiveResume(result);
      setPastedText(result.rawText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Text extraction failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!pastedText.trim() || pastedText.trim().length < 20) {
      setError('Please paste at least 20 characters of resume text.');
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const result = await analyzeResumeText(pastedText, 'pasted_resume.txt');
      setActiveResume(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (sample: SampleResumeItem) => {
    setError(null);
    setIsLoading(true);
    setPastedText(sample.rawText);
    try {
      const result = await analyzeResumeText(sample.rawText, `${sample.id}.pdf`);
      setActiveResume(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (activeResume?.rawText) {
      navigator.clipboard.writeText(activeResume.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Resume NLP Analyzer & Section Parser</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload your resume to extract skills, calculate ATS section completeness, and evaluate quantitative impact metrics.
          </p>
        </div>

        {activeResume && (
          <button
            id="btn-proceed-match"
            onClick={onProceedToMatching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 cursor-pointer transition-all self-start md:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Proceed to Job Matcher →</span>
          </button>
        )}
      </div>

      {/* Upload / Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    inputMode === 'upload'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Upload File (PDF / DOCX)
                </button>
                <button
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    inputMode === 'paste'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  Paste / Edit Resume Text
                </button>
              </div>

              {activeResume && (
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Parsed {activeResume.sections.wordCount} words</span>
                </span>
              )}
            </div>

            {/* Upload Mode Dropzone */}
            {inputMode === 'upload' ? (
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isLoading ? 'Extracting text and running NLP pipeline...' : 'Click to select or drag & drop resume'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supported: <strong>PDF (.pdf)</strong>, <strong>Microsoft Word (.docx)</strong>, Plain Text (.txt) up to 10MB
                </p>
              </div>
            ) : (
              /* Paste Mode */
              <div className="space-y-3">
                <textarea
                  id="resume-text-input"
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  placeholder="Paste raw resume text here..."
                  rows={9}
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleTextSubmit}
                    disabled={isLoading || !pastedText.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Analyze Pasted Text</span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* 1-Click Sample Resumes Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Sample Resumes (Quick Load)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select any pre-configured profile to test text extraction & skill tagging instantly:
            </p>

            <div className="space-y-2.5">
              {sampleResumes.map(sample => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-indigo-50/40 dark:hover:bg-slate-800 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {sample.name}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {sample.experienceLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {sample.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analyzed Resume Details (If parsed) */}
      {activeResume ? (
        <div className="space-y-6">
          {/* Header Card: Contact & Metadata */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {activeResume.contact.name || 'Candidate Profile'}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {activeResume.contact.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{activeResume.contact.email}</span>
                    </span>
                  )}
                  {activeResume.contact.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{activeResume.contact.phone}</span>
                    </span>
                  )}
                  {activeResume.contact.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{activeResume.contact.location}</span>
                    </span>
                  )}
                  {activeResume.contact.linkedin && (
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{activeResume.contact.linkedin}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Quality Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    ATS Readability
                  </p>
                  <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    Grade {activeResume.qualityAudit.grade} ({activeResume.qualityAudit.overallScore}/100)
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  title="Copy extracted raw text"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Total Word Count</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {activeResume.sections.wordCount} words
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Detected Skills</p>
                <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {activeResume.skills.length} Technical Skills
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Action Verbs</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {activeResume.sections.actionVerbsCount} Active Verbs
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Quantified Impact</p>
                <p className="text-base font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {activeResume.sections.quantifiableMetricsCount} Metrics Detected
                </p>
              </div>
            </div>
          </div>

          {/* Categorized Skills Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <span>Extracted Skills by Taxonomy ({activeResume.skills.length} Total)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.entries(activeResume.categorizedSkills) as [SkillCategory, string[]][])
                .filter(([_, list]) => list.length > 0)
                .map(([category, list]) => (
                  <div key={category} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                      {category} ({list.length})
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {list.map(skill => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Experience & Education Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Work Experience Timeline</span>
              </h2>

              {activeResume.experience.length > 0 ? (
                <div className="space-y-4">
                  {activeResume.experience.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-indigo-500 pl-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {exp.role}
                        </h4>
                        {exp.duration && (
                          <span className="text-[10px] text-slate-400 font-medium">{exp.duration}</span>
                        )}
                      </div>
                      {exp.company && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {exp.company}
                        </p>
                      )}
                      {exp.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                          {exp.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="line-clamp-2">{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No explicit work experience timeline identified.</p>
              )}
            </div>

            {/* Education & Projects */}
            <div className="space-y-6">
              {/* Education */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>Education & Academics</span>
                </h2>

                {activeResume.education.length > 0 ? (
                  <div className="space-y-3">
                    {activeResume.education.map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{edu.degree}</h4>
                          {edu.year && <span className="text-[11px] text-slate-400">{edu.year}</span>}
                        </div>
                        {edu.institution && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{edu.institution}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">GPA / Score: {edu.gpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">General degree information detected in resume text.</p>
                )}
              </div>

              {/* Certifications */}
              {activeResume.certifications.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Verified Certifications</span>
                  </h2>
                  <div className="space-y-1.5">
                    {activeResume.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Resume Parsed Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Upload your PDF or Word resume above or select a sample profile to preview extracted skills, education, and ATS audit details.
          </p>
        </div>
      )}
    </div>
  );
};
