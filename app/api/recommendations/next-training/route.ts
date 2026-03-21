import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const order = [
  'initial-health-intake',
  'hypertension-risk-education',
  'diabetes-followup-adherence',
  'weight-management-motivation'
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ success: false, error: 'sessionId is required' }, { status: 400 });

  const session = await db.trainingSession.findUnique({ where: { id: sessionId }, include: { training: true } });
  if (!session) return NextResponse.json({ success: false, error: 'session not found' }, { status: 404 });

  const idx = order.indexOf(session.training.slug);
  const nextSlug = order[(idx + 1) % order.length];
  const next = await db.training.findUnique({ where: { slug: nextSlug } });
  return NextResponse.json({ success: true, data: next });
}
