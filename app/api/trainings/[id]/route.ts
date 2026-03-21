import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getTrainingById } from '@/services/training/training-service';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedMinutes: z.number().int().optional(),
  microLesson: z
    .object({ intro: z.string(), sections: z.array(z.any()), quizItems: z.array(z.any()) })
    .optional(),
  workflowScenario: z
    .object({ title: z.string(), description: z.string(), context: z.string(), steps: z.array(z.any()) })
    .optional(),
  roleplayScenario: z
    .object({ roleType: z.string(), persona: z.string(), openingMessage: z.string(), objectives: z.array(z.string()) })
    .optional()
});

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await getTrainingById(params.id);
  if (!data) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = updateSchema.parse(await req.json());
    const { microLesson, workflowScenario, roleplayScenario, ...base } = body;

    const data = await db.$transaction(async (tx) => {
      await tx.training.update({ where: { id: params.id }, data: base });
      if (microLesson) {
        await tx.microLesson.update({
          where: { trainingId: params.id },
          data: { intro: microLesson.intro, sections: microLesson.sections as any, quizItems: microLesson.quizItems as any }
        });
      }
      if (workflowScenario) {
        await tx.workflowScenario.update({
          where: { trainingId: params.id },
          data: {
            title: workflowScenario.title,
            description: workflowScenario.description,
            context: workflowScenario.context,
            steps: workflowScenario.steps as any
          }
        });
      }
      if (roleplayScenario) {
        await tx.roleplayScenario.update({
          where: { trainingId: params.id },
          data: {
            roleType: roleplayScenario.roleType,
            persona: roleplayScenario.persona,
            openingMessage: roleplayScenario.openingMessage,
            objectives: roleplayScenario.objectives as any
          }
        });
      }
      return tx.training.findUnique({ where: { id: params.id }, include: { microLesson: true, workflowScenario: true, roleplayScenario: true } });
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
