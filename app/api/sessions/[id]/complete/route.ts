import { NextResponse } from 'next/server';
import { completeSessionAndGenerateReport } from '@/services/reporting/report-service';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const report = await completeSessionAndGenerateReport(params.id);
    return NextResponse.json({ success: true, data: report });
  } catch {
    return NextResponse.json({ success: false, error: 'Complete failed' }, { status: 400 });
  }
}
