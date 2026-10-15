import React, { useState } from 'react';
import { INITIAL_DOCUMENTS } from './data/engineeringDocuments';
import { EngineeringDocument, RAGConfig } from './types/rag';
import { Header } from './components/Header';
import { ChatAssistant } from './components/ChatAssistant';
import { DocumentCorpus } from './components/DocumentCorpus';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { PythonStudio } from './components/PythonStudio';
import { QuizGenerator } from './components/QuizGenerator';
import { ConfigDrawer } from './components/ConfigDrawer';

export default function App() {
  const [documents, setDocuments] = useState<EngineeringDocument[]>(INITIAL_DOCUMENTS);
  const [activeTab, setActiveTab] = useState<'assistant' | 'documents' | 'pipeline' | 'python' | 'quiz'>('assistant');
  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);
  const [selectedDocCodeToOpen, setSelectedDocCodeToOpen] = useState<string | null>(null);
  // User-friendly theme by default (false = Friendly Light Mode, true = Dark Focus Mode)
  const [isDark, setIsDark] = useState<boolean>(false);

  const [config, setConfig] = useState<RAGConfig>({
    topK: 4,
    alpha: 0.70,
    similarityThreshold: 0.25,
    chunkingStrategy: 'recursive',
    selectedDocIds: [],
    strictGrounding: true,
  });

  const totalChunksCount = documents.reduce((acc, doc) => acc + doc.chunks.length, 0);

  const handleAddCustomDocument = (newDoc: EngineeringDocument) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleSelectDocFromCorpus = (docCode: string, _pageNumber?: number) => {
    setSelectedDocCodeToOpen(docCode);
    setActiveTab('documents');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDark
          ? 'bg-slate-950 text-slate-100 selection:bg-sky-500/30 selection:text-sky-200'
          : 'bg-[#f8fafc] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-800'
      }`}
    >
      {/* App Header with EngineerChatbox branding and Light/Dark Theme Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenConfig={() => setIsConfigDrawerOpen(true)}
        totalDocumentsCount={documents.length}
        totalChunksCount={totalChunksCount}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'assistant' && (
          <ChatAssistant
            documents={documents}
            config={config}
            onSelectDocFromCorpus={handleSelectDocFromCorpus}
            isDark={isDark}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentCorpus
            documents={documents}
            onAddCustomDocument={handleAddCustomDocument}
            selectedDocCodeToOpen={selectedDocCodeToOpen}
            onClearSelectedDocCode={() => setSelectedDocCodeToOpen(null)}
            isDark={isDark}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineVisualizer config={config} isDark={isDark} />
        )}

        {activeTab === 'python' && (
          <PythonStudio config={config} isDark={isDark} />
        )}

        {activeTab === 'quiz' && (
          <QuizGenerator documents={documents} isDark={isDark} />
        )}
      </main>

      {/* Configuration Drawer */}
      <ConfigDrawer
        isOpen={isConfigDrawerOpen}
        onClose={() => setIsConfigDrawerOpen(false)}
        config={config}
        onChangeConfig={setConfig}
        documents={documents}
        isDark={isDark}
      />
    </div>
  );
}
