import { neon } from '@neondatabase/serverless';

export interface AppItem {
  id: number;
  title: string;
  slug: string;
  packageName?: string;
  category: string;
  appType: 'game' | 'app';
  version: string;
  modInfo: string;
  developer?: string;
  size?: string;
  iconUrl: string;
  rating: number;
  downloadsCount: number;
  description?: string;
  downloadUrl: string;
  screenshots?: string;
  source?: string;
  isFeatured: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentItem {
  id: number;
  appId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const initialApps: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Minecraft Pocket Edition',
    slug: 'minecraft-pe-mod',
    packageName: 'com.mojang.minecraftpe',
    category: 'Arcade',
    appType: 'game',
    version: '1.20.80.05',
    modInfo: 'Unlocked Skins, God Mode, Immortality, High Damage',
    developer: 'AstraMod Studio',
    size: '650 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-03/1615560940_minecraft.png',
    rating: 4.9,
    downloadsCount: 1540000,
    description: 'Jelajahi dunia tanpa batas dan bangun segala hal mulai dari rumah paling sederhana hingga kastil paling megah.',
    downloadUrl: 'https://files.an1.co/minecraft-mod-1.20.80.05-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/1792/thumbs/minecraft-661244.webp',
      'https://an1.com/uploads/screenshots/1792/thumbs/minecraft-215234.webp'
    ]),
    source: 'AstraMod',
    isFeatured: 1
  },
  {
    title: 'GTA San Andreas',
    slug: 'gta-san-andreas-mod',
    packageName: 'com.rockstargames.gtasa',
    category: 'Action',
    appType: 'game',
    version: '2.11.32',
    modInfo: 'Unlimited Money, Cleo Mod Menu, Max Stats, All Unlocked',
    developer: 'AstraMod Studio',
    size: '2.4 GB',
    iconUrl: 'https://an1.com/uploads/posts/2016-04/1460395726_grand-theft-auto-san-andreas.png',
    rating: 4.8,
    downloadsCount: 980000,
    description: 'Lima tahun lalu, Carl Johnson melarikan diri dari tekanan hidup di Los Santos, San Andreas.',
    downloadUrl: 'https://files.an1.co/gta-sa-mod-2.11.32-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/115/thumbs/gta-sa-882741.webp'
    ]),
    source: 'AstraMod',
    isFeatured: 1
  },
  {
    title: 'Subway Surfers',
    slug: 'subway-surfers-mod',
    packageName: 'com.kiloo.subwaysurf',
    category: 'Arcade',
    appType: 'game',
    version: '3.25.0',
    modInfo: 'Unlimited Coins, Keys, All Characters & Boards Unlocked',
    developer: 'AstraMod Studio',
    size: '160 MB',
    iconUrl: 'https://an1.com/uploads/posts/2018-09/1537877562_subway-surfers.png',
    rating: 4.7,
    downloadsCount: 2300000,
    description: 'Lari secepat mungkin! Hindari kereta yang mendekat!',
    downloadUrl: 'https://files.an1.co/subway-surfers-mod-3.25.0-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'AstraMod',
    isFeatured: 1
  },
  {
    title: 'Spotify Premium MOD',
    slug: 'spotify-premium-mod',
    packageName: 'com.spotify.music',
    category: 'Music & Audio',
    appType: 'app',
    version: '8.9.18.512',
    modInfo: 'Unlocked Premium, No Ads, Unlimited Skips, Very High Audio Quality',
    developer: 'AstraMod Studio',
    size: '82 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-02/1613143521_spotify.png',
    rating: 4.9,
    downloadsCount: 3100000,
    description: 'Dapatkan musik, album, dan playlist favorit Anda tanpa iklan dengan MOD Premium ini.',
    downloadUrl: 'https://files.an1.co/spotify-premium-mod-8.9.18-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'AstraMod',
    isFeatured: 1
  }
];

let isInitialized = false;

function getSql() {
  if (!process.env.DATABASE_URL) {
    try {
      const fs = require('fs');
      const path = require('path');
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach((line: string) => {
          const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (m) {
            const key = m[1];
            let val = m[2] || '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            process.env[key] = val;
          }
        });
      }
    } catch (e) {}
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;
  return neon(dbUrl);
}

async function initDb() {
  if (isInitialized) return;
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS apps (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        package_name TEXT,
        category TEXT NOT NULL,
        app_type TEXT NOT NULL DEFAULT 'game',
        version TEXT NOT NULL,
        mod_info TEXT NOT NULL,
        developer TEXT,
        size TEXT DEFAULT 'Varies with device',
        icon_url TEXT NOT NULL,
        rating REAL DEFAULT 4.5,
        downloads_count BIGINT DEFAULT 1000,
        description TEXT,
        download_url TEXT NOT NULL,
        screenshots TEXT,
        source TEXT DEFAULT 'AstraMod',
        is_featured INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        app_id INT NOT NULL,
        username TEXT NOT NULL,
        rating INT DEFAULT 5,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    const countRes = await sql`SELECT COUNT(*) as count FROM apps`;
    const count = Number(countRes[0]?.count || 0);

    if (count === 0) {
      for (const app of initialApps) {
        await sql`
          INSERT INTO apps (
            title, slug, package_name, category, app_type, version, mod_info,
            developer, size, icon_url, rating, downloads_count, description,
            download_url, screenshots, source, is_featured
          ) VALUES (
            ${app.title}, ${app.slug}, ${app.packageName || ''}, ${app.category}, ${app.appType || 'game'}, ${app.version}, ${app.modInfo},
            ${app.developer || 'AstraMod Studio'}, ${app.size || 'Varies with device'}, ${app.iconUrl}, ${app.rating || 4.8}, ${app.downloadsCount || 10000}, ${app.description || ''},
            ${app.downloadUrl}, ${app.screenshots || '[]'}, ${app.source || 'AstraMod'}, ${app.isFeatured ? 1 : 0}
          ) ON CONFLICT DO NOTHING;
        `;
      }
    }

    isInitialized = true;
    console.log('[NeonDB] Successfully initialized Postgres database!');
  } catch (err) {
    console.error('[NeonDB] Initialization error:', err);
  }
}

function mapRowToApp(row: any): AppItem {
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    packageName: String(row.package_name || row.packagename || ''),
    category: String(row.category),
    appType: String(row.app_type || row.apptype || 'game') as 'game' | 'app',
    version: String(row.version),
    modInfo: String(row.mod_info || row.modinfo || ''),
    developer: String(row.developer || 'AstraMod Studio'),
    size: String(row.size || 'Varies with device'),
    iconUrl: String(row.icon_url || row.iconurl || ''),
    rating: Number(row.rating || 4.8),
    downloadsCount: Number(row.downloads_count || row.downloadscount || 1000),
    description: String(row.description || ''),
    downloadUrl: String(row.download_url || row.downloadurl || ''),
    screenshots: String(row.screenshots || '[]'),
    source: String(row.source || 'AstraMod'),
    isFeatured: Number(row.is_featured || row.isfeatured || 0),
    createdAt: String(row.created_at || row.createdat || ''),
    updatedAt: String(row.updated_at || row.updatedat || ''),
  };
}

export async function getAllApps(options?: {
  search?: string;
  category?: string;
  appType?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<AppItem[]> {
  await initDb();
  const sql = getSql();
  if (!sql) return [];

  try {
    let rows;
    if (options?.search) {
      const q = `%${options.search}%`;
      rows = await sql`
        SELECT * FROM apps 
        WHERE (title ILIKE ${q} OR mod_info ILIKE ${q} OR category ILIKE ${q})
        ORDER BY id DESC
      `;
    } else if (options?.category && options.category !== 'All') {
      rows = await sql`
        SELECT * FROM apps 
        WHERE LOWER(category) = LOWER(${options.category})
        ORDER BY id DESC
      `;
    } else if (options?.appType && options.appType !== 'all') {
      rows = await sql`
        SELECT * FROM apps 
        WHERE app_type = ${options.appType}
        ORDER BY id DESC
      `;
    } else if (options?.featuredOnly) {
      rows = await sql`
        SELECT * FROM apps 
        WHERE is_featured = 1
        ORDER BY id DESC
        LIMIT ${options.limit || 10}
      `;
    } else {
      rows = await sql`SELECT * FROM apps ORDER BY id DESC`;
    }

    let result = rows.map(mapRowToApp);

    if (options?.offset || options?.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : result.length;
      result = result.slice(start, end);
    }

    return result;
  } catch (err) {
    console.error('[NeonDB] getAllApps error:', err);
    return [];
  }
}

export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  await initDb();
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT * FROM apps WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return null;
    return mapRowToApp(rows[0]);
  } catch (err) {
    console.error('[NeonDB] getAppBySlug error:', err);
    return null;
  }
}

export async function getAppById(id: number): Promise<AppItem | null> {
  await initDb();
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = await sql`SELECT * FROM apps WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    return mapRowToApp(rows[0]);
  } catch (err) {
    console.error('[NeonDB] getAppById error:', err);
    return null;
  }
}

export async function createApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppItem> {
  await initDb();
  const sql = getSql();

  try {
    const rows = await sql`
      INSERT INTO apps (
        title, slug, package_name, category, app_type, version, mod_info,
        developer, size, icon_url, rating, downloads_count, description,
        download_url, screenshots, source, is_featured
      ) VALUES (
        ${appData.title}, ${appData.slug}, ${appData.packageName || ''}, ${appData.category}, ${appData.appType || 'game'}, ${appData.version}, ${appData.modInfo},
        ${appData.developer || 'AstraMod Studio'}, ${appData.size || 'Varies with device'}, ${appData.iconUrl}, ${appData.rating || 4.8}, ${appData.downloadsCount || 10000}, ${appData.description || ''},
        ${appData.downloadUrl}, ${appData.screenshots || '[]'}, ${appData.source || 'AstraMod'}, ${appData.isFeatured ? 1 : 0}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        version = EXCLUDED.version,
        mod_info = EXCLUDED.mod_info,
        download_url = EXCLUDED.download_url,
        updated_at = NOW()
      RETURNING *;
    `;

    return mapRowToApp(rows[0]);
  } catch (err) {
    console.error('[NeonDB] createApp error:', err);
    throw err;
  }
}

export async function updateApp(id: number, appData: Partial<AppItem>): Promise<boolean> {
  await initDb();
  const sql = getSql();
  if (!sql) return false;

  try {
    const current = await getAppById(id);
    if (!current) return false;

    const updated = { ...current, ...appData };

    await sql`
      UPDATE apps SET
        title = ${updated.title},
        packageName = ${updated.packageName || ''},
        category = ${updated.category},
        appType = ${updated.appType},
        version = ${updated.version},
        modInfo = ${updated.modInfo},
        developer = ${updated.developer || ''},
        size = ${updated.size || ''},
        iconUrl = ${updated.iconUrl},
        rating = ${updated.rating},
        downloadsCount = ${updated.downloadsCount},
        description = ${updated.description || ''},
        downloadUrl = ${updated.downloadUrl},
        screenshots = ${updated.screenshots || '[]'},
        isFeatured = ${updated.isFeatured ? 1 : 0},
        updated_at = NOW()
      WHERE id = ${id}
    `;
    return true;
  } catch (err) {
    console.error('[NeonDB] updateApp error:', err);
    return false;
  }
}

export async function deleteApp(id: number): Promise<boolean> {
  await initDb();
  const sql = getSql();
  if (!sql) return false;

  try {
    await sql`DELETE FROM apps WHERE id = ${id}`;
    return true;
  } catch (err) {
    console.error('[NeonDB] deleteApp error:', err);
    return false;
  }
}

export async function incrementDownloads(id: number): Promise<void> {
  await initDb();
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`UPDATE apps SET downloads_count = downloads_count + 1 WHERE id = ${id}`;
  } catch (err) {
    console.error('[NeonDB] incrementDownloads error:', err);
  }
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  await initDb();
  const sql = getSql();
  if (!sql) return [];

  try {
    const rows = await sql`
      SELECT category as name, COUNT(*)::int as count 
      FROM apps 
      GROUP BY category 
      ORDER BY count DESC
    `;
    return rows.map(r => ({ name: String(r.name), count: Number(r.count) }));
  } catch (err) {
    console.error('[NeonDB] getCategories error:', err);
    return [];
  }
}

export async function getComments(appId: number): Promise<CommentItem[]> {
  await initDb();
  const sql = getSql();
  if (!sql) return [];

  try {
    const rows = await sql`SELECT * FROM comments WHERE app_id = ${appId} ORDER BY id DESC`;
    return rows.map(r => ({
      id: Number(r.id),
      appId: Number(r.app_id || r.appid),
      username: String(r.username),
      rating: Number(r.rating),
      comment: String(r.comment),
      createdAt: String(r.created_at || r.createdat || ''),
    }));
  } catch (err) {
    console.error('[NeonDB] getComments error:', err);
    return [];
  }
}

export async function addComment(appId: number, username: string, rating: number, comment: string): Promise<CommentItem> {
  await initDb();
  const sql = getSql();

  try {
    const rows = await sql`
      INSERT INTO comments (app_id, username, rating, comment)
      VALUES (${appId}, ${username || 'Pengguna MOD'}, ${rating || 5}, ${comment})
      RETURNING *;
    `;
    const r = rows[0];
    return {
      id: Number(r.id),
      appId: Number(r.app_id || r.appid),
      username: String(r.username),
      rating: Number(r.rating),
      comment: String(r.comment),
      createdAt: String(r.created_at || r.createdat || ''),
    };
  } catch (err) {
    console.error('[NeonDB] addComment error:', err);
    throw err;
  }
}

export default function getClient() {
  return getSql();
}
