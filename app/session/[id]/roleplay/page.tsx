'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SessionNav } from '@/components/session-nav';

export default function RoleplayPage({ params }: { params: { id: string } }) {
  const [session, setSession] = useState<any>();
  const [input, setInput] = useState('');
  const [log, setLog] = useState<any[]>([]);
  const [done, setDone] = useState(false);
  useEffect(() => { fetch(`/api/sessions/${params.id}`).then((r) => r.json()).then((j) => { setSession(j.data); setLog(j.data?.roleplayTranscript?.messages || [{ role: 'assistant', content: j.data?.training?.roleplayScenario?.openingMessage }]); }); }, [params.id]);
  const send = async () => { const r=await fetch(`/api/sessions/${params.id}/roleplay/message`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:input})}); const j=await r.json(); setLog((l)=>[...l,{role:'user',content:input},{role:'assistant',content:j.data.reply}]); setInput(''); setDone(j.data.done); };
  return <main className="container-page"><SessionNav id={params.id} /><div className="card"><h1 className="text-lg font-semibold">Roleplay 对话演练</h1><div className="my-3 h-72 overflow-y-auto rounded border p-2">{log.map((m,i)=><p key={i} className="text-sm"><b>{m.role==='user'?'你':'服务对象'}：</b>{m.content}</p>)}</div><div className="flex gap-2"><input className="w-full rounded border p-2" value={input} onChange={(e)=>setInput(e.target.value)} /><button className="btn" onClick={send}>发送</button></div>{done && <button className="btn mt-3" onClick={async()=>{await fetch(`/api/sessions/${params.id}/complete`,{method:'POST'}); location.href=`/session/${params.id}/report`;}}>完成并生成报告</button>}<div className="mt-2 text-xs text-slate-500">训练用途，不替代医疗建议。</div></div></main>;
}
