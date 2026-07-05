# Luna Desktop AI Assistant — System Workflows

> **Version:** 1.0 · July 2026
> All diagrams use Mermaid syntax.
> Reference: [README.md](./README.md) · [API_SPEC.md](./API_SPEC.md) · [DATABASE.md](./DATABASE.md)

---

## 1. Application Startup Flow

```mermaid
sequenceDiagram
    participant OS as Windows OS
    participant E as Electron Main
    participant R as React Renderer
    participant PY as Python Backend
    participant OL as Ollama
    participant DB as SQLite + FAISS

    OS->>E: Launch electron executable
    E->>PY: Start uvicorn subprocess (localhost:8000)
    PY->>DB: Open SQLite connection
    PY->>DB: Run Alembic migrations (if needed)
    PY->>DB: Seed default settings and permissions (if first run)
    PY->>DB: Load FAISS index from disk
    PY->>OL: GET /api/tags (verify Ollama is running)
    alt Ollama not running
        PY-->>E: Emit "ollama_unavailable" warning
    end
    PY-->>E: Backend ready on port 8000
    E->>R: Load React app (localhost:5173 dev / bundled prod)
    R->>PY: GET /health
    PY-->>R: {"status":"healthy","ollama":"connected"}
    R->>PY: GET /api/conversations
    R->>PY: GET /api/settings
    PY-->>R: Conversations list
    PY-->>R: User settings
    R-->>E: UI ready — show main window
    E-->>OS: Register system tray icon + global hotkey
```

---

## 2. Chat Request & Streaming Response Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React UI
    participant API as FastAPI Chat Router
    participant ORCH as AI Orchestrator
    participant MEM as Memory Engine
    participant AI as AI Engine
    participant OL as Ollama
    participant DB as SQLite

    U->>UI: Types message, presses Send
    UI->>UI: Add user message to local state (optimistic)
    UI->>API: POST /api/chat/message {content, conversation_id}
    API->>API: Validate request (Pydantic)
    API->>DB: Save user message to messages table
    API->>ORCH: route(message, conversation_id)

    ORCH->>ORCH: Classify intent → CHAT
    ORCH->>MEM: retrieve_relevant(query=message, top_k=5)
    MEM-->>ORCH: List of relevant memories

    ORCH->>DB: Load last N messages (conversation history)
    DB-->>ORCH: Message history

    ORCH->>AI: infer(context, stream=True)
    AI->>OL: POST /api/generate {model, prompt, stream:true}

    loop Stream tokens
        OL-->>AI: Token chunk
        AI-->>API: Token chunk
        API-->>UI: SSE: data: {"type":"token","content":"..."}
        UI-->>U: Render token progressively
    end

    OL-->>AI: [DONE]
    AI-->>API: Complete response text
    API->>DB: Save assistant message to messages table
    API->>MEM: evaluate_significance(response)
    alt Memory worthy
        MEM->>MEM: embed(response)
        MEM->>DB: Save to memories table
        MEM->>DB: Update FAISS index
    end
    API-->>UI: SSE: data: {"type":"done","message_id":"uuid"}
    UI->>UI: Mark message as complete
```

---

## 3. Memory Retrieval Flow

```mermaid
sequenceDiagram
    participant ORCH as Orchestrator
    participant MEM as Memory Engine
    participant EMB as Embedding Service
    participant FAISS as FAISS Store
    participant DB as SQLite

    ORCH->>MEM: retrieve_relevant(query, top_k=5)
    MEM->>EMB: embed(query)
    EMB-->>MEM: query_vector [384-dim float32]

    MEM->>FAISS: search(query_vector, k=10)
    FAISS-->>MEM: [(faiss_id, distance), ...]

    MEM->>DB: SELECT * FROM memories WHERE faiss_id IN (...)
    DB-->>MEM: Memory rows with content + metadata

    MEM->>MEM: Re-rank by: score = (1 - distance) * 0.7 + recency_weight * 0.3
    MEM->>DB: UPDATE memories SET access_count++, last_accessed=now() WHERE id IN (...)
    MEM-->>ORCH: Top 5 Memory objects ordered by combined score
```

---

## 4. Memory Write Flow

```mermaid
sequenceDiagram
    participant API as Chat Router
    participant EVAL as Memory Evaluator
    participant EMB as Embedding Service
    participant FAISS as FAISS Store
    participant DB as SQLite

    API->>EVAL: evaluate_significance(message_text)
    EVAL->>EVAL: Check heuristics (contains name, preference, fact, event)
    alt High significance
        EVAL-->>API: is_significant=True, importance=0.8
        API->>EMB: embed(message_text)
        EMB-->>API: vector [384-dim]
        API->>FAISS: add_vector(vector)
        FAISS-->>API: faiss_id=42
        API->>DB: INSERT INTO memories (content, faiss_id, importance, source, ...)
        DB-->>API: memory_id=7
        API->>DB: INSERT INTO embeddings_meta (faiss_id=42, record_type='memory', record_id=7)
        API->>FAISS: persist() -- save index to disk
    else Low significance
        EVAL-->>API: is_significant=False
        API->>API: Skip memory storage
    end
```

---

## 5. Desktop Automation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React UI
    participant ORCH as Orchestrator
    participant PLAN as Task Planner
    participant PERM as Permission Manager
    participant EXEC as Action Execution Layer
    participant OS as Windows OS
    participant DB as SQLite

    U->>UI: "Open Chrome and search for cats"
    UI->>ORCH: route(message)
    ORCH->>ORCH: Classify intent → AUTOMATION
    ORCH->>PLAN: decompose("Open Chrome and search for cats")
    PLAN-->>ORCH: [Step1: open_application(chrome), Step2: open_url(search url)]

    loop For each step
        ORCH->>PERM: check_permission(category='browser_control')
        alt Pre-approved
            PERM-->>ORCH: approved=True, type='pre_approved'
        else Requires approval
            PERM->>UI: Push pending permission request
            UI-->>U: Show PermissionDialog
            U->>UI: Click "Allow Once"
            UI->>PERM: POST /api/permissions/respond {decision: 'allow_once'}
            PERM-->>ORCH: approved=True, type='allow_once'
        end

        ORCH->>EXEC: execute(action, parameters)
        EXEC->>OS: subprocess / pywin32 / pyautogui call
        OS-->>EXEC: Result (success/error)
        EXEC->>DB: INSERT INTO action_logs (action, result, status, permission_type, ...)
        EXEC-->>ORCH: ActionResult
    end

    ORCH->>AI: summarize_result(steps_results)
    AI-->>UI: SSE stream: "I've opened Chrome and searched for cats."
```

---

## 6. Permission Approval Flow

```mermaid
sequenceDiagram
    participant PERM as Permission Manager
    participant DB as SQLite
    participant UI as React UI
    participant U as User

    PERM->>DB: SELECT status FROM permissions WHERE category=?
    alt status = 'always'
        DB-->>PERM: always
        PERM-->>PERM: Return approved immediately
    else status = 'never'
        DB-->>PERM: never
        PERM-->>PERM: Return denied immediately
    else status = 'ask'
        DB-->>PERM: ask
        PERM->>PERM: Store pending request {request_id, action, params, risk_level}
        PERM-->>UI: (UI polls GET /api/permissions/pending)
        UI-->>U: Display PermissionDialog
        Note over U,UI: Timeout: 30 seconds

        alt User clicks "Allow Once"
            U->>UI: Allow Once
            UI->>PERM: POST /api/permissions/respond {allow_once}
            PERM-->>PERM: Approve this execution only
        else User clicks "Allow Always"
            U->>UI: Allow Always
            UI->>PERM: POST /api/permissions/respond {allow_always}
            PERM->>DB: UPDATE permissions SET status='always' WHERE category=?
            PERM-->>PERM: Approve
        else User clicks "Deny"
            U->>UI: Deny
            UI->>PERM: POST /api/permissions/respond {deny}
            PERM-->>PERM: Return denied
        else Timeout
            PERM-->>PERM: Return denied (timeout)
        end
    end

    PERM->>DB: INSERT INTO action_logs (permission_type, user_approved, ...)
```

---

## 7. Conversation Save Flow

```mermaid
sequenceDiagram
    participant UI as React UI
    participant API as FastAPI
    participant DB as SQLite

    Note over UI,DB: Triggered when stream completes

    API->>DB: INSERT INTO messages (role='assistant', content=full_text, ...)
    DB-->>API: message_id
    API->>DB: UPDATE conversations SET updated_at=now() WHERE id=?
    API->>API: Check if conversation has auto-generated title
    alt No title yet (first exchange)
        API->>API: Generate title from first user message (truncate to 50 chars)
        API->>DB: UPDATE conversations SET title=? WHERE id=?
    end
    API-->>UI: SSE done event with message_id + conversation_id
    UI->>UI: Update conversation in sidebar with new updated_at
```

---

## 8. RAG Document Processing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as React UI
    participant API as FastAPI RAG Router
    participant LOADER as Document Loader
    participant CHUNK as Chunker
    participant EMB as Embedding Service
    participant FAISS as FAISS Docs Store
    participant DB as SQLite

    U->>UI: Drag and drop PDF file
    UI->>API: POST /api/rag/upload (multipart form)
    API->>DB: INSERT INTO uploaded_files (status='pending')
    API-->>UI: 201 {file_id, status:'indexing'}

    API->>LOADER: load(file_path, mime_type)
    LOADER-->>API: raw_text (extracted text from PDF/DOCX/TXT)

    API->>CHUNK: chunk(raw_text, chunk_size=512, overlap=64)
    CHUNK-->>API: List of text chunks

    loop For each chunk
        API->>EMB: embed(chunk_text)
        EMB-->>API: vector [384-dim]
        API->>FAISS: add_vector(vector)
        FAISS-->>API: faiss_id
        API->>DB: INSERT INTO embeddings_meta (faiss_id, record_type='document_chunk', ...)
    end

    API->>FAISS: persist()
    API->>DB: UPDATE uploaded_files SET status='indexed', chunk_count=N
    API-->>UI: File indexed, ready for queries
```

---

## 9. Application Shutdown Flow

```mermaid
sequenceDiagram
    participant U as User
    participant E as Electron Main
    participant R as React Renderer
    participant PY as Python Backend
    participant DB as SQLite
    participant FAISS as FAISS Store

    U->>E: Close window / Quit from tray
    E->>R: Trigger beforeunload
    R->>PY: POST /api/shutdown (optional graceful signal)
    PY->>FAISS: persist() -- save memory.index and docs.index to disk
    PY->>DB: Close all open sessions
    PY-->>E: Shutdown acknowledgment
    E->>PY: Kill uvicorn subprocess (SIGTERM)
    E->>E: Unregister global hotkeys
    E->>E: Remove tray icon
    E-->>OS: Process exits
```

---

*References: [README.md](./README.md) · [API_SPEC.md](./API_SPEC.md) · [DATABASE.md](./DATABASE.md)*
