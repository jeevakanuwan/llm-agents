import { openai } from './llm.js';

export type Turn = { ts: string; turn: number; agent: string; content: string };

export type Outcome = {
  summary: string;
  agreements: string[];
  disagreements: string[];
  action_items: { owner: string; task: string; due?: string | null }[];
};

export async function summarizeOutcome(topic: string, transcript: Turn[], model = 'gpt-4o-mini') {
  const transcriptText = transcript.map(t => `${t.agent}: ${t.content}`).join('\n\n');

  const response = await openai.responses.create({
    model,
    input: [
      {
        role: 'user',
        content: [
          { type: 'text', text: `Topic: ${topic}\n\nTranscript:\n${transcriptText}\n\nReturn a JSON that matches the schema.` }
        ]
      }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'DebateOutcome',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            summary: { type: 'string' },
            agreements: { type: 'array', items: { type: 'string' } },
            disagreements: { type: 'array', items: { type: 'string' } },
            action_items: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  owner: { type: 'string' },
                  task: { type: 'string' },
                  due: { type: ['string', 'null'] }
                },
                required: ['owner', 'task']
              }
            }
          },
          required: ['summary', 'agreements', 'disagreements', 'action_items']
        }
      }
    }
  });

  // @ts-ignore
  const json = (response as any).output[0].content[0].text ?? (response as any).output_text;
  return JSON.parse(json) as Outcome;
}

export async function runDebate({
  topic,
  a,
  b,
  maxTurns = 10,
  stopPhrase = 'AGREEMENT REACHED',
  model = 'gpt-4o-mini'
}: any) {
  const transcript: Turn[] = [];
  const history: string[] = [];

  const preamble = `Topic: ${topic}\nDebate with specifics. If consensus is reached, end with: ${stopPhrase}.`;

  let msg = await a.respond(preamble, history, model);
  transcript.push({ ts: new Date().toISOString(), turn: 1, agent: a.name, content: msg });
  history.push(`${a.name}: ${msg}`);

  for (let i = 2; i <= maxTurns; i += 2) {
    const replyB = await b.respond(msg, history, model);
    transcript.push({ ts: new Date().toISOString(), turn: i, agent: b.name, content: replyB });
    history.push(`${b.name}: ${replyB}`);
    if (replyB.includes(stopPhrase)) break;

    const replyA = await a.respond(replyB, history, model);
    transcript.push({ ts: new Date().toISOString(), turn: i + 1, agent: a.name, content: replyA });
    history.push(`${a.name}: ${replyA}`);
    if (replyA.includes(stopPhrase)) break;
  }

  const outcome = await summarizeOutcome(topic, transcript, model);

  return {
    topic,
    agents: [{ name: a.name }, { name: b.name }],
    config: { maxTurns, stopPhrase, model },
    transcript,
    outcome,
    metrics: { turns: transcript.length }
  };
}