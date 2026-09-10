import { NextRequest, NextResponse } from 'next/server';
import { getAllApps } from '@/lib/db';
import { pingIndexNow } from '@/lib/indexnow';

export async function POST(req: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mod.astralune.cfd';
    const apps = getAllApps();
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
