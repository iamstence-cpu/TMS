'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SessionNav } from '@/components/session-nav';

export default function WorkflowPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<any>();
  const [trace, setTrace] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>();
  useEffect(() => { fetch(`/api/sessions/${params.id}`).then((r) => r.json()).then((j) => setSession(j.data)); }, [params.id]);
  const steps = session?.training?.workflowScenario?.steps ?? [];
  return <main className="container-page"><SessionNav id={params.id} /><div className="card"><h1 className="text-lg font-semibold">Workflow Simulation</h1>{steps.map((s: any) => <div className="mt-3" key={s.stepId}><p className="text-sm">{s.prompt}</p><div className="flex gap-2">{s.options.map((o: any) => <button className="btn-secondary" key={o.id} onClick={async ()=>{setTrace((t)=>({...t,[s.stepId]:o.id})); const r=await fetch(`/api/sessions/${params.id}/workflow/submit-step`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({stepId:s.stepId,selectedOptionId:o.id})}); setResult((await r.json()).data);}}>{o.text}</button>)}</div></div>)}{result && <p className="mt-3 text-sm">流程得分：{result.processScore}，关键错误：{(result.criticalErrors||[]).join(',')||'无'} <Link href={`/session/${params.id}/roleplay`} className="text-blue-700">继续 Roleplay</Link></p>}</div></main>;
}
