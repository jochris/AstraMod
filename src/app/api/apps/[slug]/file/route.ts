import { NextRequest, NextResponse } from 'next/server';
import { getAppBySlug, incrementDownloads } from '@/lib/db';

async function resolveDirectApkUrl(targetUrl: string, title: string): Promise<string> {
  let urlToTry = targetUrl.replace('files.an1.co', 'files.an1.net');

  // If already a direct .apk link on an1.net or drive/other cdn
  if (urlToTry.match(/\.apk($|\?)/i) && !urlToTry.includes('an1.com/')) {
    // Check if it's accessible directly
    try {
      const headRes = await fetch(urlToTry, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (headRes.ok) return urlToTry;
    } catch (e) {}
  }

  // Search AN1 for real live download page link
  try {
    const searchUrl = `https://an1.com/?story=${encodeURIComponent(title)}&do=search&subaction=search`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept-Encoding': 'gzip, deflate' },
    });
    const searchHtml = await searchRes.text();
    const detailMatches = Array.from(searchHtml.matchAll(/href="(https:\/\/an1\.com\/\d+-[^"]+\.html)"/g));
    
    if (detailMatches.length > 0) {
      const detailUrl = detailMatches[0][1];
      const detailRes = await fetch(detailUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const detailHtml = await detailRes.text();
      const dwMatch = detailHtml.match(/href="(\/file_\d+-dw\.html)"/i);

      if (dwMatch) {
        const dwUrl = `https://an1.com${dwMatch[1]}`;
        const dwRes = await fetch(dwUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const dwHtml = await dwRes.text();
        const apkMatches = Array.from(dwHtml.matchAll(/href="(https:\/\/files\.an1\.(?:net|co)\/[^"]+\.apk)"/gi));
        const realApk = apkMatches.map(m => m[1]).find(u => !u.includes('an1store.apk'));
        if (realApk) {
          return realApk.replace('files.an1.co', 'files.an1.net');
        }
      }
    }
  } catch (err) {
    console.error('Error resolving direct APK URL from AN1:', err);
  }

  return urlToTry;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;
    const app = await getAppBySlug(slug);

    if (!app) {
      return new NextResponse('Aplikasi tidak ditemukan', { status: 404 });
    }

    await incrementDownloads(app.id);

    const directApkUrl = await resolveDirectApkUrl(app.downloadUrl, app.title);
    const safeTitle = app.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const filename = `[AstraMod]_${safeTitle}_v${app.version || '1.0'}.apk`;

    // Attempt to stream/proxy the file directly
    try {
      const fileRes = await fetch(directApkUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': '*/*',
        },
      });

      if (fileRes.ok && fileRes.body) {
        const contentType = fileRes.headers.get('content-type') || 'application/vnd.android.package-archive';
        const contentLength = fileRes.headers.get('content-length');

        const headers: Record<string, string> = {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600',
        };
        if (contentLength) {
          headers['Content-Length'] = contentLength;
        }

        return new NextResponse(fileRes.body as any, {
          status: 200,
          headers,
        });
      }
    } catch (err) {
      console.error('Proxy stream failed:', err);
    }

    return NextResponse.redirect(directApkUrl, 302);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
