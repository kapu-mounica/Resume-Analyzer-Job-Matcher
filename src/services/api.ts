import {
  HistoryRecord,
  JobMatchResult,
  ResumeAnalysis,
  Skill,
  SkillCategory,
  TestSuiteReport,
} from '../types/index.js';
import { SampleJobItem, SampleResumeItem } from '../../server/sampleData.js';

export async function analyzeResumeFile(file: File): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze resume file.');
  }

  return data.data;
}

export async function analyzeResumeText(rawText: string, filename = 'pasted_resume.txt'): Promise<ResumeAnalysis> {
  const response = await fetch('/api/analyze-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawText, filename }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze resume text.');
  }

  return data.data;
}

export async function matchResumeWithJob(
  resume: ResumeAnalysis,
  jobDescription: string
): Promise<{ result: JobMatchResult; historyId: string }> {
  const response = await fetch('/api/match-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resume,
      jobDescription,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to calculate job match score.');
  }

  return { result: data.data, historyId: data.historyId };
}

export async function fetchSkillsDatabase(): Promise<{
  categories: SkillCategory[];
  totalSkills: number;
  skills: Skill[];
}> {
  const response = await fetch('/api/skills');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to load skills database.');
  }
  return data;
}

export async function fetchSampleData(): Promise<{
  resumes: SampleResumeItem[];
  jobs: SampleJobItem[];
}> {
  const response = await fetch('/api/sample-data');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to load sample data.');
  }
  return data;
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const response = await fetch('/api/history');
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to load history.');
  }
  return data.data || [];
}

export async function deleteHistoryRecord(id: string): Promise<void> {
  const response = await fetch(`/api/history/${id}`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete history record.');
  }
}

export async function clearAllHistory(): Promise<void> {
  const response = await fetch('/api/history', { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to clear history.');
  }
}

export async function runAutomatedTestsApi(): Promise<TestSuiteReport> {
  const response = await fetch('/api/run-tests', { method: 'POST' });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to execute test suite.');
  }
  return data.report;
}

export const runTestSuite = runAutomatedTestsApi;
export const fetchSamples = fetchSampleData;

export type { TestSuiteReport };
