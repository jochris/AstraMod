import { NextRequest, NextResponse } from 'next/server';
import { addComment } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appId, username, rating, comment } = body;

    if (!appId || !comment) {
      return NextResponse.json({ success: false, error: 'App ID dan Komentar wajib diisi.' }, { status: 400 });
    }

    const newComment = addComment(appId, username, rating || 5, comment);
    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
