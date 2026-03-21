import { microResultSchema, roleplayTranscriptSchema, workflowTraceSchema } from '@/lib/contracts';

export const parseMicroResult = (value: unknown) => {
  const parsed = microResultSchema.safeParse(value);
  return parsed.success ? parsed.data : { answers: [], score: 0, correct: 0, total: 0 };
};

export const parseWorkflowTrace = (value: unknown) => {
  const parsed = workflowTraceSchema.safeParse(value);
  return parsed.success ? parsed.data : { trace: [], processScore: 0, criticalErrors: [], tags: [] };
};

export const parseRoleplayTranscript = (value: unknown) => {
  const parsed = roleplayTranscriptSchema.safeParse(value);
  return parsed.success ? parsed.data : { messages: [], tags: [] };
};
