import { createApp, getAppBySlug, updateApp } from './db';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface ScrapeResult {
  success: boolean;
  imported: number;
  message: string;
  items: any[];
}

export async function scrapeAN1(keyword: string = ''): Promise<ScrapeResult> {
  const items: any[] = [];
  try {
    const searchUrl = keyword
      ? `https://an1.com/?story=${encodeURIComponent(keyword)}&do=search&subaction=search`
      : `https://an1.com/games/`;

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Encoding': 'gzip, deflate',
      },
    });

    const html = await res.text();
    const linkMatches = Array.from(html.matchAll(/href="(https:\/\/an1\.com\/\d+-[^"]+\.html)"/g));
    const urls = Array.from(new Set(linkMatches.map(m => m[1]))).slice(0, 10);

    let importedCount = 0;

    for (const url of urls) {
      try {
        const detailRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          },
        });
        const detailHtml = await detailRes.text();

        // Extract title
        const titleMatch = detailHtml.match(/<h1[^>]* itemprop="name"[^>]*>(.*?)<\/h1>/i) ||
                           detailHtml.match(/<h1[^>]*>(.*?)<\/h1>/i) ||
                           detailHtml.match(/<title>(.*?)<\/title>/i);
        let rawTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'Game MOD';
        rawTitle = rawTitle.replace(/^Download\s+/i, '').replace(/\s+for android$/i, '').trim();

        // Title clean & version
        let title = rawTitle.replace(/\s*\(MOD.*?\)/i, '').replace(/\s*\d+\.\d+.*$/i, '').trim();
        const versionMatch = rawTitle.match(/(\d+\.\d+[\.\d]*)/);
        const version = versionMatch ? versionMatch[1] : '1.0.0';

        const slug = slugify(title) || `an1-${Date.now()}`;

        // Mod info
        const modMatch = rawTitle.match(/\((MOD[^\)]*)\)/i) || detailHtml.match(/<div class="tip_mod">(.*?)<\/div>/i);
        const modInfo = modMatch ? modMatch[1].replace(/<[^>]+>/g, '').trim() : 'MOD, Unlimited Money / Unlocked';

        // Icon
        const iconMatch = detailHtml.match(/src="(https:\/\/an1\.com\/uploads\/posts\/[^"]+)"/i) ||
                          detailHtml.match(/<img[^>]+src="([^"]+uploads\/posts[^"]+)"/i);
        const iconUrl = iconMatch ? iconMatch[1] : 'https://an1.com/templates/an1/images/logo.png';

        // Screenshots
        const screenshotMatches = Array.from(detailHtml.matchAll(/src="(https:\/\/an1\.com\/uploads\/screenshots\/[^"]+)"/g));
        const screenshots = Array.from(new Set(screenshotMatches.map(m => m[1])));

        // Category
        const catMatch = detailHtml.match(/href="https:\/\/an1\.com\/(games|programmy)\/([^"]+)\/"/i);
        let category = catMatch ? catMatch[2].replace(/-/g, ' ') : 'Action';
        category = category.charAt(0).toUpperCase() + category.slice(1);

        const isGame = !url.includes('/programmy/');

        // Developer & Size
        const devMatch = detailHtml.match(/Developer:[^<]*<[^>]+>([^<]+)/i);
        const developer = devMatch ? devMatch[1].trim() : 'AN1 Modding';

        const sizeMatch = detailHtml.match(/(\d+(?:\.\d+)?\s*(?:MB|GB|KB))/i);
        const size = sizeMatch ? sizeMatch[1] : '120 MB';

        // Download page link
        const dwPageMatch = detailHtml.match(/href="(\/file_\d+-dw\.html)"/i);
        let downloadUrl = url;
        if (dwPageMatch) {
          const dwUrl = 'https://an1.com' + dwPageMatch[1];
          try {
            const dwRes = await fetch(dwUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const dwHtml = await dwRes.text();
            const apkMatch = dwHtml.match(/href="(https:\/\/[^"]+\.apk)"/i);
            if (apkMatch) {
              downloadUrl = apkMatch[1];
            } else {
              downloadUrl = dwUrl;
            }
          } catch {
            downloadUrl = dwUrl;
          }
        }

        const appData = {
          title,
          slug,
          packageName: `com.moder.${slug.replace(/-/g, '.')}`,
          category,
          appType: (isGame ? 'game' : 'app') as 'game' | 'app',
          version,
          modInfo,
          developer,
          size,
          iconUrl,
          rating: 4.8,
          downloadsCount: Math.floor(Math.random() * 50000) + 10000,
          description: `Download ${title} MOD APK (Versi ${version}). Nikmati fitur ${modInfo} gratis & 100% aman untuk Android.`,
          downloadUrl,
          screenshots: JSON.stringify(screenshots),
          source: 'AstraMod',
          isFeatured: importedCount % 2 === 0 ? 1 : 0,
        };

        const existing = await getAppBySlug(slug);
        if (!existing) {
          await createApp(appData);
          importedCount++;
          items.push(appData);
        } else {
          await updateApp(existing.id, appData);
          items.push(appData);
        }
      } catch (err) {
        console.error('Error scraping item:', err);
      }
    }

    return {
      success: true,
      imported: importedCount,
      message: `Berhasil scrape ${importedCount} aplikasi dari AN1.com!`,
      items,
    };
  } catch (error: any) {
    return {
      success: false,
      imported: 0,
      message: `Gagal scraping: ${error.message}`,
      items: [],
    };
  }
}

export async function scrapeHappyMod(keyword: string = ''): Promise<ScrapeResult> {
  const items: any[] = [];
  try {
    const searchUrl = keyword
      ? `https://happymod.to/search.html?q=${encodeURIComponent(keyword)}`
      : `https://happymod.to/`;

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await res.text();
    const linkMatches = Array.from(html.matchAll(/href="(\/[^"]+-mod\/com\.[^"]+\/)"/g));
    const urls = Array.from(new Set(linkMatches.map(m => 'https://happymod.to' + m[1]))).slice(0, 10);

    let importedCount = 0;

    for (const url of urls) {
      try {
        const detailRes = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const detailHtml = await detailRes.text();

        const titleMatch = detailHtml.match(/<title>(.*?)<\/title>/i);
        const titleStr = titleMatch ? titleMatch[1] : '';

        // Example: Garage master: idle mechanic Mod APK v1.0.2 (Unlimited money) Download for Android.
        const cleanTitle = titleStr.split(' Mod APK')[0].trim() || 'Mod Game';
        const slug = slugify(cleanTitle);

        const versionMatch = titleStr.match(/v(\d+\.\d+[\.\d]*)/i);
        const version = versionMatch ? versionMatch[1] : '1.0.0';

        const modMatch = titleStr.match(/\((.*?)\)/);
        const modInfo = modMatch ? `MOD, ${modMatch[1]}` : 'MOD, Unlimited Money & Premium';

        // Package name from url
        const pkgMatch = url.match(/com\.[^\/]+/);
        const packageName = pkgMatch ? pkgMatch[0] : `com.happymod.${slug}`;

        // Images
        const imgMatches = Array.from(detailHtml.matchAll(/src="(https:\/\/i\.git99\.com\/upload\/[^"]+)"/g));
        const imgs = Array.from(new Set(imgMatches.map(m => m[1])));
        const iconUrl = imgs.length > 0 ? imgs[0] : 'https://happymod.to/static/img/logo.png';
        const screenshots = imgs.slice(1, 6);

        const appData = {
          title: cleanTitle,
          slug: slug || `moder-${Date.now()}`,
          packageName,
          category: 'Action',
          appType: 'game' as 'game',
          version,
          modInfo,
          developer: 'Official Studio',
          size: '85 MB',
          iconUrl,
          rating: 4.7,
          downloadsCount: Math.floor(Math.random() * 80000) + 20000,
          description: `Download ${cleanTitle} MOD APK v${version}. Nikmati fitur ${modInfo} bebas iklan & 100% working.`,
          downloadUrl: `${url}download.html`,
          screenshots: JSON.stringify(screenshots),
          source: 'AstraMod',
          isFeatured: importedCount % 2 === 0 ? 1 : 0,
        };

        const existing = await getAppBySlug(appData.slug);
        if (!existing) {
          await createApp(appData);
          importedCount++;
          items.push(appData);
        } else {
          await updateApp(existing.id, appData);
          items.push(appData);
        }
      } catch (err) {
        console.error('Error scraping HappyMod item:', err);
      }
    }

    return {
      success: true,
      imported: importedCount,
      message: `Berhasil scrape ${importedCount} aplikasi dari HappyMod!`,
      items,
    };
  } catch (error: any) {
    return {
      success: false,
      imported: 0,
      message: `Gagal scraping HappyMod: ${error.message}`,
      items: [],
    };
  }
}
