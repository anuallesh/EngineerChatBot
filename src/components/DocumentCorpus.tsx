import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  FileText, 
  Upload, 
  Plus, 
  Check, 
  X, 
  ChevronRight, 
  Layers, 
  Sparkles,
  Download,
  Eye,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { EngineeringDocument, DocumentChunk } from '../types/rag';

interface DocumentCorpusProps {
  documents: EngineeringDocument[];
  onAddCustomDocument: (newDoc: EngineeringDocument) => void;
  selectedDocCodeToOpen?: string | null;
  onClearSelectedDocCode?: () => void;
  isDark?: boolean;
}

export const DocumentCorpus: React.FC<DocumentCorpusProps> = ({
  documents,
  onAddCustomDocument,
  selectedDocCodeToOpen,
  onClearSelectedDocCode,
  isDark = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [inspectingDoc, setInspectingDoc] = useState<EngineeringDocument | null>(
    selectedDocCodeToOpen
      ? documents.find(d => d.code === selectedDocCodeToOpen) || null
      : null
  );

  // Custom Document Ingestion Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCode, setCustomCode] = useState('CSE-CUSTOM-01');
  const [customDiscipline, setCustomDiscipline] = useState<EngineeringDocument['discipline']>('Algorithms & Data Structures');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customRawText, setCustomRawText] = useState('');
  const [customChunkSize, setCustomChunkSize] = useState(450);
  const [customOverlap, setCustomOverlap] = useState(50);

  const disciplines = [
    'All',
    'Algorithms & Data Structures',
    'Operating Systems',
    'Database Systems',
    'Computer Networks',
    'Computer Architecture',
    'Theory of Computation',
    'Compiler Design',
    'Distributed Systems',
    'AI & Machine Learning',
    'Cybersecurity',
    'Software Engineering',
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesDiscipline = selectedDiscipline === 'All' || doc.discipline === selectedDiscipline;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDiscipline && matchesSearch;
  });

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customRawText.trim()) return;

    // Split text into chunks using recursive/sliding window
    const words = customRawText.split(/\s+/);
    const chunks: DocumentChunk[] = [];
    const wordsPerChunk = Math.max(40, Math.floor(customChunkSize / 5));
    const overlapWords = Math.max(5, Math.floor(customOverlap / 5));

    let startIndex = 0;
    let chunkIndex = 1;
    let pageNum = 1;

    while (startIndex < words.length) {
      const slice = words.slice(startIndex, startIndex + wordsPerChunk);
      const content = slice.join(' ');
      const keywords = content
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 5)
        .slice(0, 5);

      chunks.push({
        id: `chunk-${customCode}-${chunkIndex}`,
        docId: `doc-${customCode.toLowerCase()}`,
        pageNumber: pageNum,
        sectionTitle: `Section ${chunkIndex}: ${slice.slice(0, 4).join(' ')}...`,
        content,
        tokenCount: Math.round(slice.length * 1.3),
        keywords,
      });

      startIndex += (wordsPerChunk - overlapWords);
      chunkIndex++;
      if (chunkIndex % 3 === 0) pageNum++;
    }

    const newDoc: EngineeringDocument = {
      id: `doc-${Date.now()}`,
      code: customCode.trim() || `ENG-CUST-${Math.floor(Math.random() * 900 + 100)}`,
      title: customTitle.trim(),
      discipline: customDiscipline,
      author: customAuthor.trim() || 'Uploaded Engineering Faculty',
      institution: 'Academic Knowledge Repository',
      year: new Date().getFullYear(),
      pages: pageNum,
      fileSizeMb: Number((customRawText.length / (1024 * 100)).toFixed(2)),
      summary: customRawText.substring(0, 180) + '...',
      tags: ['Custom Ingest', customDiscipline, 'Uploaded Module'],
      chunks,
      customUploaded: true,
    };

    onAddCustomDocument(newDoc);
    setIsUploadOpen(false);
    setCustomTitle('');
    setCustomRawText('');
    setInspectingDoc(newDoc);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors shadow-sm ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              16 Core Computer Science & Engineering (CSE) Textbooks
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
              {documents.length} CSE Textbooks Active
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Pre-indexed vector and lexical knowledge base covering Algorithms, Operating Systems, DBMS, Computer Networks, Architecture, Theory of Computation, Compilers, Distributed Systems, AI/ML, and Security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ingest Custom PDF / Notes</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Discipline pill selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {disciplines.map(disc => (
            <button
              key={disc}
              onClick={() => setSelectedDiscipline(disc)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search titles, authors, keywords..."
            className={`w-full pl-10 pr-4 py-2 rounded-2xl text-xs transition-colors border ${
              isDark
                ? 'bg-slate-800/90 border-slate-700 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
            }`}
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group shadow-sm ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 hover:border-sky-500/40 hover:shadow-lg'
                : 'bg-white border-slate-200/90 hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  {doc.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  {doc.discipline}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h3 className={`font-bold text-sm leading-snug group-hover:text-indigo-600 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {doc.title}
                </h3>
                <p className={`text-xs mt-1 font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {doc.author} • <span className="opacity-80">{doc.institution}</span>
                </p>
              </div>

              {/* Abstract */}
              <p className={`text-xs leading-relaxed line-clamp-3 font-serif ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {doc.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {doc.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                      isDark ? 'bg-slate-800/70 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <div className="flex items-center gap-2">
                <span>{doc.pages} pages</span>
                <span>•</span>
                <span>{doc.chunks.length} chunks</span>
              </div>
              <button
                onClick={() => setInspectingDoc(doc)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-sans text-xs font-bold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Chunks</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Chunk Inspector Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {inspectingDoc.code}
                  </span>
                  <span className="text-xs text-slate-400">
                    {inspectingDoc.discipline} Engineering
                  </span>
                </div>
                <h3 className="font-semibold text-white text-base mt-1">
                  {inspectingDoc.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {inspectingDoc.author} • {inspectingDoc.institution} ({inspectingDoc.year})
                </p>
              </div>
              <button
                onClick={() => {
                  setInspectingDoc(null);
                  if (onClearSelectedDocCode) onClearSelectedDocCode();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Chunks List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-medium text-slate-300">
                  Pre-Indexed Vector Chunks ({inspectingDoc.chunks.length})
                </span>
                <span className="font-mono text-[11px]">
                  Total Tokens: ~{inspectingDoc.chunks.reduce((acc, c) => acc + c.tokenCount, 0)}
                </span>
              </div>

              {inspectingDoc.chunks.map((chunk, idx) => (
                <div
                  key={chunk.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 hover:border-sky-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">
                      {chunk.sectionTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-[10px] border border-sky-800">
                      Page {chunk.pageNumber} • {chunk.tokenCount} tokens
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed font-serif p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
                    "{chunk.content}"
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {chunk.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
              <button
                onClick={() => {
                  setInspectingDoc(null);
                  if (onClearSelectedDocCode) onClearSelectedDocCode();
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Ingestion Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDocument}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-sky-400" />
                <h3 className="font-semibold text-white text-base">
                  Ingest Engineering Document / Lecture Notes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Document Code</label>
                  <input
                    type="text"
                    value={customCode}
                    onChange={e => setCustomCode(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Discipline</label>
                  <select
                    value={customDiscipline}
                    onChange={e => setCustomDiscipline(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    {disciplines.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Aerodynamic Boundary Layers & Shock Wave Theory"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Author / University</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. J. Smith (MIT Aeronautics)"
                  value={customAuthor}
                  onChange={e => setCustomAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              {/* Chunking hyperparameters */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex justify-between">
                    <span>Chunk Size</span>
                    <span className="font-mono text-sky-400">{customChunkSize} chars</span>
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    step="50"
                    value={customChunkSize}
                    onChange={e => setCustomChunkSize(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium flex justify-between">
                    <span>Overlap</span>
                    <span className="font-mono text-sky-400">{customOverlap} chars</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    step="10"
                    value={customOverlap}
                    onChange={e => setCustomOverlap(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Document Text / Technical Notes</label>
                <textarea
                  rows={6}
                  placeholder="Paste textbook excerpts, equations, or lecture transcripts to chunk and index..."
                  value={customRawText}
                  onChange={e => setCustomRawText(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Chunk & Index into RAG</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
