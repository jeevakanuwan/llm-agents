import 'dotenv/config';
import OpenAI from 'openai';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function callLLM(system: string, inputText: string, model = 'gpt-4o-mini') {
  const res = await openai.responses.create({
    model,
    instructions: system,
    input: inputText
  });
  // @ts-ignore
  return (res as any).output_text ?? '';
}