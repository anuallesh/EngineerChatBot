import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Clock, 
  Database, 
  ChevronRight, 
  Copy, 
  Check, 
  Code2, 
  BookOpen, 
  HelpCircle,
  Binary,
  Cpu,
  Globe,
  Shield,
  Layers,
  Terminal,
  RefreshCw,
  Search,
  Bot,
  User,
  GraduationCap,
  Trash2,
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  X,
  FileText,
  Dices,
  BookMarked
} from 'lucide-react';
import { 
  AssistantMessage, 
  EngineeringDocument, 
  RAGConfig, 
  RetrievalResult, 
  DocumentChunk 
} from '../types/rag';
import { executeHybridRetrieval, extractCitations } from '../lib/ragEngine';
import { FormattedText } from '../utils/formatters';

interface ChatAssistantProps {
  documents: EngineeringDocument[];
  config: RAGConfig;
  onSelectDocFromCorpus: (docCode: string, pageNumber?: number) => void;
  isDark?: boolean;
}

// 8 Core CSE Subjects with high-yield exam & interview questions
const CSE_SUBJECTS = [
  {
    id: 'all',
    label: 'All CSE Subjects',
    icon: GraduationCap,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-800 dark:text-indigo-400',
    sampleQuestions: [
      'How does a B+ Tree node split during insertion, and why are all data pointers restricted to leaf nodes?',
      'Compare Process vs Thread memory layouts and explain what occurs during an OS context switch.',
      'How does Write-Ahead Logging (WAL) with the Steal/No-Force policy guarantee ACID Durability in DBMS?',
      'Explain the TCP 3-way handshake and describe how AIMD congestion control adjusts cwnd.',
    ]
  },
  {
    id: 'dsa',
    label: 'Algorithms & Data Structures',
    icon: Binary,
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400',
    sampleQuestions: [
      'How does a B+ Tree node split during insertion, and why are leaf nodes organized in a doubly-linked list?',
      'Explain the 5 invariants of Red-Black Trees and why tree height is guaranteed bounded to 2*log2(N+1).',
      'Explain Dijkstra single-source shortest path algorithm and its time complexity with a Fibonacci heap.',
      'What is Bellman’s Principle of Optimality in Dynamic Programming, and how does memoization differ from tabulation?'
    ]
  },
  {
    id: 'os',
    label: 'Operating Systems',
    icon: Terminal,
    badgeColor: 'bg-sky-500/10 text-sky-600 border-sky-200 dark:border-sky-800 dark:text-sky-400',
    sampleQuestions: [
      'Compare Process vs Thread memory layouts and explain what occurs during an OS context switch.',
      'Explain Multi-Level Paging, Translation Lookaside Buffers (TLB), and how the CPU handles page faults.',
      'What are the 4 Coffman conditions for Deadlock, and how does Dijkstra’s Banker’s algorithm prevent them?',
      'Explain how counting semaphores and mutexes prevent race conditions in critical sections.'
    ]
  },
  {
    id: 'dbms',
    label: 'Database Systems (DBMS)',
    icon: Database,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400',
    sampleQuestions: [
      'How does Write-Ahead Logging (WAL) with the Steal/No-Force policy guarantee ACID Durability in DBMS?',
      'Explain the 3 phases of ARIES Crash Recovery: Analysis, Redo, and Undo with CLRs.',
      'Compare Strict Two-Phase Locking (Strict 2PL) with Multi-Version Concurrency Control (MVCC).',
      'What is BCNF (Boyce-Codd Normal Form) and how does it eliminate update anomalies compared to 3NF?'
    ]
  },
  {
    id: 'networks',
    label: 'Computer Networks',
    icon: Globe,
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-200 dark:border-violet-800 dark:text-violet-400',
    sampleQuestions: [
      'Explain the TCP 3-way handshake and describe how AIMD congestion control adjusts cwnd.',
      'How does hierarchical DNS resolution work across Root, TLD, and Authoritative name servers?',
      'Explain the differences between IPv4 subnetting, CIDR notation, and OSPF link-state routing.'
    ]
  },
  {
    id: 'arch',
    label: 'Computer Architecture',
    icon: Cpu,
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-800 dark:text-amber-400',
    sampleQuestions: [
      'Explain the 5 stages of the RISC-V pipeline and how Read-After-Write (RAW) data hazards are resolved with forwarding.',
      'How does dynamic 2-bit saturating counter branch prediction prevent control hazard pipeline stalls?',
      'Explain cache coherence and the 4 states of the MESI snooping protocol (Modified, Exclusive, Shared, Invalid).'
    ]
  },
  {
    id: 'toc',
    label: 'Theory of Computation',
    icon: Layers,
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200 dark:border-fuchsia-800 dark:text-fuchsia-400',
    sampleQuestions: [
      'Explain the Rabin-Scott Subset Construction theorem converting an NFA to an equivalent DFA.',
      'How did Alan Turing prove that the Halting Problem is undecidable using proof by diagonalization?',
      'Explain the complexity classes P, NP, and the Cook-Levin theorem proving 3-SAT is NP-Complete.'
    ]
  },
  {
    id: 'aiml',
    label: 'AI & Machine Learning',
    icon: Sparkles,
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-800 dark:text-rose-400',
    sampleQuestions: [
      'Explain the Scaled Dot-Product Self-Attention mechanism in Transformers with Query, Key, and Value matrices.',
      'How does Backpropagation compute loss gradients with the chain rule across deep neural network layers?',
      'Explain the Minimax adversarial game search algorithm and how Alpha-Beta pruning doubles search depth.'
    ]
  },
  {
    id: 'security',
    label: 'Cybersecurity & Crypto',
    icon: Shield,
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-200 dark:border-teal-800 dark:text-teal-400',
    sampleQuestions: [
      'Explain the mathematical foundation of RSA public-key encryption using Euler totient and modular inverses.',
      'Explain Diffie-Hellman Key Exchange and how discrete logarithms prevent eavesdroppers from computing the shared secret.',
      'What are SQL Injection attacks and how do Prepared Statements / Parameterized Queries prevent them?'
    ]
  }
];

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  documents,
  config,
  onSelectDocFromCorpus,
  isDark = false,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### 👋 Welcome to EngineerChatbox (CSE Edition)!

I am your friendly, dedicated AI study companion focusing **exclusively on Computer Science & Engineering (CSE)**.
I am powered by a **Retrieval-Augmented Generation (RAG)** pipeline grounded in **16 core CSE textbooks & technical references** covering:

- **Algorithms & Data Structures** (B+ Trees, Red-Black Trees, Dijkstra, Dynamic Programming)
- **Operating Systems** (Process & Thread memory, Paging & TLB, Deadlocks, Semaphores)
- **Database Management Systems** (B+ Tree Indexes, WAL & ACID, ARIES Recovery, 2PL & MVCC)
- **Computer Networks** (TCP 3-Way Handshake, AIMD Congestion Control, DNS, TLS)
- **Computer Architecture** (RISC-V 5-stage pipeline, RAW hazards, MESI cache coherence)
- **Theory of Computation** (DFA/NFA equivalence, Halting problem, Cook-Levin NP-Completeness)
- **Distributed Systems** (Raft consensus, CAP theorem, Paxos)
- **AI, ML & Transformers** (Self-Attention, Backpropagation, Minimax)
- **Cybersecurity & Cryptography** (RSA encryption, Diffie-Hellman, SHA-256)

Every answer includes **numbered citations [1], [2]** linking directly to the textbook page and passage. Click any subject chip below or ask any question to get started!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Source chunk inspector modal state
  const [inspectorResult, setInspectorResult] = useState<RetrievalResult | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Telemetry drawer state for power inspection
  const [expandedTelemetryMsgId, setExpandedTelemetryMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (overrideQuery?: string) => {
    const text = (overrideQuery || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!overrideQuery) {
      setInputQuery('');
    }
    setIsLoading(true);
    setLoadingStep('Searching 16 Computer Science textbooks using BM25 & semantic similarity...');

    try {
      const { results: retrievedResults, latencyMs: retrievalMs } = executeHybridRetrieval(text, documents, config);

      setLoadingStep(`Retrieved ${retrievedResults.length} relevant CSE textbook passages. Synthesizing grounded answer...`);
      const citations = extractCitations(retrievedResults);

      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          retrievedResults,
          config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: AssistantMessage = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'Unable to generate response from the active CSE documents.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations,
        retrievedResults,
        telemetry: {
          retrievalLatencyMs: retrievalMs,
          rerankingLatencyMs: 6,
          generationLatencyMs: data.telemetry?.generationLatencyMs || 220,
          totalLatencyMs: retrievalMs + (data.telemetry?.generationLatencyMs || 220) + 6,
          evaluatedChunksCount: documents.reduce((acc, d) => acc + d.chunks.length, 0),
          retrievedChunksCount: retrievedResults.length,
          promptTokens: data.telemetry?.promptTokens || 340,
          completionTokens: data.telemetry?.completionTokens || 210,
          model: data.model || 'gemini-3.8-flash',
        },
        assembledPrompt: data.assembledPrompt,
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (retrievedResults.length > 0) {
        setInspectorResult(retrievedResults[0]);
      }
    } catch (err: any) {
      console.error('Error during RAG query:', err);
      const errorMessage: AssistantMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Notice\n\nI was unable to retrieve matching passages: \`${err.message || 'Network error'}\`.\n\nPlease try asking a core Computer Science & Engineering question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `### 🧹 Chat cleared!
I'm ready for your next Computer Science & Engineering question. Pick a subject below or type any question!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleRandomQuestion = () => {
    const activeSubject = CSE_SUBJECTS.find(s => s.id === selectedSubjectId) || CSE_SUBJECTS[0];
    const randomIndex = Math.floor(Math.random() * activeSubject.sampleQuestions.length);
    const chosenQ = activeSubject.sampleQuestions[randomIndex];
    setInputQuery(chosenQ);
    inputRef.current?.focus();
  };

  const handleCitationClick = (
    docCode: string,
    pageNumber: number,
    chunkId?: string,
    sourceNumber?: number
  ) => {
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.retrievedResults);
    if (lastAssistantMsg && lastAssistantMsg.retrievedResults) {
      let match: RetrievalResult | undefined;
      if (sourceNumber && lastAssistantMsg.retrievedResults[sourceNumber - 1]) {
        match = lastAssistantMsg.retrievedResults[sourceNumber - 1];
      } else if (chunkId) {
        match = lastAssistantMsg.retrievedResults.find(r => r.chunk.id === chunkId);
      } else {
        match = lastAssistantMsg.retrievedResults.find(
          r => r.docCode === docCode && (pageNumber ? r.chunk.pageNumber === pageNumber : true)
        );
      }
      if (match) {
        setInspectorResult(match);
        setIsInspectorOpen(true);
        return;
      }
    }

    // Fallback: search within loaded documents
    for (const doc of documents) {
      if (doc.code === docCode || doc.id === docCode) {
        const chunk = chunkId 
          ? doc.chunks.find(c => c.id === chunkId)
          : doc.chunks.find(c => c.pageNumber === pageNumber) || doc.chunks[0];
        if (chunk) {
          setInspectorResult({
            chunk,
            docCode: doc.code,
            docTitle: doc.title,
            bm25Score: 0.9,
            denseScore: 0.9,
            hybridScore: 0.9,
            similarityScore: 0.9,
            rank: sourceNumber || 1,
          });
          setIsInspectorOpen(true);
          return;
        }
      }
    }
  };

  const currentSubjectObj = CSE_SUBJECTS.find(s => s.id === selectedSubjectId) || CSE_SUBJECTS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[640px] max-w-5xl mx-auto">
      {/* Main Chatbot Window */}
      <div
        className={`flex-1 flex flex-col rounded-3xl border shadow-lg overflow-hidden transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-indigo-500/5'
        }`}
      >
        {/* Chatbot Top Bar */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/80'
          }`}
        >
          {/* Assistant Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-sm sm:text-base tracking-tight">
                  EngineerChatbox
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  CSE Active
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                16 CSE Textbooks • RAG Grounded • Numbered Citations
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomQuestion}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300'
                  : 'bg-white hover:bg-indigo-50 border-slate-200 text-indigo-700 shadow-2xs'
              }`}
              title="Pick a random CSE exam question"
            >
              <Dices className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Random CSE Question</span>
            </button>

            <button
              onClick={handleClearChat}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-red-950/40 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-800'
                  : 'bg-white hover:bg-red-50 border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 shadow-2xs'
              }`}
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CSE Subject Filter Chips Bar */}
        <div
          className={`px-4 sm:px-6 py-2.5 border-b overflow-x-auto flex items-center gap-1.5 no-scrollbar ${
            isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/40'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-indigo-500" />
            Subject:
          </span>
          {CSE_SUBJECTS.map(subj => {
            const Icon = subj.icon;
            const isSelected = selectedSubjectId === subj.id;
            return (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs scale-102'
                    : isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{subj.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 sm:gap-4 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Bot Avatar */}
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-100 dark:ring-indigo-900">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 transition-all text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/20'
                    : isDark
                    ? 'bg-slate-800/80 border border-slate-700/80 text-slate-100 shadow-sm'
                    : 'bg-white border border-slate-200/80 text-slate-800 shadow-sm'
                }`}
              >
                {/* Message Header */}
                <div
                  className={`flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b text-xs ${
                    msg.role === 'user'
                      ? 'border-white/20'
                      : isDark
                      ? 'border-slate-700/80'
                      : 'border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        CSE Student
                      </span>
                    ) : (
                      <span className="font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <Bot className="w-4 h-4" />
                        EngineerChatbox (CSE)
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-2 font-mono text-[11px] ${
                      msg.role === 'user'
                        ? 'text-white/80'
                        : isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className={`p-1 rounded-md transition-colors cursor-pointer ${
                          isDark ? 'hover:bg-slate-700 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                {msg.role === 'user' ? (
                  <p className="font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <>
                    <FormattedText
                      text={msg.content}
                      retrievedResults={msg.retrievedResults}
                      citations={msg.citations}
                      onCitationClick={handleCitationClick}
                      isDark={isDark}
                    />

                    {/* Verified CSE Sources Card List */}
                    {msg.retrievedResults && msg.retrievedResults.length > 0 && (
                      <div
                        className={`mt-4 pt-3.5 border-t space-y-2.5 ${
                          isDark ? 'border-slate-700/80' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Verified CSE Textbook Sources ({msg.retrievedResults.length} passages)</span>
                          </span>
                          <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Click any source to inspect excerpt
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.retrievedResults.map((r, rIdx) => {
                            const sourceNum = rIdx + 1;
                            const isSelected = inspectorResult?.chunk.id === r.chunk.id;
                            return (
                              <button
                                key={r.chunk.id}
                                onClick={() => {
                                  setInspectorResult(r);
                                  setIsInspectorOpen(true);
                                }}
                                className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                                  isSelected
                                    ? 'bg-indigo-50 border-indigo-400 text-slate-900 ring-2 ring-indigo-400/30 shadow-xs dark:bg-indigo-950/60 dark:border-indigo-600 dark:text-slate-100'
                                    : isDark
                                    ? 'bg-slate-900/60 hover:bg-slate-900 border-slate-700/70 text-slate-300'
                                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded-md font-mono text-[11px] font-black bg-indigo-600 text-white">
                                      [{sourceNum}]
                                    </span>
                                    <span className="font-mono font-bold text-[11px] text-indigo-700 dark:text-indigo-300">
                                      {r.docCode}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      p.{r.chunk.pageNumber}
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
                                    {(r.hybridScore * 100).toFixed(0)}% match
                                  </span>
                                </div>
                                <p className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {r.chunk.sectionTitle}
                                </p>
                                <p className={`text-[10px] line-clamp-1 italic font-serif ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  "{r.chunk.content}"
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Unobtrusive Collapsible Telemetry */}
                    {msg.telemetry && (
                      <div className="mt-3 pt-2 text-[10px] font-mono text-slate-400">
                        <button
                          onClick={() => setExpandedTelemetryMsgId(expandedTelemetryMsgId === msg.id ? null : msg.id)}
                          className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors cursor-pointer"
                        >
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <span>Generated in {msg.telemetry.totalLatencyMs}ms ({msg.telemetry.retrievalLatencyMs}ms retrieval)</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="underline decoration-dotted">
                            {expandedTelemetryMsgId === msg.id ? 'Hide RAG details' : 'Show RAG details'}
                          </span>
                        </button>

                        {expandedTelemetryMsgId === msg.id && (
                          <div className={`mt-2 p-2.5 rounded-xl border text-[11px] space-y-1 ${
                            isDark ? 'bg-slate-900/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}>
                            <div className="flex justify-between">
                              <span>Model:</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{msg.telemetry.model}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Evaluated Chunks:</span>
                              <span>{msg.telemetry.evaluatedChunksCount} total across 16 CSE books</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Retrieved Top-K Chunks:</span>
                              <span>{msg.telemetry.retrievedChunksCount} passages</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tokens:</span>
                              <span>~{msg.telemetry.promptTokens} prompt / ~{msg.telemetry.completionTokens} completion</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Animation */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div
                className={`border rounded-3xl p-4 sm:p-5 max-w-lg space-y-2.5 shadow-sm ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Searching CSE Knowledge Base...</span>
                </div>
                <p className="text-xs text-slate-500 font-mono animate-pulse">{loadingStep}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 h-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* High-yield Sample Questions Bar for Selected Subject */}
        <div
          className={`px-4 sm:px-6 py-2.5 border-t transition-colors ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recommended {currentSubjectObj.label} Queries:</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to ask instantly</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {currentSubjectObj.sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all hover:scale-101 cursor-pointer shrink-0 shadow-2xs ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-indigo-300'
                    : 'bg-white hover:bg-indigo-50 border-slate-200 text-slate-700 hover:text-indigo-700'
                }`}
                title={q}
              >
                {q.length > 55 ? `${q.substring(0, 52)}...` : q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div
          className={`p-3 sm:p-4 border-t transition-colors ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200/80 bg-white'
          }`}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2.5"
          >
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                rows={2}
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask EngineerChatbox any Computer Science question (e.g. 'Explain B+ Tree splits' or 'Virtual Memory Paging')..."
                disabled={isLoading}
                className={`w-full p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm resize-none transition-all disabled:opacity-50 border ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="h-13 sm:h-14 px-5 sm:px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed shadow-md shadow-indigo-600/25 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask Question</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Grounded strictly in 16 core Computer Science & Engineering textbooks
            </span>
            <span className="hidden sm:inline">Enter ↵ to send • Shift+Enter for new line</span>
          </div>
        </div>
      </div>

      {/* Slide-over Textbook Chunk Inspector Modal */}
      {isInspectorOpen && inspectorResult && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg h-full flex flex-col shadow-2xl border-l transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm">
                  CSE Textbook Inspector [Passage #{inspectorResult.rank}]
                </h3>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-xs">
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                    {inspectorResult.docCode}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {(inspectorResult.hybridScore * 100).toFixed(1)}% match
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {inspectorResult.chunk.sectionTitle}
                  </h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {inspectorResult.docTitle} • Page {inspectorResult.chunk.pageNumber}
                  </p>
                </div>

                {/* Score breakdown */}
                <div
                  className={`p-3 rounded-xl border space-y-1 font-mono text-[11px] ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <span>Dense Semantic Cosine:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{inspectorResult.denseScore.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BM25 Keyword Norm:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{inspectorResult.bm25Score.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1 font-bold">
                    <span>Hybrid Fusion Score:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{inspectorResult.hybridScore.toFixed(3)}</span>
                  </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1">
                  {inspectorResult.chunk.keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exact Chunk Content */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Exact Textbook Passage
                </span>
                <div
                  className={`p-4 rounded-2xl border font-serif text-sm leading-relaxed ${
                    isDark ? 'bg-slate-800/40 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  "{inspectorResult.chunk.content}"
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectDocFromCorpus(inspectorResult.docCode, inspectorResult.chunk.pageNumber);
                    setIsInspectorOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in 16 CSE Textbooks Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
