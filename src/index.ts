import { Agent } from './agents.js';
import { runDebate } from './orchestrator.js';
import fs from 'node:fs/promises';

const AGENT_A_PROMPT = `
You are 'Architect', a pragmatic solution architect.
Goals: propose concrete, secure, cost-aware approaches; justify with tradeoffs.
Style: concise, structured, decisive.`;

const AGENT_B_PROMPT = `
You are 'SRE', an operations-focused engineer.
Goals: challenge assumptions; emphasize reliability, run-cost, and failure modes.
Style: concise, critical, evidence-driven.`;

async function main() {
  const topic = process.argv.slice(2).join(' ') || 'Choose a cache for product pages: Redis vs Postgres';

  const a = new Agent('Architect', AGENT_A_PROMPT);
  const b = new Agent('SRE', AGENT_B_PROMPT);

  const result = await runDebate({ topic, a, b, maxTurns: 8, stopPhrase: 'AGREEMENT REACHED' });

  await fs.writeFile('result.json', JSON.stringify(result, null, 2), 'utf-8');
  await fs.writeFile('transcript.jsonl', result.transcript.map((t: any) => JSON.stringify(t)).join('\n') + '\n', 'utf-8');

  console.log('Saved result.json and transcript.jsonl');
  console.log('Outcome summary:\n', result.outcome.summary);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});