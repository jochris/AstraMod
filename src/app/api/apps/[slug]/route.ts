import { NextRequest, NextResponse } from 'next/server';
import { getAppBySlug, updateApp, deleteApp, getComments } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const app = await getAppBySlug(slug);
    if (!app) {
      return NextResponse.json({ success: false, error: 'Aplikasi tidak ditemukan.' }, { status: 404 });
    }

    const comments = await getComments(app.id);

    return NextResponse.json({
      success: true,
      data: app,
      comments,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const app = await getAppBySlug(slug);
    if (!app) {
      return NextResponse.json({ success: false, error: 'Aplikasi tidak ditemukan.' }, { status: 404 });
    }

    const body = await req.json();
    const success = await updateApp(app.id, body);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const app = await getAppBySlug(slug);
    if (!app) {
      return NextResponse.json({ success: false, error: 'Aplikasi tidak ditemukan.' }, { status: 404 });
    }

    const success = await deleteApp(app.id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
