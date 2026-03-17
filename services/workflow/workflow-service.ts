import type { BehaviorTag } from '@/domain/session';
import type { WorkflowStep } from '@/domain/training';

export function evaluateWorkflow(steps: WorkflowStep[], trace: { stepId: string; selectedOptionId: string }[]) {
  let score = 0; let total = 0; const criticalErrors: string[] = []; const tags: BehaviorTag[] = [];
  for (const s of steps) {
    total += s.scoreWeight * 10;
    const t = trace.find((x) => x.stepId === s.stepId);
    if (t?.selectedOptionId === s.correctOptionId) score += s.scoreWeight * 10;
    else if (s.isCritical && s.errorTag) criticalErrors.push(s.errorTag);
  }
  if (trace.length >= 4) tags.push('asked_basic_info', 'provided_behavior_advice');
  if (trace.length >= 6) tags.push('suggested_followup', 'documented_next_step');
  if (criticalErrors.includes('missed_red_flag')) tags.push('missed_red_flag');
  return { processScore: Math.round((score / Math.max(total, 1)) * 100), criticalErrors, tags };
}
