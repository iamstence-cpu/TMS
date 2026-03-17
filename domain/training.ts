export type TrainingSummary = {
  id: string; slug: string; title: string; category: string; description: string;
  difficulty: string; estimatedMinutes: number; targetRoles: string[]; learningObjectives: string[];
};

export type QuizItem = { id: string; question: string; options: string[]; answer: number; explanation: string };
export type WorkflowStep = { stepId: string; prompt: string; options: { id: string; text: string }[]; correctOptionId: string; explanation: string; scoreWeight: number; isCritical: boolean; errorTag?: string; feedbackIfWrong: string };
