import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSessionSchema } from '@/domain/evaluation';

export async function POST(req: Request) {
  try {
    const payload = createSessionSchema.parse(await req.json());
    const session = await db.trainingSession.create({ data: payload });
    return NextResponse.json({ success: true, data: session });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }
}
