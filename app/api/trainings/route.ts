import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listTrainings } from '@/services/training/training-service';
import { z } from 'zod';

const createSchema = z.object({
  slug: z.string().min(3), title: z.string().min(2), category: z.string().min(2), description: z.string().min(10),
  targetRoles: z.array(z.string()).default(['健康管理师']), learningObjectives: z.array(z.string()).default([]),
  difficulty: z.string().default('初级'), estimatedMinutes: z.number().int().min(10)
});

export async function GET() { return NextResponse.json({ success: true, data: await listTrainings() }); }

export async function POST(req: Request) {
  try {
    const body = createSchema.parse(await req.json());
    const row = await db.training.create({ data: { ...body, targetRoles: JSON.stringify(body.targetRoles), learningObjectives: JSON.stringify(body.learningObjectives), status: 'PUBLISHED' } });
    return NextResponse.json({ success: true, data: row });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
