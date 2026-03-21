import { getTrainingById } from '@/services/training/training-service';

export default async function PreviewPage({ params }: { params: { id: string } }) {
  const t = await getTrainingById(params.id);
  if (!t) return <main className="container-page">未找到。</main>;
  return <main className="container-page"><div className="card"><h1 className="text-lg font-semibold">预览：{t.title}</h1><p>{t.description}</p></div></main>;
}
