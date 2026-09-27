import { NextRequest, NextResponse } from 'next/server';
import { createWorkflow, getAllWorkflows } from '@/lib/workflowStore';

export async function GET() {
  const workflows = getAllWorkflows();
  return NextResponse.json({ workflows });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, mode, customSchema } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json({ error: 'A valid business prompt is required.' }, { status: 400 });
    }

    const workflow = createWorkflow(prompt.trim(), mode === 'live' ? 'live' : 'demo', customSchema);
    return NextResponse.json({ workflow });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to initialize workflow.' }, { status: 500 });
  }
}
