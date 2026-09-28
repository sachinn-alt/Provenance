'use client';

import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Code2, Globe, Cpu, Sparkles } from 'lucide-react';

interface DeveloperApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperApiModal: React.FC<DeveloperApiModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'node'>('curl');
  const [copied, setCopied] = useState(false);

  const curlCode = `# 1. Dispatch Autonomous Workflow
curl -X POST https://provenance-zeta.vercel.app/api/workflows \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Collect top 10 early-stage AI agent startups with founders, funding, and tech stack",
    "mode": "live"
  }'

# Response:
# { "workflow": { "id": "wf-1727488000-abc12", "status": "running", ... } }

# 2. Subscribe to Real-Time SSE Agent Telemetry Stream
curl -N https://provenance-zeta.vercel.app/api/workflows/wf-1727488000-abc12/stream`;

  const pythonCode = `import requests
import json
import sseclient # pip install sseclient-py

BASE_URL = "https://provenance-zeta.vercel.app"

# 1. Initialize Autonomous Pipeline Run
payload = {
    "prompt": "Find top 10 mechanical keyboard switches with tactile force and sound profile",
    "mode": "live" # or "demo" for cached snapshot execution
}
res = requests.post(f"{BASE_URL}/api/workflows", json=payload)
workflow = res.json()["workflow"]
workflow_id = workflow["id"]
print(f"[*] Pipeline initialized: {workflow_id}")

# 2. Listen to Real-Time Telemetry & Lineage Stream
stream_res = requests.get(f"{BASE_URL}/api/workflows/{workflow_id}/stream", stream=True)
client = sseclient.SSEClient(stream_res)

for event in client.events():
    if event.event == "log":
        log_data = json.loads(event.data)
        print(f"[{log_data['phase'].upper()}] {log_data['message']}")
    elif event.event == "workflow_completed":
        final_data = json.loads(event.data)
        print(f"[✓] Published {len(final_data['records'])} verified records with Citation Anchors!")
        break`;

  const nodeCode = `// Dispatch & Stream via Fetch (Node 18+)
const BASE_URL = 'https://provenance-zeta.vercel.app';

async function runAutonomousProvenance() {
  const initRes = await fetch(\`\${BASE_URL}/api/workflows\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Find top 10 FDA cleared AI radiology diagnostic software',
      mode: 'live'
    })
  });
  
  const { workflow } = await initRes.json();
  console.log('Dispatched Workflow:', workflow.id);

  // Connect to SSE Stream
  const eventSource = new EventSource(\`\${BASE_URL}/api/workflows/\${workflow.id}/stream\`);
  
  eventSource.addEventListener('log', (e) => {
    const log = JSON.parse(e.data);
    console.log(\`[\${log.phase}] \${log.message}\`);
  });

  eventSource.addEventListener('workflow_completed', (e) => {
    const completed = JSON.parse(e.data);
    console.log('Records harvested:', completed.records.length);
    eventSource.close();
  });
}

runAutonomousProvenance();`;

  const getCode = () => {
    if (activeTab === 'curl') return curlCode;
    if (activeTab === 'python') return pythonCode;
    return nodeCode;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 text-[#ff4400] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <span>Developer REST API & Headless Execution</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-700">
                  v1.0 Live
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Trigger autonomous multi-agent ETL pipelines from external scripts, crons, or notebooks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:rotate-90 active:scale-90 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Copy Button */}
        <div className="px-5 pt-4 pb-2 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/30">
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-150 active:scale-95 ${
                activeTab === 'curl' 
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              cURL CLI
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-150 active:scale-95 ${
                activeTab === 'python' 
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Python Client
            </button>
            <button
              onClick={() => setActiveTab('node')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'node' 
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Node.js / TS
            </button>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              copied
                ? 'bg-[#ff4400] text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 overflow-x-auto bg-zinc-950 font-mono text-xs leading-relaxed text-zinc-300">
          <pre className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-x-auto text-[11.5px]">
            <code>{getCode()}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#ff4400]" />
            Endpoints: <code className="text-zinc-300">POST /api/workflows</code> &bull; <code className="text-zinc-300">GET /api/workflows/:id/stream</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
