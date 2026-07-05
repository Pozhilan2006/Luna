# Luna Desktop AI Assistant — Coding Rules & Standards

> **Version:** 1.0 · July 2026
> These rules are MANDATORY. No PR may be merged that violates these standards.
> Reference: [README.md](./README.md) · [TEAM_TASKS.md](./TEAM_TASKS.md)

---

## 1. File & Folder Naming

### Python (Backend)
| Artifact | Convention | Example |
|----------|-----------|---------|
| Directories | `snake_case` | `memory_engine/`, `api/` |
| Python files | `snake_case.py` | `memory_engine.py`, `ollama_client.py` |
| Test files | `test_<module>.py` | `test_memory_engine.py` |
| Migration files | `<timestamp>_<description>.py` | `20260706_001_initial_schema.py` |
| Config files | `snake_case` | `.env`, `alembic.ini` |

### TypeScript (Frontend)
| Artifact | Convention | Example |
|----------|-----------|---------|
| Component files | `PascalCase.tsx` | `ChatWindow.tsx`, `MessageBubble.tsx` |
| Hook files | `camelCase.ts` prefixed `use` | `useChatStream.ts` |
| Service files | `camelCase.ts` | `api.ts`, `storage.ts` |
| Type files | `camelCase.ts` | `chat.ts`, `memory.ts` |
| Page files | `PascalCase.tsx` suffixed `Page` | `ChatPage.tsx`, `SettingsPage.tsx` |
| Utility files | `camelCase.ts` | `formatters.ts`, `constants.ts` |
| Test files | `<Component>.test.tsx` | `ChatWindow.test.tsx` |

---

## 2. Class & Function Naming

### Python
```python
# Classes: PascalCase
class MemoryEngine:
class OllamaClient:
class ActionLog:

# Functions and methods: snake_case
def retrieve_relevant(query: str, top_k: int = 5) -> list[Memory]:
def embed_text(text: str) -> np.ndarray:

# Constants: UPPER_SNAKE_CASE
MAX_MEMORY_TOKENS = 2048
DEFAULT_MODEL = "qwen2.5:7b"
FAISS_INDEX_PATH = Path("data/faiss/memory.index")

# Private methods: prefix with _
def _normalize_score(self, raw: float) -> float:

# Async functions: same naming, add async keyword
async def stream_response(prompt: str) -> AsyncGenerator[str, None]:
```

### TypeScript
```typescript
// Interfaces and Types: PascalCase
interface ChatMessage { ... }
type PermissionStatus = 'always' | 'ask' | 'never';

// Components: PascalCase
const ChatWindow: React.FC<ChatWindowProps> = () => { ... }

// Hooks: camelCase prefixed with use
const useChatStream = (conversationId: string) => { ... }

// Regular functions: camelCase
const formatTimestamp = (date: Date): string => { ... }

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8000';
const MAX_MESSAGE_LENGTH = 10000;

// Event handlers: handle prefix
const handleSubmit = () => { ... }
const handleKeyDown = (e: KeyboardEvent) => { ... }
```

---

## 3. API Naming

- Routes use **kebab-case**: `/api/action-logs`, `/api/uploaded-files`
- Route parameters use **snake_case**: `{conversation_id}`, `{memory_id}`
- Query parameters use **snake_case**: `?top_k=5`, `?created_after=2026-01-01`
- JSON request/response fields use **snake_case**: `{ "conversation_id": "...", "created_at": "..." }`

**Route structure:**
```
GET    /api/{resource}              # list
POST   /api/{resource}              # create
GET    /api/{resource}/{id}         # read single
PUT    /api/{resource}/{id}         # update
DELETE /api/{resource}/{id}         # delete
POST   /api/{resource}/{action}     # custom action
```

---

## 4. Git Commit Format

All commits must follow **Conventional Commits**:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**
| Type | When to Use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Build, config, tooling |
| `refactor` | Code change with no feature/fix |
| `test` | Adding or fixing tests |
| `perf` | Performance improvement |
| `style` | Formatting, no logic change |

**Examples:**
```
feat(memory): implement FAISS vector storage for memories
fix(chat): resolve SSE stream not closing on completion
docs(api): add permission endpoint examples to API_SPEC.md
chore(deps): pin faiss-cpu to 1.7.4
test(automation): add unit tests for file_manager actions
refactor(orchestrator): extract intent classifier to separate module
```

---

## 5. Branch Strategy

```
main          ← Protected. Production-ready code only. Merge via PR with both approvals.
develop       ← Integration branch. All features merge here first.
feature/*     ← New features. Branch from develop. Merge back to develop.
fix/*         ← Bug fixes. Branch from develop (or main for hotfixes).
docs/*        ← Documentation updates only.
chore/*       ← Build, config, tooling changes.
```

**Branch naming:**
```
feature/memory-panel-ui
feature/faiss-store-integration
fix/sse-stream-close-on-error
docs/api-spec-permissions
chore/update-requirements
```

**Rules:**
- Branch names are lowercase with hyphens
- Never commit directly to `main` or `develop`
- Feature branches live no longer than one phase

---

## 6. Pull Request Rules

**PR title** must match Conventional Commits format:
```
feat(memory): implement semantic search over stored memories
```

**PR description must include:**
1. **What** — What does this PR do?
2. **Why** — Why is this change needed?
3. **How** — Any non-obvious implementation decisions
4. **Testing** — What was tested manually + automated tests added
5. **Phase** — Which phase this contributes to
6. **Checklist:**
   - [ ] Tests pass locally
   - [ ] No `any` types added (TypeScript)
   - [ ] No missing type hints (Python)
   - [ ] No hardcoded strings (use constants)
   - [ ] Logging added for new code paths
   - [ ] API_SPEC.md updated if endpoints changed
   - [ ] No `print()` statements (use logger)

**Merge requirements:**
- Both developers must approve before merging to `develop`
- All CI checks must pass
- No unresolved review comments

---

## 7. Code Review Rules

**Reviewer responsibilities:**
1. Check for logic correctness, not just style
2. Verify type safety (no `any`, no untyped returns)
3. Confirm error handling is complete
4. Ensure no sensitive data is logged
5. Verify the Permission Manager is used for any new automation
6. Check that new DB queries use ORM, not raw SQL

**Author responsibilities:**
1. Keep PRs focused — one concern per PR
2. Respond to all comments before re-requesting review
3. Do not force-push to shared branches
4. Squash trivial fixup commits before merge

---

## 8. Error Handling Rules

### Python
```python
# CORRECT — use custom exceptions, always log
from app.utils.errors import LunaError, OllamaConnectionError
from app.utils.logger import get_logger

logger = get_logger(__name__)

try:
    result = ollama_client.generate(prompt)
except httpx.ConnectError as e:
    logger.error("Ollama connection failed", error=str(e), model=model_name)
    raise OllamaConnectionError(f"Cannot reach Ollama at {base_url}") from e

# WRONG — never do this
try:
    result = ollama_client.generate(prompt)
except Exception:
    pass  # silently swallowed

# WRONG — never use bare except
except:
    ...
```

**Custom exception hierarchy:**
```
LunaError (base)
├── OllamaConnectionError
├── MemoryEngineError
│   └── FAISSIndexError
├── AutomationError
│   └── PermissionDeniedError
├── DatabaseError
└── RAGError
```

### TypeScript
```typescript
// CORRECT — catch and handle, show user feedback
try {
  const response = await api.sendMessage(content);
} catch (error) {
  console.error('[ChatWindow] Failed to send message:', error);
  showToast('Failed to send message. Is the backend running?', 'error');
}

// WRONG — swallowing errors
try {
  await api.sendMessage(content);
} catch {
  // nothing
}
```

---

## 9. Logging Rules

### Python
```python
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Use structured key=value pairs
logger.info("Memory stored", memory_id=7, importance=0.8, source="conversation")
logger.warning("FAISS index rebuild needed", reason="index file missing")
logger.error("Ollama inference failed", model="qwen2.5:7b", error=str(e))
logger.debug("Context built", token_count=1842, memory_count=5)
```

**Log levels:**
| Level | When |
|-------|------|
| `DEBUG` | Detailed internals (disabled in production) |
| `INFO` | Normal operations (request received, action executed) |
| `WARNING` | Recoverable issues (model fallback, cache miss) |
| `ERROR` | Failures that need attention but don't crash the service |
| `CRITICAL` | System cannot continue (DB unavailable, FAISS corrupt) |

**Never log:**
- User message content (privacy)
- File contents
- System paths with sensitive info
- API responses in full (only metadata)

### TypeScript
```typescript
// Use console levels, prefix with component name
console.log('[ChatWindow] Message rendered');
console.warn('[API] Retry attempt 2/3');
console.error('[useChatStream] SSE connection lost:', error);

// Never log user message content
```

---

## 10. Documentation Rules

### Python Docstrings (Google style)
```python
def retrieve_relevant(query: str, top_k: int = 5) -> list[Memory]:
    """Retrieve the most relevant memories for a given query.

    Uses FAISS for vector similarity search and re-ranks by a
    combined score of semantic distance and recency.

    Args:
        query: The user's input text to search against.
        top_k: Maximum number of memories to return.

    Returns:
        List of Memory objects ordered by relevance score descending.

    Raises:
        FAISSIndexError: If the FAISS index is not loaded.
        DatabaseError: If SQLite connection fails.
    """
```

### TypeScript JSDoc
```typescript
/**
 * Custom hook for consuming SSE chat streams from the backend.
 *
 * @param conversationId - The active conversation UUID
 * @returns Object containing streaming state and control functions
 *
 * @example
 * const { tokens, isStreaming, sendMessage } = useChatStream(conversationId);
 */
const useChatStream = (conversationId: string) => { ... }
```

**Rules:**
- All public Python functions and classes must have docstrings
- All exported TypeScript functions and components must have JSDoc
- Inline comments explain *why*, not *what* the code does
- Do not leave TODO comments in merged code — open a GitHub issue instead

---

## 11. Type Safety Rules

### Python
```python
# CORRECT — full type hints
def embed(self, text: str) -> np.ndarray:

# CORRECT — use Pydantic models for all data transfer
class ChatRequest(BaseModel):
    conversation_id: str | None = None
    content: str
    attachments: list[str] = []

# WRONG — no type hints
def embed(self, text):

# WRONG — raw dicts for data transfer
def get_memory(id: int) -> dict:
```

### TypeScript
```typescript
// tsconfig.json must have strict: true

// CORRECT — explicit types
const sendMessage = async (content: string): Promise<ChatResponse> => { ... }

// WRONG — any type
const sendMessage = async (content: any): Promise<any> => { ... }

// WRONG — implicit any
const handleResponse = (data) => { ... }
```

---

## 12. Security Rules

1. **No secrets in code** — All secrets and config in `.env` files (gitignored)
2. **No user data in logs** — Never log message content, file paths, clipboard data
3. **All automation gated** — `PermissionManager.check_permission()` called before every OS action
4. **No `shell=True`** in subprocess unless absolutely required — use argument lists
5. **No dynamic SQL** — Use SQLAlchemy ORM exclusively
6. **Input validation** — All external input validated by Pydantic before processing
7. **No eval()** — Never use Python `eval()` or JS `eval()`

---

## 13. Testing Rules

### Python (pytest)
- Test file mirrors source: `app/ai/engine.py` → `tests/unit/test_engine.py`
- Test function naming: `test_<function>_<scenario>()`
```python
def test_retrieve_relevant_returns_top_k():
def test_retrieve_relevant_with_empty_index_returns_empty_list():
def test_permission_check_returns_true_for_always_category():
```
- Use `pytest.fixture` for shared setup
- Mock external services (Ollama, filesystem) in unit tests
- Integration tests may use real SQLite (in-memory) but never real Ollama

### TypeScript (Jest + React Testing Library)
- Test file mirrors component: `ChatWindow.tsx` → `ChatWindow.test.tsx`
- Test naming: `describe('<ComponentName>')` → `it('should ...')`
```typescript
describe('ChatWindow', () => {
  it('should render user message bubble', () => { ... });
  it('should display typing indicator while streaming', () => { ... });
});
```

---

*References: [README.md](./README.md) · [TEAM_TASKS.md](./TEAM_TASKS.md) · [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)*
