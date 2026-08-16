import {
  JobDescriptionAnalysis,
  JobMatchResult,
  JobRequirement,
  MatchScoreBreakdown,
  ResumeAnalysis,
  SkillCategory,
} from '../../src/types/index.js';
import {
  computeCosineSimilarity,
  computeTermFrequencies,
  extractEducation,
  extractSkills,
  tokenize,
} from './nlpEngine.js';
import { getSkillCategory, SKILL_DATABASE } from './skillsDatabase.js';

export function analyzeJobDescription(jobText: string): JobDescriptionAnalysis {
  const cleanedText = jobText.replace(/\s+/g, ' ').trim();
  const lowerText = jobText.toLowerCase();

  // Extract skills present in JD
  const { skills: detectedSkillsList, categorizedSkills } = extractSkills(jobText);
  const allDetectedSkills = detectedSkillsList.map(s => s.skill);

  // Classify skills into Required vs Preferred based on sentence context
  const lines = jobText.split(/\n|\. |\; /).map(l => l.trim()).filter(l => l.length > 0);
  const requiredSkillsSet = new Set<string>();
  const preferredSkillsSet = new Set<string>();

  const requiredTriggers = [
    'must have', 'required', 'requirements', 'qualifications', 'essential',
    'mandatory', 'minimum of', 'proven experience in', 'strong experience in',
    'proficient in', 'expert in', 'hands-on experience with', 'you will need',
    'core requirements', 'technical stack',
  ];

  const preferredTriggers = [
    'preferred', 'nice to have', 'plus', 'bonus', 'good to have', 'desired',
    'advantageous', 'familiarity with', 'exposure to', 'optional',
  ];

  for (const line of lines) {
    const lineLower = line.toLowerCase();
    const isPreferred = preferredTriggers.some(trigger => lineLower.includes(trigger));
    const isRequired = requiredTriggers.some(trigger => lineLower.includes(trigger));

    for (const skill of allDetectedSkills) {
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const skillRegex = new RegExp(`\\b${escaped}\\b`, 'i');

      if (skillRegex.test(line)) {
        if (isPreferred && !isRequired) {
          preferredSkillsSet.add(skill);
        } else {
          requiredSkillsSet.add(skill);
        }
      }
    }
  }

  // Ensure every detected skill is categorized as at least required or preferred
  for (const skill of allDetectedSkills) {
    if (!requiredSkillsSet.has(skill) && !preferredSkillsSet.has(skill)) {
      requiredSkillsSet.add(skill);
    }
  }

  // Extract Job Title
  let jobTitle = 'Software Engineer';
  const titleMatch = jobText.match(/(?:Job Title|Role|Position|Opening):\s*([A-Za-z0-9\s&/-]{3,50})/i) ||
    lines[0]?.match(/^[A-Za-z0-9\s&/-]{4,40}$/);
  if (titleMatch) {
    jobTitle = (titleMatch[1] || titleMatch[0]).trim();
  } else {
    for (const rolePattern of ['Full Stack Developer', 'Data Scientist', 'Machine Learning Engineer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Software Engineer', 'Cloud Architect']) {
      if (new RegExp(rolePattern, 'i').test(jobText)) {
        jobTitle = rolePattern;
        break;
      }
    }
  }

  // Extract Company Name if present
  let company: string | undefined;
  const companyMatch = jobText.match(/(?:Company|About|At)\s+([A-Za-z0-9\s&]{2,35})(?:is hiring|is looking|offers)/i);
  if (companyMatch) {
    company = companyMatch[1].trim();
  }

  // Experience requirement in years
  let experienceRequirementYears: number | undefined;
  const expMatch = jobText.match(/(\d+)(?:\+|\s*to\s*\d+)?\s*(?:years|yrs)(?:\s+of)?\s+(?:experience|exp)/i) ||
    jobText.match(/(?:experience|exp)\s*(?:required|needed)?\s*:\s*(\d+)\s*(?:years|yrs)/i);
  if (expMatch) {
    experienceRequirementYears = parseInt(expMatch[1], 10);
  }

  // Education requirement
  let educationRequirement: string | undefined;
  const eduMatch = jobText.match(/(?:Bachelor|Master|B\.Tech|B\.E\.|B\.S\.|M\.S\.|Degree|Ph\.D\.)\s+(?:in|of)\s+[A-Za-z\s&,]{4,50}/i);
  if (eduMatch) {
    educationRequirement = eduMatch[0].trim();
  }

  // Extract structured requirements list
  const requirementsList: JobRequirement[] = [];
  for (const line of lines) {
    if (
      line.length >= 15 &&
      line.length <= 150 &&
      (line.startsWith('•') || line.startsWith('-') || /^(must|require|experience|knowledge|ability|proficiency)/i.test(line))
    ) {
      const isPref = preferredTriggers.some(t => line.toLowerCase().includes(t));
      const cleanLine = line.replace(/^[•\-\*]\s*/, '');
      const matchedSkill = allDetectedSkills.find(s => new RegExp(`\\b${s}\\b`, 'i').test(cleanLine));

      requirementsList.push({
        text: cleanLine,
        type: isPref ? 'preferred' : 'required',
        category: matchedSkill ? getSkillCategory(matchedSkill) : 'General Requirements',
        matched: false, // will be evaluated during matching
        matchingSkill: matchedSkill,
      });
    }
  }

  // Top Keywords
  const tokens = tokenize(jobText);
  const tf = computeTermFrequencies(tokens);
  const topKeywords = Array.from(tf.entries())
    .map(([word, count]) => ({
      word,
      count,
      score: Math.round((count / tokens.length) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return {
    rawText: jobText,
    cleanedText,
    jobTitle,
    company,
    requiredSkills: Array.from(requiredSkillsSet),
    preferredSkills: Array.from(preferredSkillsSet),
    allDetectedSkills,
    categorizedSkills,
    experienceRequirementYears,
    educationRequirement,
    requirementsList,
    topKeywords,
  };
}

export function calculateJobMatch(
  resume: ResumeAnalysis,
  jobDescriptionText: string
): JobMatchResult {
  const jobAnalysis = analyzeJobDescription(jobDescriptionText);
  const resumeSkillsSet = new Set(resume.skills.map(s => s.skill.toLowerCase()));

  // 1. Skill Matching Logic
  const matchingSkills: JobMatchResult['matchingSkills'] = [];
  const missingSkills: JobMatchResult['missingSkills'] = [];

  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  // Check required skills
  for (const reqSkill of jobAnalysis.requiredSkills) {
    const reqSkillLower = reqSkill.toLowerCase();
    const isMatched = resumeSkillsSet.has(reqSkillLower) ||
      resume.cleanedText.toLowerCase().includes(reqSkillLower);

    const category = getSkillCategory(reqSkill);

    if (isMatched) {
      matchedRequired.push(reqSkill);
      const resumeSkillObj = resume.skills.find(s => s.skill.toLowerCase() === reqSkillLower);
      matchingSkills.push({
        name: reqSkill,
        category,
        importance: 'required',
        frequencyInResume: resumeSkillObj ? resumeSkillObj.count : 1,
        frequencyInJob: 1,
      });
    } else {
      missingRequired.push(reqSkill);
      missingSkills.push({
        name: reqSkill,
        category,
        importance: 'required',
        recommendation: `High Priority: Add demonstrable project work or experience highlighting ${reqSkill}.`,
      });
    }
  }

  // Check preferred skills
  for (const prefSkill of jobAnalysis.preferredSkills) {
    const prefSkillLower = prefSkill.toLowerCase();
    const isMatched = resumeSkillsSet.has(prefSkillLower) ||
      resume.cleanedText.toLowerCase().includes(prefSkillLower);

    const category = getSkillCategory(prefSkill);

    if (isMatched) {
      matchedPreferred.push(prefSkill);
      const resumeSkillObj = resume.skills.find(s => s.skill.toLowerCase() === prefSkillLower);
      matchingSkills.push({
        name: prefSkill,
        category,
        importance: 'preferred',
        frequencyInResume: resumeSkillObj ? resumeSkillObj.count : 1,
        frequencyInJob: 1,
      });
    } else {
      missingPreferred.push(prefSkill);
      missingSkills.push({
        name: prefSkill,
        category,
        importance: 'preferred',
        recommendation: `Bonus Advantage: Familiarity with ${prefSkill} will strengthen your application competitiveness.`,
      });
    }
  }

  // 2. Partial Matches & Skill Proximities
  const partialMatches: JobMatchResult['partialMatches'] = [];
  const skillProximityMap: Record<string, { related: string; reason: string }> = {
    'FastAPI': { related: 'Flask', reason: 'Modern Python ASGI web framework with similar routing patterns to Flask' },
    'Flask': { related: 'FastAPI', reason: 'Python WSGI micro-framework sharing Python backend concepts with FastAPI' },
    'React': { related: 'Vue.js', reason: 'Component-based reactive frontend architecture' },
    'Vue.js': { related: 'React', reason: 'Component-based declarative UI framework' },
    'PostgreSQL': { related: 'MySQL', reason: 'Relational SQL database with similar ACID querying principles' },
    'MySQL': { related: 'PostgreSQL', reason: 'Relational database sharing SQL ANSI compliance' },
    'AWS': { related: 'Google Cloud', reason: 'Enterprise cloud infrastructure (compute, storage, IAM, serverless)' },
    'Google Cloud': { related: 'AWS', reason: 'Enterprise cloud services sharing architectural paradigms' },
    'Docker': { related: 'Kubernetes', reason: 'Containerization runtime foundational to Kubernetes orchestration' },
    'PyTorch': { related: 'TensorFlow', reason: 'Deep learning tensor computation and neural network framework' },
    'TensorFlow': { related: 'PyTorch', reason: 'Deep learning framework for training and inference' },
    'TypeScript': { related: 'JavaScript', reason: 'Typed superset sharing full ECMAScript standard compatibility' },
  };

  for (const missing of missingSkills) {
    const proximity = skillProximityMap[missing.name];
    if (proximity && resumeSkillsSet.has(proximity.related.toLowerCase())) {
      partialMatches.push({
        jobSkill: missing.name,
        relatedResumeSkill: proximity.related,
        reason: proximity.reason,
      });
    }
  }

  // 3. Keyword Coverage & TF-IDF Cosine Similarity
  const tfidfSimilarity = computeCosineSimilarity(resume.rawText, jobDescriptionText);
  const semanticTfidfScore = Math.round(tfidfSimilarity * 100);

  const resumeTokens = new Set(tokenize(resume.rawText));
  const keywordCoverage = jobAnalysis.topKeywords.slice(0, 15).map(item => ({
    keyword: item.word,
    inResume: resumeTokens.has(item.word),
    importance: item.score,
  }));

  // 4. Job Requirements Evaluation
  let coveredReqCount = 0;
  const evaluatedRequirements = jobAnalysis.requirementsList.map(req => {
    let matched = false;
    if (req.matchingSkill && resumeSkillsSet.has(req.matchingSkill.toLowerCase())) {
      matched = true;
    } else {
      // Token overlap match
      const reqTokens = tokenize(req.text);
      const matchedTokens = reqTokens.filter(t => resumeTokens.has(t));
      if (reqTokens.length > 0 && (matchedTokens.length / reqTokens.length) >= 0.45) {
        matched = true;
      }
    }

    if (matched) coveredReqCount++;
    return { ...req, matched };
  });

  const totalReqs = Math.max(evaluatedRequirements.length, 1);
  const requirementCoverageScore = Math.round((coveredReqCount / totalReqs) * 100);

  // 5. Hard Skill Score Calculation Formula:
  // (Matched Required * 1.5 + Matched Preferred * 1.0) / (Total Required * 1.5 + Total Preferred * 1.0)
  const totalRequired = jobAnalysis.requiredSkills.length;
  const totalPreferred = jobAnalysis.preferredSkills.length;

  let hardSkillScore = 0;
  if (totalRequired + totalPreferred === 0) {
    hardSkillScore = semanticTfidfScore;
  } else {
    const numerator = (matchedRequired.length * 1.5) + (matchedPreferred.length * 1.0);
    const denominator = (totalRequired * 1.5) + (totalPreferred * 1.0);
    hardSkillScore = Math.round((numerator / Math.max(denominator, 1)) * 100);
  }

  // 6. Resume Quality Score from NLP Engine
  const resumeQualityScore = resume.qualityAudit.overallScore;

  // 7. Overall Weighted Calculation:
  // Skill Match: 40%
  // Semantic TF-IDF: 25%
  // Requirement Coverage: 20%
  // Resume Quality: 15%
  const weightedOverall = Math.round(
    (hardSkillScore * 0.40) +
    (semanticTfidfScore * 0.25) +
    (requirementCoverageScore * 0.20) +
    (resumeQualityScore * 0.15)
  );

  const overallScore = Math.min(Math.max(weightedOverall, 5), 98);

  let grade: MatchScoreBreakdown['grade'] = 'Low Match';
  if (overallScore >= 80) grade = 'Excellent Match';
  else if (overallScore >= 68) grade = 'Strong Match';
  else if (overallScore >= 48) grade = 'Moderate Match';
  else grade = 'Low Match';

  const scoreBreakdown: MatchScoreBreakdown = {
    hardSkillScore: Math.min(100, hardSkillScore),
    semanticTfidfScore: Math.min(100, semanticTfidfScore),
    requirementCoverageScore: Math.min(100, requirementCoverageScore),
    resumeQualityScore: Math.min(100, resumeQualityScore),
    overallScore,
    grade,
  };

  // Strengths identification
  const strengths: string[] = [];
  if (matchedRequired.length > 0) {
    strengths.push(`Matches ${matchedRequired.length} essential core required skills including: ${matchedRequired.slice(0, 4).join(', ')}.`);
  }
  if (matchedPreferred.length > 0) {
    strengths.push(`Possesses ${matchedPreferred.length} preferred bonus skills: ${matchedPreferred.slice(0, 3).join(', ')}.`);
  }
  if (semanticTfidfScore >= 60) {
    strengths.push(`High contextual vocabulary alignment (${semanticTfidfScore}% TF-IDF semantic overlap) with job domain terminology.`);
  }
  if (partialMatches.length > 0) {
    strengths.push(`Strong transferable background with related technologies (${partialMatches.map(p => `${p.relatedResumeSkill} → ${p.jobSkill}`).join(', ')}).`);
  }
  if (resume.sections.quantifiableMetricsCount >= 2) {
    strengths.push('Demonstrates impact with verified quantifiable metrics in project and work highlights.');
  }

  // Gaps identification
  const gaps: string[] = [];
  if (missingRequired.length > 0) {
    gaps.push(`Missing ${missingRequired.length} key required technical skills: ${missingRequired.slice(0, 5).join(', ')}.`);
  }
  if (missingPreferred.length > 0) {
    gaps.push(`Missing preferred qualifications: ${missingPreferred.slice(0, 4).join(', ')}.`);
  }
  if (jobAnalysis.experienceRequirementYears && (resume.experience[0]?.yearsEstimated || 0) < jobAnalysis.experienceRequirementYears) {
    gaps.push(`Target job requests ~${jobAnalysis.experienceRequirementYears}+ years experience, while resume indicates ~${resume.experience[0]?.yearsEstimated || 1} years.`);
  }
  if (keywordCoverage.filter(k => !k.inResume).length >= 5) {
    gaps.push(`Several high-frequency job keywords (${keywordCoverage.filter(k => !k.inResume).slice(0, 4).map(k => k.keyword).join(', ')}) are absent from resume text.`);
  }

  // Actionable Improvement Roadmap
  const improvementRoadmap: JobMatchResult['improvementRoadmap'] = [];

  if (missingRequired.length > 0) {
    improvementRoadmap.push({
      priority: 'High',
      title: `Incorporate Missing Core Skills: ${missingRequired.slice(0, 3).join(', ')}`,
      description: 'The job specification explicitly designates these technical proficiencies as mandatory requirements.',
      actionItems: [
        `If you have hands-on exposure to ${missingRequired.slice(0, 2).join(' or ')}, add them explicitly into your Technical Skills summary block.`,
        `Add 1-2 bullet points in your Projects or Experience sections detailing practical implementations using ${missingRequired[0]}.`,
      ],
    });
  }

  if (keywordCoverage.filter(k => !k.inResume).length > 0) {
    const missingKw = keywordCoverage.filter(k => !k.inResume).slice(0, 4).map(k => k.keyword);
    improvementRoadmap.push({
      priority: 'Medium',
      title: `Optimize ATS Keyword Density for: ${missingKw.join(', ')}`,
      description: 'Applicant Tracking Systems use exact keyword matching to rank incoming resumes for recruiters.',
      actionItems: [
        `Integrate domain terms like "${missingKw[0]}" and "${missingKw[1] || 'scalability'}" into your project descriptions.`,
        'Ensure headings match standard industry conventions (e.g. "Work Experience", "Technical Skills", "Education").',
      ],
    });
  }

  if (resume.sections.quantifiableMetricsCount < 3) {
    improvementRoadmap.push({
      priority: 'Medium',
      title: 'Strengthen Accomplishment Metrics (Google XYZ Pattern)',
      description: 'Recruiters favor resumes that quantify business and technical impact rather than just listing responsibilities.',
      actionItems: [
        'Rewrite project bullets to include numerical results (e.g. "Increased query performance by 35%", "Engineered microservice handling 5,000 requests/sec").',
        'Include benchmark numbers such as user base size, database volume, test coverage percentage, or latency improvements.',
      ],
    });
  }

  return {
    id: `match_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    analyzedAt: new Date().toISOString(),
    resumeSummary: {
      id: resume.id,
      filename: resume.filename,
      candidateName: resume.contact.name,
      topSkills: resume.skills.slice(0, 8).map(s => s.skill),
      wordCount: resume.sections.wordCount,
    },
    jobSummary: {
      title: jobAnalysis.jobTitle,
      company: jobAnalysis.company,
      totalRequiredSkills: jobAnalysis.requiredSkills.length,
      totalPreferredSkills: jobAnalysis.preferredSkills.length,
    },
    scoreBreakdown,
    matchingSkills,
    missingSkills,
    partialMatches,
    keywordCoverage,
    requirementsEvaluation: {
      totalRequirements: evaluatedRequirements.length,
      coveredCount: coveredReqCount,
      uncoveredCount: Math.max(evaluatedRequirements.length - coveredReqCount, 0),
      items: evaluatedRequirements,
    },
    strengths,
    gaps,
    improvementRoadmap,
  };
}
