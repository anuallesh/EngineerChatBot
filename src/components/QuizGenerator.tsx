import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  BookOpen, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { EngineeringDocument } from '../types/rag';

interface QuizGeneratorProps {
  documents: EngineeringDocument[];
  isDark?: boolean;
}

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  citation: string;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ documents, isDark = false }) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'default-1',
      question: 'In an Operating System with 4-level paging on an x86-64 architecture, what occurs when a TLB miss takes place and the Present bit in the PTE is 0?',
      options: [
        'The MMU hardware raises a Page Fault interrupt (#PF vector 14), invoking the kernel to swap the page from disk into RAM',
        'The CPU immediately restarts the machine to prevent kernel memory corruption',
        'The process address space is permanently truncated down to 32 bits',
        'The TLB resets its CR3 register and retries the instruction in user mode indefinitely'
      ],
      correctIndex: 0,
      explanation: 'On a TLB miss, the MMU executes a hardware page table walk. If the Present bit in the Page Table Entry is 0, the CPU triggers interrupt vector 14 (#PF: Page Fault), invoking the kernel page fault handler to allocate a free frame and load the page from swap storage.',
      citation: 'CSE-OS-302 (p.82)'
    },
    {
      id: 'default-2',
      question: 'When an insertion causes a leaf node in a B+ Tree of order m to exceed m-1 keys, what mechanism preserves search completeness?',
      options: [
        'The leaf splits at the median key; the split key is copied to the parent while remaining in the leaf node',
        'The tree completely rebalances using AVL single left rotations',
        'The leaf node is discarded and converted into an unindexed heap file',
        'All parent nodes are deleted and rebuilt from root'
      ],
      correctIndex: 0,
      explanation: 'In B+ Trees, all actual data records reside in leaves. During a split, the median split key is copied to the parent while remaining in the leaf to maintain search completeness and sequential linked scans.',
      citation: 'CSE-DS-301 (p.42)'
    },
    {
      id: 'default-3',
      question: 'How does Write-Ahead Logging (WAL) with the Steal/No-Force buffer pool policy guarantee ACID Atomicity and Durability in DBMS?',
      options: [
        'Log records must be flushed to non-volatile disk before the corresponding dirty page can overwrite disk, and all transaction logs must flush before commit confirmation',
        'Transactions only write to volatile RAM and never flush dirty pages until the server reboots',
        'All reader locks are held exclusively until midnight backup schedules execute',
        'Disk sectors are encrypted twice using asymmetric RSA key pairs'
      ],
      correctIndex: 0,
      explanation: 'WAL mandates that any dirty page update in the buffer pool cannot be written to disk before its corresponding WAL log record is persisted, and all transaction log records must be flushed before commit confirmation.',
      citation: 'CSE-DB-303 (p.48)'
    }
  ]);

  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (qId: string, optIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIndex }));
    setRevealedExplanations(prev => ({ ...prev, [qId]: true }));
  };

  const handleGenerateQuestions = async () => {
    const doc = documents.find(d => d.id === selectedDocId) || documents[0];
    if (!doc) return;

    setIsGenerating(true);
    setUserAnswers({});
    setRevealedExplanations({});

    try {
      const chunk = doc.chunks[0];
      const res = await fetch('/api/rag/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: doc.title,
          docCode: doc.code,
          chunkContent: chunk ? chunk.content : doc.summary,
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Quiz generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-3xl border transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200/90 shadow-slate-200/50'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Academic Exam & Practice Problem Generator
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono font-bold">
              Document-Grounded
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Test and verify your conceptual and mathematical understanding with problems derived strictly from active textbooks.
          </p>
        </div>

        {/* Generator Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDocId}
            onChange={e => setSelectedDocId(e.target.value)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs max-w-xs truncate border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Generate New Problems</span>
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctIndex;

          return (
            <div
              key={q.id || idx}
              className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-200/90 shadow-slate-200/50'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 font-mono text-xs font-bold flex items-center justify-center border border-indigo-200">
                    Q{idx + 1}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Source: <span className="text-indigo-600 font-bold">{q.citation}</span>
                  </span>
                </div>
                {isAnswered && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 font-mono ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <p className={`text-sm font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {q.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let optionStyle = isDark
                    ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                    : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300 text-slate-700';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-medium ring-1 ring-emerald-500';
                    } else if (isThisSelected && !isThisCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-800 font-medium ring-1 ring-rose-500';
                    } else {
                      optionStyle = 'opacity-50 border-slate-200';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 text-slate-700 shadow-2xs">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Verified Explanation */}
              {revealedExplanations[q.id] && (
                <div
                  className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-300'
                      : 'bg-indigo-50/60 border-indigo-200 text-slate-800'
                  }`}
                >
                  <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Academic Derivation & Explanation:</span>
                  </div>
                  <p className="leading-relaxed font-serif">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
