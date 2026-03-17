import { PrismaClient, TrainingStatus } from '@prisma/client';

const prisma = new PrismaClient();

type SeedTraining = {
  slug: string; title: string; category: string; description: string; difficulty: string; estimatedMinutes: number;
  targetRoles: string[]; learningObjectives: string[];
  microIntro: string; sections: unknown[]; quizItems: unknown[];
  workflow: { title: string; description: string; context: string; steps: unknown[]; passingRules: unknown; criticalMistakes: unknown[] };
  roleplay: { roleType: string; persona: string; openingMessage: string; objectives: string[]; scoringRubric: unknown; stopConditions: unknown; escalationRules: string[] };
};

const mkSteps = (items: string[]) => items.map((prompt, i) => ({ stepId: `s${i + 1}`, prompt, options: [{ id: 'a', text: '流程化执行并记录' }, { id: 'b', text: '跳过关键询问' }, { id: 'c', text: '直接给诊断建议' }], correctOptionId: 'a', explanation: '岗位训练强调流程完整、边界清晰。', scoreWeight: i === 5 ? 2 : 1, isCritical: i >= 4, errorTag: i >= 4 ? 'missed_red_flag' : 'process_incomplete', feedbackIfWrong: '请按训练流程补全信息并保持非诊断边界。' }));

const baseQuiz = [
  { id: 'q1', question: '以下哪项属于健康管理师在训练中的合规表达？', options: ['直接调整药量', '建议记录指标并及时就医评估', '确诊疾病类型'], answer: 1, explanation: '健康管理师不做诊断和处方调整。' },
  { id: 'q2', question: '发现异常风险信号时优先动作是？', options: ['继续闲聊', '建议转介或尽快就医', '自行下诊断'], answer: 1, explanation: '应及时提示转介。' },
  { id: 'q3', question: '流程训练最关键的是？', options: ['随意发挥', '完整记录与关键项不遗漏', '只追求聊天轮次'], answer: 1, explanation: '流程完整性决定服务质量。' }
];

const trainings: SeedTraining[] = [
  {
    slug: 'initial-health-intake', title: '首次健康信息采集与建档', category: '建档采集', description: '训练初次接触对象的信息采集、知情告知与建档留痕能力。', difficulty: '初级', estimatedMinutes: 35,
    targetRoles: ['健康管理师'], learningObjectives: ['获取基础信息', '获取生活方式', '采集既往史与家族史', '隐私合规沟通'],
    microIntro: '你将学习如何在首次服务中完成规范建档并降低信息遗漏。',
    sections: [
      { title: '开场说明', explanation: '先说明训练目的与隐私边界。', keyReminder: '先告知，再询问。', commonMistakes: ['直接追问隐私'] },
      { title: '生活方式采集', explanation: '饮食、运动、睡眠、烟酒信息应结构化收集。', keyReminder: '先开放式，再量化。', commonMistakes: ['遗漏睡眠与压力'] },
      { title: '病史药史与关注点', explanation: '关注既往史、家族史、用药与当下诉求。', keyReminder: '不作诊断结论。', commonMistakes: ['越权解释药物调整'] }
    ],
    quizItems: baseQuiz,
    workflow: { title: '首次建档流程模拟', description: '完整走通首访建档流程', context: '社区首次接触对象，存在隐私顾虑。', steps: mkSteps(['开场说明与知情告知', '获取基本信息', '获取生活方式', '获取既往史/家族史', '识别转介风险信号', '总结确认建档信息', '完成服务记录', '确认后续随访安排']), passingRules: { minScore: 70, maxCriticalErrors: 1 }, criticalMistakes: ['missed_red_flag', 'overstepped_medical_boundary'] },
    roleplay: { roleType: '社区初访对象', persona: '略有戒备，不愿一次性透露全部信息，对隐私敏感。', openingMessage: '我第一次来，你们会不会把我的信息到处共享？', objectives: ['建立信任', '完成关键采集', '边界提醒与留痕'], scoringRubric: { empathy: 20, process: 30, risk: 25, compliance: 25 }, stopConditions: { maxRounds: 8 }, escalationRules: ['遇到急性异常建议就医'] }
  },
  {
    slug: 'hypertension-risk-education', title: '高血压高风险人群健康教育与干预沟通', category: '慢病风险教育', description: '训练风险识别、生活方式教育与边界提示。', difficulty: '中级', estimatedMinutes: 40,
    targetRoles: ['健康管理师'], learningObjectives: ['识别风险因素', '提出行为建议', '提醒监测复查', '避免诊疗越权'],
    microIntro: '你将面向“觉得自己没问题”的对象进行行为干预沟通。',
    sections: [
      { title: '风险识别框架', explanation: '围绕体重、盐摄入、活动量、睡眠、压力采集风险。', keyReminder: '识别先于建议。', commonMistakes: ['未先了解真实障碍'] },
      { title: '非诊断教育表达', explanation: '使用可执行建议，避免医学诊断。', keyReminder: '建议可落地。', commonMistakes: ['给出药量建议'] },
      { title: '就医边界', explanation: '出现持续高值或不适应建议就医评估。', keyReminder: '边界反复强调。', commonMistakes: ['弱化转介'] }
    ], quizItems: baseQuiz,
    workflow: { title: '高血压风险教育流程', description: '从风险识别到执行计划确认', context: '对象抗拒改变生活方式。', steps: mkSteps(['确认沟通目标', '获取基础情况', '识别主要风险因素', '提出饮食和运动建议', '强调监测与复查', '说明何时需就医', '确认理解与执行计划', '记录本次服务']), passingRules: { minScore: 70, maxCriticalErrors: 1 }, criticalMistakes: ['made_unrealistic_promise', 'overstepped_medical_boundary'] },
    roleplay: { roleType: '抗拒改变的中年客户', persona: '觉得自己没事，不愿改饮食和作息，总有借口。', openingMessage: '我血压偶尔高一点，不用小题大做吧？', objectives: ['识别风险', '提出可执行建议', '确认执行计划'], scoringRubric: { empathy: 20, guidance: 30, risk: 25, compliance: 25 }, stopConditions: { maxRounds: 8 }, escalationRules: ['若头痛胸闷明显建议尽快就医'] }
  },
  {
    slug: 'diabetes-followup-adherence', title: '糖尿病管理对象随访沟通与依从性提升', category: '慢病随访', description: '训练线上/电话随访，识别依从性问题与异常信号。', difficulty: '中级', estimatedMinutes: 45,
    targetRoles: ['健康管理师'], learningObjectives: ['结构化随访', '依从性提升', '异常信号识别', '转介意识'],
    microIntro: '通过随访训练提升依从性沟通能力。',
    sections: [
      { title: '随访结构', explanation: '身份核实、监测回顾、依从性排查、下一步计划。', keyReminder: '先核实再提问。', commonMistakes: ['直接给建议'] },
      { title: '依从性沟通', explanation: '探查障碍，给可执行替代方案。', keyReminder: '共同制定目标。', commonMistakes: ['指责对象'] },
      { title: '异常信号处理', explanation: '出现头晕乏力等需要提示就医。', keyReminder: '风险优先。', commonMistakes: ['忽略红旗症状'] }
    ], quizItems: baseQuiz,
    workflow: { title: '糖尿病随访流程', description: '完成随访沟通与风险判断', context: '对象血糖波动，依从性一般。', steps: mkSteps(['核实身份与背景', '询问监测与感受', '询问饮食/运动/服药', '识别依从性问题', '识别异常风险信号', '给出后续建议', '必要时建议就医', '记录与下次安排']), passingRules: { minScore: 70, maxCriticalErrors: 1 }, criticalMistakes: ['missed_red_flag'] },
    roleplay: { roleType: '依从性较差的服务对象', persona: '有时忘记监测，不太愿意承认问题，偶有头晕。', openingMessage: '最近有点累，血糖我也没怎么测。', objectives: ['识别依从性障碍', '风险提醒', '形成下次计划'], scoringRubric: { empathy: 20, adherence: 30, risk: 25, compliance: 25 }, stopConditions: { maxRounds: 8 }, escalationRules: ['持续不适建议就医'] }
  },
  {
    slug: 'weight-management-motivation', title: '体重管理咨询与行为改变激励', category: '体重管理', description: '训练目标设定、激励沟通与风险边界控制。', difficulty: '中级', estimatedMinutes: 35,
    targetRoles: ['健康管理师'], learningObjectives: ['获取相关信息', '识别不合理预期', '行为改变激励', '避免极端减重建议'],
    microIntro: '学习应对“追求快速瘦身”对象，建立合理可执行方案。',
    sections: [
      { title: '预期管理', explanation: '澄清目标并识别不合理期待。', keyReminder: '先校准预期。', commonMistakes: ['承诺短期大幅减重'] },
      { title: '行为策略', explanation: '饮食、运动、睡眠、压力管理小步迭代。', keyReminder: '以周为单位设置目标。', commonMistakes: ['过度激进方案'] },
      { title: '边界提醒', explanation: '不推荐极端饮食或未经证实疗法。', keyReminder: '安全优先。', commonMistakes: ['夸大效果'] }
    ], quizItems: baseQuiz,
    workflow: { title: '体重管理咨询流程', description: '从动机访谈到目标制定', context: '对象急于求成，寻求捷径。', steps: mkSteps(['了解目标与动机', '获取生活方式信息', '识别不合理期待', '提出可执行策略', '设定阶段目标', '激励性总结', '说明风险边界', '记录与复盘安排']), passingRules: { minScore: 70, maxCriticalErrors: 1 }, criticalMistakes: ['made_unrealistic_promise', 'overstepped_medical_boundary'] },
    roleplay: { roleType: '急于减重客户', persona: '想快速瘦，容易被极端方法吸引，希望有捷径。', openingMessage: '我一个月要瘦15斤，有没有最快的方法？', objectives: ['纠偏预期', '给出安全方案', '提升参与感'], scoringRubric: { empathy: 20, motivation: 30, risk: 25, compliance: 25 }, stopConditions: { maxRounds: 8 }, escalationRules: ['出现不适或极端行为建议就医'] }
  }
];

async function main() {
  await prisma.trainingSession.deleteMany();
  await prisma.roleplayScenario.deleteMany();
  await prisma.workflowScenario.deleteMany();
  await prisma.microLesson.deleteMany();
  await prisma.training.deleteMany();

  for (const t of trainings) {
    const training = await prisma.training.create({ data: { slug: t.slug, title: t.title, category: t.category, description: t.description, targetRoles: JSON.stringify(t.targetRoles), learningObjectives: JSON.stringify(t.learningObjectives), difficulty: t.difficulty, estimatedMinutes: t.estimatedMinutes, status: TrainingStatus.PUBLISHED } });
    await prisma.microLesson.create({ data: { trainingId: training.id, intro: t.microIntro, sections: t.sections, quizItems: t.quizItems } });
    await prisma.workflowScenario.create({ data: { trainingId: training.id, title: t.workflow.title, description: t.workflow.description, context: t.workflow.context, steps: t.workflow.steps, passingRules: t.workflow.passingRules, criticalMistakes: t.workflow.criticalMistakes } });
    await prisma.roleplayScenario.create({ data: { trainingId: training.id, roleType: t.roleplay.roleType, persona: t.roleplay.persona, openingMessage: t.roleplay.openingMessage, objectives: t.roleplay.objectives, scoringRubric: t.roleplay.scoringRubric, stopConditions: t.roleplay.stopConditions, escalationRules: t.roleplay.escalationRules } });
  }
}

main().finally(() => prisma.$disconnect());
