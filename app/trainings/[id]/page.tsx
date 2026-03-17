import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTrainingById } from '@/services/training/training-service';
import { db } from '@/lib/db';

export default async function TrainingDetail({ params }: { params: { id: string } }) {
  const t = await getTrainingById(params.id);
  if (!t) return <main className="container-page">未找到训练。</main>;

  async function start() {
    'use server';
    const session = await db.trainingSession.create({ data: { trainingId: t.id } });
    redirect(`/session/${session.id}/microlearning`);
  }

  return (
    <main className="container-page space-y-3">
      <div className="card">
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="mt-2 text-sm">{t.description}</p>
        <form action={start}><button className="btn mt-3" type="submit">开始训练</button></form>
      </div>
      <div className="card"><h2 className="font-medium">学习目标</h2><ul className="list-disc pl-5 text-sm">{(t.learningObjectives as string[]).map((x) => <li key={x}>{x}</li>)}</ul></div>
      <Link href="/about/safety" className="text-sm text-blue-700">查看合规边界声明</Link>
    </main>
  );
}
