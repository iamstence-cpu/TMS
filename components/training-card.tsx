import Link from 'next/link';

export function TrainingCard({ training }: { training: any }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{training.title}</h3>
      <p className="mt-1 text-sm text-slate-600">{training.description}</p>
      <div className="mt-3 text-xs text-slate-500">{training.category} · {training.difficulty} · {training.estimatedMinutes} 分钟</div>
      <Link href={`/trainings/${training.id}`} className="btn mt-3 inline-block">查看详情</Link>
    </div>
  );
}
