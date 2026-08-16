import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { HistoryRecord, ResumeAnalysis } from './src/types/index.js';
import { calculateJobMatch } from './server/nlp/jobMatcher.js';
import { analyzeResumeText } from './server/nlp/nlpEngine.js';
import { SKILL_CATEGORIES, SKILL_DATABASE } from './server/nlp/skillsDatabase.js';
import { extractTextFromBuffer } from './server/nlp/textExtractor.js';
import { SAMPLE_JOBS, SAMPLE_RESUMES } from './server/sampleData.js';
import { runAllAutomatedTests } from './server/testSuite.js';

// In-memory persistent history store (seeded with initial realistic records for instant rich dashboard)
let historyStore: HistoryRecord[] = [];

// Seed initial history
(function seedInitialHistory() {
  try {
    const res1 = analyzeResumeText(SAMPLE_RESUMES[0].rawText, 'alex_rivera_resume.pdf', 'application/pdf', 145000);
    const match1 = calculateJobMatch(res1, SAMPLE_JOBS[0].rawText);
    historyStore.push({
      id: `hist_${Date.now() - 1000 * 60 * 60 * 24 * 2}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      resumeFilename: 'alex_rivera_resume.pdf',
      candidateName: 'Alex Rivera',
      jobTitle: 'Senior Full-Stack Engineer',
      companyName: 'Stripe Horizon Technologies',
      matchScore: match1.scoreBreakdown.overallScore,
      grade: match1.scoreBreakdown.grade,
      matchingSkillsCount: match1.matchingSkills.length,
      missingSkillsCount: match1.missingSkills.length,
      matchingSkills: match1.matchingSkills.map(s => s.name),
      missingSkills: match1.missingSkills.map(s => s.name),
      resultData: match1,
    });

    const res2 = analyzeResumeText(SAMPLE_RESUMES[1].rawText, 'priya_sharma_ml.pdf', 'application/pdf', 182000);
    const match2 = calculateJobMatch(res2, SAMPLE_JOBS[1].rawText);
    historyStore.push({
      id: `hist_${Date.now() - 1000 * 60 * 60 * 12}`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      resumeFilename: 'priya_sharma_ml.pdf',
      candidateName: 'Priya Sharma',
      jobTitle: 'Machine Learning & NLP Engineer',
      companyName: 'Cognitive Dynamics AI',
      matchScore: match2.scoreBreakdown.overallScore,
      grade: match2.scoreBreakdown.grade,
      matchingSkillsCount: match2.matchingSkills.length,
      missingSkillsCount: match2.missingSkills.length,
      matchingSkills: match2.matchingSkills.map(s => s.name),
      missingSkills: match2.missingSkills.map(s => s.name),
      resultData: match2,
    });
  } catch (e) {
    console.error('Failed to seed history:', e);
  }
})();

// Multer memory storage configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.pdf', '.docx', '.doc', '.txt', '.rtf', '.md'].includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('word') || file.mimetype.includes('text')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload a PDF (.pdf), Word (.docx), or Text (.txt) document.'));
    }
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // ==================== API ROUTES ====================

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Resume Analyzer & Job Matcher API',
    });
  });

  // POST /api/analyze-resume: Handles PDF/DOCX file upload or JSON payload
  app.post('/api/analyze-resume', (req: Request, res: Response, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `File upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  }, async (req: Request, res: Response) => {
    try {
      let rawText = '';
      let filename = 'pasted_resume.txt';
      let fileType = 'text/plain';
      let fileSize = 0;

      if (req.file) {
        filename = req.file.originalname;
        fileType = req.file.mimetype;
        fileSize = req.file.size;

        const extracted = await extractTextFromBuffer(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );
        rawText = extracted.rawText;
      } else if (req.body && req.body.rawText) {
        rawText = req.body.rawText;
        filename = req.body.filename || 'pasted_resume.txt';
        fileType = 'text/plain';
        fileSize = Buffer.byteLength(rawText, 'utf-8');
      } else {
        return res.status(400).json({
          error: 'No resume content provided. Please upload a PDF/DOCX file or supply resume text.',
        });
      }

      if (!rawText || rawText.trim().length < 15) {
        return res.status(400).json({
          error: 'Resume text appears empty or could not be extracted cleanly from the file.',
        });
      }

      const analysis: ResumeAnalysis = analyzeResumeText(rawText, filename, fileType, fileSize);

      return res.json({
        success: true,
        data: analysis,
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'An error occurred during resume NLP analysis.',
      });
    }
  });

  // POST /api/match-job: Matches an analyzed resume with a job description
  app.post('/api/match-job', (req: Request, res: Response) => {
    try {
      const { resume, resumeText, jobDescription } = req.body;

      if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 10) {
        return res.status(400).json({
          error: 'Please provide a valid Job Description with at least 10 characters to perform matching.',
        });
      }

      let resumeAnalysis: ResumeAnalysis;

      if (resume && resume.skills) {
        resumeAnalysis = resume;
      } else if (resumeText && typeof resumeText === 'string') {
        resumeAnalysis = analyzeResumeText(resumeText);
      } else {
        return res.status(400).json({
          error: 'Please provide valid resume data or resume text for job matching.',
        });
      }

      const matchResult = calculateJobMatch(resumeAnalysis, jobDescription);

      // Auto-persist match to history store
      const historyItem: HistoryRecord = {
        id: `hist_${Date.now()}`,
        timestamp: matchResult.analyzedAt,
        resumeFilename: matchResult.resumeSummary.filename || 'Resume',
        candidateName: matchResult.resumeSummary.candidateName,
        jobTitle: matchResult.jobSummary.title || 'Target Job',
        companyName: matchResult.jobSummary.company,
        matchScore: matchResult.scoreBreakdown.overallScore,
        grade: matchResult.scoreBreakdown.grade,
        matchingSkillsCount: matchResult.matchingSkills.length,
        missingSkillsCount: matchResult.missingSkills.length,
        matchingSkills: matchResult.matchingSkills.map(s => s.name),
        missingSkills: matchResult.missingSkills.map(s => s.name),
        resultData: matchResult,
      };

      // Keep up to 50 most recent records
      historyStore.unshift(historyItem);
      if (historyStore.length > 50) {
        historyStore = historyStore.slice(0, 50);
      }

      return res.json({
        success: true,
        data: matchResult,
        historyId: historyItem.id,
      });
    } catch (error) {
      console.error('Error matching job:', error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to calculate resume-job match score.',
      });
    }
  });

  // GET /api/skills: Returns categorized skill database
  app.get('/api/skills', (req: Request, res: Response) => {
    res.json({
      success: true,
      categories: SKILL_CATEGORIES,
      totalSkills: SKILL_DATABASE.length,
      skills: SKILL_DATABASE,
    });
  });

  // GET /api/sample-data: Returns sample resumes and job descriptions
  app.get('/api/sample-data', (req: Request, res: Response) => {
    res.json({
      success: true,
      resumes: SAMPLE_RESUMES,
      jobs: SAMPLE_JOBS,
    });
  });

  // GET /api/history: Retrieve analysis history
  app.get('/api/history', (req: Request, res: Response) => {
    res.json({
      success: true,
      count: historyStore.length,
      data: historyStore,
    });
  });

  // POST /api/history: Add an explicit history record
  app.post('/api/history', (req: Request, res: Response) => {
    try {
      const record: HistoryRecord = req.body;
      if (!record || !record.id) {
        return res.status(400).json({ error: 'Invalid history record.' });
      }
      historyStore.unshift(record);
      if (historyStore.length > 50) {
        historyStore = historyStore.slice(0, 50);
      }
      res.json({ success: true, count: historyStore.length });
    } catch (e) {
      res.status(500).json({ error: 'Failed to save history record.' });
    }
  });

  // DELETE /api/history/:id: Remove single history entry
  app.delete('/api/history/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = historyStore.length;
    historyStore = historyStore.filter(h => h.id !== id);
    if (historyStore.length === initialLen) {
      return res.status(404).json({ error: 'Record not found.' });
    }
    res.json({ success: true, remaining: historyStore.length });
  });

  // DELETE /api/history: Clear all history
  app.delete('/api/history', (req: Request, res: Response) => {
    historyStore = [];
    res.json({ success: true, count: 0 });
  });

  // POST /api/run-tests: Automated test suite endpoint
  app.post('/api/run-tests', async (req: Request, res: Response) => {
    try {
      const report = await runAllAutomatedTests();
      res.json({
        success: true,
        report,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to execute test suite.',
      });
    }
  });

  // ==================== VITE MIDDLEWARE & STATIC SERVING ====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Resume Analyzer & Job Matcher server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
