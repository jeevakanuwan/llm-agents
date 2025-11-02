import { callLLM } from './llm.js';

export class Agent {
  constructor(public name: string, public system: string) {}

  async respond(peerUtterance: string, history: string[], model?: string) {
    const transcriptForModel =
      history.concat([`${this.name} (you) should reply to:\n${peerUtterance}`]).join('\n\n---\n\n');
    const reply = await callLLM(this.system, transcriptForModel, model);
    return reply.trim();
  }
}