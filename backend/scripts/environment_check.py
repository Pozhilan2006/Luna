#!/usr/bin/env python3
"""
Luna Desktop AI Assistant - Development Environment Verification Script
Verifies Python version, Ollama install, model availability, and critical library imports.
"""

import sys
import shutil
import os
from contextlib import contextmanager
from typing import List, Tuple, Dict, Any

# Fix encoding issues on Windows console by forcing UTF-8 output if possible
if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    if hasattr(sys.stderr, "reconfigure"):
        try:
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass

# Attempt to import rich for advanced terminal visuals
try:
    from rich.console import Console
    from rich.table import Table
    from rich.panel import Panel
    from rich.text import Text
    USE_RICH = True
except ImportError:
    USE_RICH = False

# Console interface abstraction
class SimpleConsole:
    def print(self, *args, **kwargs):
        print(*args, **kwargs)

console = Console() if USE_RICH else SimpleConsole()

@contextmanager
def step_status(label: str):
    """Context manager to show spinners/messages during check execution."""
    if USE_RICH:
        with console.status(f"[bold yellow]{label}...[/bold yellow]"):
            yield
    else:
        # Standard stdout with no newline to indicate progress
        print(f"{label}... ", end="", flush=True)
        yield


def check_python_version() -> Tuple[bool, str]:
    """Verifies that Python 3.11+ is installed."""
    major, minor, micro = sys.version_info[:3]
    version_str = f"{major}.{minor}.{micro}"
    if sys.version_info >= (3, 11):
        return True, f"Python {version_str} (>= 3.11 requirement met)"
    return False, f"Python {version_str} (Requires Python 3.11+)"


def check_import(module_name: str, display_name: str) -> Tuple[bool, str]:
    """Tries to import a package and retrieve its version."""
    try:
        module = __import__(module_name)
        # Attempt standard ways to fetch version
        version = "unknown"
        for attr in ["__version__", "version", "VERSION"]:
            if hasattr(module, attr):
                val = getattr(module, attr)
                if isinstance(val, str):
                    version = val
                    break
                elif isinstance(val, tuple):
                    version = ".".join(map(str, val))
                    break
        return True, f"{display_name} (v{version}) imported successfully"
    except ImportError as e:
        return False, f"Failed to import {display_name}: {str(e)}"


def check_ollama_cli() -> Tuple[bool, str]:
    """Locates the Ollama executable on the system path."""
    path = shutil.which("ollama")
    if path:
        return True, f"Ollama CLI found at: {path}"
    return False, "Ollama CLI not found in system PATH. Is it installed?"


def check_ollama_server() -> Tuple[bool, str, List[str]]:
    """Verifies connection to Ollama server and lists downloaded models."""
    try:
        import ollama
        # Fetch models (raises connection error if server is down)
        model_list = ollama.list()
        models = [m.model for m in model_list.models]
        return True, "Ollama server is reachable and active", models
    except ImportError:
        return False, "Python 'ollama' package is not installed", []
    except Exception as e:
        return False, f"Could not connect to Ollama server. Is the service running? Error: {str(e)}", []


def check_ollama_models(models: List[str]) -> Tuple[bool, str, bool, str]:
    """Verifies Qwen and Phi models are pulled locally."""
    qwen_found = False
    qwen_name = ""
    phi_found = False
    phi_name = ""
    
    for m in models:
        m_lower = m.lower()
        if "qwen" in m_lower:
            qwen_found = True
            qwen_name = m
        if "phi" in m_lower:
            phi_found = True
            phi_name = m
            
    qwen_msg = f"Qwen model found: {qwen_name}" if qwen_found else "Qwen model not found (Expected qwen2.5:7b or similar)"
    phi_msg = f"Phi model found: {phi_name}" if phi_found else "Phi model not found (Expected phi4-mini:latest or similar)"
    
    return qwen_found, qwen_msg, phi_found, phi_msg


def check_embedding_model() -> Tuple[bool, str]:
    """Verifies SentenceTransformer can load the specific embedding model and generate embeddings."""
    try:
        from sentence_transformers import SentenceTransformer
        # Disable tokenizers warning to keep terminal clean
        os.environ["TOKENIZERS_PARALLELISM"] = "false"
        
        # Load local or cache model
        model = SentenceTransformer('BAAI/bge-small-en-v1.5')
        
        # Run brief inference sanity check
        embeddings = model.encode(["Luna Assistant verification query"])
        emb_shape = embeddings.shape
        if len(emb_shape) == 2 and emb_shape[1] == 384:
            return True, f"BAAI/bge-small-en-v1.5 loaded. Shape: {emb_shape} (384-dim)"
        return False, f"Embedding loaded but produced incorrect dimension shape: {emb_shape}"
    except Exception as e:
        return False, f"Failed to load or run embedding model: {str(e)}"


def run_verification():
    # Print Title Header
    if USE_RICH:
        console.print(Panel.fit(
            "[bold purple]Luna Desktop AI Assistant[/bold purple]\n"
            "[bold white]Development Environment Verification[/bold white]",
            border_style="purple",
            subtitle="July 2026",
            subtitle_align="right"
        ))
    else:
        console.print("=" * 70)
        console.print("Luna Desktop AI Assistant - Environment Verification")
        console.print("=" * 70)
        
    results = []
    
    # 1. Python Version Check
    with step_status("Checking Python version"):
        success, msg = check_python_version()
        results.append(("Python Version", ">= 3.11", success, msg))
        if not USE_RICH: print("DONE" if success else "FAILED")
        
    # 2. Library Import Checks
    imports_to_check = [
        ("fastapi", "FastAPI"),
        ("sqlalchemy", "SQLAlchemy"),
        ("faiss", "FAISS Vector DB"),
        ("sentence_transformers", "Sentence Transformers")
    ]
    for mod, label in imports_to_check:
        with step_status(f"Importing {label}"):
            success, msg = check_import(mod, label)
            results.append((label, "Importable", success, msg))
            if not USE_RICH: print("DONE" if success else "FAILED")
            
    # 3. Ollama CLI
    with step_status("Locating Ollama CLI"):
        success, msg = check_ollama_cli()
        results.append(("Ollama CLI", "Installed", success, msg))
        if not USE_RICH: print("DONE" if success else "FAILED")
        
    # 4. Ollama Server & Models Check
    server_success = False
    models = []
    with step_status("Connecting to Ollama server"):
        server_success, msg, models = check_ollama_server()
        results.append(("Ollama Server", "Reachable", server_success, msg))
        if not USE_RICH: print("DONE" if server_success else "FAILED")
        
    if server_success:
        with step_status("Validating Ollama models"):
            qwen_ok, qwen_msg, phi_ok, phi_msg = check_ollama_models(models)
            results.append(("Qwen Model", "Downloaded", qwen_ok, qwen_msg))
            results.append(("Phi Model", "Downloaded", phi_ok, phi_msg))
            if not USE_RICH: print("DONE")
    else:
        results.append(("Qwen Model", "Downloaded", False, "Skipped - Ollama server unreachable"))
        results.append(("Phi Model", "Downloaded", False, "Skipped - Ollama server unreachable"))
        
    # 5. Embedding Model Load & Encode
    with step_status("Loading BAAI/bge-small-en-v1.5 model"):
        success, msg = check_embedding_model()
        results.append(("Embedding Model", "Load & Encode", success, msg))
        if not USE_RICH: print("DONE" if success else "FAILED")
        
    console.print()
    
    # Display final results board
    if USE_RICH:
        table = Table(title="Environment Verification Results", title_justify="left", show_header=True, header_style="bold cyan")
        table.add_column("Component", style="bold white", width=25)
        table.add_column("Requirement", style="dim", width=15)
        table.add_column("Status", justify="center", width=12)
        table.add_column("Details/Message", width=55)
        
        all_passed = True
        for comp, req, success, msg in results:
            if success:
                status_str = "[bold green]PASSED[/bold green]"
            else:
                status_str = "[bold red]FAILED[/bold red]"
                all_passed = False
            table.add_row(comp, req, status_str, msg)
            
        console.print(table)
        console.print()
        
        if all_passed:
            console.print(Panel(
                "[bold green]✔ ALL CHECKS PASSED: Your development environment is fully operational and ready![/bold green]",
                border_style="green"
            ))
            sys.exit(0)
        else:
            console.print(Panel(
                "[bold red]✘ CHECKS FAILED: Please fix the issues highlighted in red before starting Luna.[/bold red]",
                border_style="red"
            ))
            sys.exit(1)
    else:
        # Fallback text representation
        all_passed = True
        console.print(f"{'Component':<25} | {'Requirement':<15} | {'Status':<8} | Details")
        console.print("-" * 110)
        for comp, req, success, msg in results:
            status_str = "PASSED" if success else "FAILED"
            if not success:
                all_passed = False
            console.print(f"{comp:<25} | {req:<15} | {status_str:<8} | {msg}")
            
        console.print()
        if all_passed:
            console.print("✔ ALL CHECKS PASSED: Your development environment is fully operational and ready!")
            sys.exit(0)
        else:
            console.print("✘ CHECKS FAILED: Please fix the issues highlighted above before starting Luna.")
            sys.exit(1)


if __name__ == "__main__":
    try:
        run_verification()
    except UnicodeEncodeError:
        # Self-healing fallback if terminal encoding does not support Unicode / rich output symbols
        USE_RICH = False
        console = SimpleConsole()
        run_verification()
