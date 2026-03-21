import Link from 'next/link';

export default function AdminHome() {
  return <main className="container-page"><div className="card"><h1 className="text-xl font-semibold">管理端</h1><p className="text-sm">维护训练主题、微课、流程和评分规则。</p><Link href="/admin/trainings" className="btn mt-3 inline-block">进入训练管理</Link></div></main>;
}
