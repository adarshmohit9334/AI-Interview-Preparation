/**
 * InterviewIQ AI - Hardcoded Question Bank
 * Structured original question dataset for multiple roles, topics, and difficulties.
 * Cleanly separated so it can later be migrated to MySQL or automated question generation.
 */

export const QUESTION_BANK = [
  // --- FRONTEND DEVELOPER QUESTIONS ---
  {
    id: "fe-react-001",
    role: "Frontend Developer",
    topic: "React & State Management",
    difficulty: "Beginner",
    questionText: "Explain the difference between state and props in React. When would you use state versus props?",
    expectedAnswer: "Props (short for properties) are read-only inputs passed from a parent component to a child component, making data unidirectional and predictable. State is local, mutable memory managed internally by a component using hooks like useState. Use props to configure children and pass callbacks; use state for data that changes over time based on user interactions, API responses, or timer events.",
    keyConcepts: [
      "Props are immutable/read-only and passed down",
      "State is internal and managed within the component",
      "State changes trigger component re-renders",
      "Unidirectional data flow in React hierarchy"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 120
  },
  {
    id: "fe-react-002",
    role: "Frontend Developer",
    topic: "React & Performance",
    difficulty: "Intermediate",
    questionText: "How does the virtual DOM work in React, and how does reconciliation optimize rendering performance?",
    expectedAnswer: "The Virtual DOM is a lightweight JavaScript object representation of the real browser DOM kept in memory. When state or props change, React constructs a new virtual DOM tree, computes the diff against the previous snapshot using its heuristic Diffing Algorithm (Reconciliation), and batches minimal mutations to update only what changed in the real DOM. This avoids expensive direct DOM recalculations and layout thrashing.",
    keyConcepts: [
      "In-memory JavaScript representation of DOM",
      "Diffing algorithm (O(n) heuristic reconciliation)",
      "Batching and targeted DOM patches",
      "Avoidance of costly layout thrashing / browser reflows"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },
  {
    id: "fe-js-003",
    role: "Frontend Developer",
    topic: "JavaScript Fundamentals",
    difficulty: "Intermediate",
    questionText: "What is the JavaScript Event Loop, and how does it manage the Call Stack, Microtask Queue, and Callback/Macrotask Queue?",
    expectedAnswer: "JavaScript is single-threaded with a single synchronous call stack. Asynchronous operations are offloaded to web/browser APIs. When ready, promise resolutions go to the Microtask Queue while setTimeout, setInterval, and I/O callbacks go to the Macrotask (Callback) Queue. The Event Loop continuously checks if the Call Stack is empty. Once empty, it exhausts the entire Microtask Queue before processing the next Macrotask.",
    keyConcepts: [
      "Single-threaded execution & synchronous call stack",
      "Microtask queue priority (Promises, queueMicrotask)",
      "Macrotask queue (setTimeout, DOM events)",
      "Event loop cycle and non-blocking I/O model"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },
  {
    id: "fe-perf-004",
    role: "Frontend Developer",
    topic: "Web Performance & Core Vitals",
    difficulty: "Advanced",
    questionText: "How would you identify and optimize Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) in a modern web application?",
    expectedAnswer: "To optimize LCP: preload the hero image or critical font using rel='preload', ensure fast server response times (TTFB), employ CDN caching, minimize render-blocking CSS/JS, and use modern compressed formats like WebP or AVIF. For INP: break long tasks (>50ms) using requestIdleCallback or scheduler.yield(), debounce heavy event listeners, decouple non-critical computations from user gestures, and avoid deep synchronous state cascades.",
    keyConcepts: [
      "LCP measurement criteria and resource preloading",
      "Eliminating render-blocking resources",
      "INP responsiveness and breaking down long tasks",
      "Minimizing main-thread contention during user interactions"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 180
  },

  // --- BACKEND DEVELOPER QUESTIONS ---
  {
    id: "be-node-001",
    role: "Backend Developer",
    topic: "Node.js Architecture",
    difficulty: "Beginner",
    questionText: "What is non-blocking I/O in Node.js, and why does Node.js use an event-driven architecture?",
    expectedAnswer: "Non-blocking I/O means system operations (such as file reads, database queries, or network requests) do not pause the main execution thread while waiting for completion. Instead, Node delegates these operations to libuv's thread pool or OS kernel interfaces and registers a callback. This allows a single-threaded server to handle thousands of concurrent client connections with minimal memory overhead compared to multi-threaded thread-per-request architectures.",
    keyConcepts: [
      "Single-threaded main event loop",
      "Delegation to libuv and asynchronous OS primitives",
      "High concurrency for I/O-bound operations",
      "Low thread overhead compared to thread-per-connection"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 120
  },
  {
    id: "be-api-002",
    role: "Backend Developer",
    topic: "REST & API Design",
    difficulty: "Intermediate",
    questionText: "What does it mean for an HTTP method to be idempotent? Explain which standard HTTP methods are idempotent and why.",
    expectedAnswer: "An HTTP method is idempotent if making the same request multiple identical times produces the exact same server resource state as making it once. GET, HEAD, OPTIONS are idempotent and safe (they don't mutate state). PUT and DELETE are idempotent because replacing a resource or deleting an existing ID achieves the same end state regardless of repeats. POST is NOT idempotent because executing it repeatedly typically creates multiple duplicate resources.",
    keyConcepts: [
      "Definition: f(f(x)) = f(x) for server state",
      "Safe vs idempotent distinction",
      "GET, PUT, DELETE idempotency semantics",
      "POST non-idempotency and practical handling (e.g. Idempotency Keys)"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },
  {
    id: "be-sql-003",
    role: "Backend Developer",
    topic: "Databases & Transactions",
    difficulty: "Advanced",
    questionText: "Explain ACID properties in relational databases and how transaction isolation levels mitigate dirty reads, non-repeatable reads, and phantom reads.",
    expectedAnswer: "ACID stands for Atomicity (all-or-nothing), Consistency (rules/constraints maintained), Isolation (independent concurrent execution), and Durability (committed changes persist). Isolation levels manage concurrency trade-offs: Read Uncommitted allows dirty reads. Read Committed prevents dirty reads. Repeatable Read prevents dirty and non-repeatable reads using MVCC/locks. Serializable provides strict sequential equivalence, preventing phantom reads at the expense of concurrency throughput.",
    keyConcepts: [
      "ACID property definitions and significance",
      "Concurrency anomalies: dirty, non-repeatable, and phantom reads",
      "Four standard ANSI SQL isolation levels",
      "Locking vs MVCC trade-offs"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 180
  },

  // --- FULL STACK DEVELOPER QUESTIONS ---
  {
    id: "fs-auth-001",
    role: "Full Stack Developer",
    topic: "Authentication & Security",
    difficulty: "Intermediate",
    questionText: "Compare JWT stored in localStorage versus HTTP-only, Secure SameSite cookies for web authentication. What are the security trade-offs?",
    expectedAnswer: "JWT stored in localStorage is vulnerable to Cross-Site Scripting (XSS)—any malicious script executing on the origin can read the token and exfiltrate it. In contrast, storing the token in an HttpOnly, Secure cookie prevents JavaScript from accessing it, mitigating XSS token theft. However, cookies are susceptible to Cross-Site Request Forgery (CSRF), which must be defended against using SameSite=Strict/Lax attributes and anti-CSRF tokens.",
    keyConcepts: [
      "XSS risk with localStorage token storage",
      "HttpOnly flag prevents client-side JS access",
      "CSRF vulnerability with cookie authentication",
      "SameSite cookies and CSRF token defenses"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },
  {
    id: "fs-arch-002",
    role: "Full Stack Developer",
    topic: "System Design & Scaling",
    difficulty: "Advanced",
    questionText: "Design an end-to-end strategy to handle real-time notifications in a full-stack web application. When would you use WebSockets vs Server-Sent Events (SSE)?",
    expectedAnswer: "For unidirectional server-to-client updates (such as score updates, system alerts, or progress notifications), Server-Sent Events (SSE) is simpler, operates over standard HTTP/2, includes built-in auto-reconnection, and avoids custom framing. For bidirectional, low-latency communication (such as collaborative editing or interactive chat), WebSockets is superior. At scale, the backend must use a pub/sub backbone (like Redis Pub/Sub) to fan out events across multiple server instances.",
    keyConcepts: [
      "SSE: Unidirectional, native HTTP/2, auto-reconnect",
      "WebSockets: Full-duplex bidirectional communication",
      "Horizontal scaling using Redis Pub/Sub / message brokers",
      "Connection resilience and graceful degradation"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 180
  },

  // --- PYTHON DEVELOPER QUESTIONS ---
  {
    id: "py-core-001",
    role: "Python Developer",
    topic: "Core Python & Memory",
    difficulty: "Beginner",
    questionText: "What is the difference between mutable and immutable data types in Python? Give examples and explain how passing them to functions works.",
    expectedAnswer: "Immutable objects (integers, floats, strings, tuples, frozensets) cannot have their contents altered after creation. Mutable objects (lists, dictionaries, sets) can be modified in-place. Python uses 'call-by-object-reference'. If you pass a mutable object like a list and modify it inside the function, the caller sees the change. If you reassign the variable inside, it points to a new object without altering the caller's reference.",
    keyConcepts: [
      "Immutable types: int, str, tuple",
      "Mutable types: list, dict, set",
      "Call-by-object-reference semantics",
      "In-place modification vs reassignment consequences"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 120
  },
  {
    id: "py-gil-002",
    role: "Python Developer",
    topic: "Concurrency & GIL",
    difficulty: "Intermediate",
    questionText: "What is Python's Global Interpreter Lock (GIL), and how does it impact multi-threaded CPU-bound versus I/O-bound tasks?",
    expectedAnswer: "The GIL is a mutex in CPython that prevents multiple native threads from executing Python bytecodes concurrently, designed to simplify memory management and reference counting. For CPU-bound tasks, multi-threading in Python does not provide true parallelism and can even degrade performance due to lock contention; multiprocessing or C extensions must be used. For I/O-bound tasks, the GIL is released during system calls, making threads effective.",
    keyConcepts: [
      "CPython mutex protecting reference counting",
      "Impact on CPU-bound parallelism (multiprocessing needed)",
      "Release of GIL during I/O operations",
      "Difference between threading and multiprocessing in Python"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },

  // --- JAVA DEVELOPER QUESTIONS ---
  {
    id: "java-jvm-001",
    role: "Java Developer",
    topic: "JVM & Memory Management",
    difficulty: "Intermediate",
    questionText: "Explain Java's memory model: what are the Heap and Stack, and how does Garbage Collection identify unreferenced objects?",
    expectedAnswer: "The Stack stores thread-specific execution frames, primitive local variables, and references to objects. The Heap is shared across threads and stores all actual object instances. Garbage Collection locates unreferenced objects using reachability analysis starting from GC Roots (active stack variables, static fields, JNI references). Objects unreachable from any GC root are swept or compacted across generational spaces (Young Gen: Eden/Survivor, and Tenured/Old Gen).",
    keyConcepts: [
      "Stack memory: thread-local, primitive data, references",
      "Heap memory: shared, object instances",
      "GC Roots and reachability graph",
      "Generational collection (Young, Survivor, Old generation)"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },

  // --- DATA ANALYST QUESTIONS ---
  {
    id: "da-sql-001",
    role: "Data Analyst",
    topic: "SQL & Analytics",
    difficulty: "Intermediate",
    questionText: "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() window functions in SQL with a practical example.",
    expectedAnswer: "All three compute ranks over a partitioned, ordered set. When duplicate values (ties) occur: ROW_NUMBER() assigns strictly unique, consecutive integers regardless of ties (1, 2, 3, 4). RANK() gives ties the same rank and skips subsequent ranks to reflect count (1, 2, 2, 4). DENSE_RANK() gives ties the same rank but does not skip any ranks (1, 2, 2, 3). Use DENSE_RANK when you need consecutive tier rankings without holes.",
    keyConcepts: [
      "Window functions with OVER(PARTITION BY ... ORDER BY ...)",
      "ROW_NUMBER produces distinct sequential IDs",
      "RANK skips positions after duplicate ties",
      "DENSE_RANK preserves consecutive numbering without gaps"
    ],
    scoringRubric: {
      technicalAccuracy: 40,
      conceptualUnderstanding: 30,
      practicalExamples: 20,
      clarity: 10
    },
    suggestedTimeSeconds: 150
  },

  // --- HR INTERVIEW QUESTIONS ---
  {
    id: "hr-behavioral-001",
    role: "HR Interview",
    topic: "Behavioral & STAR Method",
    difficulty: "Beginner",
    questionText: "Tell me about a time when you faced a tight deadline or high-pressure situation on a project. How did you prioritize and deliver?",
    expectedAnswer: "A strong behavioral response follows the STAR method: Situation (project context, timeline constraint), Task (personal responsibility and objective), Action (how tasks were triaged, scope negotiated, blockers removed, or communication managed), and Result (successful delivery, metrics of impact, and lessons learned for future sprints).",
    keyConcepts: [
      "Clear STAR structure (Situation, Task, Action, Result)",
      "Prioritization and time management discipline",
      "Proactive stakeholder communication under stress",
      "Reflective outcome and learning mindset"
    ],
    scoringRubric: {
      communicationClarity: 35,
      relevanceAndStructure: 35,
      practicalActionDemonstrated: 20,
      authenticity: 10
    },
    suggestedTimeSeconds: 120
  },
  {
    id: "hr-conflict-002",
    role: "HR Interview",
    topic: "Team Collaboration & Conflict",
    difficulty: "Intermediate",
    questionText: "Describe a scenario where you had a significant disagreement with a colleague or team lead over a technical or design decision. How did you resolve it?",
    expectedAnswer: "Look for emotional maturity and evidence-driven conflict resolution: acknowledging the other person's perspective, separating personal ego from the problem, gathering objective data or building a small proof-of-concept, finding common alignment with project goals, and committing to the final team consensus respectfully even if it differed from the initial preference.",
    keyConcepts: [
      "Active listening and empathy for differing viewpoints",
      "Objective, data-backed reasoning over emotional reaction",
      "Collaborative resolution aligned with team goals",
      "Commitment to final decision (disagree and commit)"
    ],
    scoringRubric: {
      communicationClarity: 35,
      relevanceAndStructure: 35,
      practicalActionDemonstrated: 20,
      authenticity: 10
    },
    suggestedTimeSeconds: 150
  }
];

export const AVAILABLE_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Python Developer",
  "Java Developer",
  "Data Analyst",
  "HR Interview"
];

export const AVAILABLE_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
export const AVAILABLE_STYLES = ["Technical", "HR", "Mixed"];
export const AVAILABLE_ANSWER_MODES = ["Text", "Audio", "Both"];
