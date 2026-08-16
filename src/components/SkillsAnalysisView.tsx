import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  Layers,
  Search,
  Sliders,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';
import { JobMatchResult, ResumeAnalysis, Skill, SkillCategory } from '../types/index.js';
import { fetchSkillsDatabase } from '../services/api.js';

interface SkillsAnalysisViewProps {
  activeResume: ResumeAnalysis | null;
  activeResult: JobMatchResult | null;
}

export const SkillsAnalysisView: React.FC<SkillsAnalysisViewProps> = ({
  activeResume,
  activeResult,
}) => {
  const [skillsList, setSkillsList] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSkillsDatabase()
      .then(res => {
        setSkillsList(res.skills);
        setCategories(res.categories);
      })
      .catch(err => console.error('Failed to load skills taxonomy:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const resumeSkillsSet = new Set((activeResume?.skills || []).map(s => s.skill.toLowerCase()));
  const matchingSkillsSet = new Set((activeResult?.matchingSkills || []).map(s => s.name.toLowerCase()));
  const missingSkillsSet = new Set((activeResult?.missingSkills || []).map(s => s.name.toLowerCase()));

  const filteredSkills = skillsList.filter(skill => {
    const matchesCat = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (skill.aliases || []).some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <span>Industry Skill Taxonomy & Gap Matrix</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore structured tech competencies across 8 domains and cross-reference with your active resume and target job requirements.
        </p>
      </div>

      {/* Top Gap Matrix Summary (if result exists) */}
      {activeResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Target Job Gap Matrix: {activeResult.jobSummary.title}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Acquired & Verified Competencies ({activeResult.matchingSkills.length})</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeResult.matchingSkills.map(s => (
                  <span
                    key={s.name}
                    className="px-2 py-0.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <h3 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Target Job Competency Gaps ({activeResult.missingSkills.length})</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeResult.missingSkills.map(s => (
                  <span
                    key={s.name}
                    className="px-2 py-0.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs"
                  >
                    {s.name} ({s.importance})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 400+ skills, aliases, tools..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <span className="text-xs text-slate-400 self-end sm:self-auto">
            Showing <strong>{filteredSkills.length}</strong> Skills in Database
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredSkills.map(skill => {
          const isPresentInResume = resumeSkillsSet.has(skill.name.toLowerCase());
          const isMissingInJob = missingSkillsSet.has(skill.name.toLowerCase());
          const isMatchedInJob = matchingSkillsSet.has(skill.name.toLowerCase());

          return (
            <div
              key={skill.name}
              className={`p-3.5 rounded-xl border transition-all ${
                isMatchedInJob
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : isMissingInJob
                  ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                  : isPresentInResume
                  ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {skill.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{skill.category}</p>
                </div>

                {skill.demandLevel && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      skill.demandLevel === 'Very High'
                        ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {skill.demandLevel} Demand
                  </span>
                )}
              </div>

              {/* Status Pill */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-[10px]">
                {isPresentInResume ? (
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                    <span>In Active Resume</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Not in Resume</span>
                )}

                {isMissingInJob && (
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    Job Gap ✗
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
