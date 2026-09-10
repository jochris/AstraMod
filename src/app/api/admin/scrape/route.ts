import { NextRequest, NextResponse } from 'next/server';
import { scrapeAN1, scrapeHappyMod } from '@/lib/scraper';
import { isAuthorizedAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Akses ditolak. Password admin diperlukan.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { source = 'happymod', keyword = '' } = body;

    let result;
    if (source.toLowerCase() === 'an1') {
      result = await scrapeAN1(keyword);
    } else {
      result = await scrapeHappyMod(keyword);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
