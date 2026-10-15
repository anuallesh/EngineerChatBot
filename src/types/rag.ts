export interface DocumentChunk {
  id: string;
  docId: string;
  pageNumber: number;
  sectionTitle: string;
  content: string;
  tokenCount: number;
  keywords: string[];
  embeddingVector?: number[]; // Normalized vector representation
}

export interface EngineeringDocument {
  id: string;
  code: string;
  title: string;
  discipline: 
    | 'Algorithms & Data Structures' 
    | 'Operating Systems' 
    | 'Database Systems' 
    | 'Computer Networks' 
    | 'Computer Architecture' 
    | 'Theory of Computation' 
    | 'Compiler Design' 
    | 'Distributed Systems' 
    | 'AI & Machine Learning' 
    | 'Cybersecurity'
    | 'Software Engineering'
    | 'Computer Science';
  author: string;
  institution: string;
  year: number;
  pages: number;
  fileSizeMb: number;
  summary: string;
  tags: string[];
  chunks: DocumentChunk[];
  customUploaded?: boolean;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  docCode: string;
  docTitle: string;
  similarityScore: number;
  denseScore: number;
  bm25Score: number;
  hybridScore: number;
  rank: number;
}

export interface RAGQueryTelemetry {
  retrievalLatencyMs: number;
  rerankingLatencyMs: number;
  generationLatencyMs: number;
  totalLatencyMs: number;
  evaluatedChunksCount: number;
  retrievedChunksCount: number;
  promptTokens: number;
  completionTokens: number;
  model: string;
}

export interface CitationReference {
  id: string;
  sourceNumber: number;
  docId: string;
  docCode: string;
  docTitle?: string;
  pageNumber: number;
  sectionTitle: string;
  snippet: string;
  chunkId: string;
  similarityScore?: number;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: CitationReference[];
  retrievedResults?: RetrievalResult[];
  telemetry?: RAGQueryTelemetry;
  assembledPrompt?: string;
  engineeringCategory?: string;
}

export interface RAGConfig {
  topK: number;
  alpha: number; // 0 = BM25 keyword only, 1 = Dense semantic only, 0.7 = Hybrid
  similarityThreshold: number;
  chunkingStrategy: 'recursive' | 'fixed' | 'semantic';
  selectedDocIds: string[];
  strictGrounding: boolean;
}
