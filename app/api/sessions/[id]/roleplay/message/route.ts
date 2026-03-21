import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { roleplayMessageSchema } from '@/domain/evaluation';
import { extractBehaviorTags, generateClientReply } from '@/services/roleplay/roleplay-service';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { message } = roleplayMessageSchema.parse(await req.json());
    const session = await db.trainingSession.findUnique({ where: { id: params.id }, include: { training: { include: { roleplayScenario: true } } } });
    if (!session?.training.roleplayScenario) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const messages = ((session.roleplayTranscript as any)?.messages ?? []) as any[];
    const nextMessages = [...messages, { role: 'user', content: message }];
    const reply = await generateClientReply({ persona: session.training.roleplayScenario.persona, openingMessage: session.training.roleplayScenario.openingMessage, transcript: nextMessages as any, round: session.roleplayRoundCount + 1 });
    nextMessages.push({ role: 'assistant', content: reply });
    const tags = [...new Set([...(session.roleplayTranscript as any)?.tags ?? [], ...extractBehaviorTags(message)])];
    const roundCount = session.roleplayRoundCount + 1;
    const done = roundCount >= Number((session.training.roleplayScenario.stopConditions as any).maxRounds || 8);
    await db.trainingSession.update({ where: { id: params.id }, data: { roleplayTranscript: { messages: nextMessages, tags } as any, roleplayRoundCount: roundCount, currentStage: done ? 'REPORT' : 'ROLEPLAY' } });
    return NextResponse.json({ success: true, data: { reply, roundCount, done, tags } });
  } catch {
    return NextResponse.json({ success: false, error: 'Roleplay failed' }, { status: 400 });
  }
}
