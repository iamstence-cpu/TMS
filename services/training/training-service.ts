import { db } from '@/lib/db';
import { safeJsonParse } from '@/lib/utils';

export async function listTrainings() {
  const rows = await db.training.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'asc' } });
  return rows.map((t) => ({ ...t, targetRoles: safeJsonParse<string[]>(t.targetRoles, []), learningObjectives: safeJsonParse<string[]>(t.learningObjectives, []) }));
}

export async function getTrainingById(id: string) {
  const t = await db.training.findUnique({ where: { id }, include: { microLesson: true, workflowScenario: true, roleplayScenario: true } });
  if (!t) return null;
  return { ...t, targetRoles: safeJsonParse<string[]>(t.targetRoles, []), learningObjectives: safeJsonParse<string[]>(t.learningObjectives, []) };
}
