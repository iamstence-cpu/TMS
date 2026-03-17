'use client';
import { useEffect, useState } from 'react';
import { SessionNav } from '@/components/session-nav';

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<any>();
  useEffect(() => { fetch(`/api/sessions/${params.id}/report`).then((r) => r.json()).then((j) => setReport(j.data)); }, [params.id]);
  if (!report) return <main className="container-page"><SessionNav id={params.id} />报告生成中...</main>;
  return <main className="container-page space-y-3"><SessionNav id={params.id} /><div className="card"><h1 className="text-xl font-semibold">自动评估报告</h1><p>总体评分：{report.overallScore}</p><div className="grid grid-cols-2 gap-2 text-sm"><p>knowledge: {report.knowledgeScore}</p><p>process: {report.processScore}</p><p>risk: {report.riskRecognitionScore}</p><p>communication: {report.communicationScore}</p><p>compliance: {report.complianceBoundaryScore}</p></div><p className="mt-2 text-sm">亮点：{(report.strengths||[]).join('；')}</p><p className="text-sm">薄弱点：{(report.weaknesses||[]).join('；')}</p><p className="text-sm text-red-600">严重错误：{(report.criticalErrors||[]).join('；') || '无'}</p><p className="text-sm">补练建议：{(report.remediationPlan||[]).join('；')}</p><p className="text-xs text-slate-500 mt-2">{report.complianceReminder}</p></div></main>;
}
