import Link from 'next/link';
import { listTrainings } from '@/services/training/training-service';
import { TrainingCard } from '@/components/training-card';

export default async function HomePage() {
  const trainings = await listTrainings();
  return (
    <main className="container-page space-y-4">
      <section className="card">
        <h1 className="text-2xl font-bold">健康管理师岗位训练平台</h1>
        <p className="mt-2 text-sm text-slate-600">聚焦流程训练、沟通训练、风险识别、合规边界与过程留痕。仅用于教学与实训，不替代医疗诊疗。</p>
        <Link href="/trainings" className="btn mt-3 inline-block">进入训练主题</Link>
      </section>
      <section className="grid gap-3 md:grid-cols-2">{trainings.map((t) => <TrainingCard key={t.id} training={t} />)}</section>
    </main>
  );
}
