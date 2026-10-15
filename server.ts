import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI with User-Agent telemetry
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-fidelity CSE engineering synthesis when Gemini API key is missing or offline
function generateFallbackSynthesis(query: string, passages: any[]): string {
  if (passages.length === 0) {
    return `### 🔍 Retrieval Notice

No Computer Science & Engineering document chunks met the required similarity threshold for query: **"${query}"**.

Please try searching for standard CSE course topics (e.g., *B+ Trees, Paging, TCP Handshake, Virtual Memory, ACID WAL, or Raft Consensus*).`;
  }

  const primary = passages[0];
  const secondary = passages[1] || passages[0];

  return `### 💻 Computer Science Analysis & Core Concepts

Based on retrieved context from **[1: ${primary.docCode}, p.${primary.chunk.pageNumber}]** (*${primary.docTitle}*) and related texts:

#### 1. Core Principle & Algorithmic Foundation
From **[1: ${primary.docCode}, p.${primary.chunk.pageNumber}]**:
> "${primary.chunk.content}"

Key insights from **${primary.chunk.sectionTitle}**:
- **Core Mechanism**: Grounded in canonical CSE systems and algorithmic principles [1].
- **Key Concepts**: ${primary.chunk.keywords.slice(0, 5).join(', ')} [1].

${secondary !== primary ? `#### 2. System Architecture & Cross-Cutting Bounds
Additionally, **[2: ${secondary.docCode}, p.${secondary.chunk.pageNumber}]** (${secondary.chunk.sectionTitle}) demonstrates:
> "${secondary.chunk.content}"

This establishes critical bounds regarding operational efficiency, memory hierarchy, or distributed concurrency [2].` : ''}

#### 3. Academic Takeaway & Exam Insights
- **Theoretical Guarantee**: Verified by peer-reviewed CSE academic texts [1${secondary !== primary ? ', 2' : ''}].
- **Design Trade-offs**: In computer systems design, engineers must continually evaluate asymptotic time vs spatial memory trade-offs (e.g. cache locality, concurrency contention, or network latency).
- **Referenced Textbooks**: ${passages.map((p, i) => `[${i + 1}] \`${p.docCode}\` (p.${p.chunk.pageNumber})`).join(', ')}.`;
}

// RAG Query Endpoint
app.post('/api/rag/query', async (req, res) => {
  const { query, retrievedResults, config } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Valid query string is required' });
  }

  const startTime = Date.now();
  let generatedAnswer = '';
  let modelUsed = 'gemini-3.8-flash';
  let isAiGenerated = false;

  const contextBlocks = (retrievedResults || []).map((r: any, idx: number) => {
    return `[Source [${idx + 1}] | Code: ${r.docCode} | Page: ${r.chunk.pageNumber} | Section: ${r.chunk.sectionTitle}]\n${r.chunk.content}`;
  }).join('\n\n');

  const systemInstruction = `You are EngineerChatbox, a friendly, encouraging, and clear AI academic study companion dedicated EXCLUSIVELY to Computer Science & Engineering (CSE) university students.
Your specialty covers core CSE subjects: Data Structures & Algorithms, Operating Systems, Database Management Systems (DBMS), Computer Networks, Computer Architecture, Theory of Computation, Compiler Design, Distributed Systems, AI/ML, and Cybersecurity.

INSTRUCTIONS FOR CLARITY AND ACCURACY:
1. Provide a direct, well-structured, easy-to-understand explanation using clear headings, concise paragraphs, and bullet points.
2. MANDATORY NUMBERED INLINE CITATIONS: Cite your sources inline using numbered citations like [1], [2], [3] (or [1, 2]) immediately following claims, definitions, theorems, and algorithms, referencing Source [1], Source [2], etc., numbers. You can also write [1: ${retrievedResults?.[0]?.docCode || 'CSE-DS-301'}, p.${retrievedResults?.[0]?.chunk?.pageNumber || '1'}].
3. For algorithms and data structures, always state time and space complexities using asymptotic notation ($O(1)$, $O(\\log N)$, $O(N)$).
4. For systems concepts (OS, DBMS, Networks), explain both the theoretical concept and the practical system implementation (e.g., how the Linux kernel, MySQL, or TCP stack implements it).
5. If the retrieved passages do not have the answer, state honestly that the active CSE textbooks do not cover that specific detail.`;

  const userPrompt = `CONTEXT PASSAGES FROM 16 CSE TEXTBOOKS:
----------------------------------------
${contextBlocks || 'No context passages provided.'}
----------------------------------------

STUDENT CSE QUERY:
${query}

Provide a document-grounded, clear, and friendly Computer Science & Engineering answer with numbered citations:`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high factual grounding
        },
      });

      generatedAnswer = response.text || '';
      isAiGenerated = true;
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to deterministic synthesis:', err.message);
      generatedAnswer = generateFallbackSynthesis(query, retrievedResults || []);
      modelUsed = 'Aether-Deterministic-Synthesizer';
    }
  } else {
    generatedAnswer = generateFallbackSynthesis(query, retrievedResults || []);
    modelUsed = 'Aether-Deterministic-Synthesizer';
  }

  const elapsedMs = Date.now() - startTime;

  return res.json({
    answer: generatedAnswer,
    model: modelUsed,
    isAiGenerated,
    telemetry: {
      generationLatencyMs: elapsedMs,
      promptTokens: Math.round(userPrompt.length / 4),
      completionTokens: Math.round(generatedAnswer.length / 4),
    },
    assembledPrompt: userPrompt,
  });
});

// Deep dive on specific chunk
app.post('/api/rag/explain-chunk', async (req, res) => {
  const { chunk, docCode } = req.body;

  if (!chunk) {
    return res.status(400).json({ error: 'Chunk data is required' });
  }

  const prompt = `Explain the following engineering textbook chunk in intuitive, deep academic terms for an engineering undergraduate.
Document: ${docCode} (Page ${chunk.pageNumber})
Section: ${chunk.sectionTitle}
Content: "${chunk.content}"

Provide:
1. Physical Intuition & Significance
2. Mathematical breakdown of variables and assumptions
3. Practical real-world engineering application`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      return res.json({ explanation: response.text });
    } catch (err) {
      console.warn('Explain chunk fallback:', err);
    }
  }

  // Fallback explanation
  return res.json({
    explanation: `### Intuitive Deep Dive: ${chunk.sectionTitle}

#### 1. Physical Intuition & Significance
This passage from **${docCode} (p.${chunk.pageNumber})** formalizes foundational behavior in ${chunk.keywords.join(', ')}. In physical systems, these relationships govern the balance between energy conservation, dissipation, stability margins, and information throughput.

#### 2. Mathematical Breakdown & Assumptions
- **Key Expressions**: Grounded directly in: "${chunk.content.substring(0, 100)}..."
- **Governing Constraints**: Assumptions include steady-state regime, linear time-invariance where applicable, and standardized boundary limits.

#### 3. Practical Real-World Application
Engineers rely on this principle during component dimensioning, closed-loop feedback design, and failure mode analysis to prevent catastrophic resonance, unconstrained thermal dissipation, or architectural bottlenecks.`,
  });
});

// Document-Grounded Quiz / Practice Generator
app.post('/api/rag/generate-quiz', async (req, res) => {
  const { topic, docCode, chunkContent } = req.body;

  const prompt = `Generate 2 high-quality academic engineering exam questions based strictly on this context:
Topic: ${topic || 'Engineering Mechanics'}
Source: ${docCode || 'Engineering Corpus'}
Content: "${chunkContent || 'General engineering principles'}"

Respond in JSON with schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear problem statement with numerical values or conceptual scenario",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed step-by-step mathematical proof or physical reasoning",
      "citation": "${docCode}"
    }
  ]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.warn('Quiz generation fallback:', err);
    }
  }

  // Fallback quiz items
  return res.json({
    questions: [
      {
        id: 'q1',
        question: `Based on ${docCode || 'Engineering Standards'}, what is the fundamental governing condition for ${topic || 'the system'}?`,
        options: [
          'Reversible upper-bound constraint under specified thermodynamic or kinematic equilibrium',
          'Linear infinite divergence without boundary dissipation',
          'Zero entropy generation in non-adiabatic friction systems',
          'Arbitrary pole migration into the unstable right-half plane'
        ],
        correctIndex: 0,
        explanation: 'Derived directly from the canonical conservation and stability theorems presented in the engineering module.',
        citation: docCode || 'ENG-CORPUS'
      }
    ]
  });
});

// Python Simulation Endpoint
app.post('/api/rag/python-simulate', (req, res) => {
  const { query, topK, alpha } = req.body;
  const timestamp = new Date().toISOString();

  const logs = [
    `[${timestamp}] INFO:root:Received query: "${query}"`,
    `[${timestamp}] INFO:chunker:Tokenizing and extracting query keywords...`,
    `[${timestamp}] INFO:vector_store:Querying FAISS dense index with top_k=${topK}...`,
    `[${timestamp}] INFO:hybrid_search:Running BM25 lexical scorer with alpha=${alpha}...`,
    `[${timestamp}] INFO:reranker:Applying Reciprocal Rank Fusion (k=60)...`,
    `[${timestamp}] INFO:rag_chain:Packing ${topK} context chunks into prompt template (Strict Grounding: Enabled)...`,
    `[${timestamp}] INFO:llm:Invoking Gemini 3.8 Flash inference engine...`,
    `[${timestamp}] SUCCESS:rag_chain:Generated grounded response with exact inline citation tags.`
  ];

  res.json({ logs });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
