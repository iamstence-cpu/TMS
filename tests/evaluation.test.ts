import test from 'node:test';
import assert from 'node:assert/strict';
import { extractBehaviorTags } from '@/services/roleplay/roleplay-service';
import { evaluateWorkflow } from '@/services/workflow/workflow-service';

test('extractBehaviorTags should detect referral and boundary', () => {
  const tags = extractBehaviorTags('建议你尽快就医复查，我会记录并安排下次随访，不做诊断。');
  assert.ok(tags.includes('suggested_referral'));
  assert.ok(tags.includes('documented_next_step'));
});

test('evaluateWorkflow should score by correctness', () => {
  const steps = [{ stepId: 's1', prompt: '', options: [], correctOptionId: 'a', explanation: '', scoreWeight: 1, isCritical: false, feedbackIfWrong: '' }, { stepId: 's2', prompt: '', options: [], correctOptionId: 'a', explanation: '', scoreWeight: 1, isCritical: true, errorTag: 'missed_red_flag', feedbackIfWrong: '' }] as any;
  const r = evaluateWorkflow(steps, [{ stepId: 's1', selectedOptionId: 'a' }, { stepId: 's2', selectedOptionId: 'b' }]);
  assert.equal(r.processScore, 50);
  assert.ok(r.criticalErrors.includes('missed_red_flag'));
});
