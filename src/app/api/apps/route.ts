import { NextRequest, NextResponse } from 'next/server';
import { getAllApps, createApp, getCategories } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const appType = searchParams.get('appType') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const apps = await getAllApps({ search, category, appType, featuredOnly, limit, offset });
    const categories = await getCategories();

    return NextResponse.json({
      success: true,
      data: apps,
      categories,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.downloadUrl || !body.modInfo) {
      return NextResponse.json({ success: false, error: 'Judul, Link Download, dan Mod Info wajib diisi.' }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const appData = {
      ...body,
      slug,
      iconUrl: body.iconUrl || 'https://an1.com/templates/an1/images/logo.png',
      rating: body.rating || 4.8,
      downloadsCount: body.downloadsCount || 1000,
      appType: body.appType || 'game',
      category: body.category || 'Action',
      version: body.version || '1.0.0',
    };

    const newApp = await createApp(appData);
    return NextResponse.json({ success: true, data: newApp }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
