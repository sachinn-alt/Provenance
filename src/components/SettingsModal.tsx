'use client';

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Cpu, 
  Key, 
  ShieldCheck, 
  Check, 
  Sliders, 
  Eye, 
  EyeOff, 
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { AppSettings } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings?: (settings: AppSettings) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  llmProvider: 'gemini',
  apiKey: '',
  ollamaEndpoint: 'http://localhost:11434',
  confidenceThreshold: 90,
  crawlerStrategy: 'auto',
  autoVerifyHighConfidence: true
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveSettings
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('provenance_settings');
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to load settings from localStorage:', e);
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem('provenance_settings', JSON.stringify(settings));
      if (onSaveSettings) onSaveSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('provenance_settings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff4400]/15 border border-[#ff4400]/30 flex items-center justify-center text-[#ff4400]">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                System Engine Settings // BYOK
              </h2>
              <p className="text-xs text-zinc-400">
                Configure extraction models, client-side API keys, and crawler thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Section 1: LLM Reasoning Provider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs text-zinc-300 font-semibold uppercase flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#ff4400]" />
                Extraction Reasoning Engine
              </label>
              <span className="text-[11px] font-mono text-zinc-500">Autonomous DAG Engine</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'gemini', name: 'Google Gemini 1.5 Flash', badge: 'Default', desc: 'Fast, native multimodal & large context' },
                { id: 'openai', name: 'OpenAI GPT-4o / mini', badge: 'Cloud', desc: 'High schema precision & reasoning' },
                { id: 'claude', name: 'Anthropic Claude 3.5', badge: 'Frontier', desc: 'Complex table & anchor fidelity' },
                { id: 'groq', name: 'Groq Llama 3.3 70B', badge: 'Sub-second', desc: 'Ultra-low latency streaming' },
                { id: 'ollama', name: 'Local Ollama Instance', badge: 'Private/Air-gapped', desc: 'Zero data leaves your network' }
              ].map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, llmProvider: provider.id as any }))}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.llmProvider === provider.id
                      ? 'border-[#ff4400] bg-[#ff4400]/10 text-white shadow-[0_0_12px_rgba(255,68,0,0.15)]'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-zinc-200">{provider.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      {provider.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-snug line-clamp-1">{provider.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: API Key Configuration */}
          {settings.llmProvider !== 'ollama' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-zinc-300 font-semibold uppercase flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-[#ff4400]" />
                  {settings.llmProvider.toUpperCase()} API Key (Optional)
                </label>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Stored locally in browser
                </span>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={`Enter your ${settings.llmProvider} API key (sk-...)`}
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#ff4400] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                If left blank, Provenance uses deterministic syntactic parsing with full verbatim citation support.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="font-mono text-xs text-zinc-300 font-semibold uppercase flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-[#ff4400]" />
                Ollama Local Server URL
              </label>
              <input
                type="text"
                value={settings.ollamaEndpoint || 'http://localhost:11434'}
                onChange={(e) => setSettings(prev => ({ ...prev, ollamaEndpoint: e.target.value }))}
                placeholder="http://localhost:11434"
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-[#ff4400]"
              />
            </div>
          )}

          {/* Section 3: Crawler Engine & Fallback Strategy */}
          <div className="space-y-3 pt-2 border-t border-zinc-900">
            <label className="font-mono text-xs text-zinc-300 font-semibold uppercase flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#ff4400]" />
              Web Crawler Engine Strategy
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: 'auto', label: 'Auto (Recommended)', desc: 'Jina Dynamic Headless with Fallback' },
                { id: 'jina', label: 'Jina Gateway Only', desc: 'Strict JS Execution & Anti-WAF' },
                { id: 'cheerio', label: 'Static DOM Only', desc: 'Direct Cheerio HTML parser' }
              ].map((strat) => (
                <button
                  key={strat.id}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, crawlerStrategy: strat.id as any }))}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    settings.crawlerStrategy === strat.id
                      ? 'border-[#ff4400] bg-[#ff4400]/10 text-white'
                      : 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-bold text-[11px] mb-0.5">{strat.label}</div>
                  <div className="text-[10px] text-zinc-500 leading-tight">{strat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Confidence Score Threshold */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <div className="flex items-center justify-between">
              <label className="font-mono text-xs text-zinc-300 font-semibold uppercase flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#ff4400]" />
                Citation Confidence Threshold
              </label>
              <span className="font-mono text-xs text-[#ff4400] font-bold">
                {settings.confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="99"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings(prev => ({ ...prev, confidenceThreshold: Number(e.target.value) }))}
              className="w-full accent-[#ff4400] bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>60% (Permissive)</span>
              <span>85% (Balanced)</span>
              <span>99% (Strict Verbatim)</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/50">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Reset Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#ff4400] hover:bg-[#ff5511] text-white font-mono text-xs font-semibold shadow-lg shadow-[#ff4400]/20 transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Apply Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
