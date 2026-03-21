import type { EvaluationReport } from '@/domain/session';
import { evaluatorPrompt, compliancePrompt } from '@/services/llm/prompts';
import { chatCompletion } from '@/services/llm/provider';

export async function buildEvaluationReport(input: {
  trainingTitle: string;
  recommendedNextTraining: string;
  microScore: number;
  processScore: number;
  roleplayTags: string[];
  criticalErrors: string[];
  transcript: string;
}): Promise<EvaluationReport> {
  const risk = input.roleplayTags.includes('suggested_referral') ? 80 : 55;
  const communication = input.roleplayTags.includes('checked_understanding') ? 82 : 65;
  const compliance = input.roleplayTags.includes('overstepped_medical_boundary') ? 40 : 85;
  const overall = Math.round((input.microScore + input.processScore + risk + communication + compliance) / 5);

  const base: EvaluationReport = {
    overallScore: overall,
    knowledgeScore: input.microScore,
    processScore: input.processScore,
    riskRecognitionScore: risk,
    communicationScore: communication,
    complianceBoundaryScore: compliance,
    strengths: ['能够完成基础流程并形成结构化沟通'],
    weaknesses: ['建议进一步强化风险追问和执行确认'],
    criticalErrors: input.criticalErrors,
    remediationPlan: ['复练当前主题并聚焦红旗信号识别', '每次沟通都加入转介边界提醒'],
    recommendedNextTraining: input.recommendedNextTraining,
    behaviorTags: input.roleplayTags as any,
    moduleDetails: { microScore: input.microScore, workflowScore: input.processScore, roleplayTags: input.roleplayTags },
    complianceReminder: '本系统用于岗位训练，不替代医生诊疗。出现异常体征或药物调整问题请建议就医。'
  };

  try {
    const text = await chatCompletion([
      { role: 'system', content: `${evaluatorPrompt}\n${compliancePrompt}` },
      { role: 'user', content: JSON.stringify(input) }
    ], 0.2);
    const parsed = JSON.parse(text);
    return { ...base, ...parsed, recommendedNextTraining: parsed.recommendedNextTraining || input.recommendedNextTraining };
  } catch {
    return base;
  }
}
