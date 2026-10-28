# InterviewIQ AI — Smart Mock Interview & AI Preparation Platform

InterviewIQ AI is an interactive mock interview platform designed for final-year MCA capstone projects and technical portfolios.

---

## Key Features
- **Curated Multi-Role Question Bank**: Technical and behavioral questions for Frontend, Backend, Full Stack, Python, Java, Data Analytics, and HR.
- **Decoupled Question Architecture**: Easily migratable from memory to MySQL or automated AI generation.
- **Interactive Interview Room**: One-question-at-a-time flow, real-time timer countdown, character counters, progress bars, and state persistence.
- **Text & Audio Evaluation Workflow**: Input typed answers or spoken voice recordings.
- **Dimensional AI Scoring Engine**: Technical accuracy, conceptual depth, clarity, and constructive feedback (Phase 3).
- **Persistent MySQL Analytics**: Session histories, dimensional radar charts, and review reports (Phase 2 & 5).

---

## Tech Stack
- **Frontend**: React 18, Vite, JavaScript, Tailwind CSS, Lucide React, Recharts, Axios, React Router.
- **Backend**: Node.js, Express (ES modules), Helmet, Morgan, Cookie-Parser, Zod, Multer.
- **Database**: MySQL 8.x with `mysql2`.
- **AI Services**: OpenAI API (GPT-4o), Google Gemini API, OpenAI Whisper (Speech-to-Text).

---

## Quick Start (Local macOS Setup)

### 1. Prerequisites
- Node.js v18+ (tested on Node v24.19)
- npm v9+

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will open on `http://localhost:5173`.

### 4. Running Backend Automated Tests
```bash
cd backend
npm test
```

---

## 5-Phase Project Roadmap
- [x] **Phase 1**: Project Foundation, Responsive UI, & Decoupled Question Bank (**COMPLETED**)
- [ ] **Phase 2**: MySQL Schema, Authentication, & Persistent Sessions
- [ ] **Phase 3**: Real OpenAI & Gemini Answer Evaluation Engine
- [ ] **Phase 4**: Browser Audio Recording & Speech-to-Text Integration
- [ ] **Phase 5**: Real Analytics Dashboard, Final Viva Reports, & Delivery
