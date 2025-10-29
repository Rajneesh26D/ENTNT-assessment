# TalentFlow

A modern **HR recruitment management platform** that streamlines the hiring process with job management, candidate tracking, and custom assessment creation capabilities.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Bonus Features](#bonus-features)

---

## Tech Stack

### **Frontend Framework**
- React **18.3.1**
- TypeScript **5.5.3**
- Vite **5.4.2**

### **Styling**
- Tailwind CSS **3.4.14**
- PostCSS
- Autoprefixer

### **UI Libraries**
- Framer Motion **11.11.11** (animations)
- Lucide React **0.454.0** (icons)
- dnd-kit **6.1.0** (drag and drop)
- TanStack React Virtual **3.10.8** (virtualization)

### **State Management & Data**
- Dexie.js **4.0.8** (IndexedDB wrapper)
- Mock Service Worker (MSW) **2.6.2** (API mocking)

### **Routing**
- React Router DOM **6.27.0**

---

## Features

### **Job Management**
- Create, edit, and archive job postings
- Add tags, requirements, and location details
- Filter and search jobs by title
- View job details and associated candidates

### **Candidate Tracking**
- List view and **Kanban board** view for candidates
- Track candidates through stages:  
  `Applied → Screening → Technical → Offer → Hired → Rejected`
- Drag and drop candidates between stages
- Advanced filtering by stage, job, and search query
- Individual candidate profile pages
- **Virtualized list rendering** for 1000+ candidates

### **Assessment Builder**
- Create custom assessments for job positions
- Supported question types:
  - Short Text
  - Long Text
  - Single Choice
  - Multiple Choice
  - Numeric
  - File Upload
- Organize questions into **sections**
- Drag and drop to reorder sections and questions
- Preview and publish assessments

### **User Interface**
- Responsive design with **dark theme**
- Smooth animations and transitions
- Real-time search and filtering
- Loading states and error handling

---

## Project Structure

```
TALENTFLOW/
├── .git/
├── node_modules/
├── talentflow/
│   ├── node_modules/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── assessments/
│       │   ├── candidates/
│       │   ├── jobs/
│       │   ├── landing/
│       │   ├── layout/
│       │   └── ui/
│       ├── hooks/
│       │   ├── useAssessments.ts
│       │   ├── useCandidates.ts
│       │   └── useJobs.ts
│       ├── lib/
│       ├── pages/
│       │   ├── AssessmentBuilder.tsx
│       │   ├── Assessments.tsx
│       │   ├── AssessmentTake.tsx
│       │   ├── CandidateProfile.tsx
│       │   ├── Candidates.tsx
│       │   ├── HrDashboard.tsx
│       │   ├── JobDetails.tsx
│       │   ├── Jobs.tsx
│       │   ├── Landing.tsx
│       │   └── VirtualizedCandidateList.tsx
│       ├── services/
│       │   ├── api.ts
│       │   ├── db.ts
│       │   └── seed.ts
│       ├── store/
│       │   ├── assessmentsStore.ts
│       │   ├── candidatesStore.ts
│       │   └── jobsStore.ts
│       ├── types/
│       │   └── index.ts
│       ├── utils/
│       │   └── export.ts
│       ├── App.css
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── eslint.config.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── tailwind.config.js
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vercel.json
│       └── vite.config.ts
├── .gitignore
├── package-lock.json
└── package.json
```

---

## Setup Instructions

### **Prerequisites**
- Node.js **v16.x** or higher
- npm **v8.x** or higher

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TALENTFLOW/talentflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   → `http://localhost:5173`

### **Available Scripts**

| Script           | Description                     |
|------------------|---------------------------------|
| `npm run dev`     | Start development server        |
| `npm run build`   | Build for production            |
| `npm run preview` | Preview production build        |
| `npm run lint`    | Run ESLint                      |

### **Initial Setup**

On first launch, the app **automatically seeds** the database with:
- 25 sample job postings
- 1000 sample candidates
- 2 sample assessments

---

## Architecture

### **Design Decisions**
- **Vite**: Fast HMR and optimized builds
- **TypeScript**: Type safety & better DX
- **IndexedDB**: Offline support & fast local data
- **Component-based**: Modular, reusable UI
- **Custom Hooks**: Encapsulated logic
- **React Router**: SPA navigation

### **Data Flow**
```
Components
   ↓
Custom Hooks (useCandidates, useJobs, useAssessments)
   ↓
Dexie.js → IndexedDB
   ↓
MSW (intercepts API in dev)
   ↓
State Updates → Re-renders
```

---

## Bonus Features

### **Data Import and Export**

#### **Export Functionality**
- Export candidates to **CSV**
- Export jobs to **JSON**
- Export assessments to **JSON**

#### **Import Functionality**
- Import candidates from **CSV**
- Built-in format validator
- Help dialog with CSV format specs
- Bulk import with error handling

#### **CSV Import Format**

```csv
Name,Email,Phone,Stage,Job Title,Applied Date
John Doe,john@example.com,1234567890,applied,Senior Developer,2024-10-01
Jane Smith,jane@example.com,0987654321,screening,Backend Engineer,2024-10-15
```

> **Valid stages**: `applied`, `screening`, `technical`, `offer`, `hired`, `rejected`

---

### **Performance Optimizations**
- Virtual scrolling for large candidate lists
- Debounced search inputs
- Lazy loading of components
- Optimized re-renders (React best practices)

---
