import { EngineeringDocument } from '../types/rag';

export const INITIAL_DOCUMENTS: EngineeringDocument[] = [
  {
    id: 'doc-cse-algo',
    code: 'CSE-DS-301',
    title: 'Data Structures, Advanced Algorithms & Complexity Analysis',
    discipline: 'Algorithms & Data Structures',
    author: 'Prof. Thomas H. Cormen & Prof. Ronald L. Rivest',
    institution: 'MIT Department of Electrical Engineering & Computer Science',
    year: 2024,
    pages: 240,
    fileSizeMb: 18.5,
    summary: 'Comprehensive academic textbook covering self-balancing search trees (B-Trees, B+ Trees, Red-Black Trees), asymptotic amortized complexity, dynamic programming optimal substructure, and shortest-path graph algorithms.',
    tags: ['B-Tree', 'B+ Tree', 'Red-Black Tree', 'Dijkstra', 'Dynamic Programming', 'Amortized Complexity'],
    chunks: [
      {
        id: 'chunk-ds301-1',
        docId: 'doc-cse-algo',
        pageNumber: 42,
        sectionTitle: '3.2 B-Trees and B+ Trees: Disk-Optimized Multiway Indexing',
        content: 'A B-Tree of order m satisfies: each non-root node contains at least ⌈m/2⌉ children and at most m children. In B+ Trees, all actual data records and pointers reside strictly in the leaf nodes, which are linked sequentially in a doubly-linked list for O(1) sequential range traversals and O(log_m N) random point lookups. When an insertion causes a leaf node to exceed m-1 keys, the node splits at the median key ⌈m/2⌉. In B+ Trees, the split key is copied to the parent while remaining in the leaf node to preserve search completeness.',
        tokenCount: 140,
        keywords: ['B-Tree', 'B+ Tree', 'node split', 'disk index', 'range scan', 'order m', 'leaf linked list']
      },
      {
        id: 'chunk-ds301-2',
        docId: 'doc-cse-algo',
        pageNumber: 86,
        sectionTitle: '5.4 Red-Black Tree Invariants, Balance and Tree Rotations',
        content: 'Red-Black trees are self-balancing binary search trees adhering to five fundamental invariants: (1) Every node is either red or black; (2) The root is strictly black; (3) Every leaf (NIL) is black; (4) If a node is red, both children must be black (no adjacent red nodes); (5) For every node, all paths to descendant leaves contain the identical number of black nodes (black-height). Consequently, the maximum path length from root to leaf cannot exceed 2 * ⌊log2(N + 1)⌋, ensuring guaranteed O(log N) worst-case search, insertion, and deletion.',
        tokenCount: 138,
        keywords: ['Red-Black Tree', 'invariants', 'black-height', 'rotations', 'asymptotic bound', 'O(log N)']
      },
      {
        id: 'chunk-ds301-3',
        docId: 'doc-cse-algo',
        pageNumber: 132,
        sectionTitle: '8.1 Dijkstra and A* Shortest Path Graph Optimization',
        content: 'Dijkstra’s algorithm computes single-source shortest paths on weighted directed graphs with non-negative edge weights w(u, v) ≥ 0. Implementing the priority queue using a Fibonacci heap yields asymptotic time complexity O(|E| + |V| log |V|), improving upon standard binary min-heaps O((|V| + |E|) log |V|). A* search augments Dijkstra with an admissible heuristic h(n) ≤ h*(n) that never overestimates remaining cost to the goal, guaranteeing optimal shortest path discovery while pruning unpromising search frontiers.',
        tokenCount: 130,
        keywords: ['Dijkstra', 'A* search', 'Fibonacci heap', 'priority queue', 'admissible heuristic', 'graph theory']
      },
      {
        id: 'chunk-ds301-4',
        docId: 'doc-cse-algo',
        pageNumber: 178,
        sectionTitle: '11.3 Dynamic Programming: Bellman Principle of Optimality',
        content: 'Dynamic Programming solves optimization problems possessing optimal substructure and overlapping subproblems. By Bellman’s Principle of Optimality, an optimal policy has the property that whatever the initial state and decision are, the remaining decisions must constitute an optimal policy with regard to the state resulting from the first decision. Memoization utilizes top-down caching, whereas tabulation fills an iterative bottom-up array in topological order, reducing exponential time O(2^N) down to polynomial O(N * W).',
        tokenCount: 125,
        keywords: ['Dynamic Programming', 'Bellman', 'optimal substructure', 'memoization', 'tabulation', 'recurrence']
      }
    ]
  },
  {
    id: 'doc-cse-os',
    code: 'CSE-OS-302',
    title: 'Operating Systems: Concurrency, Virtual Memory & Kernel Architecture',
    discipline: 'Operating Systems',
    author: 'Prof. Remzi H. Arpaci-Dusseau & Andrea C. Arpaci-Dusseau',
    institution: 'University of Wisconsin-Madison Computer Sciences',
    year: 2024,
    pages: 220,
    fileSizeMb: 17.2,
    summary: 'In-depth coverage of OS kernel mechanisms: CPU virtualization (scheduling policies, context switching), memory virtualization (paging, TLBs, multi-level page tables), and concurrency (locks, semaphores, deadlock avoidance).',
    tags: ['Virtual Memory', 'Paging', 'TLB', 'Context Switching', 'Semaphores', 'Deadlock'],
    chunks: [
      {
        id: 'chunk-os302-1',
        docId: 'doc-cse-os',
        pageNumber: 38,
        sectionTitle: '2.4 Process vs Thread Memory Layout & Context Switching',
        content: 'A process is an OS abstraction representing an executing program with a private address space: Text (code), Data (globals), BSS, Heap (dynamic allocation), and Stack (local frames). Threads within the same process share the Text, Data, and Heap segments, as well as open file descriptors, but each thread retains its own private Program Counter (PC), CPU registers, and independent call stack. Context switching between processes flushes the Translation Lookaside Buffer (TLB) and resets the CR3 page table register, whereas thread context switches inside the same process preserve the TLB mapping.',
        tokenCount: 142,
        keywords: ['Process', 'Thread', 'context switch', 'TLB', 'CR3 register', 'virtual address space', 'heap vs stack']
      },
      {
        id: 'chunk-os302-2',
        docId: 'doc-cse-os',
        pageNumber: 82,
        sectionTitle: '5.1 Multi-Level Paging, Translation Lookaside Buffers (TLB) & Page Faults',
        content: 'In 64-bit architectures, linear page tables are impractically large. Multi-level page tables (e.g., 4-level paging in x86-64: PML4, PDPT, PD, PT) structure the address space into a hierarchical tree where unused page table pages are never allocated in RAM. The CPU hardware TLB caches recent Virtual-to-Physical translations. On a TLB miss, the MMU executes a hardware page table walk. If the Present bit in the PTE is 0, the CPU triggers interrupt vector 14 (#PF: Page Fault), invoking the kernel page-fault handler to swap the requested page from disk into a free physical frame.',
        tokenCount: 146,
        keywords: ['Multi-level paging', 'TLB', 'MMU', 'page fault', 'x86-64', 'PTE', 'virtual memory']
      },
      {
        id: 'chunk-os302-3',
        docId: 'doc-cse-os',
        pageNumber: 124,
        sectionTitle: '7.3 Synchronization Primitives: Mutexes, Semaphores & Condition Variables',
        content: 'Dijkstra defined counting semaphores with atomic operations: wait() (decrement; blocks if counter < 0) and post() (increment; wakes sleeping thread). A binary semaphore initialized to 1 operates as a mutual exclusion lock (Mutex). Unlike spinlocks that consume CPU cycles in tight while-loops, OS mutexes put waiting threads to sleep using futex system calls, relinquishing the processor until signaled. Condition variables allow threads to atomically release an associated mutex and sleep until a state predicate is satisfied, preventing busy-waiting and race conditions.',
        tokenCount: 135,
        keywords: ['Mutex', 'Semaphore', 'condition variable', 'futex', 'race condition', 'critical section', 'spin lock']
      },
      {
        id: 'chunk-os302-4',
        docId: 'doc-cse-os',
        pageNumber: 168,
        sectionTitle: '9.2 Deadlock Coffman Conditions & Dijkstra’s Banker’s Algorithm',
        content: 'A deadlock occurs if and only if four Coffman conditions simultaneously hold: (1) Mutual Exclusion (non-shareable resources); (2) Hold and Wait (processes holding resources request new ones); (3) No Preemption (resources cannot be forcibly reclaimed); (4) Circular Wait (closed loop chain of processes waiting for each other). The Banker’s algorithm avoids deadlock by simulating resource allocation: requests are only granted if the resulting state is "Safe" (there exists an execution sequence allowing all processes to satisfy their maximum claim and terminate).',
        tokenCount: 136,
        keywords: ['Deadlock', 'Coffman conditions', 'Bankers algorithm', 'safe state', 'circular wait', 'resource allocation']
      }
    ]
  },
  {
    id: 'doc-cse-db',
    code: 'CSE-DB-303',
    title: 'Database Systems Internals, Query Optimization & Transaction Engines',
    discipline: 'Database Systems',
    author: 'Prof. Raghu Ramakrishnan & Prof. Johannes Gehrke',
    institution: 'Carnegie Mellon University Database Group & Cornell CS',
    year: 2024,
    pages: 230,
    fileSizeMb: 19.1,
    summary: 'Internal architecture of relational and distributed database engines: B+ Tree index structures, buffer pool management, ARIES recovery with Write-Ahead Logging (WAL), ACID guarantees, and Two-Phase Locking (2PL) vs MVCC.',
    tags: ['B+ Tree Index', 'WAL', 'ARIES Recovery', 'ACID', '2PL', 'MVCC', 'Buffer Pool'],
    chunks: [
      {
        id: 'chunk-db303-1',
        docId: 'doc-cse-db',
        pageNumber: 48,
        sectionTitle: '3.3 Write-Ahead Logging (WAL) and the Steal/No-Force Buffer Policy',
        content: 'To maximize write throughput without sacrificing ACID Atomicity and Durability, high-performance DBMS engines employ a Steal / No-Force buffer pool policy. "Steal" allows the buffer manager to flush dirty uncommitted pages to disk to free buffer frames; "No-Force" avoids requiring all modified pages of a transaction to be pushed to disk at commit time. Write-Ahead Logging (WAL) mandates: (1) All log records for a page update must be flushed to non-volatile disk before the page itself can overwrite disk; (2) All transaction log records must be flushed before returning commit confirmation.',
        tokenCount: 138,
        keywords: ['WAL', 'Write-Ahead Log', 'Steal No-Force', 'buffer pool', 'ACID', 'durability', 'commit']
      },
      {
        id: 'chunk-db303-2',
        docId: 'doc-cse-db',
        pageNumber: 94,
        sectionTitle: '5.2 ARIES Crash Recovery: Analysis, Redo, and Undo Phases',
        content: 'The ARIES recovery algorithm operates in three sequential phases following an unexpected crash: (1) Analysis Phase scans the WAL forward from the latest checkpoint to reconstruct the active Transaction Table and Dirty Page Table (DPT); (2) Redo Phase repeats history by scanning forward from the lowest recovery LSN in the DPT, reapplying logged actions (committed and uncommitted) to restore pre-crash database state; (3) Undo Phase scans backward from the crash point, reversing the modifications of all uncommitted "loser" transactions and emitting Compensation Log Records (CLRs) to ensure idempotency during crash repeats.',
        tokenCount: 144,
        keywords: ['ARIES', 'crash recovery', 'Redo', 'Undo', 'checkpoint', 'LSN', 'Compensation Log Record']
      },
      {
        id: 'chunk-db303-3',
        docId: 'doc-cse-db',
        pageNumber: 142,
        sectionTitle: '8.4 Concurrency Control: Strict 2PL vs Multi-Version Concurrency Control (MVCC)',
        content: 'Strict Two-Phase Locking (Strict 2PL) guarantees conflict serializability and avoids cascading aborts by holding all Exclusive (X) and Shared (S) locks until transaction termination (commit or rollback). However, 2PL introduces lock contention where readers block writers and writers block readers. Multi-Version Concurrency Control (MVCC), utilized in PostgreSQL and MySQL InnoDB, maintains multiple timestamped versions of each tuple. Readers observe a consistent snapshot as of their transaction start time without taking locks: "readers never block writers, and writers never block readers".',
        tokenCount: 139,
        keywords: ['Strict 2PL', 'MVCC', 'serializability', 'snapshot isolation', 'locks', 'concurrency control']
      }
    ]
  },
  {
    id: 'doc-cse-net',
    code: 'CSE-NET-304',
    title: 'Computer Networks: Protocol Architecture & Congestion Dynamics',
    discipline: 'Computer Networks',
    author: 'Prof. James F. Kurose & Prof. Keith W. Ross',
    institution: 'UMass Amherst & NYU School of Engineering',
    year: 2024,
    pages: 215,
    fileSizeMb: 17.8,
    summary: 'The 5-layer Internet architecture, TCP 3-way handshake and connection teardown, TCP Reno/Cubic congestion control algorithms, sliding window flow control, DNS resolution, and TLS 1.3 handshake cryptographic protocol.',
    tags: ['TCP Handshake', 'Congestion Control', 'Sliding Window', 'DNS', 'TLS 1.3', 'Routing'],
    chunks: [
      {
        id: 'chunk-net304-1',
        docId: 'doc-cse-net',
        pageNumber: 34,
        sectionTitle: '2.2 TCP Connection Establishment (3-Way Handshake) & 4-Way Teardown',
        content: 'TCP provides reliable full-duplex stream transport. Connection setup follows a 3-way handshake: (1) Client sends SYN packet with an Initial Sequence Number (ISN_c); (2) Server responds with SYN-ACK, acknowledging ISN_c + 1 and providing server sequence number ISN_s; (3) Client sends ACK acknowledging ISN_s + 1, at which point connection state transitions to ESTABLISHED. Connection termination requires a 4-way FIN/ACK handshake because TCP is full-duplex: each endpoint must independently close its transmission half-connection, with the active closer waiting in TIME_WAIT (2*MSL) to handle lost ACKs.',
        tokenCount: 146,
        keywords: ['TCP 3-way handshake', 'SYN', 'ACK', 'FIN', 'TIME_WAIT', 'sequence number', 'full-duplex']
      },
      {
        id: 'chunk-net304-2',
        docId: 'doc-cse-net',
        pageNumber: 76,
        sectionTitle: '4.1 TCP Congestion Control: AIMD, Slow Start, and Fast Recovery',
        content: 'TCP congestion control regulates transmission rate via the Congestion Window (cwnd). The algorithm operates in four phases: (1) Slow Start exponentially doubles cwnd every Round-Trip Time (RTT) until reaching slow-start threshold (ssthresh); (2) Congestion Avoidance linearly increases cwnd by 1 MSS per RTT (Additive Increase); (3) On triple duplicate ACKs (indicating packet loss without timeout), Fast Retransmit re-sends the missing segment immediately; (4) Fast Recovery sets ssthresh = cwnd / 2, reducing cwnd by half (Multiplicative Decrease, AIMD), avoiding an expensive drop to 1 MSS.',
        tokenCount: 142,
        keywords: ['AIMD', 'cwnd', 'Slow Start', 'Fast Retransmit', 'Fast Recovery', 'ssthresh', 'congestion']
      },
      {
        id: 'chunk-net304-3',
        docId: 'doc-cse-net',
        pageNumber: 122,
        sectionTitle: '6.3 DNS Hierarchical Resolution & Anycast Routing',
        content: 'The Domain Name System (DNS) maps human-readable hostnames to IP addresses through a distributed hierarchical tree: Root DNS servers (13 named authorities, distributed via IP Anycast), Top-Level Domain (TLD) servers (.com, .org, .edu), and Authoritative Name Servers. When a client performs a lookup, the local recursive resolver checks its cache; on a cache miss, it iteratively queries the Root server, which responds with NS referrals to the TLD, followed by the Authoritative server, which returns the final A or AAAA DNS record with a Time-To-Live (TTL).',
        tokenCount: 134,
        keywords: ['DNS', 'recursive resolver', 'Root server', 'TLD', 'authoritative', 'TTL', 'IP Anycast']
      }
    ]
  },
  {
    id: 'doc-cse-arc',
    code: 'CSE-ARC-305',
    title: 'Computer Architecture: Pipelining, Hazards & Microprocessor Design',
    discipline: 'Computer Architecture',
    author: 'Prof. John L. Hennessy & Prof. David A. Patterson',
    institution: 'Stanford University & UC Berkeley Computer Architecture Lab',
    year: 2024,
    pages: 200,
    fileSizeMb: 16.4,
    summary: 'The classic 5-stage RISC-V processor pipeline, hazard classification (structural, data, control), operand forwarding/bypassing units, dynamic branch prediction state machines, cache coherence (MESI), and Tomasulo out-of-order execution.',
    tags: ['Pipelining', 'RISC-V', 'Hazards', 'Forwarding', 'Branch Prediction', 'MESI Protocol'],
    chunks: [
      {
        id: 'chunk-arc305-1',
        docId: 'doc-cse-arc',
        pageNumber: 28,
        sectionTitle: '2.1 Classic 5-Stage RISC-V Pipeline and Data Hazard Resolution',
        content: 'The canonical RISC-V integer pipeline divides execution into five stages: IF (Instruction Fetch), ID (Decode & Register Read), EX (Execute / ALU), MEM (Data Memory Access), and WB (Write-Back to registers). Read-After-Write (RAW) data hazards occur when an instruction requires the result of an antecedent instruction still inside the pipeline. Operand Forwarding (Bypassing) routes the ALU output directly from EX/MEM or MEM/WB pipeline registers back to the ALU input multiplexers, eliminating stalls for ALU-to-ALU dependencies. Load-use dependencies still require inserting a 1-cycle stall bubble.',
        tokenCount: 145,
        keywords: ['5-stage pipeline', 'RISC-V', 'data hazard', 'RAW', 'forwarding unit', 'bypassing', 'stall bubble']
      },
      {
        id: 'chunk-arc305-2',
        docId: 'doc-cse-arc',
        pageNumber: 72,
        sectionTitle: '4.3 Dynamic 2-Bit Saturating Counter Branch Prediction',
        content: 'Conditional branches generate control hazards, risking pipeline flushes of speculative instructions. Dynamic branch predictors maintain a Branch Target Buffer (BTB) indexed by program counter and a 2-bit saturating counter: Strongly Taken (11), Weakly Taken (10), Weakly Not Taken (01), Strongly Not Taken (00). An inverted branch outcome decrements or increments the state, requiring two consecutive mispredictions to flip the primary prediction direction. In inner loops executed thousands of times, this dampens misprediction penalties to single-cycle exit boundaries.',
        tokenCount: 130,
        keywords: ['branch prediction', 'saturating counter', 'BTB', 'control hazard', 'speculative execution']
      },
      {
        id: 'chunk-arc305-3',
        docId: 'doc-cse-arc',
        pageNumber: 118,
        sectionTitle: '6.2 Cache Coherence and the 4-State MESI Protocol',
        content: 'In shared-memory symmetric multiprocessors (SMP), private L1/L2 caches risk serving stale data. The MESI protocol maintains coherence across snooping broadcast buses with four states: Modified (cache line is dirty, exclusive, must be written back to RAM); Exclusive (clean, valid only in this cache, identical to memory); Shared (clean, present in multiple caches); Invalid (line does not hold valid data). A write to a Shared line broadcasts an Invalidation message on the interconnect, forcing peer caches to transition their copy to Invalid before the local write can proceed.',
        tokenCount: 140,
        keywords: ['cache coherence', 'MESI protocol', 'SMP', 'snooping bus', 'invalidation', 'multiprocessor']
      }
    ]
  },
  {
    id: 'doc-cse-toc',
    code: 'CSE-TOC-306',
    title: 'Introduction to the Theory of Computation & Automata',
    discipline: 'Theory of Computation',
    author: 'Prof. Michael Sipser',
    institution: 'MIT Department of Mathematics & Computer Science',
    year: 2023,
    pages: 195,
    fileSizeMb: 15.2,
    summary: 'Formal language theory, Deterministic and Non-deterministic Finite Automata (DFA/NFA), Regular Expressions, Pumping Lemma, Context-Free Grammars (CFGs), Turing Machines, Halting Problem undecidability, and P vs NP completeness.',
    tags: ['Automata', 'DFA', 'NFA', 'Turing Machine', 'Pumping Lemma', 'NP-Complete'],
    chunks: [
      {
        id: 'chunk-toc306-1',
        docId: 'doc-cse-toc',
        pageNumber: 32,
        sectionTitle: '1.3 Equivalence of DFA and NFA: Subset Construction Algorithm',
        content: 'A Deterministic Finite Automaton (DFA) is defined as a 5-tuple M = (Q, Σ, δ, q0, F), where transition function δ: Q × Σ → Q is single-valued. A Non-deterministic Finite Automaton (NFA) allows transitions to a set of states δ: Q × (Σ ∪ {ε}) → P(Q). By the Rabin-Scott Subset Construction theorem, any NFA with |Q| states can be converted into an equivalent DFA with at most 2^|Q| states, where each DFA state corresponds to a subset of active NFA states. Thus, DFAs and NFAs recognize the exact same class of Regular Languages.',
        tokenCount: 135,
        keywords: ['DFA', 'NFA', 'subset construction', 'regular language', 'automata', 'transition function']
      },
      {
        id: 'chunk-toc306-2',
        docId: 'doc-cse-toc',
        pageNumber: 88,
        sectionTitle: '4.2 Turing Machine Formalism & The Undecidability of the Halting Problem',
        content: 'A Turing Machine (TM) models computation with an infinite tape and read/write head. Alan Turing proved that the Halting Problem A_TM = { <M, w> | M is a TM that accepts string w } is undecidable using a Cantor-style diagonalization proof: suppose there exists a decidable TM H that decides A_TM. Construct machine D that runs H on input <M, <M>>, outputting the exact opposite of H. Running D on its own description <D> yields an irreconcilable contradiction (D halts if and only if D does not halt), proving no general halting algorithm can exist.',
        tokenCount: 142,
        keywords: ['Turing Machine', 'Halting Problem', 'undecidable', 'diagonalization', 'computability']
      },
      {
        id: 'chunk-toc306-3',
        docId: 'doc-cse-toc',
        pageNumber: 148,
        sectionTitle: '7.1 Complexity Classes P, NP and the Cook-Levin NP-Completeness Theorem',
        content: 'Class P consists of languages decidable in polynomial time O(n^k) on a deterministic TM. Class NP consists of languages verifiable in polynomial time on a deterministic TM (or decidable in polynomial time on a non-deterministic TM). A language L is NP-Complete if: (1) L ∈ NP; (2) Every language in NP is polynomial-time Karp-reducible to L (L is NP-Hard). The Cook-Levin theorem established that Boolean Satisfiability (SAT / 3-SAT) is NP-Complete by encoding the non-deterministic TM computation tableau as a polynomial-size CNF formula.',
        tokenCount: 140,
        keywords: ['P vs NP', 'NP-Complete', 'Cook-Levin', 'SAT', 'reduction', 'polynomial time']
      }
    ]
  },
  {
    id: 'doc-cse-cmp',
    code: 'CSE-CMP-307',
    title: 'Compiler Design: Lexical Analysis, Parsing & Intermediate Code Optimization',
    discipline: 'Compiler Design',
    author: 'Prof. Alfred V. Aho, Monica S. Lam & Prof. Jeffrey D. Ullman',
    institution: 'Stanford University & Bell Laboratories (The Dragon Book)',
    year: 2024,
    pages: 205,
    fileSizeMb: 16.9,
    summary: 'The compilation pipeline: Lexical tokens, top-down LL(1) and bottom-up LR(1)/LALR parsers, Abstract Syntax Trees (AST), Static Single Assignment (SSA) form, Dataflow analysis, and Register Allocation via graph coloring.',
    tags: ['Compilers', 'LL(1) Parser', 'LR Parser', 'SSA Form', 'AST', 'Register Allocation'],
    chunks: [
      {
        id: 'chunk-cmp307-1',
        docId: 'doc-cse-cmp',
        pageNumber: 44,
        sectionTitle: '3.1 Bottom-Up LR Parsing: Shift-Reduce Conflict Resolution',
        content: 'Bottom-up LR(k) parsers reconstruct the parse tree by finding handles and reducing substrings to non-terminals. The parser maintains a state stack and symbol stack. In shift-reduce parsing, two fundamental conflicts arise: Shift-Reduce (parser cannot decide whether to shift the lookahead token onto stack or reduce top stack symbols by a grammar rule) and Reduce-Reduce (parser has multiple valid candidate rules for reduction). Operator precedence and associativity declarations resolve ambiguity in arithmetic grammars without needing cumbersome grammar refactoring.',
        tokenCount: 135,
        keywords: ['LR parser', 'shift-reduce', 'bottom-up', 'parse tree', 'ambiguity', 'grammar reduction']
      },
      {
        id: 'chunk-cmp307-2',
        docId: 'doc-cse-cmp',
        pageNumber: 98,
        sectionTitle: '5.3 Static Single Assignment (SSA) Form & Dominator Trees',
        content: 'Static Single Assignment (SSA) form is an intermediate representation (IR) wherein every variable is assigned a value exactly once. At control flow join points (such as post if-else or loop headers), φ-functions (phi nodes) select the appropriate version of a variable based on which predecessor basic block executed. Dominance frontiers dictate precisely where φ-functions must be inserted. SSA radically simplifies compiler optimizations including Common Subexpression Elimination (CSE), Dead Code Elimination (DCE), and Global Value Numbering.',
        tokenCount: 138,
        keywords: ['SSA form', 'phi function', 'dominator tree', 'intermediate representation', 'compiler optimization']
      },
      {
        id: 'chunk-cmp307-3',
        docId: 'doc-cse-cmp',
        pageNumber: 156,
        sectionTitle: '8.2 Register Allocation via Chaitin-Briggs Graph Coloring',
        content: 'Register allocation maps an unbounded number of IR temporary variables onto K physical CPU registers. Chaitin’s formulation constructs an Interference Graph where each node represents a variable’s live range, and an edge connects two nodes if their live ranges overlap simultaneously. The problem reduces to finding a K-coloring of the interference graph. If a node has degree < K, it can be pushed onto a coloring stack; if all remaining nodes have degree ≥ K, the compiler must select a variable to "spill" to stack memory in RAM.',
        tokenCount: 140,
        keywords: ['register allocation', 'graph coloring', 'interference graph', 'live range', 'spill', 'Chaitin']
      }
    ]
  },
  {
    id: 'doc-cse-dis',
    code: 'CSE-DIS-308',
    title: 'Distributed Systems: Consensus Protocols, Fault Tolerance & CAP Theorem',
    discipline: 'Distributed Systems',
    author: 'Prof. Maarten van Steen & Prof. Andrew S. Tanenbaum',
    institution: 'Vrije Universiteit Amsterdam & Cornell Distributed Systems',
    year: 2024,
    pages: 210,
    fileSizeMb: 17.5,
    summary: 'Distributed state machine replication, the Raft consensus algorithm, Paxos formalisms, Vector Clocks, Brewer’s CAP Theorem, and Distributed Two-Phase Commit (2PC) transactions.',
    tags: ['Raft', 'Paxos', 'CAP Theorem', 'Vector Clocks', 'Consensus', 'Fault Tolerance'],
    chunks: [
      {
        id: 'chunk-dis308-1',
        docId: 'doc-cse-dis',
        pageNumber: 36,
        sectionTitle: '3.1 Raft Leader Election, Randomized Heartbeat Timers & Term Numbers',
        content: 'Raft decomposes consensus into three independent subproblems: leader election, log replication, and safety. Nodes occupy one of three states: Follower, Candidate, or Leader. If a follower node receives no heartbeat AppendEntries RPCs within a randomized election timeout (typically 150ms-300ms), it increments its currentTerm, transitions to Candidate, votes for itself, and broadcasts RequestVote RPCs. To win election, a candidate must secure votes from a strict majority (> N/2) of cluster nodes for that term, guaranteeing at most one valid leader per term.',
        tokenCount: 140,
        keywords: ['Raft', 'leader election', 'consensus', 'randomized timeout', 'candidate', 'term', 'majority']
      },
      {
        id: 'chunk-dis308-2',
        docId: 'doc-cse-dis',
        pageNumber: 74,
        sectionTitle: '4.4 Raft Log Matching Invariant & State Machine Safety Property',
        content: 'The Raft Log Matching Property enforces: (1) If two entries in different logs have identical index and term, they store the identical client command; (2) If two entries in different logs have identical index and term, their logs are identical in all preceding entries. When a leader receives client commands, it issues AppendEntries RPCs. An entry is committed once replicated across a majority of nodes. The Leader Completeness Property guarantees that if a log entry is committed in a given term, that entry is present in the logs of leaders for all higher terms.',
        tokenCount: 144,
        keywords: ['Log Matching', 'AppendEntries', 'Leader Completeness', 'committed entry', 'replication', 'Raft safety']
      },
      {
        id: 'chunk-dis308-3',
        docId: 'doc-cse-dis',
        pageNumber: 128,
        sectionTitle: '6.1 Brewer’s CAP Theorem & Eventual Consistency Models',
        content: 'Brewer’s CAP theorem states that a distributed data store can simultaneously provide at most two of three guarantees: Consistency (every read receives the most recent write or an error; linearizability), Availability (every non-failing node returns a non-error response without guarantee of latest write), and Partition Tolerance (system functions despite dropped or delayed network packets). Since physical networks inevitably experience partitions (P), distributed architects must choose between CP (rejecting writes to preserve linear consistency) or AP (accepting writes with eventual consistency).',
        tokenCount: 140,
        keywords: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'linearizability', 'eventual consistency']
      }
    ]
  },
  {
    id: 'doc-cse-ml',
    code: 'CSE-ML-310',
    title: 'Machine Learning, Deep Neural Networks & Transformer Architectures',
    discipline: 'AI & Machine Learning',
    author: 'Prof. Ian Goodfellow, Dr. Yoshua Bengio & Prof. Aaron Courville',
    institution: 'Stanford AI Lab & Montreal Institute for Learning Algorithms (MILA)',
    year: 2024,
    pages: 235,
    fileSizeMb: 19.5,
    summary: 'Mathematical foundations of modern deep learning: Backpropagation and computational graphs, gradient descent optimization (Adam, RMSprop), self-attention mechanisms, Transformer encoders/decoders, and layer normalization.',
    tags: ['Transformer', 'Self-Attention', 'Backpropagation', 'Gradient Descent', 'Multi-Head Attention', 'Softmax'],
    chunks: [
      {
        id: 'chunk-ml310-1',
        docId: 'doc-cse-ml',
        pageNumber: 26,
        sectionTitle: '2.1 Scaled Dot-Product and Multi-Head Attention Mechanisms',
        content: 'The core attention mechanism projects input embeddings into Query (Q), Key (K), and Value (V) matrices with dimension d_k. Scaled dot-product attention is defined as: Attention(Q, K, V) = softmax( (Q * K^T) / √d_k ) * V. The scaling factor 1/√d_k prevents dot products from growing excessively large, avoiding vanishing gradients in the softmax function. Multi-Head Attention linearly projects queries, keys, and values h times: MultiHead(Q,K,V) = Concat(head_1, ..., head_h) * W^O, allowing the model to jointly attend to information from different representation subspaces.',
        tokenCount: 142,
        keywords: ['Transformer', 'scaled dot-product', 'multi-head attention', 'softmax', 'Query', 'Key', 'Value']
      },
      {
        id: 'chunk-ml310-2',
        docId: 'doc-cse-ml',
        pageNumber: 78,
        sectionTitle: '4.3 Backpropagation and Computational Graph Reverse-Mode Automatic Differentiation',
        content: 'Backpropagation computes the gradient of loss L with respect to all network weights W using the chain rule of calculus. Representing the neural network as a Directed Acyclic Graph (DAG) of tensor operations, the forward pass computes intermediate activations, while the backward pass computes adjoint sensitivities: ∂L/∂x_i = ∑_{j ∈ Children(i)} (∂L/∂x_j) * (∂x_j/∂x_i). The Adam optimizer utilizes these gradients to update parameters via exponentially decaying running averages of past gradients (first moment m_t) and squared gradients (second moment v_t).',
        tokenCount: 140,
        keywords: ['backpropagation', 'chain rule', 'computational graph', 'Adam optimizer', 'gradient descent', 'loss function']
      },
      {
        id: 'chunk-ml310-3',
        docId: 'doc-cse-ml',
        pageNumber: 134,
        sectionTitle: '7.2 Layer Normalization, Residual Connections & Positional Encodings',
        content: 'Deep Transformer networks employ residual skip connections x + Sublayer(x) around each multi-head attention and feed-forward block to prevent vanishing gradients across deep layer stacks. Layer Normalization (LayerNorm) normalizes activations across feature dimensions for each individual sample: LN(x) = (x - μ) / √(σ^2 + ε) * γ + β, stabilizing internal covariate shift without dependence on batch size. Because attention operations are permutation-invariant, sinusoidal or learned Positional Encodings PE(pos, 2i) = sin(pos / 10000^{2i/d}) inject sequence order information.',
        tokenCount: 145,
        keywords: ['LayerNorm', 'residual connection', 'positional encoding', 'vanishing gradient', 'covariate shift']
      }
    ]
  },
  {
    id: 'doc-cse-sec',
    code: 'CSE-SEC-311',
    title: 'Cryptography, Public-Key Infrastructure & Network Security',
    discipline: 'Cybersecurity',
    author: 'Prof. William Stallings',
    institution: 'MIT Information Security Group & Purdue Center for Education in Information Assurance',
    year: 2024,
    pages: 200,
    fileSizeMb: 16.5,
    summary: 'Symmetric block ciphers (AES-256), asymmetric public-key cryptography (RSA, Diffie-Hellman), cryptographic hash functions (SHA-256, HMAC), and public key infrastructure (PKI, X.509 certificates).',
    tags: ['RSA', 'AES', 'Diffie-Hellman', 'SHA-256', 'PKI', 'Cryptography'],
    chunks: [
      {
        id: 'chunk-sec311-1',
        docId: 'doc-cse-sec',
        pageNumber: 34,
        sectionTitle: '2.3 RSA Public-Key Cryptosystem: Modular Arithmetic & Euler’s Totient',
        content: 'The RSA cryptosystem relies on the computational intractability of factoring the product of two large prime numbers p and q. Modulus n = p * q. Euler’s totient is φ(n) = (p - 1)(q - 1). Public exponent e is chosen such that 1 < e < φ(n) and gcd(e, φ(n)) = 1. The private decryption key d is computed via the Extended Euclidean Algorithm as the modular multiplicative inverse: d ≡ e^{-1} (mod φ(n)), meaning (d * e) mod φ(n) = 1. Encryption computes ciphertext C = M^e mod n; Decryption recovers plaintext M = C^d mod n via Euler’s theorem.',
        tokenCount: 146,
        keywords: ['RSA', 'Euler totient', 'modular arithmetic', 'public key', 'private key', 'factoring']
      },
      {
        id: 'chunk-sec311-2',
        docId: 'doc-cse-sec',
        pageNumber: 82,
        sectionTitle: '4.1 Diffie-Hellman Key Exchange & The Discrete Logarithm Problem',
        content: 'Diffie-Hellman enables two parties to negotiate a shared secret over an insecure public channel without pre-shared keys. Both agree on a large prime p and generator g. Alice picks private integer a and transmits public key A = g^a mod p; Bob picks private integer b and transmits public key B = g^b mod p. Alice computes shared secret K = B^a mod p = (g^b)^a mod p, while Bob computes K = A^b mod p = (g^a)^b mod p = g^{ab} mod p. An eavesdropper observing A and B cannot compute K without solving the discrete logarithm problem.',
        tokenCount: 142,
        keywords: ['Diffie-Hellman', 'key exchange', 'discrete logarithm', 'shared secret', 'modular exponentiation']
      }
    ]
  },
  {
    id: 'doc-cse-rag',
    code: 'CSE-RAG-313',
    title: 'Retrieval-Augmented Generation & Dense Semantic Vector Search',
    discipline: 'AI & Machine Learning',
    author: 'Dr. Patrick Lewis & Prof. Douwe Kiela',
    institution: 'Meta AI Research & Stanford NLP Group',
    year: 2024,
    pages: 185,
    fileSizeMb: 15.0,
    summary: 'RAG system architecture: Document ingestion, chunking algorithms, dense vector embeddings (Bi-Encoders), FAISS vector indices, BM25 hybrid lexical scoring, Reciprocal Rank Fusion (RRF), and cross-encoder re-ranking.',
    tags: ['RAG', 'Vector Embeddings', 'Cosine Similarity', 'BM25', 'Reciprocal Rank Fusion', 'FAISS'],
    chunks: [
      {
        id: 'chunk-rag313-1',
        docId: 'doc-cse-rag',
        pageNumber: 24,
        sectionTitle: '2.1 Retrieval-Augmented Generation (RAG) Architecture and Prompt Grounding',
        content: 'RAG bridges parametric LLM memory with non-parametric external document indices. Given student query q, a dense encoder computes query vector e_q. A vector database retrieves top-k relevant document chunks {c_1, ..., c_k} via cosine similarity sim(e_q, e_c) = (e_q · e_c) / (||e_q|| ||e_c||). The retrieved passages are injected as verified context into an augmented prompt: "Context: {c_1..c_k} \\n Answer the query strictly using this context". This eliminates factual hallucinations and provides verifiable inline source citations.',
        tokenCount: 136,
        keywords: ['RAG', 'retrieval-augmented generation', 'vector database', 'cosine similarity', 'dense encoder', 'hallucination']
      },
      {
        id: 'chunk-rag313-2',
        docId: 'doc-cse-rag',
        pageNumber: 68,
        sectionTitle: '4.2 Hybrid Retrieval and Reciprocal Rank Fusion (RRF)',
        content: 'Pure dense vector retrieval excels at semantic paraphrase matching but can overlook exact technical alphanumeric keywords (such as "CSE-DS-301" or "RFC 793"). Hybrid search merges sparse BM25 lexical inverted index scores with dense embedding cosine similarities. Reciprocal Rank Fusion (RRF) scores each document chunk as RRF_score(d) = ∑_{m ∈ M} 1 / (k_rrf + rank_m(d)), where k_rrf is a smoothing constant (typically 60). Cross-encoders further re-rank top candidates through full self-attention layers to elevate contextual precision.',
        tokenCount: 135,
        keywords: ['hybrid search', 'BM25', 'RRF', 'reciprocal rank fusion', 're-ranking', 'dense vector']
      }
    ]
  },
  {
    id: 'doc-cse-cld',
    code: 'CSE-CLD-314',
    title: 'Cloud Computing, Linux Containers & Kubernetes Orchestration',
    discipline: 'Distributed Systems',
    author: 'Brendan Burns & Joe Beda',
    institution: 'Google Cloud & Kubernetes Core Team',
    year: 2024,
    pages: 190,
    fileSizeMb: 15.8,
    summary: 'Linux namespaces and cgroups container isolation, OCI image specification, Kubernetes control plane architecture (kube-apiserver, etcd, kube-scheduler, kube-controller-manager), Pod lifecycle, and Declarative GitOps.',
    tags: ['Kubernetes', 'Docker', 'Containers', 'Namespaces', 'etcd', 'Orchestration'],
    chunks: [
      {
        id: 'chunk-cld314-1',
        docId: 'doc-cse-cld',
        pageNumber: 30,
        sectionTitle: '2.2 Linux Kernel Namespaces, cgroups and Container Isolation',
        content: 'Containers are not virtual machines; they are isolated Linux host processes bounded by kernel primitives: Namespaces and Control Groups (cgroups). Namespaces virtualize system resources per container: PID (process trees), NET (network interfaces/ports), MNT (filesystem mount points), and UTS (hostnames). Control Groups (cgroups v2) enforce resource limits on CPU cycles, memory caps, and block I/O throughput. When a container exceeds its memory limit, the Linux kernel Out-Of-Memory (OOM) killer terminates the process.',
        tokenCount: 135,
        keywords: ['Linux namespaces', 'cgroups', 'containers', 'isolation', 'PID namespace', 'OOM killer']
      },
      {
        id: 'chunk-cld314-2',
        docId: 'doc-cse-cld',
        pageNumber: 74,
        sectionTitle: '4.1 Kubernetes Control Plane Architecture and Declarative Reconciliation',
        content: 'The Kubernetes control plane coordinates cluster state: (1) kube-apiserver exposes the REST API; (2) etcd provides a strongly consistent, distributed Raft-backed key-value store holding the canonical cluster state; (3) kube-scheduler assigns unassigned Pods to worker nodes based on resource requests; (4) kube-controller-manager runs control loops (e.g. ReplicaSet, Deployment) enforcing declarative reconciliation (aligning actual observed state with user-defined desired state). Kubelet runs on each node to execute container runtimes.',
        tokenCount: 138,
        keywords: ['Kubernetes', 'kube-apiserver', 'etcd', 'scheduler', 'controller manager', 'reconciliation']
      }
    ]
  },
  {
    id: 'doc-cse-web',
    code: 'CSE-WEB-315',
    title: 'Web Architecture, JavaScript Engines & Browser Internals',
    discipline: 'Computer Science',
    author: 'Prof. David Flanagan & Addy Osmani',
    institution: 'Google Chrome Team & Mozilla Developer Network (MDN)',
    year: 2024,
    pages: 180,
    fileSizeMb: 14.5,
    summary: 'JavaScript V8 runtime engine internals, the Event Loop (Call Stack, Task Queue, Microtask Queue), the Critical Rendering Path (DOM, CSSOM, Render Tree, Paint), HTTP/2 multiplexing, and WebSockets full-duplex communication.',
    tags: ['Event Loop', 'JavaScript V8', 'DOM', 'Microtasks', 'HTTP/2', 'WebSockets'],
    chunks: [
      {
        id: 'chunk-web315-1',
        docId: 'doc-cse-web',
        pageNumber: 26,
        sectionTitle: '2.1 JavaScript Event Loop: Call Stack, Microtasks & Macrotasks',
        content: 'JavaScript is single-threaded, running on an asynchronous, non-blocking Event Loop. Execution proceeds via: (1) Call Stack executes synchronous JavaScript frames; (2) When stack empties, the engine flushes the entire Microtask Queue (Promise callbacks, process.nextTick, MutationObserver) before handling any macrotasks; (3) Next, the engine dequeues a single Macrotask (setTimeout, setInterval, I/O events, UI rendering); (4) The cycle repeats. Starving the event loop with synchronous computation freezes UI rendering.',
        tokenCount: 135,
        keywords: ['Event Loop', 'call stack', 'microtask', 'macrotask', 'Promise', 'single-threaded', 'V8 engine']
      },
      {
        id: 'chunk-web315-2',
        docId: 'doc-cse-web',
        pageNumber: 62,
        sectionTitle: '4.3 HTTP/1.1 vs HTTP/2 Multiplexing and TCP Head-of-Line Blocking',
        content: 'HTTP/1.1 suffers from application-layer Head-of-Line (HoL) blocking: only one request/response can traverse a single TCP connection at a time, forcing browsers to open 6 parallel TCP connections per host. HTTP/2 introduces binary framing and stream multiplexing over a single shared TCP connection: independent bidirectional streams interleave frames concurrently without blocking peers. However, at the transport layer, TCP packet drop still stalls all interleaved HTTP/2 streams, an issue addressed by HTTP/3 using UDP-based QUIC.',
        tokenCount: 138,
        keywords: ['HTTP/2', 'multiplexing', 'binary framing', 'Head-of-Line blocking', 'QUIC', 'TCP']
      }
    ]
  },
  {
    id: 'doc-cse-oop',
    code: 'CSE-OOP-312',
    title: 'Object-Oriented Architecture, SOLID Principles & Design Patterns',
    discipline: 'Computer Science',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson & John Vlissides',
    institution: 'University of Illinois & Gang of Four (GoF)',
    year: 2023,
    pages: 195,
    fileSizeMb: 15.5,
    summary: 'The SOLID design principles, Creational, Structural, and Behavioral Gang-of-Four design patterns (Factory, Singleton, Observer, Decorator, Strategy), and decoupled enterprise system architecture.',
    tags: ['Design Patterns', 'SOLID', 'Singleton', 'Observer', 'Factory', 'Polymorphism'],
    chunks: [
      {
        id: 'chunk-oop312-1',
        docId: 'doc-cse-oop',
        pageNumber: 32,
        sectionTitle: '2.1 The SOLID Object-Oriented Design Principles',
        content: 'SOLID embodies five architectural design guidelines: (S) Single Responsibility Principle: a class should have one reason to change; (O) Open/Closed Principle: software entities should be open for extension, but closed for modification; (L) Liskov Substitution Principle: subtypes must be substitutable for their base types without altering correctness; (I) Interface Segregation Principle: clients should not depend on interfaces they do not use; (D) Dependency Inversion Principle: high-level modules should depend on abstractions, not concrete implementations.',
        tokenCount: 140,
        keywords: ['SOLID', 'Single Responsibility', 'Open Closed', 'Liskov Substitution', 'Dependency Inversion']
      },
      {
        id: 'chunk-oop312-2',
        docId: 'doc-cse-oop',
        pageNumber: 84,
        sectionTitle: '4.2 GoF Patterns: Factory Method, Observer, and Thread-Safe Singleton',
        content: 'The Factory Method pattern defines an interface for creating objects while delegating instantiation logic to subclasses. The Observer pattern establishes a one-to-many dependency where subject state changes trigger automated broadcast notifications to all registered observers, decoupling event emitters from listeners. In multithreaded systems, the Singleton pattern ensures a class has only one instance using Double-Checked Locking with a volatile instance reference to prevent out-of-order instruction reordering hazards.',
        tokenCount: 138,
        keywords: ['Factory pattern', 'Observer pattern', 'Singleton', 'double-checked locking', 'design patterns']
      }
    ]
  },
  {
    id: 'doc-cse-grp',
    code: 'CSE-GRP-316',
    title: 'Real-Time Computer Graphics & Programmable GPU Pipelines',
    discipline: 'Computer Science',
    author: 'Tomas Akenine-Möller & Eric Haines',
    institution: 'Lund University & NVIDIA Graphics Architecture Lab',
    year: 2024,
    pages: 185,
    fileSizeMb: 16.0,
    summary: 'The programmable 3D rendering pipeline: Vertex, geometry, and fragment shaders, rasterization, Z-buffering depth tests, Ray Tracing BVH traversal, and SIMT GPU warp execution.',
    tags: ['Computer Graphics', 'Shaders', 'Rasterization', 'Ray Tracing', 'GPU Architecture', 'Z-Buffer'],
    chunks: [
      {
        id: 'chunk-grp316-1',
        docId: 'doc-cse-grp',
        pageNumber: 28,
        sectionTitle: '2.2 The Programmable GPU Pipeline and SIMT Execution Model',
        content: 'Modern graphics processing units (GPUs) employ a Single Instruction, Multiple Threads (SIMT) architecture where threads execute instructions in lockstep groups called Warps (32 threads in NVIDIA) or Wavefronts (64 threads in AMD). The programmable pipeline processes geometric data through: (1) Vertex Shader (world/view/projection matrix transformations); (2) Primitive Assembly and Clipping; (3) Rasterization (converting triangles into fragments); (4) Fragment/Pixel Shader (shading, lighting, texture mapping); (5) Output Merger with Z-Buffer depth testing.',
        tokenCount: 140,
        keywords: ['GPU pipeline', 'SIMT', 'warp', 'vertex shader', 'fragment shader', 'rasterization', 'z-buffer']
      }
    ]
  },
  {
    id: 'doc-cse-ai',
    code: 'CSE-AI-309',
    title: 'Artificial Intelligence: Heuristic Search & Reinforcement Learning',
    discipline: 'AI & Machine Learning',
    author: 'Prof. Stuart Russell & Dr. Peter Norvig',
    institution: 'UC Berkeley & Stanford AI Group',
    year: 2024,
    pages: 220,
    fileSizeMb: 18.0,
    summary: 'State-space search algorithms (A*, IDA*), Adversarial Minimax with Alpha-Beta pruning, Markov Decision Processes (MDP), Bellman Optimality equations, and Q-Learning reinforcement algorithms.',
    tags: ['AI Search', 'A*', 'Minimax', 'Alpha-Beta', 'MDP', 'Q-Learning'],
    chunks: [
      {
        id: 'chunk-ai309-1',
        docId: 'doc-cse-ai',
        pageNumber: 36,
        sectionTitle: '3.2 Adversarial Search: Minimax and Alpha-Beta Pruning',
        content: 'In two-player zero-sum games of perfect information (such as Chess), the Minimax algorithm computes optimal decisions by recursively maximizing own payoff while assuming the opponent minimizes it. Alpha-Beta pruning significantly prunes branches that cannot influence the final decision without altering the optimal outcome: α represents the minimum score the maximizing player is assured of, while β represents the maximum score the minimizing player is assured of. If α ≥ β, the remaining child nodes are pruned, doubling effective search depth.',
        tokenCount: 138,
        keywords: ['Minimax', 'Alpha-Beta pruning', 'adversarial search', 'game tree', 'zero-sum game']
      },
      {
        id: 'chunk-ai309-2',
        docId: 'doc-cse-ai',
        pageNumber: 92,
        sectionTitle: '5.4 Markov Decision Processes (MDP) & Bellman Optimality Equation',
        content: 'A Markov Decision Process (MDP) models sequential decision making under uncertainty: (S, A, P, R, γ). By the Markov property, transition probability P(s\' | s, a) depends solely on the current state and action. The Bellman Optimality Equation expresses the optimal state-value function V*(s) = max_a [ R(s, a) + γ ∑_{s\'} P(s\' | s, a) * V*(s\') ]. In model-free reinforcement learning where transition probabilities P are unknown, Q-Learning updates action-values iteratively: Q(s, a) ← Q(s, a) + α [ r + γ max_{a\'} Q(s\', a\') - Q(s, a) ].',
        tokenCount: 145,
        keywords: ['MDP', 'Bellman equation', 'Q-Learning', 'reinforcement learning', 'Markov property', 'discount factor']
      }
    ]
  }
];
