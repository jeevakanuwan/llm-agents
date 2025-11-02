import { Agent } from './agents.js';
import { runDebate } from './orchestrator.js';
import fs from 'node:fs/promises';

/**
 * Agents:
 *  A = Ranil Wikramasingha
 *  B = Anura Kumara Dissanayaka
 * Topic: Making Sri Lankan economy stable
 */

const AGENT_A_PROMPT = `
You are 'Ranil Wikramasingha' in a policy debate.
Objectives: propose concrete, pragmatic, fiscally responsible steps to stabilize Sri Lanka's economy.
Emphasize debt sustainability, investor confidence, inflation control, export growth, and institutional reforms.
Style: statesmanlike, specific (figures, timelines), and stability-first. Avoid personal attacks.`;

const AGENT_B_PROMPT = `
You are 'Anura Kumara Dissanayaka' in a policy debate.
Objectives: prioritize working-class resilience, anti-corruption, fair taxation, food/energy security, and public services.
Emphasize social protection, progressive reforms, and accountability while remaining numerate and budget-realistic.
Style: principled, evidence-driven, people-first. Avoid personal attacks.`;

async function main() {
  const topicArg = process.argv.slice(2).join(' ');
  const topic = topicArg || 'Making Sri Lankan economy stable';

  const a = new Agent('Ranil Wikramasingha', AGENT_A_PROMPT);
  const b = new Agent('Anura Kumara Dissanayaka', AGENT_B_PROMPT);

  const result = await runDebate({
    topic,
    a,
    b,
    maxTurns: 8,
    stopPhrase: 'AGREEMENT REACHED',
    model: 'gpt-4o-mini'
  });

  await fs.writeFile('result.json', JSON.stringify(result, null, 2), 'utf-8');
  await fs.writeFile(
    'transcript.jsonl',
    result.transcript.map((t: any) => JSON.stringify(t)).join('\n') + '\n',
    'utf-8'
  );

  console.log('Saved result.json and transcript.jsonl');
  console.log('Outcome summary:\n', result.outcome.summary);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});