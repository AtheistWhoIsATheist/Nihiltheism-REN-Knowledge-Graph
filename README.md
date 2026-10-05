# JOURNAL314 Ω — Nihiltheism REN Knowledge Graph & Ingestion System

Interactive, local-first philosophical knowledge workspace and cosmic hypermap built with React 19, TypeScript, Tailwind CSS, Express, and the Recursive Ontological Analysis Engine (ROAE 2.0).

---

## 1. System Overview

The **Nihiltheism REN Knowledge Graph** unifies the static, curated philosophical hypermap (`nihiltheism-ren-knowledge-graph.html`) with an interactive, local-first computational research workspace and the ingestion engine.

### Core Pillars:
1. **Preservation Invariant (P-001–P-006)**: Complete fidelity to the canonical 730 nodes and 728 edges across two root trees (*JOURNAL314 Ω — Nihiltheistic Hypermarkmap* and *Thematic Cross-Cuts*). Retains category styling, counts, hierarchies, and cosmic glassmorphic aesthetics.
2. **Ingestion Engine (IV1–IV16)**: Deterministic multi-format file ingestion supporting Markdown (`.md`), Plain Text (`.txt`), Adobe PDF (`.pdf`), JSON (`.json`), and Tabular CSV (`.csv`).
3. **Identity & Deduplication**: Exact SHA-256 content hashing guarantees identical files are never duplicated, even if renamed.
4. **Failure Isolation**: Malformed, empty, or unsupported files fail safely and visibly without corrupting the live graph state or aborting healthy items in a batch.
5. **Epistemic Discipline & ROAE 2.0**:
   - **Candidate Graph-Diff Contract**: The AI/analysis engine never mutates the live graph directly; changes are staged with temporary IDs in a Review Workspace for human audit and atomic commit.
   - **Phenomenology-Ontology Firewall (L1–L5)**: Enforces separation between L1 (Report), L2 (Phenomenological Structure), L3 (Interpretive Classification), L4 (Causal Explanation), and L5 (Ontological Claim).
   - **Adversarial Integrity Protocol (AIP)**: Three-fold internal audit by simulated Referee, Prosecutor, and Physician.
   - **Symmetrical Skepticism**: Symmetrically checks Nihiltheistic, Naturalistic, and Traditional Theological hypotheses; declares epistemic underdetermination when warranted.
   - **Void Operator $\emptyset(X)$**: Counterfactual stress-testing by subtracting load-bearing assumptions (e.g. teleology, providence, redemption) to isolate invariant phenomenological structures.

---

## 2. Quick Start & Launchers

### Prerequisites
- Node.js >= 18.0.0 (Node 20+ recommended)
- npm or yarn

### Linux / macOS
```bash
# Make launcher executable and run:
chmod +x start.sh
./start.sh
```
Or directly:
```bash
npm install
npm run dev
```

### Windows (Command Prompt)
```cmd
start.bat
```

### Windows (PowerShell)
```powershell
.\start.ps1
```

Once started, navigate in any modern browser to:
`http://localhost:3000`

---

## 3. Automated Verification & Gates

Run the comprehensive test suite verifying preservation, parsing, SHA-256 deduplication, failure isolation, and ROAE invariants:
```bash
npm test
```

Run static TypeScript typecheck:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```

---

## 4. Architecture & File Structure

```
├── .env.example                               # Environment secrets template (GEMINI_API_KEY)
├── index.html                                 # HTML5 entry with metadata
├── metadata.json                              # AI Studio app metadata
├── nihiltheism-ren-knowledge-graph.html       # Preserved original HTML baseline artifact
├── package.json                               # Dependencies & build scripts
├── server.ts                                  # Express backend with Vite middleware & Gemini proxy
├── start.bat                                  # Windows Command Prompt launcher
├── start.ps1                                  # Windows PowerShell launcher
├── start.sh                                   # Unix/macOS bash launcher
├── tsconfig.json                              # TypeScript strict configuration
├── vite.config.ts                             # Vite configuration with Tailwind CSS v4
├── src/
│   ├── App.tsx                                # Main application root & state orchestration
│   ├── components/
│   │   ├── CandidateDiffReviewModal.tsx       # ROAE candidate graph diff review & commit UI
│   │   ├── ExportModal.tsx                    # Multi-format graph export (JSON, Markdown, CSV, Cypher)
│   │   ├── GraphCanvas.tsx                    # High-performance force-directed canvas graph engine
│   │   ├── Header.tsx                         # Top navigation bar, stats, view mode selector
│   │   ├── HypermapView.tsx                   # Original collapsible mindmap tree view
│   │   ├── IngestionModal.tsx                 # Multi-file dropzone & batch processing drawer
│   │   ├── NihiltheisticSuiteModal.tsx        # Epistemic invariants & Nothingness typology
│   │   ├── NodeInspectorModal.tsx             # Node metadata, provenance, and stratum viewer
│   │   ├── PreservationLedgerModal.tsx        # Verification ledger of canonical nodes & edges
│   │   ├── ResidueManagementModal.tsx         # Contradiction locking & unassimilated residue
│   │   └── RoaeWorkspaceModal.tsx             # ROAE 2.0 analysis trigger & Void Operator UI
│   ├── data/
│   │   └── canonicalGraph.json                # Canonical 730-node baseline dataset
│   ├── services/
│   │   ├── export/GraphExport.ts              # Export serializer
│   │   ├── ingestion/IngestionService.ts      # Multi-format batch ingestion orchestrator
│   │   ├── parsers/                           # Parsers: Markdown, Plain Text, PDF, JSON, CSV
│   │   └── storage/GraphStorage.ts            # IndexedDB / LocalStorage persistent state store
│   └── types/                                 # Complete TypeScript definitions
└── tests/
    └── comprehensive-verification.ts          # Automated 18-point verification test suite
```

---

## 5. Offline & Portability Note
This application uses a local-first architecture. Graph exploration, searching, hierarchy inspection, multi-format file ingestion, deduplication, and export work 100% offline in any modern browser without network access or API keys. When configured with a `GEMINI_API_KEY`, ROAE 2.0 invokes Gemini 3.8 Flash for live philosophical analysis; otherwise, it seamlessly utilizes its built-in deterministic epistemological reasoning engine.
