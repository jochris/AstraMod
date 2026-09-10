import { NextRequest, NextResponse } from 'next/server';
import { getAppBySlug, incrementDownloads } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const app = getAppBySlug(slug);
    if (!app) {
      return NextResponse.json({ success: false, error: 'Aplikasi tidak ditemukan.' }, { status: 404 });
    }

    incrementDownloads(app.id);

    return NextResponse.json({
      success: true,
      downloadUrl: app.downloadUrl,
      downloadsCount: app.downloadsCount + 1,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
