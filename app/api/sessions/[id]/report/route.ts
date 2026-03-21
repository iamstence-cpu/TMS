import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await db.trainingSession.findUnique({ where: { id: params.id } });
  if (!session?.reportJson) return NextResponse.json({ success: false, error: 'Report not ready' }, { status: 404 });
  return NextResponse.json({ success: true, data: session.reportJson });
}
