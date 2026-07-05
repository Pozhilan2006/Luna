# Luna Desktop AI Assistant — Project Structure

> **Version:** 1.0 · July 2026
> Reference: [README.md](./README.md) | [CODING_RULES.md](./CODING_RULES.md)

---

## Root Structure

```
luna/
├── docs/          # All architecture and planning documents
├── backend/       # Python FastAPI service
├── desktop/       # Electron + React frontend
├── data/          # Runtime data — gitignored (DB, FAISS, uploads)
└── scripts/       # Developer utility scripts
```

---

## Backend: `backend/`

### Full Tree

```
backend/
├── app/
│   ├── main.py                    # FastAPI app factory, middleware, router registration
│   ├── api/                       # HTTP route handlers
│   │   ├── __init__.py
│   │   ├── chat.py                # /api/chat/*
│   │   ├── memory.py              # /api/memory/*
│   │   ├── automation.py          # /api/automation/*
│   │   ├── permissions.py         # /api/permissions/*
│   │   ├── settings.py            # /api/settings/*
│   │   ├── context.py             # /api/context/*
│   │   ├── rag.py                 # /api/rag/*
│   │   ├── planner.py             # /api/planner/*
│   │   ├── dashboard.py           # /api/dashboard/*
│   │   ├── diagnostics.py         # /api/diagnostics/*
│   │   ├── plugins.py             # /api/plugins/*
│   │   ├── search.py              # /api/search/*
│   │   ├── tools.py               # /api/tools/*
│   │   ├── notes.py               # /api/notes/*
│   │   ├── tasks.py               # /api/tasks/*
│   │   └── backup.py              # /api/backup/*
│   │
│   ├── ai/                        # AI Engine layer
│   │   ├── __init__.py
│   │   ├── orchestrator.py        # Intent classification and routing
│   │   ├── engine.py              # Model selection and inference
│   │   ├── ollama_client.py       # HTTP client for Ollama REST API
│   │   ├── context_builder.py     # Context window assembly and token budgeting
│   │   ├── intent_classifier.py   # Rule-based and LLM-based intent classifier
│   │   └── constants.py           # Model names, intent enums, token limits
│   │
│   ├── memory/                    # Memory Engine
│   │   ├── __init__.py
│   │   ├── memory_engine.py       # High-level memory operations
│   │   ├── faiss_store.py         # FAISS index management
│   │   ├── embedding_service.py   # Sentence transformer embedding
│   │   ├── memory_evaluator.py    # Significance evaluation logic
│   │   └── retrieval.py           # Similarity search and re-ranking
│   │
│   ├── automation/                # Automation Engine
│   │   ├── __init__.py
│   │   ├── base_action.py         # Abstract Action base class
│   │   ├── system_control.py      # App open/close, system settings, power
│   │   ├── file_manager.py        # File CRUD, search, reading
│   │   ├── browser_control.py     # Browser open, URL navigation
│   │   ├── media_control.py       # Volume, media playback
│   │   └── utilities.py           # Screenshot, clipboard
│   │
│   ├── planner/                   # Task Planner
│   │   ├── __init__.py
│   │   ├── task_planner.py        # Request decomposition into action steps
│   │   ├── step.py                # ActionStep dataclass
│   │   └── risk_estimator.py      # Risk level estimation per action
│   │
│   ├── rag/                       # RAG Pipeline
│   │   ├── __init__.py
│   │   ├── rag_engine.py          # High-level RAG orchestration
│   │   ├── document_loader.py     # File parsing (PDF, TXT, DOCX, MD)
│   │   ├── chunker.py             # Text chunking strategies
│   │   ├── indexer.py             # Chunk embedding and FAISS indexing
│   │   └── retriever.py           # Semantic retrieval for documents
│   │
│   ├── context/                   # Context Management
│   │   ├── __init__.py
│   │   ├── context_manager.py     # Desktop context collection
│   │   ├── window_tracker.py      # Active window detection (pywin32)
│   │   └── clipboard_monitor.py   # Clipboard change detection
│   │
│   ├── permissions/               # Permission System
│   │   ├── __init__.py
│   │   ├── permission_manager.py  # Authorization gate
│   │   ├── categories.py          # ActionCategory enum definitions
│   │   └── audit.py               # Audit log writer
│   │
│   ├── models/                    # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── conversation.py        # Conversation model
│   │   ├── message.py             # Message model
│   │   ├── memory.py              # Memory model
│   │   ├── embedding_meta.py      # EmbeddingMeta model
│   │   ├── setting.py             # Setting model
│   │   ├── permission.py          # Permission model
│   │   ├── action_log.py          # ActionLog model
│   │   └── uploaded_file.py       # UploadedFile model
│   │
│   ├── schemas/                   # Pydantic Schemas
│   │   ├── __init__.py
│   │   ├── chat.py                # ChatRequest, ChatResponse, StreamChunk
│   │   ├── memory.py              # MemoryCreate, MemoryRead, MemorySearch
│   │   ├── automation.py          # AutomationRequest, AutomationResult
│   │   ├── permission.py          # PermissionRead, PermissionUpdate
│   │   ├── setting.py             # SettingRead, SettingUpdate
│   │   ├── context.py             # DesktopContext
│   │   └── common.py              # Shared response envelope, pagination
│   │
│   ├── database/                  # Database Infrastructure
│   │   ├── __init__.py
│   │   ├── engine.py              # SQLAlchemy engine + session factory
│   │   ├── base.py                # Declarative base
│   │   └── dependencies.py        # FastAPI Depends() for DB session
│   │
│   ├── services/                  # Business Logic Services
│   │   ├── __init__.py
│   │   ├── conversation_service.py
│   │   ├── message_service.py
│   │   ├── memory_service.py
│   │   ├── settings_service.py
│   │   ├── file_service.py
│   │   └── export_service.py      # Data export for privacy
│   │
│   ├── plugins/                   # Plugin Interface
│   │   ├── __init__.py
│   │   ├── base_plugin.py         # Abstract plugin interface
│   │   └── registry.py            # Plugin discovery and registration
│   │
│   ├── tools/                     # Utility Tools
│   │   ├── __init__.py
│   │   ├── token_counter.py       # Token estimation utilities
│   │   └── text_utils.py          # Text cleaning helpers
│   │
│   └── utils/                     # Infrastructure Utilities
│       ├── __init__.py
│       ├── logger.py              # Structured logging setup
│       ├── errors.py              # Custom exception classes
│       └── config.py              # Settings/env var loader
│
├── alembic/                       # Database migrations
│   ├── env.py
│   ├── versions/
│   └── alembic.ini
│
├── tests/                         # Backend tests (pytest)
│   ├── conftest.py
│   ├── unit/
│   │   ├── test_orchestrator.py
│   │   ├── test_memory_engine.py
│   │   ├── test_faiss_store.py
│   │   ├── test_permission_manager.py
│   │   └── test_automation_tools.py
│   └── integration/
│       ├── test_chat_flow.py
│       ├── test_memory_flow.py
│       └── test_automation_flow.py
│
├── requirements.txt               # Pinned dependencies
├── .env.example                   # Environment variable template
└── pytest.ini                     # Pytest configuration
```

---

## Frontend: `desktop/`

### Full Tree

```
desktop/
├── electron/
│   ├── main.ts                    # Electron main process entry point
│   ├── preload.ts                 # Context bridge (exposes safe APIs to renderer)
│   └── ipc/
│       ├── index.ts               # IPC handler registration
│       ├── window.ts              # Window management IPC
│       └── system.ts              # System tray, hotkey IPC
│
├── src/
│   ├── main.tsx                   # React app entry point
│   ├── App.tsx                    # Root component with router
│   │
│   ├── components/                # Reusable UI components
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx     # Message list container
│   │   │   ├── MessageBubble.tsx  # Individual message (user/assistant)
│   │   │   ├── InputBar.tsx       # Text input + file attach + send
│   │   │   ├── StreamingText.tsx  # Token-by-token stream renderer
│   │   │   └── TypingIndicator.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx        # Conversation list + navigation
│   │   │   ├── TopBar.tsx         # Window controls + model indicator
│   │   │   └── StatusBar.tsx      # Active context, connection status
│   │   ├── memory/
│   │   │   ├── MemoryPanel.tsx    # Memory list viewer
│   │   │   └── MemoryCard.tsx     # Individual memory entry
│   │   ├── automation/
│   │   │   ├── AutomationLog.tsx  # Action log table
│   │   │   └── LogEntry.tsx       # Individual log row
│   │   ├── permissions/
│   │   │   ├── PermissionDialog.tsx    # Approval modal
│   │   │   └── PermissionToggle.tsx    # Per-category toggle
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── pages/
│   │   ├── ChatPage.tsx           # Main chat interface
│   │   ├── SettingsPage.tsx       # Settings and model config
│   │   ├── PrivacyPage.tsx        # Privacy dashboard + data management
│   │   ├── PermissionsPage.tsx    # Per-category permission management
│   │   └── AutomationLogPage.tsx  # Full automation audit log
│   │
│   ├── hooks/
│   │   ├── useChatStream.ts       # SSE streaming hook
│   │   ├── useConversations.ts    # Conversation list + CRUD
│   │   ├── useMemory.ts           # Memory list + delete
│   │   ├── useSettings.ts         # Settings read/write
│   │   └── usePermissions.ts      # Permission management
│   │
│   ├── context/
│   │   ├── ConversationContext.tsx  # Active conversation + messages state
│   │   ├── PermissionContext.tsx    # Global permission dialog trigger
│   │   └── SettingsContext.tsx      # Global settings state
│   │
│   ├── services/
│   │   └── api.ts                 # Centralized API client (all fetch calls)
│   │
│   ├── store/
│   │   └── index.ts               # Global state (useReducer actions/reducers)
│   │
│   ├── types/
│   │   ├── chat.ts                # Message, Conversation, StreamChunk types
│   │   ├── memory.ts              # Memory types
│   │   ├── automation.ts          # ActionLog, AutomationRequest types
│   │   ├── permission.ts          # Permission types
│   │   ├── settings.ts            # Settings types
│   │   └── api.ts                 # Generic API envelope types
│   │
│   ├── utils/
│   │   ├── formatters.ts          # Date, text formatting
│   │   └── constants.ts           # API base URL, config constants
│   │
│   └── assets/
│       ├── logo.svg
│       └── icons/
│
├── public/
│   └── icon.png                   # App icon for Electron Builder
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── .env.example
```

---

## Data Directory: `data/` (gitignored)

```
data/
├── luna.db            # SQLite database (all structured data)
├── faiss/
│   ├── memory.index   # FAISS flat index for memories
│   └── docs.index     # FAISS flat index for RAG documents
└── uploads/           # Uploaded files for RAG processing
```

---

## Module Dependencies

```
api/ → services/ → models/ (no circular deps)
ai/orchestrator → ai/engine, memory/memory_engine, planner/task_planner
ai/engine → ai/ollama_client, rag/rag_engine
memory/memory_engine → memory/faiss_store, memory/embedding_service
automation/* → permissions/permission_manager
permissions/permission_manager → models/permission, permissions/audit
rag/* → memory/embedding_service, memory/faiss_store
```

**Rule: No circular imports. Lower layers never import from higher layers.**

---

## Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| Python files | `snake_case.py` | `memory_engine.py` |
| Python classes | `PascalCase` | `MemoryEngine` |
| Python functions | `snake_case` | `retrieve_relevant()` |
| Python constants | `UPPER_SNAKE` | `MAX_MEMORY_TOKENS` |
| TypeScript files | `PascalCase.tsx/.ts` | `ChatWindow.tsx` |
| TypeScript components | `PascalCase` | `ChatWindow` |
| TypeScript hooks | `camelCase` prefixed `use` | `useChatStream` |
| TypeScript types | `PascalCase` | `ChatMessage` |
| TypeScript constants | `UPPER_SNAKE` | `API_BASE_URL` |
| API routes | `kebab-case` | `/api/chat-stream` |
| DB tables | `snake_case` | `action_logs` |
| Git branches | `type/short-description` | `feature/memory-panel` |

---

## Architecture Boundaries

| Layer | May Import From | Must NOT Import From |
|-------|---------------|---------------------|
| `api/` | `services/`, `schemas/` | `ai/`, `memory/`, `automation/` directly |
| `services/` | `models/`, `database/` | `api/` |
| `ai/` | `memory/`, `rag/`, `planner/` | `api/`, `services/` |
| `automation/` | `permissions/`, `utils/` | `ai/`, `memory/`, `api/` |
| `models/` | `database/base` | Everything else |
| `schemas/` | Nothing internal | Everything except `common.py` |

The **API layer** orchestrates by calling **services**. The **services** call **engines** (AI, Memory, Automation). Engines are pure domain logic with no HTTP knowledge.

---

*References: [README.md](./README.md) · [CODING_RULES.md](./CODING_RULES.md)*
