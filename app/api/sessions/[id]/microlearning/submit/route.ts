import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { microSubmitSchema } from '@/domain/evaluation';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { answers } = microSubmitSchema.parse(await req.json());
    const session = await db.trainingSession.findUnique({ where: { id: params.id }, include: { training: { include: { microLesson: true } } } });
    if (!session?.training.microLesson) return NextResponse.json({ success: false, error: 'Session or lesson not found' }, { status: 404 });
    const quiz = session.training.microLesson.quizItems as any[];
    const correct = quiz.reduce((n, q, i) => (answers[i] === q.answer ? n + 1 : n), 0);
    const score = Math.round((correct / Math.max(quiz.length, 1)) * 100);
    const data = { answers, score, correct, total: quiz.length };
    await db.trainingSession.update({ where: { id: params.id }, data: { microlearningResult: data as any, currentStage: 'WORKFLOW' } });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: 'Submit failed' }, { status: 400 });
  }
}
