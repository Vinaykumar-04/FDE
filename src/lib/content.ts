import { z } from 'zod';

export const flashcardSchema = z.object({ front: z.string(), back: z.string() });
export const quizItemSchema = z.object({
  question: z.string(), choices: z.array(z.string()).length(3), answer: z.number().int().min(0).max(2), explanation: z.string(),
});
export const lessonSchema = z.object({
  id: z.string(), title: z.string(), minutes: z.number().int(), xp: z.number().int(),
  why: z.string().optional(), concept: z.string().optional(), analogy: z.string().optional(), example: z.string().optional(), mistake: z.string().optional(), nextStep: z.string().optional(), distractor: z.string().optional(),
  quiz: z.array(quizItemSchema).length(3), cards: z.array(flashcardSchema).length(3),
});
export type Lesson = z.infer<typeof lessonSchema>;
export type QuizItem = z.infer<typeof quizItemSchema>;

export const levels = [
  { id: 'L0-recruit', code: 'L0', rank: 'Recruit', title: 'Start with the essentials', color: 'blue', topics: 'The FDE role, terminal, Git, Python, HTTP and JSON', games: ['Status Code Match', 'Terminal Quest', 'JSON Debugger'], boss: 'Fix a broken integration script', bossId: 'integration-script' },
  { id: 'L1-builder', code: 'L1', rank: 'Builder', title: 'Build and ship', color: 'amber', topics: 'Python modules, REST APIs, SQL, Docker and cloud', games: ['API Range', 'Data Desk', 'Dockerfile Puzzle'], boss: 'Ship a small API in a container', bossId: 'container-api' },
  { id: 'L2-integrator', code: 'L2', rank: 'Integrator', title: 'Connect systems reliably', color: 'teal', topics: 'OAuth, webhooks, retries, ETL, logging and idempotency', games: ['Retry Storm', 'Pipeline Builder', 'Webhook Doctor'], boss: 'Sync two systems without duplicates', bossId: 'duplicate-safe-sync' },
  { id: 'L3-ai-engineer', code: 'L3', rank: 'AI Engineer', title: 'Build grounded AI', color: 'orange', topics: 'LLMs, prompts, RAG, tools, agents, evals and cost', games: ['RAG Workshop', 'Tool Calling', 'Prompt Fixer', 'Eval Lab'], boss: 'Ship an assistant with a passing eval', bossId: 'grounded-assistant' },
  { id: 'L4-field-operator', code: 'L4', rank: 'Field Operator', title: 'Run it safely in the field', color: 'rose', topics: 'Security, CI/CD, Kubernetes, on-prem and incidents', games: ['Security Checkpoint', 'Incident Commander', 'Deploy Roulette'], boss: 'Survive a production incident', bossId: 'production-incident' },
  { id: 'L5-fde-hero', code: 'L5', rank: 'FDE Hero', title: 'Lead a customer engagement', color: 'gold', topics: 'Discovery, scoping, demos, portfolio and interviews', games: ['Customer Room', 'Scope Wars', 'Interview Gauntlet', 'Portfolio Review'], boss: 'Run an engagement from request to handover', bossId: 'customer-engagement' },
] as const;

export const lessonIdsByLevel = {
  'L0-recruit': ['what-an-fde-does', 'fde-career-paths', 'terminal-basics', 'git-and-python', 'http-and-status-codes', 'json-and-integrations'],
  'L1-builder': ['python-modules', 'rest-api-requests', 'sql-and-tables', 'docker-containers', 'cloud-basics', 'ship-small-api'],
  'L2-integrator': ['api-keys-oauth', 'webhook-foundations', 'pagination', 'retries-backoff', 'idempotency', 'etl-logging'],
  'L3-ai-engineer': ['llm-apis', 'prompting', 'structured-output', 'embeddings', 'rag-grounding', 'tools-evals'],
  'L4-field-operator': ['security-basics', 'tenant-secrets', 'cicd', 'kubernetes-basics', 'onprem-airgap', 'observability-incidents'],
  'L5-fde-hero': ['customer-discovery', 'scoping-priorities', 'stakeholder-communication', 'demos-handover', 'case-study-portfolio', 'interviews-negotiation'],
} as const;

export type LevelId = keyof typeof lessonIdsByLevel;
export const lessonIds = Object.values(lessonIdsByLevel).flat() as string[];
export const gateKey = (levelId: string) => `gate:${levelId}`;
export const gameIdByTitle: Record<string, string> = {
  'Status Code Match': 'status-code-match', 'Terminal Quest': 'terminal-quest', 'JSON Debugger': 'json-debugger',
  'API Range': 'api-range', 'Data Desk': 'data-desk', 'Dockerfile Puzzle': 'dockerfile-puzzle',
  'Retry Storm': 'retry-storm', 'Pipeline Builder': 'pipeline-builder', 'Webhook Doctor': 'webhook-doctor',
  'RAG Workshop': 'rag-workshop', 'Tool Calling': 'tool-calling', 'Prompt Fixer': 'prompt-fixer', 'Eval Lab': 'eval-lab',
  'Security Checkpoint': 'security-checkpoint', 'Incident Commander': 'incident-commander', 'Deploy Roulette': 'deploy-roulette',
  'Customer Room': 'customer-room', 'Scope Wars': 'scope-wars', 'Interview Gauntlet': 'interview-gauntlet', 'Portfolio Review': 'portfolio-review',
};
