export interface Skill {
  name: string;
  category: SkillCategory;
  aliases?: string[];
  description?: string;
  demandLevel?: 'High' | 'Very High' | 'Moderate';
}

export type SkillCategory =
  | 'Programming Languages'
  | 'Web & Frontend'
  | 'Backend & Frameworks'
  | 'Data Science & Machine Learning'
  | 'Databases & Storage'
  | 'Cloud & DevOps'
  | 'Software Engineering & Tools'
  | 'Soft Skills & Methodologies';

export interface ExtractedContact {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface ExtractedEducation {
  degree: string;
  field?: string;
  institution?: string;
  year?: string;
  gpa?: string;
}

export interface ExtractedExperience {
  role?: string;
  company?: string;
  duration?: string;
  yearsEstimated?: number;
  highlights: string[];
}

export interface ExtractedProject {
  title: string;
  description?: string;
  technologies: string[];
  highlights: string[];
  metricsDetected: boolean;
}

export interface SectionAnalysis {
  hasContactInfo: boolean;
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  hasProjects: boolean;
  hasCertifications: boolean;
  wordCount: number;
  readingTimeMinutes: number;
  actionVerbsCount: number;
  quantifiableMetricsCount: number;
  completenessScore: number; // 0-100
}

export interface ResumeAnalysis {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  rawText: string;
  cleanedText: string;
  contact: ExtractedContact;
  skills: {
    skill: string;
    category: SkillCategory;
    count: number;
    locations: string[];
  }[];
  categorizedSkills: Record<SkillCategory, string[]>;
  education: ExtractedEducation[];
  experience: ExtractedExperience[];
  projects: ExtractedProject[];
  certifications: string[];
  sections: SectionAnalysis;
  qualityAudit: {
    overallScore: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D';
    strengths: string[];
    weaknesses: string[];
    actionableSuggestions: string[];
    atsIssues: string[];
  };
}

export interface JobRequirement {
  text: string;
  type: 'required' | 'preferred';
  category: string;
  matched: boolean;
  matchingSkill?: string;
}

export interface JobDescriptionAnalysis {
  rawText: string;
  cleanedText: string;
  jobTitle?: string;
  company?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  allDetectedSkills: string[];
  categorizedSkills: Record<SkillCategory, string[]>;
  experienceRequirementYears?: number;
  educationRequirement?: string;
  requirementsList: JobRequirement[];
  topKeywords: { word: string; count: number; score: number }[];
}

export interface MatchScoreBreakdown {
  hardSkillScore: number;       // 0-100 (40% weight)
  semanticTfidfScore: number;   // 0-100 (25% weight)
  requirementCoverageScore: number; // 0-100 (20% weight)
  resumeQualityScore: number;   // 0-100 (15% weight)
  overallScore: number;         // 0-100
  grade: 'Excellent Match' | 'Strong Match' | 'Moderate Match' | 'Low Match';
}

export interface JobMatchResult {
  id: string;
  analyzedAt: string;
  resumeSummary: {
    id: string;
    filename: string;
    candidateName?: string;
    topSkills: string[];
    wordCount: number;
  };
  jobSummary: {
    title: string;
    company?: string;
    totalRequiredSkills: number;
    totalPreferredSkills: number;
  };
  scoreBreakdown: MatchScoreBreakdown;
  matchingSkills: {
    name: string;
    category: SkillCategory;
    importance: 'required' | 'preferred' | 'bonus';
    frequencyInResume: number;
    frequencyInJob: number;
  }[];
  missingSkills: {
    name: string;
    category: SkillCategory;
    importance: 'required' | 'preferred';
    recommendation: string;
  }[];
  partialMatches: {
    jobSkill: string;
    relatedResumeSkill: string;
    reason: string;
  }[];
  keywordCoverage: {
    keyword: string;
    inResume: boolean;
    importance: number;
  }[];
  requirementsEvaluation: {
    totalRequirements: number;
    coveredCount: number;
    uncoveredCount: number;
    items: JobRequirement[];
  };
  strengths: string[];
  gaps: string[];
  improvementRoadmap: {
    priority: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    actionItems: string[];
  }[];
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  resumeFilename: string;
  candidateName?: string;
  jobTitle: string;
  companyName?: string;
  matchScore: number;
  grade: string;
  matchingSkillsCount: number;
  missingSkillsCount: number;
  matchingSkills: string[];
  missingSkills: string[];
  resultData: JobMatchResult;
}

export interface TestCaseResult {
  id: number;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'running';
  executionTimeMs: number;
  details: {
    inputSummary: string;
    expectedBehavior: string;
    actualOutput: string;
    metrics?: Record<string, string | number>;
  };
}

export interface TestSuiteReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  durationMs: number;
  allPassed: boolean;
  results: TestCaseResult[];
}
