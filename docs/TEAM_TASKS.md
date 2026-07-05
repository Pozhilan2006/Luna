# Luna Desktop AI Assistant — Team Tasks & Roadmap

> **Version:** 1.0 · July 2026
> **Team:** Developer A (Backend/AI Lead) · Developer B (Frontend/Desktop Lead)
> **Workflow:** Complete phase → A tests → B tests → Joint test → Fix → Mark done → Next phase.
> **Rule:** Never begin the next phase until the current phase's Definition of Done is fully satisfied.

---

## Developer Roles

| Role | Responsibilities |
|------|-----------------|
| **Developer A** | Python backend, FastAPI routes, AI engine, memory system, automation engine, database, RAG pipeline, testing infrastructure |
| **Developer B** | Electron shell, React UI, TypeScript, TailwindCSS, IPC bridge, frontend state, API client, packaging |

---

## Phase Overview

| Phase | Name | Owner(s) |
|-------|------|---------|
| 0 | Research & Planning | Both |
| 1 | Architecture Lock | Both |
| 2 | Project Foundation | Both |
| 3 | Backend Foundation | A primary, B review |
| 4 | Frontend Foundation | B primary, A review |
| 5 | AI Infrastructure | A primary |
| 6 | Conversation System | Both |
| 7 | Memory System | A primary |
| 8 | Automation Engine | A primary |
| 9 | Desktop Integrations | B primary |
| 10 | Permissions & Privacy | Both |
| 11 | Testing | Both |
| 12 | Packaging | B primary |
| 13 | Demo Preparation | Both |

---

## Phase 0 — Research & Planning

### Objective
Validate technical feasibility. Confirm all dependencies can be installed and run on the target machine.

### Developer A Tasks
- [ ] Install Ollama on Windows development machine
- [ ] Pull and run Qwen2.5:7B locally, verify inference works
- [ ] Pull and run Phi-4 Mini, verify inference works
- [ ] Benchmark average inference speed (tokens/sec) for both models
- [ ] Install Python 3.11+ and set up a virtual environment
- [ ] Verify faiss-cpu installs correctly on Windows
- [ ] Download and test BAAI/bge-small-en-v1.5 embedding model
- [ ] Document all install issues and resolutions

### Developer B Tasks
- [ ] Install Node.js 20 LTS and confirm npm/npx work
- [ ] Install Electron and scaffold a minimal hello-world Electron app
- [ ] Confirm Vite + React + TypeScript + Tailwind wiring works inside Electron
- [ ] Confirm Electron Builder can produce a Windows executable
- [ ] Document all install issues and resolutions

### Joint Tasks
- [ ] Agree on git branching strategy (see CODING_RULES.md)
- [ ] Initialize GitHub repository with correct `.gitignore`
- [ ] Confirm localhost communication between Python process and Electron shell works
- [ ] Set up shared Notion/Linear/GitHub Projects board for task tracking

### Testing Checklist
- [ ] Ollama serving Qwen2.5:7B responds to a curl POST
- [ ] Python FastAPI returns 200 on `GET /health`
- [ ] Electron window loads a React component
- [ ] `faiss.IndexFlatL2` can be created and queried in Python

### Definition of Done
All tools installed, all smoke tests pass, all blockers documented.

### Risks
- Qwen2.5:7B requires 8GB+ VRAM — verify hardware supports it
- faiss-cpu has known Windows build issues on some Python versions

---

## Phase 1 — Architecture Lock

### Objective
Finalize and commit all architecture documents before any implementation begins.

### Developer A Tasks
- [ ] Review and sign off on `README.md` (backend sections)
- [ ] Review and sign off on `DATABASE.md`
- [ ] Review and sign off on `API_SPEC.md`
- [ ] Review and sign off on `WORKFLOW.md`
- [ ] Review and sign off on `CODING_RULES.md`

### Developer B Tasks
- [ ] Review and sign off on `README.md` (frontend sections)
- [ ] Review and sign off on `PROJECT_STRUCTURE.md`
- [ ] Review and sign off on `API_SPEC.md` (response shapes)
- [ ] Review and sign off on `TEAM_TASKS.md`

### Joint Tasks
- [ ] Walk through every Mermaid diagram together
- [ ] Agree on folder structure for both backend and frontend
- [ ] Commit finalized docs to `docs/` on `main` branch
- [ ] Tag commit as `v0.1-architecture-lock`

### Definition of Done
All 7 docs committed and tagged. Both developers have reviewed and approved every document. No open architecture questions remain.

### Risks
- Scope creep — keep doc review focused on architecture, not implementation detail

---

## Phase 2 — Project Foundation

### Objective
Create the repository structure, dev tooling, and CI baseline.

### Developer A Tasks
- [ ] Create `backend/` directory with full folder structure (see PROJECT_STRUCTURE.md)
- [ ] Create `backend/requirements.txt` with all dependencies pinned
- [ ] Create `backend/app/main.py` with FastAPI factory + middleware
- [ ] Create `backend/app/database/engine.py` with SQLAlchemy session factory
- [ ] Create `backend/app/database/base.py` with declarative base
- [ ] Set up Alembic with `alembic init alembic/`
- [ ] Create initial migration (empty tables)
- [ ] Confirm `uvicorn app.main:app --reload` starts without errors
- [ ] Create `backend/.env.example` with all required env vars

### Developer B Tasks
- [ ] Scaffold Electron app using Vite + React + TypeScript template
- [ ] Configure TailwindCSS with custom design tokens (colors, fonts, spacing)
- [ ] Set up ESLint + Prettier with strict TypeScript config
- [ ] Create `electron/main.ts` and `electron/preload.ts` skeleton
- [ ] Configure Electron to load `http://localhost:5173` (Vite dev server) in dev mode
- [ ] Create IPC bridge skeleton in `electron/ipc/`
- [ ] Confirm Electron window opens and shows React app
- [ ] Create `desktop/.env.example`

### Joint Tasks
- [ ] Confirm backend URL is configurable from frontend via env var
- [ ] Commit foundation to `develop` branch as `feat: project foundation`

### Testing Checklist
- [ ] `GET /health` returns `{"status": "healthy"}`
- [ ] SQLAlchemy connects to `luna.db` without errors
- [ ] Alembic migration runs cleanly
- [ ] Electron window opens without errors
- [ ] React renders a placeholder home page
- [ ] TailwindCSS styles apply correctly

### Definition of Done
Both dev servers start. Health check passes. Database initializes. Electron renders React.

---

## Phase 3 — Backend Foundation

### Objective
Build all SQLAlchemy models, Pydantic schemas, and base API routes.

### Developer A Tasks
- [ ] Create all SQLAlchemy models (see DATABASE.md for full schema):
  - `Conversation`, `Message`, `Memory`, `EmbeddingMeta`
  - `Setting`, `Permission`, `ActionLog`, `UploadedFile`
- [ ] Write Alembic migration for all tables
- [ ] Create all Pydantic schemas (request + response for every API endpoint)
- [ ] Create `api/chat.py` route skeleton (POST /api/chat/message)
- [ ] Create `api/memory.py` route skeleton
- [ ] Create `api/settings.py` route skeleton
- [ ] Create `api/automation.py` route skeleton
- [ ] Create `api/permissions.py` route skeleton
- [ ] Create `api/health.py`
- [ ] Create `services/conversation_service.py` with CRUD
- [ ] Create `services/settings_service.py` with CRUD
- [ ] Create `utils/logger.py` with structured logging
- [ ] Create `utils/errors.py` with custom exception classes

### Developer B Tasks
- [ ] Review all Pydantic schemas — confirm response shapes work for frontend
- [ ] Create TypeScript type definitions in `src/types/` matching backend schemas
- [ ] Create `src/services/api.ts` — centralized axios/fetch client with base URL config
- [ ] Create API function stubs for every endpoint in API_SPEC.md
- [ ] Confirm types match expected API responses

### Testing Checklist
- [ ] All DB tables created by Alembic migration
- [ ] `POST /api/chat/message` returns placeholder 200 (no AI yet)
- [ ] `GET /api/conversations` returns empty list
- [ ] `GET /api/settings` returns default settings
- [ ] All Pydantic schemas validated with test payloads

### Definition of Done
Database fully initialized. All route skeletons return correct shapes. TypeScript types aligned with backend schemas.

---

## Phase 4 — Frontend Foundation

### Objective
Build the complete UI shell with all pages, components, and navigation.

### Developer B Tasks
- [ ] Create page layout with sidebar navigation
- [ ] Build `ChatPage` with `ChatWindow` and `InputBar` components
- [ ] Build `MessageBubble` component (user + assistant variants)
- [ ] Build `SettingsPage` with placeholder sections
- [ ] Build `PrivacyDashboard` page
- [ ] Build `AutomationLogPage`
- [ ] Create `ConversationContext` with `useReducer` for chat state
- [ ] Create `SettingsContext` for global settings
- [ ] Build `PermissionDialog` modal component (wired to `PermissionContext`)
- [ ] Implement streaming token display in `ChatWindow` (mock data first)
- [ ] Add loading states, error states, and empty states to all components
- [ ] Apply full TailwindCSS design system (typography, colors, spacing)
- [ ] Make layout responsive within Electron window constraints

### Developer A Tasks
- [ ] Review UI against system architecture — confirm all required data surfaces exist
- [ ] Confirm `PermissionDialog` design matches permission workflow
- [ ] Confirm `AutomationLogPage` structure can render `ActionLog` DB records

### Testing Checklist
- [ ] All pages render without console errors
- [ ] Navigation between pages works
- [ ] `PermissionDialog` opens and closes correctly
- [ ] `ChatWindow` renders mock messages correctly
- [ ] `InputBar` captures text input and fires submit handler
- [ ] Design is consistent across all pages

### Definition of Done
Complete UI shell navigable, all components render, design system applied.

---

## Phase 5 — AI Infrastructure

### Objective
Build the AI Engine, Orchestrator, and Embedding Service.

### Developer A Tasks
- [ ] Create `ai/ollama_client.py` — HTTP client for Ollama REST API
  - `generate()` for non-streaming
  - `generate_stream()` for SSE streaming
  - `list_models()` for model discovery
- [ ] Create `ai/orchestrator.py` — intent classification + routing
  - `classify_intent(message)` → enum: CHAT | AUTOMATION | FILE | MEMORY
  - `route(intent, message, context)` → response
- [ ] Create `ai/engine.py` — model selection + inference
  - `select_model(task_complexity)` → model name
  - `infer(prompt, model, stream)` → response/generator
- [ ] Create `ai/context_builder.py` — context window assembly
  - `build_context(conversation_history, memories, system_prompt)` → str
  - Enforce token budget (max 8192 total, 2048 for memories)
- [ ] Create `memory/embedding_service.py`
  - Load BAAI/bge-small-en-v1.5 on startup
  - `embed(text)` → np.ndarray (384-dim)
- [ ] Wire `GET /api/models` to return available Ollama models
- [ ] Wire `POST /api/chat/message` to call Orchestrator (no memory yet)
- [ ] Return streaming SSE response from `/api/chat/stream`

### Testing Checklist
- [ ] `ollama_client.generate()` returns response from Qwen2.5:7B
- [ ] `ollama_client.generate_stream()` yields tokens progressively
- [ ] `classify_intent("open chrome")` returns `AUTOMATION`
- [ ] `classify_intent("hello how are you")` returns `CHAT`
- [ ] `embed("hello world")` returns a 384-dim numpy array
- [ ] `GET /api/models` returns list including qwen2.5:7b
- [ ] SSE stream from `/api/chat/stream` is received correctly with curl

### Definition of Done
End-to-end: message sent → Orchestrator → Ollama → SSE tokens returned.

---

## Phase 6 — Conversation System

### Objective
Connect the frontend chat UI to the live AI backend with full streaming.

### Developer A Tasks
- [ ] Complete `POST /api/chat/message` — save user message, call Orchestrator, stream response
- [ ] Complete `GET /api/conversations` — list all conversations with metadata
- [ ] Complete `GET /api/conversations/{id}/messages` — fetch full message history
- [ ] Complete `POST /api/conversations` — create new conversation
- [ ] Complete `DELETE /api/conversations/{id}` — delete conversation + messages
- [ ] Implement conversation history injection into context window
- [ ] Ensure assistant responses are saved to `messages` table after streaming completes

### Developer B Tasks
- [ ] Implement `useChatStream` hook using `EventSource` for SSE
- [ ] Wire `InputBar` submit → `POST /api/chat/message` → stream tokens into `ChatWindow`
- [ ] Implement conversation list sidebar (load from `GET /api/conversations`)
- [ ] Implement new conversation creation button
- [ ] Implement conversation switching (load history from API)
- [ ] Add typing indicator during streaming
- [ ] Add error toast when API call fails

### Joint Testing
- [ ] Send message → tokens stream into UI progressively
- [ ] Refresh app → conversation history persists
- [ ] Switch conversations → correct history loads
- [ ] Delete conversation → removed from sidebar and DB
- [ ] Long messages render correctly

### Definition of Done
Full conversation flow working end-to-end with persistence and streaming.

---

## Phase 7 — Memory System

### Objective
Implement long-term memory storage, retrieval, and injection into context.

### Developer A Tasks
- [ ] Create `memory/memory_engine.py`
  - `evaluate_significance(message)` → bool
  - `store_memory(text, source, importance)` → memory_id
  - `retrieve_relevant(query, top_k=5)` → List[Memory]
- [ ] Create `memory/faiss_store.py`
  - `initialize_index()` — load from disk or create new
  - `add_vector(vector, memory_id)` → faiss_id
  - `search(query_vector, k)` → List[faiss_id]
  - `persist()` — save index to `data/faiss/memory.index`
- [ ] Create `memory/memory_evaluator.py`
  - Heuristic + LLM-based evaluation of memory-worthiness
- [ ] Wire Memory Engine into AI Orchestrator context building
- [ ] Complete `GET /api/memory` — list all memories
- [ ] Complete `DELETE /api/memory/{id}` — delete a memory
- [ ] Complete `POST /api/memory/search` — semantic search
- [ ] Persist FAISS index on backend shutdown

### Developer B Tasks
- [ ] Build `MemoryPanel` component — list memories with search
- [ ] Implement memory delete with confirmation
- [ ] Display memory count in sidebar/status bar
- [ ] Add "What do you remember about me?" test interaction

### Testing Checklist
- [ ] Store 10 memories → FAISS index grows to 10 entries
- [ ] Query "what is my name" → retrieves name memory with high score
- [ ] Delete memory → removed from SQLite and FAISS
- [ ] Backend restart → FAISS index reloaded from disk correctly
- [ ] Memory context injected into conversation produces better responses

### Definition of Done
Memories persist across sessions. Relevant memories surface in chat context. Memory panel is functional.

---

## Phase 8 — Automation Engine

### Objective
Build the desktop automation system with safe execution and audit logging.

### Developer A Tasks
- [ ] Create `automation/base_action.py` — abstract Action interface
- [ ] Create `automation/system_control.py`:
  - `open_application(name)`, `close_application(name)`, `list_running_processes()`
  - `get_system_info()`, `adjust_volume(level)`, `lock_screen()`
- [ ] Create `automation/file_manager.py`:
  - `create_file(path)`, `delete_file(path)`, `move_file(src, dst)`
  - `search_files(query, directory)`, `read_file_content(path)`
- [ ] Create `automation/browser_control.py`:
  - `open_url(url)`, `search_web(query)`
- [ ] Create `automation/utilities.py`:
  - `take_screenshot()`, `copy_to_clipboard(text)`, `get_clipboard()`
- [ ] Create `planner/task_planner.py`:
  - `decompose(user_request)` → List[ActionStep]
  - `estimate_risk(action)` → RiskLevel enum
- [ ] Create `permissions/permission_manager.py`:
  - `check_permission(category)` → bool
  - `request_permission(category, action_details)` → awaitable approval
  - `grant_permission(category, scope)` → void
  - `revoke_permission(category)` → void
- [ ] Wire `POST /api/automation/execute` route
- [ ] Wire `GET /api/automation/logs` route
- [ ] Write audit log entry for every action execution

### Developer B Tasks
- [ ] Build `AutomationLogPage` — render action_logs from API
- [ ] Display risk level badge per log entry
- [ ] Show approval status (approved/denied/pre-approved)
- [ ] Implement `PermissionDialog` backend integration (poll `GET /api/permissions/pending`)

### Testing Checklist
- [ ] `open_application("notepad")` opens Notepad on Windows
- [ ] `take_screenshot()` saves screenshot and returns file path
- [ ] `search_files("*.py", "C:/")` returns results within timeout
- [ ] Every execution writes to `action_logs` table
- [ ] Denied action returns proper error message
- [ ] Pre-approved action executes without dialog

### Definition of Done
All automation tools functional. Permission gate enforced. Audit log populated. UI displays log.

---

## Phase 9 — Desktop Integrations

### Objective
Integrate Luna with Windows-native features and desktop context awareness.

### Developer A Tasks
- [ ] Implement `watchdog` file watcher — detect file changes in configured directories
- [ ] Implement active window detection via `pywin32` — `get_active_window_title()`
- [ ] Implement clipboard monitor — notify on clipboard change
- [ ] Expose context data via `GET /api/context/desktop` endpoint
- [ ] Feed desktop context into Orchestrator's system prompt

### Developer B Tasks
- [ ] Implement system tray icon using Electron's `Tray` API
- [ ] Add tray menu: Open Luna, Settings, Quit
- [ ] Implement global hotkey (e.g., Ctrl+Space) to focus Luna window
- [ ] Implement drag-and-drop file upload into `InputBar`
- [ ] Display active desktop context (current window) in UI status bar
- [ ] Configure Electron to launch minimized to tray on startup (optional setting)

### Testing Checklist
- [ ] System tray icon appears on Windows taskbar
- [ ] Global hotkey brings Luna window to focus
- [ ] Drag-and-drop file into chat processes the file
- [ ] Desktop context (active window name) updates in real time
- [ ] File watcher detects file creation in watched directory

### Definition of Done
Luna operates as a native Windows desktop application. Tray, hotkeys, and drag-drop all functional.

---

## Phase 10 — Permissions & Privacy

### Objective
Complete the permission system and privacy dashboard.

### Developer A Tasks
- [ ] Complete `GET /api/permissions` — list all permission settings
- [ ] Complete `PUT /api/permissions/{category}` — update permission
- [ ] Complete `DELETE /api/permissions/{category}` — revoke permission
- [ ] Complete `GET /api/privacy/export` — export all user data as JSON
- [ ] Complete `DELETE /api/privacy/data` — delete all user data
- [ ] Ensure `DELETE /api/privacy/data` also clears FAISS index
- [ ] Add rate limiting to sensitive endpoints

### Developer B Tasks
- [ ] Build `PrivacyDashboard` with:
  - Data summary (message count, memory count, action log count)
  - Export All Data button
  - Delete All Data button with confirmation dialog
  - Per-permission toggle UI
- [ ] Build `PermissionsPage` — list and toggle each automation category
- [ ] Add privacy status indicator in sidebar

### Testing Checklist
- [ ] Export returns valid JSON with all user data
- [ ] Delete All Data clears all tables and FAISS index
- [ ] Permission toggle persists across app restart
- [ ] Automation blocked when category permission is toggled off
- [ ] Confirmation dialog shown before irreversible actions

### Definition of Done
Full privacy control in UI. Permission system consistent across backend and frontend.

---

## Phase 11 — Testing

### Objective
Achieve acceptable test coverage across backend and frontend before packaging.

### Developer A Tasks
- [ ] Write pytest unit tests for:
  - `OllamaClient` (mock Ollama)
  - `MemoryEngine.store_memory()` and `retrieve_relevant()`
  - `FaissStore.add_vector()` and `search()`
  - `PermissionManager.check_permission()`
  - `TaskPlanner.decompose()`
  - All automation tools (mock OS calls)
- [ ] Write pytest integration tests for:
  - Full chat message → response flow
  - Memory write → retrieve → inject flow
  - Automation request → permission → execute → log flow
- [ ] Achieve ≥ 70% coverage on `app/ai/`, `app/memory/`, `app/automation/`
- [ ] Set up `pytest-cov` and generate coverage report

### Developer B Tasks
- [ ] Write component tests for:
  - `ChatWindow` (renders messages, handles streaming)
  - `MessageBubble` (user/assistant variants)
  - `PermissionDialog` (approve/deny interactions)
  - `MemoryPanel` (list, delete)
- [ ] Perform manual E2E test of full user journey:
  - Open app → chat → see memory stored → automation → permission dialog → result
- [ ] Test on Windows 10 and Windows 11 if possible
- [ ] Check for memory leaks (EventSource not cleaned up, etc.)

### Joint Testing (E2E Scenarios)
- [ ] Scenario 1: User asks "open chrome and search for cats" → permission dialog → approved → browser opens
- [ ] Scenario 2: User chats for 10 turns → memories stored → restart app → memories still influence responses
- [ ] Scenario 3: User uploads a PDF → RAG processes it → queries answered from document
- [ ] Scenario 4: User revokes file permission → automation attempt blocked

### Definition of Done
≥ 70% backend test coverage. All E2E scenarios pass. No critical bugs.

---

## Phase 12 — Packaging

### Objective
Produce a distributable Windows executable.

### Developer B Tasks
- [ ] Configure Electron Builder in `package.json`:
  - Target: NSIS installer + portable exe
  - Include backend Python process as bundled resource or launch as child process
  - Configure auto-start of Python backend when Electron launches
- [ ] Test packaged build on clean Windows machine (no dev tools installed)
- [ ] Verify Ollama path is configurable (user may have Ollama in non-default location)
- [ ] Create installer with Luna icon and proper app metadata
- [ ] Test installer: install, run, uninstall cleanly

### Developer A Tasks
- [ ] Create `scripts/start_backend.bat` for Windows
- [ ] Ensure backend startup checks for Ollama availability and shows clear error if not found
- [ ] Ensure FAISS index and SQLite DB are created in user's AppData directory in production
- [ ] Bundle Python as embedded interpreter OR provide setup script for Python install
- [ ] Document packaging steps in `docs/PACKAGING.md`

### Testing Checklist
- [ ] Packaged exe launches without errors on clean machine
- [ ] Backend starts automatically when Electron opens
- [ ] Database created in correct AppData location
- [ ] Uninstall removes app without leaving orphan processes

### Definition of Done
Single installable package produced. App runs on a clean Windows machine.

---

## Phase 13 — Demo Preparation

### Objective
Prepare a polished, reliable demo for the hackathon presentation.

### Developer A Tasks
- [ ] Pre-load demo database with sample memories and conversation history
- [ ] Create a `demo_reset.py` script that resets DB to clean demo state
- [ ] Ensure Qwen2.5:7B is pulled and cached before demo
- [ ] Prepare 5 showcase prompts that demonstrate Luna's capabilities
- [ ] Test all showcase prompts 3+ times end-to-end

### Developer B Tasks
- [ ] Polish UI — fix any visual inconsistencies, animations, and loading states
- [ ] Add Luna branding (logo, window title, tray icon)
- [ ] Record a 2-minute demo video as backup
- [ ] Prepare slide deck (architecture diagram from README.md)
- [ ] Test demo flow on presentation hardware

### Joint Tasks
- [ ] Rehearse full demo 3 times
- [ ] Define fallback plan if Ollama is slow on demo machine
- [ ] Prepare offline demo responses (cached) as emergency fallback

### Demo Showcase Scenarios
1. **Memory:** "Do you remember what I told you about my job?" → retrieves from memory
2. **Automation:** "Open Spotify and play something" → permission dialog → opens Spotify
3. **File Understanding:** Upload a PDF → "Summarize this document"
4. **Context Awareness:** "What window am I working in?" → reads active window
5. **Privacy:** Show Privacy Dashboard, export data, demonstrate local-only architecture

### Definition of Done
Demo rehearsed 3 times without critical failures. Backup plan documented. Branding complete.

---

*References: [README.md](./README.md) · [CODING_RULES.md](./CODING_RULES.md) · [API_SPEC.md](./API_SPEC.md)*
