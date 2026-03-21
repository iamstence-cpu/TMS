import { z } from 'zod';

export const sectionSchema = z.object({
  title: z.string(),
  explanation: z.string(),
  keyReminder: z.string(),
  commonMistakes: z.array(z.string())
});

export const quizItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  answer: z.number().int(),
  explanation: z.string()
});

export const workflowOptionSchema = z.object({ id: z.string(), text: z.string() });
export const workflowStepSchema = z.object({
  stepId: z.string(),
  prompt: z.string(),
  options: z.array(workflowOptionSchema),
  correctOptionId: z.string(),
  explanation: z.string(),
  scoreWeight: z.number(),
  isCritical: z.boolean(),
  errorTag: z.string().optional(),
  feedbackIfWrong: z.string()
});

export const roleplayMessageSchema = z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string() });
export const roleplayTranscriptSchema = z.object({
  messages: z.array(roleplayMessageSchema).default([]),
  tags: z.array(z.string()).default([])
});

export const microResultSchema = z.object({
  answers: z.array(z.number()),
  score: z.number(),
  correct: z.number(),
  total: z.number()
});

export const workflowTraceSchema = z.object({
  trace: z.array(z.object({ stepId: z.string(), selectedOptionId: z.string() })),
  processScore: z.number(),
  criticalErrors: z.array(z.string()),
  tags: z.array(z.string())
});
