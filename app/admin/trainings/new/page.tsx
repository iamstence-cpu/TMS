'use client';
import { useState } from 'react';

export default function NewTraining() {
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ slug: '', title: '', category: '', description: '', difficulty: '初级', estimatedMinutes: 30 });
  return <main className="container-page"><div className="card space-y-2"><h1 className="text-lg font-semibold">新增训练主题</h1>{Object.entries(form).map(([k,v]) => <input key={k} className="w-full rounded border p-2" value={String(v)} onChange={(e)=>setForm((f)=>({...f,[k]:k==='estimatedMinutes'?Number(e.target.value):e.target.value}))} placeholder={k} />)}<button className="btn" onClick={async()=>{const r=await fetch('/api/trainings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,targetRoles:['健康管理师'],learningObjectives:['待补充']})}); setMsg((await r.json()).success?'创建成功':'创建失败');}}>保存</button><p>{msg}</p></div></main>;
}
