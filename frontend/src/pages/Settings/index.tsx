import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settings';
import { Save, Sliders, Shield } from 'lucide-react';
import type { Settings as SettingsType } from '@/types';

/**
 * Settings configuration viewport allowing the user to switch active LLM models,
 * Ollama host URLs, and FastAPI endpoint routes.
 */
export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    theme: 'dark',
    apiUrl: 'http://127.0.0.1:8000',
    defaultModel: 'phi4-mini',
    ollamaHost: 'http://localhost:11434',
  });
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    // Read local settings via IPC Bridge
    settingsService.getSettings().then((loaded) => {
      if (loaded) {
        setSettings(loaded);
      }
    });
  }, []);

  const handleSave = (): void => {
    settingsService.saveSettings(settings).then((res) => {
      if (res.success) {
        setSaveStatus('Configuration saved successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">
          Adjust model configurations and local API server connections.
        </p>
      </div>

      <div className="space-y-4">
        {/* Local LLM Settings Section */}
        <div className="bg-surface border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="font-bold text-sm flex items-center space-x-2 text-text-primary uppercase tracking-wider">
            <Sliders size={16} className="text-accent" />
            <span>Local AI Model</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex flex-col space-y-1.5">
              <label className="text-text-secondary text-xs font-semibold">Active LLM Model</label>
              <select
                value={settings.defaultModel}
                onChange={(e) => setSettings((prev) => ({ ...prev, defaultModel: e.target.value }))}
                className="bg-background border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none text-sm cursor-pointer hover:border-accent/40"
              >
                <option value="phi4-mini">phi4-mini (Default)</option>
                <option value="qwen2.5:7b">qwen2.5:7b</option>
                <option value="llama3:8b">llama3:8b</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-text-secondary text-xs font-semibold">Ollama API Host</label>
              <input
                type="text"
                value={settings.ollamaHost}
                onChange={(e) => setSettings((prev) => ({ ...prev, ollamaHost: e.target.value }))}
                className="bg-background border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Server Connections Settings Section */}
        <div className="bg-surface border border-border p-6 rounded-xl space-y-4 shadow-sm">
          <h3 className="font-bold text-sm flex items-center space-x-2 text-text-primary uppercase tracking-wider">
            <Shield size={16} className="text-accent" />
            <span>Connection Routes</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex flex-col space-y-1.5">
              <label className="text-text-secondary text-xs font-semibold">FastAPI Backend API</label>
              <input
                type="text"
                value={settings.apiUrl}
                onChange={(e) => setSettings((prev) => ({ ...prev, apiUrl: e.target.value }))}
                className="bg-background border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Action button trigger panel */}
        <div className="flex items-center space-x-4 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/80 transition-all cursor-pointer shadow-md"
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>
          {saveStatus && <span className="text-xs text-success font-bold">{saveStatus}</span>}
        </div>
      </div>
    </div>
  );
}
