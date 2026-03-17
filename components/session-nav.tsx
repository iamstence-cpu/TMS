import Link from 'next/link';

export function SessionNav({ id }: { id: string }) {
  const items = ['microlearning', 'workflow', 'roleplay', 'report'];
  return <div className="mb-4 flex gap-2 text-sm">{items.map((x) => <Link key={x} href={`/session/${id}/${x}`} className="btn-secondary">{x}</Link>)}</div>;
}
