'use client';
import { useEffect, useState } from 'react';

export default function EditTraining({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>();
  const [msg, setMsg] = useState('');
  useEffect(() => { fetch(`/api/trainings/${params.id}`).then((r) => r.json()).then((j) => setForm(j.data)); }, [params.id]);
  if (!form) return <main className="container-page">加载中...</main>;
  return <main className="container-page"><div className="card space-y-2"><h1 className="text-lg font-semibold">编辑训练主题</h1><input className="w-full rounded border p-2" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /><textarea className="w-full rounded border p-2" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /><button className="btn" onClick={async()=>{const r=await fetch(`/api/trainings/${params.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:form.title,description:form.description})}); setMsg((await r.json()).success?'已更新':'更新失败');}}>更新</button><p>{msg}</p></div></main>;
}
