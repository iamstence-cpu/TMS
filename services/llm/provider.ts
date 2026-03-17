import { env } from '@/lib/env';
import type { ChatMessage } from '@/domain/roleplay';

export async function chatCompletion(messages: ChatMessage[], temperature = 0.4): Promise<string> {
  if (!env.OPENAI_API_KEY) throw new Error('NO_API_KEY');
  const res = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: env.LLM_MODEL, messages, temperature })
  });
  if (!res.ok) throw new Error(`LLM_FAILED_${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? '';
}
