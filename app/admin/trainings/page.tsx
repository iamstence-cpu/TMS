import Link from 'next/link';
import { listTrainings } from '@/services/training/training-service';

export default async function AdminTrainings() {
  const list = await listTrainings();
  return <main className="container-page"><div className="mb-3"><Link href="/admin/trainings/new" className="btn">新增主题</Link></div><div className="grid gap-2">{list.map((t)=><div className="card" key={t.id}><b>{t.title}</b><p className="text-sm">{t.description}</p><div className="space-x-3 text-sm"><Link href={`/admin/trainings/${t.id}/edit`} className="text-blue-700">编辑</Link><Link href={`/admin/trainings/${t.id}/preview`} className="text-blue-700">预览</Link></div></div>)}</div></main>;
}
