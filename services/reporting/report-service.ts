import { db } from '@/lib/db';
import { parseMicroResult, parseRoleplayTranscript, parseWorkflowTrace } from '@/lib/session-data';
import { buildEvaluationReport } from '@/services/evaluation/evaluation-service';

function getRecommendedNext(slug: string) {
  const order = [
    'initial-health-intake',
    'hypertension-risk-education',
    'diabetes-followup-adherence',
    'weight-management-motivation'
  ];
  const idx = order.indexOf(slug);
  const nextSlug = order[(idx + 1) % order.length];
  return nextSlug;
}

export async function completeSessionAndGenerateReport(sessionId: string) {
  const session = await db.trainingSession.findUnique({ where: { id: sessionId }, include: { training: true } });
  if (!session) throw new Error('SESSION_NOT_FOUND');

  const micro = parseMicroResult(session.microlearningResult).score;
  const workflow = parseWorkflowTrace(session.workflowTrace);
  const roleplay = parseRoleplayTranscript(session.roleplayTranscript);

  const nextTraining = await db.training.findUnique({ where: { slug: getRecommendedNext(session.training.slug) } });

  const report = await buildEvaluationReport({
    trainingTitle: session.training.title,
    recommendedNextTraining: nextTraining?.title ?? '高血压高风险人群健康教育与干预沟通',
    microScore: micro,
    processScore: workflow.processScore,
    roleplayTags: roleplay.tags,
    criticalErrors: workflow.criticalErrors,
    transcript: JSON.stringify(roleplay.messages)
  });

  await db.trainingSession.update({
    where: { id: sessionId },
    data: { reportJson: report as any, status: 'COMPLETED', currentStage: 'REPORT', completedAt: new Date() }
  });
  return report;
}
