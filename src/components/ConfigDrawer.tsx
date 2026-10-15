import React from 'react';
import { X, Sliders, CheckSquare, Square, Info, ShieldCheck, Zap } from 'lucide-react';
import { RAGConfig, EngineeringDocument } from '../types/rag';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: RAGConfig;
  onChangeConfig: (newConfig: RAGConfig) => void;
  documents: EngineeringDocument[];
  isDark?: boolean;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  documents,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const handleToggleDoc = (docId: string) => {
    let newSelected: string[];
    if (config.selectedDocIds.includes(docId)) {
      newSelected = config.selectedDocIds.filter(id => id !== docId);
    } else {
      newSelected = [...config.selectedDocIds, docId];
    }
    onChangeConfig({ ...config, selectedDocIds: newSelected });
  };

  const handleSelectAll = () => {
    onChangeConfig({ ...config, selectedDocIds: documents.map(d => d.id) });
  };

  const handleDeselectAll = () => {
    onChangeConfig({ ...config, selectedDocIds: [] });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div
        className={`w-full max-w-md h-full flex flex-col shadow-2xl border-l transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Drawer Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              RAG Pipeline Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className={`p-5 overflow-y-auto space-y-6 flex-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {/* Top-K Retrieval */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-white flex items-center gap-1.5">
                <span>Top-K Context Chunks</span>
                <span className="text-xs text-sky-400 font-mono">({config.topK})</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">1 – 10 chunks</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={config.topK}
              onChange={e => onChangeConfig({ ...config, topK: parseInt(e.target.value, 10) })}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Specifies the maximum count of highest-ranked passages injected into the LLM context prompt.
            </p>
          </div>

          {/* Alpha Hybrid Weight */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-white flex items-center gap-1.5">
                <span>Hybrid Search Alpha (α)</span>
                <span className="text-xs text-sky-400 font-mono">({config.alpha.toFixed(2)})</span>
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.alpha}
              onChange={e => onChangeConfig({ ...config, alpha: parseFloat(e.target.value) })}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span className={config.alpha === 0 ? 'text-sky-300 font-semibold' : ''}>0.0 (BM25 Keyword)</span>
              <span className={config.alpha >= 0.6 && config.alpha <= 0.8 ? 'text-emerald-300 font-semibold' : ''}>0.70 (Optimal Hybrid)</span>
              <span className={config.alpha === 1 ? 'text-purple-300 font-semibold' : ''}>1.0 (Dense Vector)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Blends lexical BM25 token frequencies with dense semantic vector cosine similarity.
            </p>
          </div>

          {/* Similarity Score Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-medium text-white flex items-center gap-1.5">
                <span>Min Similarity Threshold</span>
                <span className="text-xs text-sky-400 font-mono">({config.similarityThreshold.toFixed(2)})</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">0.0 – 0.8</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={config.similarityThreshold}
              onChange={e => onChangeConfig({ ...config, similarityThreshold: parseFloat(e.target.value) })}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Discards any passages scoring lower than this relevance cutoff to eliminate low-confidence noise.
            </p>
          </div>

          {/* Chunking Strategy */}
          <div className="space-y-2">
            <label className="font-medium text-white block">Chunking & Tokenizer Strategy</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'recursive', label: 'Recursive', sub: '500 ch / 50 ov' },
                { id: 'semantic', label: 'Semantic', sub: 'Section Header' },
                { id: 'fixed', label: 'Fixed Size', sub: '256 tokens' },
              ].map(strat => (
                <button
                  key={strat.id}
                  onClick={() => onChangeConfig({ ...config, chunkingStrategy: strat.id as any })}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    config.chunkingStrategy === strat.id
                      ? 'border-sky-500 bg-sky-500/10 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-sky-300">{strat.label}</div>
                  <div className="text-[10px] text-slate-400">{strat.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Strict Grounding Toggle */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-medium text-white text-xs">Strict Document Grounding</span>
              </div>
              <button
                onClick={() => onChangeConfig({ ...config, strictGrounding: !config.strictGrounding })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  config.strictGrounding ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    config.strictGrounding ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              When enabled, forces the model to disclaim if a concept is missing in the retrieved documents, preventing speculative extrapolation.
            </p>
          </div>

          {/* Document Scope Filter */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="font-medium text-white text-xs">Corpus Document Filtering</label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleSelectAll}
                  className="text-sky-400 hover:underline cursor-pointer"
                >
                  All ({documents.length})
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={handleDeselectAll}
                  className="text-slate-400 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {documents.map(doc => {
                const isSelected = config.selectedDocIds.length === 0 || config.selectedDocIds.includes(doc.id);
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleToggleDoc(doc.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/80 border border-slate-700/70 text-slate-200'
                        : 'bg-slate-900/40 border border-transparent text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                      <span className="font-mono text-sky-300 font-semibold">{doc.code}</span>
                      <span className="truncate text-slate-300">{doc.title}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      {doc.chunks.length} ch
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <div className="text-[11px] text-slate-400">
            Active: <span className="text-sky-300 font-mono">{config.selectedDocIds.length === 0 ? 'All 16' : `${config.selectedDocIds.length}/16`} Docs</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-medium text-xs transition-colors cursor-pointer"
          >
            Apply Parameters
          </button>
        </div>
      </div>
    </div>
  );
};
