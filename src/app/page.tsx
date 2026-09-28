'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { PromptBar } from '@/components/PromptBar';
import { PipelineDAG } from '@/components/PipelineDAG';
import { ExecutionConsole } from '@/components/ExecutionConsole';
import { DataWorkbench } from '@/components/DataWorkbench';
import { LineageDrawer } from '@/components/LineageDrawer';
import { AnalyticsView } from '@/components/AnalyticsView';
import { HistoryModal } from '@/components/HistoryModal';
import { ExportModal } from '@/components/ExportModal';
import { DeveloperApiModal } from '@/components/DeveloperApiModal';
import { WorkflowRun, CellProvenance, GeneratedSchema } from '@/types';
import { getInitialSeedWorkflow } from '@/lib/workflowStore';
import { Table, BarChart2 } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { DigitalMetalBackdrop } from '@/components/DigitalMetalBackdrop';

const defaultInitialWorkflow = getInitialSeedWorkflow();

export default function Home() {
  const [mode, setMode] = useState<'live' | 'demo'>('demo');
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowRun | null>(defaultInitialWorkflow);
  const [historyWorkflows, setHistoryWorkflows] = useState<WorkflowRun[]>([defaultInitialWorkflow]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'workbench' | 'analytics'>('workbench');
  
  // Modals & Drawers
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [inspectedCell, setInspectedCell] = useState<{
    fieldName: string;
    fieldValue: any;
    provenance?: CellProvenance;
  } | null>(null);

  // Fetch initial workflows on mount
  useEffect(() => {
    fetch('/api/workflows')
      .then(res => res.json())
      .then(data => {
        if (data.workflows && data.workflows.length > 0) {
          setHistoryWorkflows(data.workflows);
          setActiveWorkflow(data.workflows[0]);
        }
      })
      .catch(err => console.error('Failed to load initial workflows:', err));
  }, []);

  // Execute workflow
  const handleExecute = async (prompt: string, customSchema?: GeneratedSchema) => {
    if (isRunning) return;
    setIsRunning(true);

    try {
      // 1. Create workflow via POST
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          mode, 
          customSchema: customSchema || activeWorkflow?.schema 
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create workflow');
      }

      const { workflow } = await res.json();
      setActiveWorkflow(workflow);

      // 2. Connect to Server-Sent Events (SSE) Stream
      const eventSource = new EventSource(`/api/workflows/${workflow.id}/stream`);

      eventSource.addEventListener('step_update', (e) => {
        const step = JSON.parse(e.data);
        setActiveWorkflow((prev) => {
          if (!prev) return null;
          const updatedSteps = prev.steps.map(s => s.id === step.id ? step : s);
          return { ...prev, steps: updatedSteps };
        });
      });

      eventSource.addEventListener('schema_generated', (e) => {
        const schema = JSON.parse(e.data);
        setActiveWorkflow((prev) => {
          if (!prev) return null;
          return { ...prev, schema };
        });
      });

      eventSource.addEventListener('log', (e) => {
        const log = JSON.parse(e.data);
        setActiveWorkflow((prev) => {
          if (!prev) return null;
          return { ...prev, logs: [...prev.logs, log] };
        });
      });

      eventSource.addEventListener('workflow_completed', (e) => {
        const completed = JSON.parse(e.data);
        setActiveWorkflow(completed);
        setIsRunning(false);
        eventSource.close();

        // Refresh history
        fetch('/api/workflows')
          .then(r => r.json())
          .then(d => {
            if (d.workflows) setHistoryWorkflows(d.workflows);
          });
      });

      eventSource.addEventListener('workflow_failed', (e) => {
        const failed = JSON.parse(e.data);
        setActiveWorkflow(failed);
        setIsRunning(false);
        eventSource.close();
      });

      eventSource.onerror = (err) => {
        console.warn('SSE stream closed or interrupted:', err);
        setIsRunning(false);
        eventSource.close();
      };

    } catch (err: any) {
      console.error('Execution error:', err);
      setIsRunning(false);
    }
  };

  const handleInspectCell = (fieldName: string, fieldValue: any, provenance?: CellProvenance) => {
    setInspectedCell({ fieldName, fieldValue, provenance });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] relative overflow-x-hidden selection:bg-[#ff4400] selection:text-white">
      
      {/* Digital Metal Unified Specular Horizon & Monolith Architectural Backdrop */}
      <DigitalMetalBackdrop />

      {/* Header */}
      <Header
        mode={mode}
        onToggleMode={setMode}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenApi={() => setShowApiModal(true)}
        historyCount={historyWorkflows.length}
        hasRecords={Boolean(activeWorkflow && activeWorkflow.records.length > 0)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5 relative z-10">
        
        {/* Teenage Engineering Style Editorial Header Teaser */}
        <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950/80 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="text-[#ff4400] font-bold">[SYS.PROVENANCE // 01]</span>
            <span className="text-zinc-200 uppercase font-semibold tracking-wider">The Anti-Manual Data Engine</span>
            <span className="text-zinc-500 hidden md:inline">• &ldquo;Manual crawling is hell. Verifiable automation is truth.&rdquo;</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
            <span className="text-zinc-400">CITATIONS: 100% VERIFIED</span>
          </div>
        </div>

        {/* Natural Language Prompt Input Bar */}
        <section>
          <PromptBar
            onExecute={handleExecute}
            isRunning={isRunning}
            currentSchema={activeWorkflow?.schema}
            onUpdateSchema={(updatedSchema) => {
              setActiveWorkflow((prev) => prev ? { ...prev, schema: updatedSchema } : null);
            }}
          />
        </section>

        {/* Live Pipeline DAG (Autonomous 6-Stage Graph) */}
        {activeWorkflow && (
          <section>
            <PipelineDAG
              steps={activeWorkflow.steps}
              isRunning={isRunning}
            />
          </section>
        )}

        {/* Live Terminal Execution Console */}
        {activeWorkflow && activeWorkflow.logs.length > 0 && (
          <section>
            <ExecutionConsole
              logs={activeWorkflow.logs}
              isRunning={isRunning}
            />
          </section>
        )}

        {/* Data Workbench & Analytics Tabs */}
        {activeWorkflow && activeWorkflow.records.length > 0 && (
          <section className="space-y-4">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('workbench')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'workbench'
                      ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Table className="w-3.5 h-3.5 text-[#ff4400]" />
                  <span>Data Workbench</span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-300 text-[10px] border border-zinc-700/50">
                    {activeWorkflow.records.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'analytics'
                      ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5 text-[#ff4400]" />
                  <span>Dataset Health & Analytics</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                <span>Click any cell to inspect verbatim citation anchors</span>
              </div>
            </div>

            {/* Tab 1: High Density Data Grid */}
            {activeTab === 'workbench' && (
              <DataWorkbench
                records={activeWorkflow.records}
                schema={activeWorkflow.schema}
                onInspectCell={handleInspectCell}
              />
            )}

            {/* Tab 2: Analytics & Quality Metrics */}
            {activeTab === 'analytics' && (
              <AnalyticsView
                summary={activeWorkflow.summary}
                records={activeWorkflow.records}
                schema={activeWorkflow.schema}
              />
            )}

          </section>
        )}

      </main>

      {/* Industrial Terminal Footer */}
      <Footer
        onOpenApi={() => setShowApiModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        mode={mode}
        totalWorkflows={historyWorkflows.length}
      />

      {/* Lineage & Citation Inspector Drawer */}
      <LineageDrawer
        isOpen={Boolean(inspectedCell)}
        onClose={() => setInspectedCell(null)}
        fieldName={inspectedCell?.fieldName || ''}
        fieldValue={inspectedCell?.fieldValue}
        provenance={inspectedCell?.provenance}
        entityName={activeWorkflow?.schema.entityName || 'Entity'}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        workflows={historyWorkflows}
        onSelectWorkflow={(wf) => setActiveWorkflow(wf)}
        activeWorkflowId={activeWorkflow?.id}
      />

      {/* Export Modal */}
      {activeWorkflow && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          records={activeWorkflow.records}
          schema={activeWorkflow.schema}
        />
      )}

      {/* Developer REST API Modal */}
      <DeveloperApiModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
      />

    </div>
  );
}
