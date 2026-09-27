import { NextRequest, NextResponse } from 'next/server';
import { getWorkflow } from '@/lib/workflowStore';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workflow = getWorkflow(id);

  if (!workflow) {
    return NextResponse.json({ error: 'Workflow not found.' }, { status: 404 });
  }

  return NextResponse.json({ workflow });
}
