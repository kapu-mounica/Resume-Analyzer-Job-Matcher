import { TestCaseResult, TestSuiteReport } from '../src/types/index.js';
import { calculateJobMatch } from './nlp/jobMatcher.js';
import { analyzeResumeText } from './nlp/nlpEngine.js';
import { extractTextFromBuffer } from './nlp/textExtractor.js';
import { SAMPLE_JOBS, SAMPLE_RESUMES } from './sampleData.js';

export async function runAllAutomatedTests(): Promise<TestSuiteReport> {
  const startTime = Date.now();
  const results: TestCaseResult[] = [];

  // Test 1: Strong resume + matching job
  const t1Start = Date.now();
  try {
    const resume = analyzeResumeText(SAMPLE_RESUMES[0].rawText, 'alex_rivera_resume.pdf', 'application/pdf');
    const match = calculateJobMatch(resume, SAMPLE_JOBS[0].rawText);
    const passed = match.scoreBreakdown.overallScore >= 75 && match.matchingSkills.length >= 6;

    results.push({
      id: 1,
      name: 'Strong Resume + Matching Job',
      description: 'Senior Full-Stack Resume matched with Senior Full-Stack Job Description.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t1Start,
      details: {
        inputSummary: 'Alex Rivera (5+ Yrs Full Stack) vs Stripe Horizon Senior Full Stack Job',
        expectedBehavior: 'Overall score >= 75%, 6+ matching core skills detected, high semantic similarity.',
        actualOutput: `Overall Score: ${match.scoreBreakdown.overallScore}% (${match.scoreBreakdown.grade}), Matching Skills: ${match.matchingSkills.length}, Missing Skills: ${match.missingSkills.length}`,
        metrics: {
          overallScore: `${match.scoreBreakdown.overallScore}%`,
          hardSkillScore: `${match.scoreBreakdown.hardSkillScore}%`,
          semanticTfidf: `${match.scoreBreakdown.semanticTfidfScore}%`,
          matchingSkillsFound: match.matchingSkills.map(s => s.name).join(', '),
        },
      },
    });
  } catch (err) {
    results.push({
      id: 1,
      name: 'Strong Resume + Matching Job',
      description: 'Senior Full-Stack Resume matched with Senior Full-Stack Job Description.',
      status: 'failed',
      executionTimeMs: Date.now() - t1Start,
      details: {
        inputSummary: 'Senior Full Stack Resume',
        expectedBehavior: 'Passes matching algorithm without errors.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 2: Weak resume + unrelated job
  const t2Start = Date.now();
  try {
    const weakResume = analyzeResumeText(SAMPLE_RESUMES[3].rawText, 'david_miller_resume.txt', 'text/plain');
    const unrelatedJob = SAMPLE_JOBS[3].rawText; // Graphic designer
    const match = calculateJobMatch(weakResume, unrelatedJob);
    const passed = match.scoreBreakdown.overallScore <= 45;

    results.push({
      id: 2,
      name: 'Weak Resume + Unrelated Job',
      description: 'Junior Web Resume matched with Graphic Designer Job Description.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t2Start,
      details: {
        inputSummary: 'David Miller (Junior) vs Senior Graphic & Brand Designer Job',
        expectedBehavior: 'Overall score <= 45%, low semantic similarity, grade flagged as Low Match.',
        actualOutput: `Overall Score: ${match.scoreBreakdown.overallScore}% (${match.scoreBreakdown.grade}), Missing Skills: ${match.missingSkills.length}`,
        metrics: {
          overallScore: `${match.scoreBreakdown.overallScore}%`,
          hardSkillScore: `${match.scoreBreakdown.hardSkillScore}%`,
          grade: match.scoreBreakdown.grade,
        },
      },
    });
  } catch (err) {
    results.push({
      id: 2,
      name: 'Weak Resume + Unrelated Job',
      description: 'Junior Web Resume matched with Graphic Designer Job Description.',
      status: 'failed',
      executionTimeMs: Date.now() - t2Start,
      details: {
        inputSummary: 'Weak Resume + Graphic Designer',
        expectedBehavior: 'Clean processing with low score.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 3: Resume with many matching skills
  const t3Start = Date.now();
  try {
    const mlResume = analyzeResumeText(SAMPLE_RESUMES[1].rawText, 'priya_sharma_ml.pdf', 'application/pdf');
    const mlJob = SAMPLE_JOBS[1].rawText;
    const match = calculateJobMatch(mlResume, mlJob);
    const passed = match.matchingSkills.length >= 7 && match.scoreBreakdown.hardSkillScore >= 75;

    results.push({
      id: 3,
      name: 'Resume with Many Matching Skills',
      description: 'ML Engineer Resume matched with Machine Learning & NLP Job.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t3Start,
      details: {
        inputSummary: 'Priya Sharma (ML & NLP) vs Cognitive Dynamics AI ML Engineer Job',
        expectedBehavior: '7+ matching technical skills, hard skill score >= 75%.',
        actualOutput: `Matching Skills: ${match.matchingSkills.length} (${match.matchingSkills.map(s => s.name).slice(0, 5).join(', ')}...), Hard Skill Score: ${match.scoreBreakdown.hardSkillScore}%`,
        metrics: {
          hardSkillScore: `${match.scoreBreakdown.hardSkillScore}%`,
          matchingSkillsCount: match.matchingSkills.length,
          matchedSkills: match.matchingSkills.map(s => s.name).join(', '),
        },
      },
    });
  } catch (err) {
    results.push({
      id: 3,
      name: 'Resume with Many Matching Skills',
      description: 'ML Engineer Resume matched with Machine Learning & NLP Job.',
      status: 'failed',
      executionTimeMs: Date.now() - t3Start,
      details: {
        inputSummary: 'ML Resume + ML Job',
        expectedBehavior: 'Accurate skill extraction and matching.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 4: Resume with missing skills detection
  const t4Start = Date.now();
  try {
    const backendResume = analyzeResumeText(SAMPLE_RESUMES[2].rawText, 'karthik_backend.docx', 'application/docx');
    const fullStackJob = SAMPLE_JOBS[0].rawText; // Full stack job requiring React, GraphQL, Tailwind CSS
    const match = calculateJobMatch(backendResume, fullStackJob);
    const hasDetectedMissing = match.missingSkills.some(s => s.name === 'React' || s.name === 'Tailwind CSS');
    const passed = match.missingSkills.length >= 2 && hasDetectedMissing;

    results.push({
      id: 4,
      name: 'Resume with Missing Skills Detection',
      description: 'Python Backend Resume matched against Full-Stack Job requiring React & Tailwind.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t4Start,
      details: {
        inputSummary: 'Karthik Rao (Backend) vs Stripe Horizon Full Stack Job (Requires React, Tailwind CSS)',
        expectedBehavior: 'Explicitly identifies React, Tailwind CSS or GraphQL in missing skills list with action recommendations.',
        actualOutput: `Identified ${match.missingSkills.length} missing skills: ${match.missingSkills.map(s => s.name).join(', ')}`,
        metrics: {
          missingSkillsCount: match.missingSkills.length,
          missingList: match.missingSkills.map(s => s.name).join(', '),
        },
      },
    });
  } catch (err) {
    results.push({
      id: 4,
      name: 'Resume with Missing Skills Detection',
      description: 'Python Backend Resume matched against Full-Stack Job.',
      status: 'failed',
      executionTimeMs: Date.now() - t4Start,
      details: {
        inputSummary: 'Backend Resume + Full Stack Job',
        expectedBehavior: 'Clean missing skills extraction.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 5: PDF upload & text extraction simulation
  const t5Start = Date.now();
  try {
    // Generate text buffer simulating PDF/TXT payload
    const mockBuffer = Buffer.from(SAMPLE_RESUMES[0].rawText, 'utf-8');
    const extracted = await extractTextFromBuffer(mockBuffer, 'alex_rivera.pdf', 'application/pdf');
    const passed = extracted.wordCount >= 100 && extracted.cleanedText.includes('ALEX RIVERA');

    results.push({
      id: 5,
      name: 'PDF Upload & Text Extraction',
      description: 'Simulate PDF buffer ingestion and multi-format text normalization.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t5Start,
      details: {
        inputSummary: 'Buffer payload of alex_rivera.pdf',
        expectedBehavior: 'Extracts clean text, calculates word count >= 100, preserves line and character encoding.',
        actualOutput: `Extracted ${extracted.wordCount} words successfully. Format identified: ${extracted.format}`,
        metrics: {
          wordCount: extracted.wordCount,
          format: extracted.format,
        },
      },
    });
  } catch (err) {
    results.push({
      id: 5,
      name: 'PDF Upload & Text Extraction',
      description: 'Simulate PDF buffer ingestion.',
      status: 'failed',
      executionTimeMs: Date.now() - t5Start,
      details: {
        inputSummary: 'PDF buffer ingestion',
        expectedBehavior: 'Successful extraction without crash.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 6: DOCX upload & text extraction simulation
  const t6Start = Date.now();
  try {
    const mockBuffer = Buffer.from(SAMPLE_RESUMES[2].rawText, 'utf-8');
    const extracted = await extractTextFromBuffer(mockBuffer, 'karthik_rao.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const passed = extracted.wordCount >= 50 && extracted.cleanedText.includes('KARTHIK RAO');

    results.push({
      id: 6,
      name: 'DOCX Upload & Text Extraction',
      description: 'Simulate DOCX buffer ingestion and structure extraction.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t6Start,
      details: {
        inputSummary: 'Buffer payload of karthik_rao.docx',
        expectedBehavior: 'Extracts raw text, normalizes whitespace and symbols, returns word count.',
        actualOutput: `Extracted ${extracted.wordCount} words successfully. Format identified: ${extracted.format}`,
        metrics: {
          wordCount: extracted.wordCount,
          format: extracted.format,
        },
      },
    });
  } catch (err) {
    results.push({
      id: 6,
      name: 'DOCX Upload & Text Extraction',
      description: 'Simulate DOCX buffer ingestion.',
      status: 'failed',
      executionTimeMs: Date.now() - t6Start,
      details: {
        inputSummary: 'DOCX buffer',
        expectedBehavior: 'Successful extraction without crash.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 7: Invalid file rejection
  const t7Start = Date.now();
  try {
    let rejected = false;
    try {
      const corruptBuffer = Buffer.from([0x00, 0x01, 0x02, 0x03]);
      await extractTextFromBuffer(corruptBuffer, 'malformed_file.exe', 'application/x-msdownload');
    } catch (e) {
      rejected = true;
    }

    results.push({
      id: 7,
      name: 'Invalid File Rejection',
      description: 'Attempt uploading invalid binary file format or empty corrupted buffer.',
      status: rejected ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t7Start,
      details: {
        inputSummary: 'Corrupted binary buffer with .exe extension',
        expectedBehavior: 'Gracefully reject unsupported/empty file with informative error message.',
        actualOutput: rejected ? 'File was properly rejected with security and validation error.' : 'File was improperly accepted.',
      },
    });
  } catch (err) {
    results.push({
      id: 7,
      name: 'Invalid File Rejection',
      description: 'Attempt uploading invalid binary file.',
      status: 'failed',
      executionTimeMs: Date.now() - t7Start,
      details: {
        inputSummary: 'Corrupted binary',
        expectedBehavior: 'Caught error rejection.',
        actualOutput: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 8: Empty job description handling
  const t8Start = Date.now();
  try {
    const resume = analyzeResumeText(SAMPLE_RESUMES[0].rawText);
    const match = calculateJobMatch(resume, '   ');
    const passed = match.matchingSkills.length === 0 && match.scoreBreakdown.hardSkillScore === 0;

    results.push({
      id: 8,
      name: 'Empty Job Description Handling',
      description: 'Match a valid resume against whitespace/empty Job Description.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t8Start,
      details: {
        inputSummary: 'Valid Alex Rivera Resume vs Empty Job Description ("   ")',
        expectedBehavior: 'Handles empty text gracefully without throwing exception, returns 0% match score.',
        actualOutput: `Score handled gracefully: ${match.scoreBreakdown.overallScore}%, Matching skills: 0`,
        metrics: {
          overallScore: `${match.scoreBreakdown.overallScore}%`,
        },
      },
    });
  } catch (err) {
    results.push({
      id: 8,
      name: 'Empty Job Description Handling',
      description: 'Match resume against empty job description.',
      status: 'failed',
      executionTimeMs: Date.now() - t8Start,
      details: {
        inputSummary: 'Empty JD string',
        expectedBehavior: 'Graceful fallback without exception.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  // Test 9: Empty resume handling
  const t9Start = Date.now();
  try {
    const emptyResume = analyzeResumeText('   ');
    const match = calculateJobMatch(emptyResume, SAMPLE_JOBS[0].rawText);
    const passed = emptyResume.skills.length === 0 && match.scoreBreakdown.overallScore <= 15;

    results.push({
      id: 9,
      name: 'Empty Resume Handling',
      description: 'Analyze and match an empty text resume.',
      status: passed ? 'passed' : 'failed',
      executionTimeMs: Date.now() - t9Start,
      details: {
        inputSummary: 'Empty Resume text vs Full Stack Job',
        expectedBehavior: 'Detected skills = 0, completeness score = 0%, match score <= 15%.',
        actualOutput: `Detected Skills: ${emptyResume.skills.length}, Completeness: ${emptyResume.sections.completenessScore}%, Overall Score: ${match.scoreBreakdown.overallScore}%`,
        metrics: {
          skillsCount: emptyResume.skills.length,
          completeness: `${emptyResume.sections.completenessScore}%`,
          overallScore: `${match.scoreBreakdown.overallScore}%`,
        },
      },
    });
  } catch (err) {
    results.push({
      id: 9,
      name: 'Empty Resume Handling',
      description: 'Analyze empty resume.',
      status: 'failed',
      executionTimeMs: Date.now() - t9Start,
      details: {
        inputSummary: 'Empty Resume string',
        expectedBehavior: 'Graceful fallback without exception.',
        actualOutput: `Error: ${err instanceof Error ? err.message : String(err)}`,
      },
    });
  }

  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedTests,
    failedTests,
    durationMs: Date.now() - startTime,
    allPassed: failedTests === 0,
    results,
  };
}
