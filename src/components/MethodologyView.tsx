import React from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  FileCheck,
  HelpCircle,
  Info,
  Layers,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn text-slate-800 dark:text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Transparent NLP System Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Algorithm & Scoring Methodology
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          A rigorous, non-black-box approach combining deterministic skill graph matching, TF-IDF vector similarity, and ATS heuristics.
        </p>
      </div>

      {/* 4 Pillars of the Matching Score */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Composite Match Scoring Formula</span>
        </h2>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
          <p className="text-indigo-400 font-bold">// Composite Overall Match Formula (0 to 100%):</p>
          <p className="mt-1">
            OverallScore = (HardSkillScore × 0.40) + (TfidfCosineSimilarity × 0.25) + (RequirementCoverage × 0.20) + (AtsQualityScore × 0.15)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/30 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                1. Hard Technical Skill Score
              </span>
              <span className="text-xs font-extrabold text-indigo-600 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                40% Weight
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Evaluates exact and alias skill matches against the target job description. Required skills carry 1.5x weight compared to preferred bonus skills.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              Formula: (MatchedReq × 1.5 + MatchedPref × 1.0) / (TotalReq × 1.5 + TotalPref × 1.0)
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl border border-cyan-100 dark:border-slate-800 bg-cyan-50/30 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-cyan-700 dark:text-cyan-300">
                2. Semantic TF-IDF Cosine Similarity
              </span>
              <span className="text-xs font-extrabold text-cyan-600 bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded-full">
                25% Weight
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Computes term frequency-inverse document frequency vector similarity across normalized token vocabularies after stripping stop words.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              Formula: cos(θ) = (A · B) / (||A|| × ||B||)
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl border border-emerald-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                3. Job Requirements Coverage
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                20% Weight
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Assesses qualification bullet points, minimum years of experience criteria, degree prerequisites, and core duty keywords.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              Formula: CoveredRequirementCount / TotalRequirementCount
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-xl border border-violet-100 dark:border-slate-800 bg-violet-50/30 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-violet-700 dark:text-violet-300">
                4. Resume Quality & ATS Health
              </span>
              <span className="text-xs font-extrabold text-violet-600 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 rounded-full">
                15% Weight
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Evaluates presence of active verbs (e.g. engineered, deployed), quantitative metric density (percentages, scale), and section completeness.
            </p>
            <div className="text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              Formula: Contact(15) + Verbs(20) + Metrics(25) + SkillsDensity(20) + Length(20)
            </div>
          </div>
        </div>
      </div>

      {/* NLP Pipeline Stages */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>NLP Extraction Pipeline Stages</span>
        </h2>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Multi-Format Ingestion & Buffer Sanitization
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Extracts raw unicode stream from PDF binary structures and Microsoft Word XML packages (DOCX). Sanitizes smart quotes, en-dashes, non-breaking spaces, and non-printable characters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Technical Token Normalization & Boundary Preservation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Standard tokenizers inadvertently break technical terms like <code>C++</code>, <code>C#</code>, <code>.NET</code>, <code>Node.js</code>, and <code>CI/CD</code>. Our tokenizer replaces these with protected symbol identifiers before applying whitespace segmentation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                N-Gram Matching Against 400+ Skill Taxonomy
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates unigrams, bigrams, and trigrams (e.g., "Machine Learning", "Object-Oriented Programming", "RESTful API") against structured skill dictionaries with aliases and contextual word-boundary regex patterns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Job Context Linguistic Trigger Extraction
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scans job description sentences for requirement indicators ("must have", "proven experience with") vs preference indicators ("nice to have", "plus", "bonus") to automatically weigh technical competencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Career Guidance & Evaluation Disclaimer:</p>
          <p className="mt-1 leading-relaxed text-[11px] opacity-90">
            The Resume-Job Match Score produced by this application is a mathematical similarity index calculated using deterministic natural language processing, TF-IDF lexical frequency, and keyword density. While it serves as an excellent benchmark for ATS keyword preparation and resume optimization, it does not evaluate human subjective traits (such as communication culture, behavioral fit, or interview performance) and is not a legal guarantee of interview selection or job offers.
          </p>
        </div>
      </div>
    </div>
  );
};
