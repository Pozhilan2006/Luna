# Luna Desktop AI Assistant — API Specification

> **Version:** 1.0 · July 2026
> **Base URL:** `http://localhost:8000`
> **Auth:** None (localhost-only service, no external auth required for v1)
> **Content-Type:** `application/json` unless noted
> Reference: [README.md](./README.md) · [DATABASE.md](./DATABASE.md)

---

## Response Envelope

All non-streaming responses follow this envelope:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

On error:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "MEMORY_NOT_FOUND",
    "message": "Memory with id 42 does not exist."
  }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (delete success) |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity (Pydantic error) |
| 500 | Internal Server Error |

---

## 1. Health

### `GET /health`
**Purpose:** Check backend is alive.

**Response 200:**
```json
{
  "status": "healthy",
  "ollama": "connected",
  "database": "connected",
  "faiss": "loaded"
}
```

---

## 2. Chat

### `POST /api/chat/message`
**Purpose:** Send a user message and receive a streaming AI response.

**Request Body:**
```json
{
  "conversation_id": "uuid-or-null",
  "content": "Open Chrome and search for cats",
  "attachments": []
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversation_id` | string (UUID) \| null | No | Null creates a new conversation |
| `content` | string | Yes | User message text |
| `attachments` | array | No | File upload references |

**Response:** `text/event-stream` (SSE)

Each SSE event:
```
data: {"type": "token", "content": "Sure"}
data: {"type": "token", "content": ", let me"}
data: {"type": "done", "conversation_id": "uuid", "message_id": "uuid"}
data: {"type": "error", "message": "Ollama connection failed"}
```

**Status Codes:** 200 (stream begins), 400, 422, 500

---

### `GET /api/conversations`
**Purpose:** List all conversations.

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | int | 20 | Max results |
| `offset` | int | 0 | Pagination offset |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "title": "Planning my week",
        "created_at": "2026-07-06T00:00:00Z",
        "updated_at": "2026-07-06T00:10:00Z",
        "message_count": 12
      }
    ],
    "total": 1
  }
}
```

---

### `POST /api/conversations`
**Purpose:** Create a new conversation.

**Request Body:**
```json
{
  "title": "New Conversation"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Conversation",
    "created_at": "2026-07-06T00:00:00Z"
  }
}
```

---

### `GET /api/conversations/{conversation_id}/messages`
**Purpose:** Fetch all messages for a conversation.

**Path Params:** `conversation_id` (UUID)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "conversation_id": "uuid",
    "messages": [
      {
        "id": "uuid",
        "role": "user",
        "content": "Hello Luna",
        "created_at": "2026-07-06T00:00:00Z",
        "attachments": []
      },
      {
        "id": "uuid",
        "role": "assistant",
        "content": "Hello! How can I help?",
        "created_at": "2026-07-06T00:00:01Z",
        "model_used": "qwen2.5:7b"
      }
    ]
  }
}
```

---

### `PUT /api/conversations/{conversation_id}`
**Purpose:** Update conversation title.

**Request Body:**
```json
{ "title": "Updated Title" }
```

**Response 200:** Updated conversation object.

---

### `DELETE /api/conversations/{conversation_id}`
**Purpose:** Delete a conversation and all its messages.

**Response 204:** No content.

---

## 3. Memory

### `GET /api/memory`
**Purpose:** List all stored memories.

**Query Params:** `limit`, `offset`, `search` (text filter)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "memories": [
      {
        "id": 1,
        "content": "User's name is Alex",
        "source": "conversation",
        "importance": 0.9,
        "created_at": "2026-07-06T00:00:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### `POST /api/memory/search`
**Purpose:** Semantic search over stored memories.

**Request Body:**
```json
{
  "query": "what is my name",
  "top_k": 5
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "memory": { "id": 1, "content": "User's name is Alex" },
        "score": 0.94
      }
    ]
  }
}
```

---

### `DELETE /api/memory/{memory_id}`
**Purpose:** Delete a specific memory and its FAISS vector.

**Response 204:** No content.

---

### `DELETE /api/memory`
**Purpose:** Delete all memories (used by Privacy Dashboard).

**Response 204:** No content.

---

## 4. Automation

### `POST /api/automation/execute`
**Purpose:** Execute a desktop automation action.

**Request Body:**
```json
{
  "action": "open_application",
  "parameters": {
    "name": "chrome"
  },
  "conversation_id": "uuid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action` | string | Yes | Action identifier (see action catalog) |
| `parameters` | object | Yes | Action-specific parameters |
| `conversation_id` | string | No | For audit association |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "status": "executed",
    "result": "Chrome opened successfully.",
    "action_log_id": 42,
    "permission_used": "pre_approved"
  }
}
```

**Response 403 (Permission Denied):**
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "User denied permission for action: open_application"
  }
}
```

---

### Action Catalog

| Action ID | Parameters | Description |
|-----------|-----------|-------------|
| `open_application` | `name: str` | Open a Windows application |
| `close_application` | `name: str` | Close a running application |
| `list_processes` | none | List running processes |
| `create_file` | `path: str, content: str` | Create a file |
| `delete_file` | `path: str` | Delete a file |
| `move_file` | `src: str, dst: str` | Move a file |
| `search_files` | `query: str, directory: str` | Search for files |
| `read_file` | `path: str` | Read file content |
| `open_url` | `url: str` | Open URL in default browser |
| `search_web` | `query: str` | Open web search |
| `take_screenshot` | none | Capture screen |
| `get_clipboard` | none | Read clipboard |
| `set_clipboard` | `text: str` | Write to clipboard |
| `adjust_volume` | `level: int (0-100)` | Set system volume |
| `lock_screen` | none | Lock Windows screen |
| `get_system_info` | none | CPU, RAM, disk stats |

---

### `GET /api/automation/logs`
**Purpose:** Retrieve automation audit log.

**Query Params:** `limit`, `offset`, `action` (filter), `status` (executed/denied)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 42,
        "action": "open_application",
        "parameters": { "name": "chrome" },
        "result": "Chrome opened successfully.",
        "status": "executed",
        "permission_type": "allow_once",
        "user_approved": true,
        "created_at": "2026-07-06T00:05:00Z"
      }
    ],
    "total": 1
  }
}
```

---

## 5. Permissions

### `GET /api/permissions`
**Purpose:** List all permission settings by category.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "permissions": [
      {
        "category": "file_management",
        "display_name": "File Management",
        "status": "ask",
        "description": "Create, delete, and move files on your system."
      },
      {
        "category": "application_control",
        "display_name": "Application Control",
        "status": "always",
        "description": "Open and close applications."
      }
    ]
  }
}
```

Permission `status` values: `always` | `ask` | `never`

---

### `PUT /api/permissions/{category}`
**Purpose:** Update permission status for a category.

**Request Body:**
```json
{ "status": "always" }
```

**Response 200:** Updated permission object.

---

### `GET /api/permissions/pending`
**Purpose:** Frontend polls this to check for pending permission requests.

**Response 200 (pending exists):**
```json
{
  "success": true,
  "data": {
    "pending": {
      "request_id": "uuid",
      "category": "file_management",
      "action": "delete_file",
      "parameters": { "path": "C:/Users/Alex/doc.txt" },
      "risk_level": "high",
      "expires_at": "2026-07-06T00:05:30Z"
    }
  }
}
```

**Response 200 (no pending):**
```json
{ "success": true, "data": { "pending": null } }
```

---

### `POST /api/permissions/respond`
**Purpose:** User responds to a pending permission request.

**Request Body:**
```json
{
  "request_id": "uuid",
  "decision": "allow_once"
}
```

Decision values: `allow_once` | `allow_always` | `deny`

**Response 200:**
```json
{ "success": true, "data": { "processed": true } }
```

---

## 6. Settings

### `GET /api/settings`
**Purpose:** Retrieve all user settings.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "primary_model": "qwen2.5:7b",
      "secondary_model": "phi4:mini",
      "ollama_base_url": "http://localhost:11434",
      "memory_enabled": true,
      "max_memory_context_tokens": 2048,
      "max_conversation_history": 20,
      "system_prompt": "You are Luna, a helpful desktop assistant...",
      "startup_with_system": false,
      "minimize_to_tray": true,
      "hotkey": "ctrl+space",
      "theme": "dark"
    }
  }
}
```

---

### `PUT /api/settings`
**Purpose:** Update one or more settings.

**Request Body:** Partial settings object (any subset of fields).

```json
{
  "primary_model": "qwen2.5:7b",
  "memory_enabled": false
}
```

**Response 200:** Full updated settings object.

---

## 7. Context

### `GET /api/context/desktop`
**Purpose:** Get current desktop context (active window, clipboard snippet).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "active_window": "Visual Studio Code - main.py",
    "clipboard_preview": "def hello_world():",
    "running_processes": ["chrome.exe", "code.exe"],
    "timestamp": "2026-07-06T00:10:00Z"
  }
}
```

---

## 8. RAG (Document Understanding)

### `POST /api/rag/upload`
**Purpose:** Upload and index a document for semantic query.

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `file` | file | Document (PDF, TXT, DOCX, MD) |
| `conversation_id` | string | Associate with conversation |

**Response 201:**
```json
{
  "success": true,
  "data": {
    "file_id": "uuid",
    "filename": "report.pdf",
    "chunk_count": 24,
    "status": "indexed"
  }
}
```

---

### `POST /api/rag/query`
**Purpose:** Query indexed documents semantically.

**Request Body:**
```json
{
  "query": "What are the key findings?",
  "file_id": "uuid",
  "top_k": 5
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "chunk": "The study found that...",
        "score": 0.91,
        "page": 3
      }
    ]
  }
}
```

---

## 9. Models

### `GET /api/models`
**Purpose:** List available Ollama models.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "models": [
      { "name": "qwen2.5:7b", "size": "4.7GB", "available": true },
      { "name": "phi4:mini", "size": "2.5GB", "available": true }
    ]
  }
}
```

---

## 10. Privacy

### `GET /api/privacy/export`
**Purpose:** Export all user data as JSON (GDPR-style).

**Response 200:** `application/json` file download containing all conversations, messages, memories, settings, and action logs.

---

### `DELETE /api/privacy/data`
**Purpose:** Permanently delete all user data.

**Request Body:**
```json
{ "confirm": true }
```

**Response 204:** No content. Clears all tables and FAISS indexes.

---

*References: [DATABASE.md](./DATABASE.md) · [WORKFLOW.md](./WORKFLOW.md)*
