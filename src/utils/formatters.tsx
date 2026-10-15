import React, { useState } from 'react';
import { RetrievalResult, CitationReference } from '../types/rag';

interface FormattedTextProps {
  text: string;
  retrievedResults?: RetrievalResult[];
  citations?: CitationReference[];
  onCitationClick?: (docCode: string, pageNumber: number, chunkId?: string, sourceNumber?: number) => void;
  isDark?: boolean;
}

export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  retrievedResults,
  citations,
  onCitationClick,
  isDark = false,
}) => {
  const lines = text.split('\n');

  return (
    <div className={`space-y-2 text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className={`text-base font-bold mt-4 mb-2 flex items-center gap-2 ${
                isDark ? 'text-sky-300' : 'text-indigo-700'
              }`}
            >
              <span className={`w-1.5 h-4 rounded-full inline-block ${isDark ? 'bg-sky-400' : 'bg-indigo-600'}`}></span>
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={idx}
              className={`text-sm font-bold mt-3 mb-1 ${
                isDark ? 'text-indigo-300' : 'text-slate-900'
              }`}
            >
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className={`border-l-3 px-3.5 py-2 rounded-r-lg text-xs italic my-2.5 ${
                isDark
                  ? 'border-sky-500/60 bg-sky-950/20 text-sky-200'
                  : 'border-indigo-500 bg-indigo-50/70 text-slate-700'
              }`}
            >
              {renderInlineElements(trimmed.replace('> ', ''), retrievedResults, citations, onCitationClick, isDark)}
            </blockquote>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <li key={idx} className={`ml-4 list-disc pl-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {renderInlineElements(trimmed.substring(2), retrievedResults, citations, onCitationClick, isDark)}
            </li>
          );
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s/, '');
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-1">
              <span
                className={`text-xs font-mono shrink-0 font-bold ${
                  isDark ? 'text-sky-400' : 'text-indigo-600'
                }`}
              >
                {trimmed.match(/^\d+\./)?.[0]}
              </span>
              <span>{renderInlineElements(content, retrievedResults, citations, onCitationClick, isDark)}</span>
            </div>
          );
        }

        if (trimmed === '') {
          return <div key={idx} className="h-1.5" />;
        }

        return <p key={idx}>{renderInlineElements(line, retrievedResults, citations, onCitationClick, isDark)}</p>;
      })}
    </div>
  );
};

// Process inline markdown: **bold**, `code/math`, and numbered citations:
function renderInlineElements(
  content: string,
  retrievedResults?: RetrievalResult[],
  citations?: CitationReference[],
  onCitationClick?: (docCode: string, pageNumber: number, chunkId?: string, sourceNumber?: number) => void,
  isDark = false
): React.ReactNode[] {
  const regex = /(\[(\d+):\s*([A-Za-z0-9_-]+)[,\s]+p\.?(\d+)\])|(\[([A-Za-z0-9_-]+)[,\s]+p\.?(\d+)\])|(\[(\d+(?:\s*,\s*\d+)*)\])|(\*\*.*?\*\*)|(`.*?`)|(\$.*?\$)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(content.substring(lastIndex, match.index));
    }

    if (match[1]) {
      // Format: [1: ENG-ME-201, p.24]
      const sourceNum = parseInt(match[2], 10);
      const docCode = match[3];
      const pageNum = parseInt(match[4], 10);
      const targetChunk = retrievedResults?.[sourceNum - 1];

      elements.push(
        <CitationBadge
          key={`cite-full-${match.index}`}
          sourceNumber={sourceNum}
          docCode={docCode}
          pageNumber={pageNum}
          chunk={targetChunk?.chunk}
          similarityScore={targetChunk?.similarityScore}
          isDark={isDark}
          onClick={() => onCitationClick && onCitationClick(docCode, pageNum, targetChunk?.chunk.id, sourceNum)}
        />
      );
    } else if (match[5]) {
      // Format: [ENG-ME-201, p.24]
      const docCode = match[6];
      const pageNum = parseInt(match[7], 10);
      const matchedIdx = retrievedResults?.findIndex(
        r => r.docCode === docCode && (pageNum ? r.chunk.pageNumber === pageNum : true)
      );
      const sourceNum = matchedIdx !== undefined && matchedIdx !== -1 ? matchedIdx + 1 : 1;
      const targetChunk = matchedIdx !== undefined && matchedIdx !== -1 ? retrievedResults?.[matchedIdx] : undefined;

      elements.push(
        <CitationBadge
          key={`cite-doc-${match.index}`}
          sourceNumber={sourceNum}
          docCode={docCode}
          pageNumber={pageNum}
          chunk={targetChunk?.chunk}
          similarityScore={targetChunk?.similarityScore}
          isDark={isDark}
          onClick={() => onCitationClick && onCitationClick(docCode, pageNum, targetChunk?.chunk.id, sourceNum)}
        />
      );
    } else if (match[8]) {
      // Format: [1] or [1, 2]
      const rawNums = match[9];
      const numbers = rawNums.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));

      elements.push(
        <span key={`cite-nums-${match.index}`} className="inline-flex items-center gap-1 mx-0.5">
          {numbers.map((num, i) => {
            const target = retrievedResults?.[num - 1];
            const docCode = target?.docCode || `Source ${num}`;
            const pageNum = target?.chunk.pageNumber || 1;

            return (
              <CitationBadge
                key={`badge-${num}-${i}`}
                sourceNumber={num}
                docCode={target ? target.docCode : undefined}
                pageNumber={target ? pageNum : undefined}
                chunk={target?.chunk}
                similarityScore={target?.similarityScore}
                isDark={isDark}
                onClick={() => onCitationClick && onCitationClick(docCode, pageNum, target?.chunk.id, num)}
              />
            );
          })}
        </span>
      );
    } else if (match[10]) {
      // Bold text
      const boldText = match[10].slice(2, -2);
      elements.push(
        <strong
          key={`bold-${match.index}`}
          className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          {boldText}
        </strong>
      );
    } else if (match[11]) {
      // Inline code
      const codeText = match[11].slice(1, -1);
      elements.push(
        <code
          key={`code-${match.index}`}
          className={`font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 border ${
            isDark
              ? 'bg-slate-800 text-sky-200 border-slate-700'
              : 'bg-slate-100 text-indigo-700 border-slate-200'
          }`}
        >
          {codeText}
        </code>
      );
    } else if (match[12]) {
      // Math formula
      const mathText = match[12].slice(1, -1);
      elements.push(
        <span
          key={`math-${match.index}`}
          className={`font-mono text-xs px-1.5 py-0.5 rounded mx-0.5 italic border ${
            isDark
              ? 'bg-indigo-950/60 text-indigo-200 border-indigo-700/50'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
        >
          {mathText}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    elements.push(content.substring(lastIndex));
  }

  return elements;
}

interface CitationBadgeProps {
  sourceNumber: number;
  docCode?: string;
  pageNumber?: number;
  chunk?: any;
  similarityScore?: number;
  isDark?: boolean;
  onClick: () => void;
}

const CitationBadge: React.FC<CitationBadgeProps> = ({
  sourceNumber,
  docCode,
  pageNumber,
  chunk,
  similarityScore,
  isDark = false,
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-block align-baseline mx-0.5">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer shadow-xs ${
          isDark
            ? 'bg-sky-500/15 hover:bg-sky-500/30 text-sky-300 border border-sky-400/50'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300'
        }`}
        title={`Click to inspect Source #${sourceNumber}${docCode ? ` (${docCode})` : ''}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-extrabold">[{sourceNumber}]</span>
        {docCode && (
          <span className={`text-[10px] font-medium hidden sm:inline ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {docCode}{pageNumber ? `, p.${pageNumber}` : ''}
          </span>
        )}
      </button>

      {/* Hover preview tooltip */}
      {showTooltip && chunk && (
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3.5 rounded-2xl text-left text-xs shadow-xl z-50 pointer-events-none backdrop-blur-md border ${
            isDark
              ? 'bg-slate-900 border-sky-500/40 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800 shadow-indigo-500/10'
          }`}
        >
          <div
            className={`flex items-center justify-between gap-1 text-[10px] font-mono pb-1.5 border-b ${
              isDark ? 'text-sky-400 border-slate-800' : 'text-indigo-600 border-slate-100'
            }`}
          >
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Source [{sourceNumber}] • {docCode}
            </span>
            {similarityScore && (
              <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                {(similarityScore * 100).toFixed(0)}% match
              </span>
            )}
          </div>
          <p className={`font-semibold text-[11px] mt-1.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {chunk.sectionTitle}
          </p>
          <p className={`text-[10px] mt-1 line-clamp-2 font-serif italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            "{chunk.content}"
          </p>
          <div className="mt-1.5 text-[9px] text-indigo-500 flex items-center justify-end font-medium">
            Click to view chunk in inspector →
          </div>
        </div>
      )}
    </span>
  );
};
