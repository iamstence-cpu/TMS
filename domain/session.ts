export type BehaviorTag =
  | 'asked_basic_info' | 'explored_lifestyle' | 'explored_history' | 'identified_risk_factor'
  | 'provided_behavior_advice' | 'checked_understanding' | 'suggested_followup' | 'suggested_referral'
  | 'documented_next_step' | 'overstepped_medical_boundary' | 'made_unrealistic_promise' | 'missed_red_flag';

export type EvaluationReport = {
  overallScore: number;
  knowledgeScore: number;
  processScore: number;
  riskRecognitionScore: number;
  communicationScore: number;
  complianceBoundaryScore: number;
  strengths: string[];
  weaknesses: string[];
  criticalErrors: string[];
  remediationPlan: string[];
  recommendedNextTraining: string;
  behaviorTags: BehaviorTag[];
  moduleDetails: Record<string, unknown>;
  complianceReminder: string;
};
