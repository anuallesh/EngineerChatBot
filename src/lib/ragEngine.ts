import { DocumentChunk, EngineeringDocument, RetrievalResult, RAGConfig, CitationReference } from '../types/rag';

// Stopwords for cleaner text processing
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
  'cannot', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself', 'let\'s', 'me', 'more',
  'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such',
  'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won\'t', 'would',
  'you', 'your', 'yours', 'yourself', 'yourselves'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

// BM25 parameters
const K1 = 1.5;
const B = 0.75;

export interface InvertedIndex {
  docFrequencies: Map<string, number>;
  totalChunks: number;
  avgChunkLength: number;
  chunkLengths: Map<string, number>;
  chunkTermFreqs: Map<string, Map<string, number>>;
}

export function buildInvertedIndex(chunks: DocumentChunk[]): InvertedIndex {
  const docFrequencies = new Map<string, number>();
  const chunkLengths = new Map<string, number>();
  const chunkTermFreqs = new Map<string, Map<string, number>>();
  let totalLength = 0;

  for (const chunk of chunks) {
    const fullText = `${chunk.sectionTitle} ${chunk.content} ${chunk.keywords.join(' ')}`;
    const tokens = tokenize(fullText);
    const length = tokens.length;
    chunkLengths.set(chunk.id, length);
    totalLength += length;

    const termFreq = new Map<string, number>();
    for (const t of tokens) {
      termFreq.set(t, (termFreq.get(t) || 0) + 1);
    }
    chunkTermFreqs.set(chunk.id, termFreq);

    for (const term of termFreq.keys()) {
      docFrequencies.set(term, (docFrequencies.get(term) || 0) + 1);
    }
  }

  const totalChunks = chunks.length;
  const avgChunkLength = totalChunks > 0 ? totalLength / totalChunks : 1;

  return {
    docFrequencies,
    totalChunks,
    avgChunkLength,
    chunkLengths,
    chunkTermFreqs,
  };
}

// Compute BM25 score
export function computeBM25Score(
  queryTokens: string[],
  chunkId: string,
  index: InvertedIndex
): number {
  let score = 0;
  const docLen = index.chunkLengths.get(chunkId) || 1;
  const termFreqMap = index.chunkTermFreqs.get(chunkId);
  if (!termFreqMap) return 0;

  for (const token of queryTokens) {
    const tf = termFreqMap.get(token) || 0;
    if (tf === 0) continue;

    const df = index.docFrequencies.get(token) || 1;
    // Robertson-Spärck Jones IDF
    const idf = Math.log(1 + (index.totalChunks - df + 0.5) / (df + 0.5));
    const numerator = tf * (K1 + 1);
    const denominator = tf + K1 * (1 - B + B * (docLen / index.avgChunkLength));
    score += idf * (numerator / denominator);
  }

  return Math.max(0, score);
}

// Compute semantic vector similarity
export function computeDenseSimilarity(
  query: string,
  chunk: DocumentChunk
): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return 0;

  const chunkTokens = tokenize(`${chunk.sectionTitle} ${chunk.content} ${chunk.keywords.join(' ')}`);
  const chunkTokenSet = new Set(chunkTokens);

  // Exact & partial keyword matching
  let overlapCount = 0;
  let keywordBonus = 0;

  for (const q of queryTokens) {
    if (chunkTokenSet.has(q)) {
      overlapCount += 1;
    } else {
      // Check prefix / partial matching (e.g. "thermo" in "thermodynamics")
      for (const c of chunkTokenSet) {
        if (c.startsWith(q) || q.startsWith(c)) {
          overlapCount += 0.6;
          break;
        }
      }
    }

    // High boost if matching designated keywords
    for (const kw of chunk.keywords) {
      if (kw.toLowerCase().includes(q)) {
        keywordBonus += 0.35;
        break;
      }
    }
  }

  // Jaccard & Cosine approximation
  const queryLength = Math.sqrt(queryTokens.length);
  const chunkLength = Math.sqrt(chunkTokens.length);
  const cosineSim = (overlapCount + keywordBonus) / (queryLength * Math.min(chunkLength, 15));

  return Math.min(1.0, Math.max(0.05, cosineSim * 0.95));
}

// Hybrid Retrieval Function
export function executeHybridRetrieval(
  query: string,
  documents: EngineeringDocument[],
  config: RAGConfig
): { results: RetrievalResult[]; latencyMs: number } {
  const startTime = performance.now();
  const queryTokens = tokenize(query);

  // Gather eligible chunks based on selectedDocIds
  const eligibleChunks: { chunk: DocumentChunk; doc: EngineeringDocument }[] = [];
  const selectedSet = new Set(config.selectedDocIds);

  for (const doc of documents) {
    if (selectedSet.size > 0 && !selectedSet.has(doc.id)) continue;
    for (const chunk of doc.chunks) {
      eligibleChunks.push({ chunk, doc });
    }
  }

  if (eligibleChunks.length === 0) {
    return { results: [], latencyMs: performance.now() - startTime };
  }

  const allChunks = eligibleChunks.map(item => item.chunk);
  const index = buildInvertedIndex(allChunks);

  // Score chunks
  const scoredItems = eligibleChunks.map(item => {
    const bm25 = computeBM25Score(queryTokens, item.chunk.id, index);
    const dense = computeDenseSimilarity(query, item.chunk);
    return {
      chunk: item.chunk,
      doc: item.doc,
      bm25,
      dense,
    };
  });

  // Normalize BM25 scores between 0 and 1
  const maxBM25 = Math.max(1, ...scoredItems.map(s => s.bm25));
  const normalizedItems = scoredItems.map(item => {
    const normBM25 = item.bm25 / maxBM25;
    const hybrid = config.alpha * item.dense + (1 - config.alpha) * normBM25;
    return {
      chunk: item.chunk,
      docCode: item.doc.code,
      docTitle: item.doc.title,
      bm25Score: Number(normBM25.toFixed(3)),
      denseScore: Number(item.dense.toFixed(3)),
      hybridScore: Number(hybrid.toFixed(3)),
      similarityScore: Number(hybrid.toFixed(3)),
      rank: 0,
    };
  });

  // Filter by similarity threshold & sort descending
  const filtered = normalizedItems
    .filter(item => item.hybridScore >= config.similarityThreshold)
    .sort((a, b) => b.hybridScore - a.hybridScore)
    .slice(0, config.topK);

  // Assign ranks
  const rankedResults = filtered.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const latencyMs = Math.round(performance.now() - startTime);
  return { results: rankedResults, latencyMs };
}

// Assemble Prompt for LLM with strict context grounding
export function constructAugmentedPrompt(
  query: string,
  results: RetrievalResult[],
  strictGrounding: boolean
): string {
  if (results.length === 0) {
    return `Student Query: "${query}"\nNo relevant engineering documents met the retrieval threshold. Please inform the student that no matching sections were found in the active engineering repository.`;
  }

  const contextText = results
    .map(
      (r, idx) =>
        `[Source #${idx + 1}: ${r.docCode} (p.${r.chunk.pageNumber}) - ${r.chunk.sectionTitle}]\n${r.chunk.content}`
    )
    .join('\n\n');

  return `System Context:\nYou are EngineerChatbox, a friendly, encouraging, and expert academic AI knowledge assistant for engineering students and educators.
Your knowledge comes strictly from the retrieved engineering document passages below.

RETRIEVED CONTEXT PASSAGES:
=========================================
${contextText}
=========================================

STUDENT QUERY:
"${query}"

INSTRUCTIONS:
1. Provide a rigorous, mathematically clear, and concise engineering answer to the student query.
2. Ground every formula, concept, and deduction in the retrieved sources.
3. MANDATORY NUMBERED CITATIONS: Cite your sources inline using numbered bracket citations referencing the source passage number, e.g. [1], [2], or [1: ${results[0]?.docCode || 'ENG-XX'}, p.${results[0]?.chunk.pageNumber || '1'}].
4. If a concept cannot be deduced from the retrieved context, ${strictGrounding ? 'explicitly state that it is not covered in the active documents rather than hallucinating.' : 'answer carefully noting which parts are inferred.'}
5. When relevant, present mathematical derivations, parameter definitions, and engineering trade-offs clearly.`;
}

// Extract citation references from retrieved chunks
export function extractCitations(results: RetrievalResult[]): CitationReference[] {
  return results.map((r, idx) => ({
    id: `cite-${r.chunk.id}`,
    sourceNumber: idx + 1,
    docId: r.chunk.docId,
    docCode: r.docCode,
    docTitle: r.docTitle,
    pageNumber: r.chunk.pageNumber,
    sectionTitle: r.chunk.sectionTitle,
    snippet: r.chunk.content.substring(0, 160) + '...',
    chunkId: r.chunk.id,
    similarityScore: r.similarityScore,
  }));
}
