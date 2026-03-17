import { clientRoleplayPrompt } from '@/services/llm/prompts';
import { chatCompletion } from '@/services/llm/provider';
import type { ChatMessage } from '@/domain/roleplay';
import type { BehaviorTag } from '@/domain/session';

export async function generateClientReply(input: { persona: string; openingMessage: string; transcript: ChatMessage[]; round: number; }) {
  if (input.round === 0) return input.openingMessage;
  try {
    const content = await chatCompletion([
      { role: 'system', content: `${clientRoleplayPrompt}\nPersona:${input.persona}` },
      ...input.transcript.slice(-8)
    ]);
    return content || '我有点担心这个建议是否适合我，能再解释具体做法吗？';
  } catch {
    return '我听懂了一部分，但我担心做不到。你可以给我一个更容易执行的下一步吗？';
  }
}

export function extractBehaviorTags(text: string): BehaviorTag[] {
  const s = text.toLowerCase();
  const tags: BehaviorTag[] = [];
  if (/基本信息|年龄|身高|体重|病史/.test(text)) tags.push('asked_basic_info');
  if (/饮食|运动|作息|睡眠|烟酒/.test(text)) tags.push('explored_lifestyle');
  if (/家族史|既往史|用药/.test(text)) tags.push('explored_history');
  if (/风险|高风险|指标异常/.test(text)) tags.push('identified_risk_factor');
  if (/建议|计划|每周|可执行/.test(text)) tags.push('provided_behavior_advice');
  if (/你觉得|是否理解|能做到/.test(text)) tags.push('checked_understanding');
  if (/复查|随访|下次/.test(text)) tags.push('suggested_followup');
  if (/就医|转诊|转介/.test(text)) tags.push('suggested_referral');
  if (/记录|留痕|登记/.test(text)) tags.push('documented_next_step');
  if (/确诊|诊断|药量加/.test(text) || /prescribe|dose|diagnosis/.test(s)) tags.push('overstepped_medical_boundary');
  if (/保证瘦|快速减重|包治/.test(text)) tags.push('made_unrealistic_promise');
  return [...new Set(tags)];
}
