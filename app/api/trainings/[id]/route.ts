import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTrainingById } from '@/services/training/training-service';
import { z } from 'zod';

const updateSchema = z.object({ title: z.string().optional(), category: z.string().optional(), description: z.string().optional(), difficulty: z.string().optional(), estimatedMinutes: z.number().int().optional() });

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getTrainingById(params.id);
  if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = updateSchema.parse(await req.json());
    const data = await db.training.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
