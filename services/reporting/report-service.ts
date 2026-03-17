import { db } from '@/lib/db';
import { buildEvaluationReport } from '@/services/evaluation/evaluation-service';

export async function completeSessionAndGenerateReport(sessionId: string) {
  const session = await db.trainingSession.findUnique({ where: { id: sessionId }, include: { training: true } });
  if (!session) throw new Error('SESSION_NOT_FOUND');
  const micro = (session.microlearningResult as any)?.score ?? 0;
  const wf = (session.workflowTrace as any)?.processScore ?? 0;
  const roleplayTags = ((session.roleplayTranscript as any)?.tags ?? []) as string[];
  const criticalErrors = ((session.workflowTrace as any)?.criticalErrors ?? []) as string[];

  const report = await buildEvaluationReport({
    trainingTitle: session.training.title,
    microScore: micro,
    processScore: wf,
    roleplayTags,
    criticalErrors,
    transcript: JSON.stringify((session.roleplayTranscript as any)?.messages ?? [])
  });

  await db.trainingSession.update({ where: { id: sessionId }, data: { reportJson: report as any, status: 'COMPLETED', currentStage: 'REPORT', completedAt: new Date() } });
  return report;
}
