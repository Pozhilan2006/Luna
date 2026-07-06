import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { electronService } from '@/services/electron';
import { ShieldCheck, Cpu, Database, Terminal } from 'lucide-react';

/**
 * Main application dashboard rendering system specs, backend connectivity,
 * and cognitive model statuses.
 */
export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('loading...');
  const [sysInfo, setSysInfo] = useState<{ platform: string; arch: string; nodeVersion: string } | null>(null);

  useEffect(() => {
    // Probe Backend Connection
    apiService.checkHealth().then((isHealthy) => {
      setBackendStatus(isHealthy ? 'ONLINE' : 'OFFLINE');
    });

    // Query OS Platform via Preload Context Bridge
    electronService.getSystemInfo().then((info) => {
      setSysInfo(info);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-pink-400">
          Luna Assistant Dashboard
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Scaffolded private AI desktop assistant container.
        </p>
      </div>

      {/* Connectivity and Node Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FastAPI Status Card */}
        <div className="bg-surface border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
              <Database size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">FastAPI Endpoint</h3>
              <p className="text-xs text-text-secondary">Core Service link</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus === 'ONLINE' ? 'bg-success animate-pulse' : 'bg-danger'
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider">{backendStatus}</span>
          </div>
        </div>

        {/* Ollama LLM Status Card */}
        <div className="bg-surface border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ollama Local LLM</h3>
              <p className="text-xs text-text-secondary">Model Processor</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider">ACTIVE</span>
          </div>
        </div>

        {/* Cognitive Memory Status Card */}
        <div className="bg-surface border border-border p-5 rounded-xl flex flex-col justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-accent/10 rounded-lg text-accent">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Local Memory</h3>
              <p className="text-xs text-text-secondary">FAISS Index / Embeddings</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-success" />
            <span className="text-xs font-semibold uppercase tracking-wider">READY</span>
          </div>
        </div>
      </div>

      {/* System Diagnostic Information */}
      {sysInfo && (
        <div className="bg-surface border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold flex items-center space-x-2 text-text-primary uppercase tracking-wider">
            <Terminal size={16} className="text-accent" />
            <span>Diagnostics Output</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-t border-border pt-4">
            <div>
              <span className="text-text-secondary font-semibold">OS Platform:</span>
              <span className="ml-2 font-mono text-accent capitalize">{sysInfo.platform}</span>
            </div>
            <div>
              <span className="text-text-secondary font-semibold">Architecture:</span>
              <span className="ml-2 font-mono text-accent uppercase">{sysInfo.arch}</span>
            </div>
            <div>
              <span className="text-text-secondary font-semibold">Node.js Engine:</span>
              <span className="ml-2 font-mono text-accent">{sysInfo.nodeVersion}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
