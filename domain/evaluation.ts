import { z } from 'zod';

export const createSessionSchema = z.object({ trainingId: z.string().min(1), anonymousId: z.string().optional() });
export const microSubmitSchema = z.object({ answers: z.array(z.number()) });
export const workflowStepSchema = z.object({ stepId: z.string(), selectedOptionId: z.string() });
export const roleplayMessageSchema = z.object({ message: z.string().min(1).max(500) });
