import React from 'react';
import { 
  Bot, 
  BookOpen, 
  Layers, 
  Terminal, 
  Award, 
  SlidersHorizontal, 
  Sparkles,
  Sun,
  Moon,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { RAGConfig } from '../types/rag';

interface HeaderProps {
  activeTab: 'assistant' | 'documents' | 'pipeline' | 'python' | 'quiz';
  setActiveTab: (tab: 'assistant' | 'documents' | 'pipeline' | 'python' | 'quiz') => void;
  config: RAGConfig;
  onOpenConfig: () => void;
  totalDocumentsCount: number;
  totalChunksCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenConfig,
  totalDocumentsCount,
  totalChunksCount,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header
      className={`border-b transition-colors sticky top-0 z-30 backdrop-blur-md ${
        isDark
          ? 'border-slate-800 bg-slate-900/95 text-white shadow-md'
          : 'border-slate-200/90 bg-white/95 text-slate-800 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title: EngineerChatbox */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-2 ring-indigo-100 dark:ring-indigo-900">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                  EngineerChatbox
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-3 h-3" />
                  CSE Branch Only
                </span>
              </div>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Computer Science Academic AI Study Companion
              </p>
            </div>
          </div>

          {/* Center/Quick Stat Pill */}
          <div
            className={`hidden md:flex items-center gap-3 py-1.5 px-3 rounded-full border text-xs font-medium ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalDocumentsCount}</span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>CSE Textbooks</span>
            </div>
            <div className={`w-1 h-3 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">RAG & Hybrid Search</span>
            </div>
          </div>

          {/* Right Actions: Theme Toggle & Settings */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-indigo-700'
              }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Dark</span>
                </>
              )}
            </button>

            {/* Hyperparameters Settings Button */}
            <button
              onClick={onOpenConfig}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs'
              }`}
              title="Tune RAG Search Settings (Top-K, Hybrid Alpha)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Settings</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  isDark ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                }`}
              >
                K={config.topK}
              </span>
            </button>
          </div>
        </div>

        {/* User-friendly Tab Navigation */}
        <div
          className={`flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t no-scrollbar ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'assistant'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chatbot (CSE)</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'documents'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>16 CSE Textbooks</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'pipeline'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>RAG Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('python')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'python'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? isDark
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>CSE Exam Quiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};
