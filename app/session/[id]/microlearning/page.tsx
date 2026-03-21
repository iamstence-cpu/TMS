'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SessionNav } from '@/components/session-nav';

export default function MicroPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<any>();
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>();
  useEffect(() => { fetch(`/api/sessions/${params.id}`).then((r) => r.json()).then((j) => { setSession(j.data); }); }, [params.id]);
  const quiz = session?.training?.microLesson?.quizItems ?? [];
  return <main className="container-page"><SessionNav id={params.id} /><div className="card space-y-3"><h1 className="text-lg font-semibold">微课与小测</h1><p>{session?.training?.microLesson?.intro}</p>{quiz.map((q: any, i: number) => <div key={q.id}><p className="text-sm font-medium">{q.question}</p><div className="flex flex-wrap gap-2">{q.options.map((o: string, idx: number) => <button key={o} onClick={() => setAnswers((a) => { const b=[...a]; b[i]=idx; return b;})} className="btn-secondary">{o}</button>)}</div></div>)}<button className="btn" onClick={async () => { const res = await fetch(`/api/sessions/${params.id}/microlearning/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) }); setResult((await res.json()).data); }}>提交小测</button>{result && <div>得分：{result.score}。<Link className="text-blue-700 ml-2" href={`/session/${params.id}/workflow`}>继续 Workflow</Link></div>}</div></main>;
}
