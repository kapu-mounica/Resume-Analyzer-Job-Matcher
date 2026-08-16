import React from 'react';
import {
  Briefcase,
  CheckCircle2,
  FileText,
  History,
  Info,
  LayoutDashboard,
  Play,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'resume-analyzer'
  | 'job-matcher'
  | 'results'
  | 'history'
  | 'skills'
  | 'methodology';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenTestSuite: () => void;
  hasActiveResult: boolean;
  hasActiveResume: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTestSuite,
  hasActiveResult,
  hasActiveResume,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileText, badge: hasActiveResume ? 'Loaded' : undefined },
    { id: 'job-matcher', label: 'Job Matcher', icon: Briefcase },
    { id: 'results', label: 'Match Results', icon: CheckCircle2, badge: hasActiveResult ? 'Ready' : undefined },
    { id: 'history', label: 'History', icon: History },
    { id: 'skills', label: 'Skills Matrix', icon: Sliders },
    { id: 'methodology', label: 'Methodology', icon: Info },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-indigo-500/20 shadow-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">RESUME MATCH</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  NLP Core v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal hidden sm:block">
                Intelligent Resume Analysis & ATS Job Matching Engine
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              id="nav-run-tests-btn"
              onClick={onOpenTestSuite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
              title="Run 9 Automated Verification Test Cases"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="hidden md:inline">Run Test Suite</span>
              <span className="md:hidden">Tests</span>
            </button>

            <button
              id="nav-quick-match-btn"
              onClick={() => setActiveTab('job-matcher')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Match Job</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
