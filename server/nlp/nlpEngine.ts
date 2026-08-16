import {
  ExtractedContact,
  ExtractedEducation,
  ExtractedExperience,
  ExtractedProject,
  ResumeAnalysis,
  SectionAnalysis,
  SkillCategory,
} from '../../src/types/index.js';
import { SKILL_CATEGORIES, SKILL_DATABASE } from './skillsDatabase.js';

export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'will', 'also', 'using', 'used', 'worked', 'working', 'responsibilities', 'responsible', 'including', 'various', 'etc',
]);

export const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated', 'built',
  'championed', 'collaborated', 'configured', 'constructed', 'coordinated', 'created', 'customized',
  'debugged', 'delivered', 'deployed', 'designed', 'developed', 'devised', 'directed', 'documented',
  'engineered', 'enhanced', 'established', 'evaluated', 'executed', 'expanded', 'expedited',
  'facilitated', 'formulated', 'generated', 'guided', 'headed', 'implemented', 'improved',
  'increased', 'initiated', 'innovated', 'inspected', 'instituted', 'integrated', 'invented',
  'launched', 'lead', 'led', 'leveraged', 'maintained', 'managed', 'maximized', 'mentored',
  'migrated', 'minimized', 'modernized', 'monitored', 'negotiated', 'optimized', 'orchestrated',
  'organized', 'overhauled', 'oversaw', 'performed', 'pioneered', 'planned', 'programmed',
  'published', 're-architected', 're-engineered', 'reduced', 'refactored', 'resolved', 'restructured',
  'revamped', 'revitalized', 'scaled', 'scheduled', 'secured', 'simplified', 'spearheaded',
  'standardized', 'streamlined', 'strengthened', 'supervised', 'synthesized', 'systematized',
  'tested', 'trained', 'transformed', 'troubleshot', 'unified', 'upgraded', 'validated', 'yielded',
];

export function tokenize(text: string, keepStopWords = false): string[] {
  if (!text) return [];
  // Tokenize while preserving c++, c#, .net, node.js
  const normalized = text.toLowerCase()
    .replace(/\bc\+\+/g, ' cpp_token ')
    .replace(/\bc#/g, ' csharp_token ')
    .replace(/\.net\b/g, ' dotnet_token ')
    .replace(/\bnode\.js\b/g, ' nodejs_token ')
    .replace(/\bvue\.js\b/g, ' vuejs_token ')
    .replace(/\bci\/cd\b/g, ' cicd_token ');

  const tokens = normalized.match(/[a-z0-9_\-\.]{2,}/g) || [];

  return tokens
    .map(t => {
      if (t === 'cpp_token') return 'c++';
      if (t === 'csharp_token') return 'c#';
      if (t === 'dotnet_token') return '.net';
      if (t === 'nodejs_token') return 'node.js';
      if (t === 'vuejs_token') return 'vue.js';
      if (t === 'cicd_token') return 'ci/cd';
      return t;
    })
    .filter(t => keepStopWords || !STOP_WORDS.has(t));
}

export function generateNGrams(tokens: string[], n: number): string[] {
  if (tokens.length < n) return [];
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export function computeTermFrequencies(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

export function computeCosineSimilarity(textA: string, textB: string): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = computeTermFrequencies(tokensA);
  const tfB = computeTermFrequencies(tokensB);

  const allWords = new Set([...tfA.keys(), ...tfB.keys()]);
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const word of allWords) {
    const valA = tfA.get(word) || 0;
    const valB = tfB.get(word) || 0;

    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  const score = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  return Math.min(Math.max(score, 0), 1);
}

export function extractContactInfo(text: string): ExtractedContact {
  const contact: ExtractedContact = {};

  // Email matching
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }

  // Phone matching (various international and standard phone formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b|\b(?:\+91|91)?[-.\s]?[6-9]\d{9}\b/);
  if (phoneMatch) {
    contact.phone = phoneMatch[0].trim();
  }

  // LinkedIn matching
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_\-]+)/i) ||
    text.match(/\blinkedin\.com\/in\/[a-zA-Z0-9_\-]+\b/i) ||
    text.match(/\blinkedin:\s*([a-zA-Z0-9_\-\/]+)/i);
  if (linkedinMatch) {
    contact.linkedin = linkedinMatch[0];
  }

  // GitHub matching
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-]+)/i) ||
    text.match(/\bgithub\.com\/[a-zA-Z0-9_\-]+\b/i) ||
    text.match(/\bgithub:\s*([a-zA-Z0-9_\-\/]+)/i);
  if (githubMatch) {
    contact.github = githubMatch[0];
  }

  // Portfolio / Website matching
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|me|app|site|tech|com))\b/i);
  if (portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github')) {
    contact.portfolio = portfolioMatch[0];
  }

  // Name extraction heuristics: first 1-3 lines usually contain the candidate's name
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Candidate name is usually 2 to 4 words, alphabetic, no special symbols or section keywords
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('github') &&
      !line.includes('linkedin') &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('summary') &&
      !line.toLowerCase().includes('experience') &&
      /^[A-Z][a-zA-Z.\s]{2,40}$/.test(line) &&
      line.split(/\s+/).length >= 2 &&
      line.split(/\s+/).length <= 4
    ) {
      contact.name = line;
      break;
    }
  }

  // Location detection
  const locationMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:[A-Z]{2}|India|USA|United States|UK|Canada|Germany|Singapore|Australia|Bangalore|Bengaluru|Hyderabad|Mumbai|Delhi|Pune|Chennai|San Francisco|New York|Seattle|Austin|London|Toronto))\b/i);
  if (locationMatch) {
    contact.location = locationMatch[1].trim();
  }

  return contact;
}

export function extractSkills(text: string): {
  skills: { skill: string; category: SkillCategory; count: number; locations: string[] }[];
  categorizedSkills: Record<SkillCategory, string[]>;
} {
  const lowerText = ` ${text.toLowerCase()} `;
  const detectedMap = new Map<string, { skill: string; category: SkillCategory; count: number; locations: string[] }>();
  const categorized: Record<SkillCategory, string[]> = {
    'Programming Languages': [],
    'Web & Frontend': [],
    'Backend & Frameworks': [],
    'Data Science & Machine Learning': [],
    'Databases & Storage': [],
    'Cloud & DevOps': [],
    'Software Engineering & Tools': [],
    'Soft Skills & Methodologies': [],
  };

  for (const skillItem of SKILL_DATABASE) {
    const namesToTest = [skillItem.name, ...(skillItem.aliases || [])];
    let totalCount = 0;
    const locations: string[] = [];

    for (const name of namesToTest) {
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Word boundary regex that handles c++, c#, .net safely
      let regex: RegExp;
      if (name === 'C++') {
        regex = /(?:^|[\s,;:(/])c\+\+(?:$|[\s,;:)/])/gi;
      } else if (name === 'C#') {
        regex = /(?:^|[\s,;:(/])c#(?:$|[\s,;:)/])/gi;
      } else if (name === 'C') {
        regex = /(?:^|[\s,;:(/])c(?:$|[\s,;:)/])/gi;
      } else if (name === 'R') {
        regex = /(?:^|[\s,;:(/])r(?:\s+(?:programming|language|scripting)|$|[\s,;:)/])/gi;
      } else if (name === 'Go') {
        regex = /(?:^|[\s,;:(/])(?:go\s+lang|golang|go(?:\s+(?:developer|programming|backend)))(?:$|[\s,;:)/])/gi;
      } else {
        regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'gi');
      }

      const matches = lowerText.match(regex);
      if (matches) {
        totalCount += matches.length;
      }
    }

    if (totalCount > 0) {
      if (!detectedMap.has(skillItem.name)) {
        detectedMap.set(skillItem.name, {
          skill: skillItem.name,
          category: skillItem.category,
          count: totalCount,
          locations: [],
        });
        categorized[skillItem.category].push(skillItem.name);
      } else {
        const existing = detectedMap.get(skillItem.name)!;
        existing.count += totalCount;
      }
    }
  }

  const skills = Array.from(detectedMap.values()).sort((a, b) => b.count - a.count);

  return {
    skills,
    categorizedSkills: categorized,
  };
}

export function extractEducation(text: string): ExtractedEducation[] {
  const educationList: ExtractedEducation[] = [];
  const lines = text.split('\n').map(l => l.trim());

  const degreePatterns = [
    { regex: /\b(B\.?\s?Tech(?:nology)?|Bachelor of Technology)\b/i, name: 'B.Tech (Bachelor of Technology)' },
    { regex: /\b(B\.?\s?E\.?|Bachelor of Engineering)\b/i, name: 'B.E. (Bachelor of Engineering)' },
    { regex: /\b(B\.?\s?S\.?|B\.?\s?Sc\.?|Bachelor of Science)\b/i, name: 'B.S. (Bachelor of Science)' },
    { regex: /\b(B\.?\s?C\.?\s?A\.?|Bachelor of Computer Applications)\b/i, name: 'BCA (Bachelor of Computer Applications)' },
    { regex: /\b(M\.?\s?Tech(?:nology)?|Master of Technology)\b/i, name: 'M.Tech (Master of Technology)' },
    { regex: /\b(M\.?\s?S\.?|M\.?\s?Sc\.?|Master of Science)\b/i, name: 'M.S. (Master of Science)' },
    { regex: /\b(M\.?\s?C\.?\s?A\.?|Master of Computer Applications)\b/i, name: 'MCA (Master of Computer Applications)' },
    { regex: /\b(M\.?\s?B\.?\s?A\.?|Master of Business Administration)\b/i, name: 'MBA (Master of Business Administration)' },
    { regex: /\b(Ph\.?D\.?|Doctor of Philosophy)\b/i, name: 'Ph.D.' },
    { regex: /\b(High School|Senior Secondary|12th Grade|CBSE|ICSE)\b/i, name: 'Higher Secondary School' },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of degreePatterns) {
      if (pattern.regex.test(line)) {
        // Collect context surrounding lines for field, college, GPA, year
        const contextLines = lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 3)).join(' ');

        // Field / Major
        const fieldMatch = contextLines.match(/(?:in|of)\s+([A-Za-z\s&]{4,40})(?:Engineering|Science|Technology|Studies|Management|Mathematics|Informatics)?/i);
        const field = fieldMatch ? fieldMatch[0].replace(/^(in|of)\s+/i, '').trim() : 'Computer Science & Engineering';

        // University / College
        const institutionMatch = contextLines.match(/([A-Za-z\s&.,]{4,60}(?:University|Institute|College|Academy|School|Campus|IIT|NIT|BITS|IIIT|Stanford|MIT|Berkeley|State))/i);
        const institution = institutionMatch ? institutionMatch[1].trim() : undefined;

        // Year
        const yearMatch = contextLines.match(/\b(20\d{2}|19\d{2})(?:\s*[-–—to]\s*(?:20\d{2}|Present|Current))?\b/i);
        const year = yearMatch ? yearMatch[0] : undefined;

        // GPA / Percentage / CGPA
        const gpaMatch = contextLines.match(/(?:CGPA|GPA|Percentage|Score)?\s*[:=\s]\s*(\d{1,2}(?:\.\d{1,2})?(?:\s*\/\s*10|\s*\/\s*4|\s*%)?)/i);
        const gpa = gpaMatch ? gpaMatch[1] : undefined;

        const exists = educationList.some(e => e.degree === pattern.name);
        if (!exists) {
          educationList.push({
            degree: pattern.name,
            field,
            institution,
            year,
            gpa,
          });
        }
      }
    }
  }

  if (educationList.length === 0) {
    // Check for generic degree mention
    if (/degree|bachelor|master|graduate|university|college/i.test(text)) {
      educationList.push({
        degree: 'Bachelor Degree (Undergraduate)',
        field: 'Computer Science / Engineering',
        institution: 'University / Institute',
      });
    }
  }

  return educationList;
}

export function extractExperience(text: string): ExtractedExperience[] {
  const experiences: ExtractedExperience[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const rolePatterns = [
    /(?:Senior|Junior|Lead|Principal|Staff|Associate|Full Stack|Frontend|Backend|Software|DevOps|Data|ML|AI|Cloud|Systems|Mobile|Android|iOS|Product|QA|Test)\s+(?:Engineer|Developer|Architect|Scientist|Consultant|Intern|Specialist|Analyst|Manager)/i,
    /(?:Software Development Engineer|SDE\s*(?:I|II|III|1|2|3)?|Tech Lead|Engineering Intern|Data Analyst|Research Assistant)/i,
  ];

  let currentExp: ExtractedExperience | null = null;
  let inExperienceSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE|WORK HISTORY)/i.test(line)) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection && /^(EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|PUBLICATIONS|ACHIEVEMENTS|AWARDS)/i.test(line)) {
      inExperienceSection = false;
      if (currentExp) {
        experiences.push(currentExp);
        currentExp = null;
      }
      break;
    }

    // Role detection
    let matchedRole: string | undefined;
    for (const pattern of rolePatterns) {
      const match = line.match(pattern);
      if (match) {
        matchedRole = match[0];
        break;
      }
    }

    if (matchedRole || (inExperienceSection && /^(at|@)\s+[A-Z]/i.test(line))) {
      if (currentExp) {
        experiences.push(currentExp);
      }

      // Duration detection
      const durationMatch = line.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*(?:[-–—to]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}|Present|Current)\b/i);

      // Company detection
      const companyMatch = line.match(/(?:at|@|,)\s*([A-Za-z0-9\s&.,]{2,40})/i);

      currentExp = {
        role: matchedRole || line.slice(0, 40),
        company: companyMatch ? companyMatch[1].trim() : undefined,
        duration: durationMatch ? durationMatch[0] : undefined,
        highlights: [],
      };
    } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.length > 20)) {
      currentExp.highlights.push(line.replace(/^[•\-\*]\s*/, ''));
    }
  }

  if (currentExp) {
    experiences.push(currentExp);
  }

  // Calculate estimated years of experience
  const yearMatches = text.match(/\b(19\d{2}|20\d{2})\b/g);
  let estimatedYears = 0;
  if (yearMatches && yearMatches.length >= 2) {
    const years = yearMatches.map(Number).filter(y => y >= 1995 && y <= 2026);
    if (years.length >= 2) {
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      estimatedYears = Math.min(Math.max(maxYear - minYear, 0), 20);
    }
  }
  if (experiences.length > 0 && estimatedYears === 0) {
    estimatedYears = experiences.length * 1.5;
  }

  return experiences.map(e => ({ ...e, yearsEstimated: estimatedYears }));
}

export function extractProjects(text: string): ExtractedProject[] {
  const projects: ExtractedProject[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  let inProjectsSection = false;
  let currentProject: ExtractedProject | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^(PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS|PERSONAL PROJECTS|TECHNICAL PROJECTS)/i.test(line)) {
      inProjectsSection = true;
      continue;
    }

    if (inProjectsSection && /^(EDUCATION|EXPERIENCE|WORK HISTORY|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS)/i.test(line)) {
      inProjectsSection = false;
      if (currentProject) {
        projects.push(currentProject);
        currentProject = null;
      }
      break;
    }

    if (inProjectsSection) {
      // Check if line looks like a project header (Title | Tech Stack or Title (Tech Stack))
      const isProjectHeader =
        (line.includes('|') || line.includes(' - ') || line.includes(':') || /^[A-Z0-9\s]{3,35}$/.test(line)) &&
        !line.startsWith('•') &&
        !line.startsWith('-') &&
        !line.startsWith('*') &&
        line.length < 70;

      if (isProjectHeader) {
        if (currentProject) {
          projects.push(currentProject);
        }

        const parts = line.split(/[|\-:]/);
        const title = parts[0].trim();
        const techString = parts.length > 1 ? parts.slice(1).join(' ') : '';
        const detectedTech = SKILL_DATABASE.filter(s =>
          new RegExp(`\\b${s.name}\\b`, 'i').test(techString) ||
          s.aliases?.some(a => new RegExp(`\\b${a}\\b`, 'i').test(techString))
        ).map(s => s.name);

        currentProject = {
          title,
          technologies: detectedTech,
          highlights: [],
          metricsDetected: false,
        };
      } else if (currentProject) {
        const cleanedBullet = line.replace(/^[•\-\*]\s*/, '');
        currentProject.highlights.push(cleanedBullet);
        if (/\b(?:\d+%\s*|\d+x\s*|\$\d+|\d+\s*ms|\d+\+?\s*(?:users|clients|requests|records|qps|stars))\b/i.test(cleanedBullet)) {
          currentProject.metricsDetected = true;
        }
      }
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  // Fallback: search for projects throughout the text if no explicit header found
  if (projects.length === 0) {
    const projectMentions = text.match(/(?:Project|Application|System|Platform|Dashboard|App|Engine):\s*([^\n]+)/gi);
    if (projectMentions) {
      projectMentions.slice(0, 4).forEach((pm, idx) => {
        projects.push({
          title: pm.replace(/^(?:Project|Application|System|Platform|Dashboard|App|Engine):\s*/i, '').trim(),
          technologies: [],
          highlights: [],
          metricsDetected: false,
        });
      });
    }
  }

  return projects;
}

export function extractCertifications(text: string): string[] {
  const certifications: string[] = [];
  const certKeywords = [
    /AWS Certified\s*[A-Za-z\s-]*/i,
    /Google Cloud Certified\s*[A-Za-z\s-]*/i,
    /Microsoft Certified\s*[A-Za-z\s-]*/i,
    /Azure\s+[A-Za-z\s-]*Certification/i,
    /Certified Kubernetes\s*(?:Administrator|Application Developer|Security Specialist|CKA|CKAD|CKS)/i,
    /Cisco Certified\s*(?:Network Associate|CCNA|CCNP|CCIE)/i,
    /Oracle Certified\s*[A-Za-z\s-]*/i,
    /CompTIA\s*(?:Security\+|Network\+|A\+)/i,
    /PMP|Project Management Professional/i,
    /Scrum Master|CSM|PSM I/i,
    /TensorFlow Developer Certificate/i,
    /Coursera|Udemy|edX|HackerRank|LeetCode\s+[A-Za-z\s-]*/i,
  ];

  for (const regex of certKeywords) {
    const match = text.match(regex);
    if (match && !certifications.includes(match[0].trim())) {
      certifications.push(match[0].trim());
    }
  }

  return certifications;
}

export function analyzeSections(text: string, contact: ExtractedContact): SectionAnalysis {
  const lower = text.toLowerCase();

  const hasContactInfo = Boolean(contact.email || contact.phone || contact.linkedin);
  const hasSummary = /summary|objective|about me|professional summary|profile/i.test(lower);
  const hasExperience = /experience|work history|employment|internship|professional experience/i.test(lower);
  const hasEducation = /education|academic|degree|university|college|b\.tech|bachelor|master/i.test(lower);
  const hasSkills = /skills|technical skills|technologies|proficiencies|competencies|tools/i.test(lower);
  const hasProjects = /projects|academic projects|personal projects|key projects/i.test(lower);
  const hasCertifications = /certification|certificates|courses|licenses|accreditations/i.test(lower);

  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  // Count action verbs
  let actionVerbsCount = 0;
  for (const verb of STRONG_ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) actionVerbsCount += matches.length;
  }

  // Count quantifiable metrics (%, numbers, Xx faster, $ values, latencies)
  const metricMatches = text.match(/\b(?:\d+%\s*|\d+x\s*|\$\d+|\d+\s*ms|\d+\s*k|\d+\s*m|\b\d{2,}\+?\s*(?:users|clients|requests|records|qps|queries|engineers|team members|downloads))\b/gi);
  const quantifiableMetricsCount = metricMatches ? metricMatches.length : 0;

  // Completeness score out of 100
  let completenessScore = 0;
  if (hasContactInfo) completenessScore += 15;
  if (hasSummary) completenessScore += 10;
  if (hasExperience) completenessScore += 25;
  if (hasEducation) completenessScore += 15;
  if (hasSkills) completenessScore += 20;
  if (hasProjects) completenessScore += 10;
  if (hasCertifications) completenessScore += 5;

  return {
    hasContactInfo,
    hasSummary,
    hasExperience,
    hasEducation,
    hasSkills,
    hasProjects,
    hasCertifications,
    wordCount,
    readingTimeMinutes,
    actionVerbsCount,
    quantifiableMetricsCount,
    completenessScore: Math.min(100, completenessScore),
  };
}

export function performQualityAudit(
  sections: SectionAnalysis,
  contact: ExtractedContact,
  skillsCount: number,
  experienceCount: number,
  projectsCount: number
): ResumeAnalysis['qualityAudit'] {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const actionableSuggestions: string[] = [];
  const atsIssues: string[] = [];

  let qualityScore = 0;

  // Contact Info Evaluation
  if (contact.email && (contact.phone || contact.linkedin)) {
    strengths.push('Complete and professional contact information included (Email & Social/Phone).');
    qualityScore += 15;
  } else {
    weaknesses.push('Incomplete contact details. Missing verified phone number or LinkedIn profile link.');
    actionableSuggestions.push('Add your LinkedIn profile URL and phone number prominently in the header.');
    atsIssues.push('ATS systems prioritize resumes with complete contact headers for recruiter reach-out.');
    qualityScore += 5;
  }

  // Action Verbs & Measurable Metrics
  if (sections.actionVerbsCount >= 8) {
    strengths.push(`Strong active voice with ${sections.actionVerbsCount} action verbs (e.g. engineered, optimized, spearheaded).`);
    qualityScore += 20;
  } else if (sections.actionVerbsCount >= 4) {
    strengths.push(`Adequate use of ${sections.actionVerbsCount} action verbs.`);
    actionableSuggestions.push('Replace passive phrases (e.g., "was responsible for") with powerful dynamic action verbs.');
    qualityScore += 12;
  } else {
    weaknesses.push('Low frequency of strong action verbs. Descriptions appear passive or duty-focused.');
    actionableSuggestions.push('Begin every bullet point with high-impact action verbs like Architected, Automated, Built, Accelerated.');
    atsIssues.push('ATS parsers score action-oriented bullet points higher in relevancy rankings.');
    qualityScore += 5;
  }

  // Quantifiable Impact
  if (sections.quantifiableMetricsCount >= 4) {
    strengths.push(`Excellent quantified accomplishments detected (${sections.quantifiableMetricsCount} measurable metrics).`);
    qualityScore += 25;
  } else if (sections.quantifiableMetricsCount >= 1) {
    strengths.push('Contains some quantified metrics.');
    actionableSuggestions.push('Add measurable figures (e.g., "% latency reduction", "user scale", "accuracy rate", "time saved") to all project highlights.');
    qualityScore += 15;
  } else {
    weaknesses.push('No measurable metrics or numerical outcomes detected in work or project descriptions.');
    actionableSuggestions.push('Use the Google XYZ Formula: "Accomplished [X], as measured by [Y], by doing [Z]" to include real percentages and numbers.');
    qualityScore += 5;
  }

  // Skill Volume & Organization
  if (skillsCount >= 12) {
    strengths.push(`Rich technical skill set (${skillsCount} distinct skills recognized).`);
    qualityScore += 20;
  } else if (skillsCount >= 6) {
    strengths.push(`Good foundation of ${skillsCount} technical skills.`);
    actionableSuggestions.push('Expand your skills section with complementary frameworks, developer tools, and cloud platforms.');
    qualityScore += 14;
  } else {
    weaknesses.push('Very low technical skill density. Many standard developer proficiencies are unlisted.');
    actionableSuggestions.push('Include a dedicated, categorized Technical Skills section listing languages, frameworks, databases, and DevOps tools.');
    atsIssues.push('ATS filters heavily search for keyword matches in the skills block.');
    qualityScore += 6;
  }

  // Length & Formatting
  if (sections.wordCount >= 250 && sections.wordCount <= 850) {
    strengths.push(`Optimal resume length (${sections.wordCount} words, ~${sections.readingTimeMinutes} min read).`);
    qualityScore += 20;
  } else if (sections.wordCount < 250) {
    weaknesses.push(`Resume is overly brief (${sections.wordCount} words). Lacks depth in project and experience descriptions.`);
    actionableSuggestions.push('Elaborate on architectural decisions, challenge solutions, and technical implementations.');
    qualityScore += 8;
  } else {
    weaknesses.push(`Resume is lengthy (${sections.wordCount} words). Consider condensing to high-impact essentials.`);
    actionableSuggestions.push('Keep content focused on relevant experience and eliminate redundant bullet points.');
    qualityScore += 12;
  }

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'C';
  if (qualityScore >= 90) grade = 'A+';
  else if (qualityScore >= 80) grade = 'A';
  else if (qualityScore >= 65) grade = 'B';
  else if (qualityScore >= 50) grade = 'C';
  else grade = 'D';

  return {
    overallScore: Math.min(100, Math.max(qualityScore, 10)),
    grade,
    strengths,
    weaknesses,
    actionableSuggestions,
    atsIssues,
  };
}

export function analyzeResumeText(
  rawText: string,
  filename = 'uploaded_resume.txt',
  fileType = 'text/plain',
  fileSize = 0
): ResumeAnalysis {
  const contact = extractContactInfo(rawText);
  const { skills, categorizedSkills } = extractSkills(rawText);
  const education = extractEducation(rawText);
  const experience = extractExperience(rawText);
  const projects = extractProjects(rawText);
  const certifications = extractCertifications(rawText);
  const sections = analyzeSections(rawText, contact);
  const qualityAudit = performQualityAudit(
    sections,
    contact,
    skills.length,
    experience.length,
    projects.length
  );

  return {
    id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    filename,
    fileType,
    fileSize,
    uploadedAt: new Date().toISOString(),
    rawText,
    cleanedText: rawText.replace(/\s+/g, ' ').trim(),
    contact,
    skills,
    categorizedSkills,
    education,
    experience,
    projects,
    certifications,
    sections,
    qualityAudit,
  };
}
