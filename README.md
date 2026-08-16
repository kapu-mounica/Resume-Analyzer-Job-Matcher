# Resume Analyzer & Job Matcher

A comprehensive, deterministic NLP and TF-IDF matching engine and ATS auditor built with React 19, Tailwind CSS, TypeScript, Express, and Vite.

## Features

- **Multi-Format Ingestion**: Parse PDF (`.pdf`), Microsoft Word (`.docx`), and Plain Text (`.txt`) resumes with text normalization.
- **Deterministic 400+ Skill Taxonomy**: Hierarchical catalog across 8 categories (Programming Languages, Web & Frontend, Backend & Frameworks, Data Science & ML, Databases & Storage, Cloud & DevOps, Software Engineering & Tools, Soft Skills).
- **Composite 4-Pillar Match Scoring**:
  - **Hard Technical Skill Match (40%)**: Exact match and synonym mapping with required vs. preferred weighting.
  - **Semantic TF-IDF Cosine Similarity (25%)**: Vector-space cosine similarity with custom stopword filtering.
  - **Job Requirements Coverage (20%)**: Degree, experience level, and responsibility clause coverage.
  - **ATS Quality Audit (15%)**: Action verbs, quantitative metric density, and contact information detection.
- **Interactive Views**:
  - **Dashboard**: High-level metrics, score distribution, and sample presets.
  - **Resume Analyzer**: ATS audit, detected skills by category, structure review, and impact metric rating.
  - **Job Matcher**: Dual-pane workspace with sample job descriptions and live matching.
  - **Match Results**: Domain radar breakdown, categorized matching/missing skills, and actionable recommendations.
  - **History & Analytics**: Searchable past evaluation logs with score filters and CSV/JSON export.
  - **Skills Matrix**: Complete 400+ skill taxonomy explorer.
  - **Methodology**: Detailed documentation of scoring formulas and ATS metrics.
- **Reporting & Export**: Instant JSON export, CSV audit logs, and print-optimized PDF generation.
- **Automated Test Suite**: 9 integrated end-to-end tests validating edge cases, buffer extraction, scoring bounds, and format parsing.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Node.js, Express, TypeScript (tsx in dev, esbuild in prod)
- **NLP & Parsing**: Custom tokenization & n-gram matcher, TF-IDF vectorizer, `pdf-parse`, `mammoth`
- **Build Tooling**: Vite 6, esbuild

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/kapu-mounica/Resume-Analyzer-Job-Matcher.git
cd Resume-Analyzer-Job-Matcher

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (Express + Vite on port 3000)
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Production Build & Run

```bash
# Build frontend and compile backend
npm run build

# Start production server
npm start
```

### Testing

Run the automated test suite directly:

```bash
# In the application UI, click "Automated Tests" in the navigation bar or header
# Or query the API endpoint:
curl -X POST http://localhost:3000/api/run-tests
```

## API Endpoints

- `GET /api/health` — Service health check
- `GET /api/sample-data` — Preloaded sample resumes and job postings
- `GET /api/skills` — Full 400+ skill taxonomy organized by category
- `GET /api/history` — List analysis history records
- `POST /api/analyze-resume` — Extract skills and ATS metrics from text or file
- `POST /api/upload-resume` — Multipart form upload for `.pdf`, `.docx`, `.txt`
- `POST /api/match-job` — Run composite match calculation between resume and job
- `POST /api/run-tests` — Execute the 9-case test suite and return JSON report

## License

MIT License
