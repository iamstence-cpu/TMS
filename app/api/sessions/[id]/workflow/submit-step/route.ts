import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { workflowStepSchema } from '@/domain/evaluation';
import { evaluateWorkflow } from '@/services/workflow/workflow-service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const step = workflowStepSchema.parse(await req.json());
    const session = await db.trainingSession.findUnique({ where: { id: params.id }, include: { training: { include: { workflowScenario: true } } } });
    if (!session?.training.workflowScenario) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const trace = ((session.workflowTrace as any)?.trace ?? []) as any[];
    const nextTrace = [...trace.filter((t) => t.stepId !== step.stepId), step];
    const result = evaluateWorkflow(session.training.workflowScenario.steps as any, nextTrace);
    await db.trainingSession.update({ where: { id: params.id }, data: { workflowTrace: { trace: nextTrace, ...result } as any, currentStage: 'ROLEPLAY' } });
    return NextResponse.json({ success: true, data: { trace: nextTrace, ...result } });
  } catch {
    return NextResponse.json({ success: false, error: 'Workflow submit failed' }, { status: 400 });
  }
}
