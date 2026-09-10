import { NextRequest, NextResponse } from 'next/server';
import { getAppBySlug, incrementDownloads } from '@/lib/db';

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

    let targetUrl = app.downloadUrl;

    // Convert legacy an1.co to an1.net
    if (targetUrl.includes('files.an1.co')) {
      targetUrl = targetUrl.replace('files.an1.co', 'files.an1.net');
    }

    // If targetUrl is an an1.com HTML page or missing direct apk, resolve real APK URL
    if (targetUrl.includes('an1.com') && !targetUrl.match(/\.apk($|\?)/i)) {
      try {
        const res = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        const html = await res.text();
        const apkMatches = Array.from(html.matchAll(/href="(https:\/\/files\.an1\.(?:net|co)\/[^"]+\.apk)"/gi));
        const realApk = apkMatches.map(m => m[1]).find(url => !url.includes('an1store.apk'));
        if (realApk) {
          targetUrl = realApk;
        } else {
          const dwMatch = html.match(/href="(\/file_\d+-dw\.html)"/i);
          if (dwMatch) {
            const dwRes = await fetch(`https://an1.com${dwMatch[1]}`, {
              headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            });
            const dwHtml = await dwRes.text();
            const dwApkMatches = Array.from(dwHtml.matchAll(/href="(https:\/\/files\.an1\.(?:net|co)\/[^"]+\.apk)"/gi));
            const dwRealApk = dwApkMatches.map(m => m[1]).find(url => !url.includes('an1store.apk'));
            if (dwRealApk) targetUrl = dwRealApk;
          }
        }
      } catch (e) {
        console.error('Failed to resolve an1 dw link:', e);
      }
    }

    // Ensure targetUrl uses an1.net
    targetUrl = targetUrl.replace('files.an1.co', 'files.an1.net');

    // Clean filename for download: [AstraMod]_Title_vVersion.apk
    const safeTitle = app.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const filename = `[AstraMod]_${safeTitle}_v${app.version || '1.0'}.apk`;

    // Attempt to stream/proxy the file directly from targetUrl
    try {
      const fileRes = await fetch(targetUrl, {
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
      console.error('Proxy stream failed, falling back to redirect:', err);
    }

    // Fallback if proxy stream fails: redirect directly to targetUrl
    return NextResponse.redirect(targetUrl, 302);
  } catch (error: any) {
    return new NextResponse(`Error: ${error.message}`, { status: 500 });
  }
}
