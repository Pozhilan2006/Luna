# Luna Desktop AI Assistant — Environment Setup Log

This document records the system environment, local AI configurations, package setup commands, problems solved during configuration, and the final environment verification checklist.

---

## Environment Details

* **Operating System:** Windows 11 (Build 10.0.26200)
* **Python Version:** 3.14.4 (64-bit)
* **Ollama Version:** 0.31.1

---

## Installed Models

The following local LLMs have been pulled and verified on the Ollama instance:
* **qwen2.5:7b:** Primary agent orchestrator, planner, and conversation model.
* **phi4-mini:latest:** Secondary lightweight utility, classification, and summarization model.
* **mistral:latest:** Fallback option.

---

## Setup & Installation Commands

Follow these steps to initialize the backend development environment:

1. **Navigate to the Backend Directory:**
   ```powershell
   cd backend
   ```

2. **Create Python Virtual Environment:**
   ```powershell
   python -m venv .venv
   ```

3. **Activate the Virtual Environment:**
   ```powershell
   .venv\Scripts\Activate.ps1
   ```

4. **Install Pinned Dependencies:**
   Ensure all libraries (FastAPI, SQLAlchemy, FAISS, Sentence Transformers) are installed:
   ```powershell
   pip install -r requirements.txt
   ```
   *(If initializing fresh without `requirements.txt`, install manually:)*
   ```powershell
   pip install fastapi uvicorn sqlalchemy alembic faiss-cpu sentence-transformers ollama rich
   ```

5. **Download the Local Embedding Model:**
   The SentenceTransformer package will automatically download the required model files upon first execution:
   ```python
   from sentence_transformers import SentenceTransformer
   model = SentenceTransformer('BAAI/bge-small-en-v1.5')
   ```

---

## Problems & Solutions

### 1. Windows Console Unicode Encoding Error
* **Problem:** Running Python CLI scripts with rich Unicode output (such as `✔` or box-drawing characters `┌`, `─`) inside standard Windows Cmd/PowerShell instances resulted in a crash:
  ```
  UnicodeEncodeError: 'charmap' codec can't encode character '\u2714' in position 0: character maps to <undefined>
  ```
* **Solution:** 
  1. Force `sys.stdout` and `sys.stderr` to use UTF-8 dynamically on startup:
     ```python
     if sys.platform == "win32":
         sys.stdout.reconfigure(encoding="utf-8")
         sys.stderr.reconfigure(encoding="utf-8")
     ```
  2. Implement a self-healing fallback wrapping the verification execution. If a `UnicodeEncodeError` is thrown, the script automatically catches the exception, disables the `rich` visual panels/symbols, and restarts execution in plain ASCII mode.

### 2. FAISS Compilation Failures on Windows
* **Problem:** Installing standard `faiss` from source on Windows frequently fails due to missing compilation tools or CUDA setup errors.
* **Solution:** Install the precompiled CPU-only wheels directly using `pip install faiss-cpu`, which installs instantly and functions perfectly on Windows CPU architectures.

---

## Final Verification Checklist

The development environment is verified active and healthy using the unified validation script:

* [x] **Python version:** Verified Python 3.14.4 (exceeds the 3.11+ requirement).
* [x] **FastAPI & Uvicorn:** Base HTTP libraries are installed and importable.
* [x] **SQLAlchemy:** Database ORM is ready.
* [x] **FAISS Vector DB:** CPU bindings successfully imported and functional.
* [x] **Sentence Transformers:** Installed and importable.
* [x] **Embedding Model:** `BAAI/bge-small-en-v1.5` loaded and verified generating 384-dimension vectors.
* [x] **Ollama CLI:** Executable located on system PATH.
* [x] **Ollama Server:** Local daemon is reachable and responding.
* [x] **Qwen Inference Model:** `qwen2.5:7b` registered and ready.
* [x] **Phi Inference Model:** `phi4-mini:latest` registered and ready.

---

### Verification Execution Command
Run the following single command to re-validate the entire suite:
```powershell
.venv\Scripts\python scripts/environment_check.py
```
