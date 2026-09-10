import { NextRequest, NextResponse } from 'next/server';
import { getAllApps } from '@/lib/db';
import { pingIndexNow } from '@/lib/indexnow';
import { isAuthorizedAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Akses ditolak. Password admin diperlukan.' }, { status: 401 });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mod.astralune.cfd';
    const apps = await getAllApps();
    const urls = [
      baseUrl,
      `${baseUrl}/?type=game`,
      `${baseUrl}/?type=app`,
      ...apps.map((a) => `${baseUrl}/app/${a.slug}`),
    ];

    const result = await pingIndexNow(urls);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
