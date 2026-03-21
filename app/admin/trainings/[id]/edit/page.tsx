'use client';
import { useEffect, useState } from 'react';

export default function EditTraining({ params }: { params: { id: string } }) {
  const [form, setForm] = useState<any>();
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch(`/api/trainings/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        const data = j.data;
        setForm({
          ...data,
          sectionsText: JSON.stringify(data.microLesson?.sections ?? [], null, 2),
          quizText: JSON.stringify(data.microLesson?.quizItems ?? [], null, 2),
          workflowStepsText: JSON.stringify(data.workflowScenario?.steps ?? [], null, 2),
          objectivesText: JSON.stringify(data.roleplayScenario?.objectives ?? [], null, 2)
        });
      });
  }, [params.id]);

  if (!form) return <main className="container-page">加载中...</main>;

  const save = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        microLesson: {
          intro: form.microLesson?.intro ?? '',
          sections: JSON.parse(form.sectionsText || '[]'),
          quizItems: JSON.parse(form.quizText || '[]')
        },
        workflowScenario: {
          title: form.workflowScenario?.title ?? '',
          description: form.workflowScenario?.description ?? '',
          context: form.workflowScenario?.context ?? '',
          steps: JSON.parse(form.workflowStepsText || '[]')
        },
        roleplayScenario: {
          roleType: form.roleplayScenario?.roleType ?? '服务对象',
          persona: form.roleplayScenario?.persona ?? '',
          openingMessage: form.roleplayScenario?.openingMessage ?? '',
          objectives: JSON.parse(form.objectivesText || '[]')
        }
      };
      const r = await fetch(`/api/trainings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const j = await r.json();
      setMsg(j.success ? '已更新（含微课/流程/对练内容）' : '更新失败');
    } catch {
      setMsg('JSON 格式错误，请检查后重试');
    }
  };

  return (
    <main className="container-page space-y-3">
      <div className="card space-y-2">
        <h1 className="text-lg font-semibold">编辑训练主题</h1>
        <input className="w-full rounded border p-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full rounded border p-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">微课配置（JSON）</h2>
        <textarea className="w-full rounded border p-2" rows={4} value={form.microLesson?.intro ?? ''} onChange={(e) => setForm({ ...form, microLesson: { ...form.microLesson, intro: e.target.value } })} />
        <textarea className="w-full rounded border p-2 font-mono text-xs" rows={8} value={form.sectionsText} onChange={(e) => setForm({ ...form, sectionsText: e.target.value })} />
        <textarea className="w-full rounded border p-2 font-mono text-xs" rows={8} value={form.quizText} onChange={(e) => setForm({ ...form, quizText: e.target.value })} />
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Workflow 配置（JSON）</h2>
        <input className="w-full rounded border p-2" value={form.workflowScenario?.title ?? ''} onChange={(e) => setForm({ ...form, workflowScenario: { ...form.workflowScenario, title: e.target.value } })} />
        <textarea className="w-full rounded border p-2" value={form.workflowScenario?.description ?? ''} onChange={(e) => setForm({ ...form, workflowScenario: { ...form.workflowScenario, description: e.target.value } })} />
        <textarea className="w-full rounded border p-2" value={form.workflowScenario?.context ?? ''} onChange={(e) => setForm({ ...form, workflowScenario: { ...form.workflowScenario, context: e.target.value } })} />
        <textarea className="w-full rounded border p-2 font-mono text-xs" rows={10} value={form.workflowStepsText} onChange={(e) => setForm({ ...form, workflowStepsText: e.target.value })} />
      </div>

      <div className="card space-y-2">
        <h2 className="font-semibold">Roleplay 配置</h2>
        <input className="w-full rounded border p-2" value={form.roleplayScenario?.roleType ?? ''} onChange={(e) => setForm({ ...form, roleplayScenario: { ...form.roleplayScenario, roleType: e.target.value } })} />
        <textarea className="w-full rounded border p-2" rows={3} value={form.roleplayScenario?.persona ?? ''} onChange={(e) => setForm({ ...form, roleplayScenario: { ...form.roleplayScenario, persona: e.target.value } })} />
        <textarea className="w-full rounded border p-2" rows={2} value={form.roleplayScenario?.openingMessage ?? ''} onChange={(e) => setForm({ ...form, roleplayScenario: { ...form.roleplayScenario, openingMessage: e.target.value } })} />
        <textarea className="w-full rounded border p-2 font-mono text-xs" rows={5} value={form.objectivesText} onChange={(e) => setForm({ ...form, objectivesText: e.target.value })} />
      </div>

      <button className="btn" onClick={save}>更新</button>
      <p>{msg}</p>
    </main>
  );
}
