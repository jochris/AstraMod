import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';

let dbInstance: Database | null = null;

async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  let dbPath: string;
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    dbPath = path.join('/tmp', 'moder.db');
  } else {
    dbPath = path.join(process.cwd(), 'moder.db');
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS apps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      packageName TEXT,
      category TEXT NOT NULL,
      appType TEXT NOT NULL DEFAULT 'game',
      version TEXT NOT NULL,
      modInfo TEXT NOT NULL,
      developer TEXT,
      size TEXT DEFAULT 'Varies with device',
      iconUrl TEXT NOT NULL,
      rating REAL DEFAULT 4.5,
      downloadsCount INTEGER DEFAULT 1000,
      description TEXT,
      downloadUrl TEXT NOT NULL,
      screenshots TEXT,
      source TEXT DEFAULT 'AstraMod',
      isFeatured INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appId INTEGER NOT NULL,
      username TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      comment TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appId) REFERENCES apps (id) ON DELETE CASCADE
    );
  `);

  const countRes = await dbInstance.get('SELECT COUNT(*) as count FROM apps');
  if (!countRes || countRes.count === 0) {
    const initialApps = [
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

    for (const app of initialApps) {
      await dbInstance.run(
        `INSERT INTO apps (
          title, slug, packageName, category, appType, version, modInfo,
          developer, size, iconUrl, rating, downloadsCount, description,
          downloadUrl, screenshots, source, isFeatured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          app.title,
          app.slug,
          app.packageName,
          app.category,
          app.appType,
          app.version,
          app.modInfo,
          app.developer,
          app.size,
          app.iconUrl,
          app.rating,
          app.downloadsCount,
          app.description,
          app.downloadUrl,
          app.screenshots,
          app.source,
          app.isFeatured
        ]
      );
    }
  }

  return dbInstance;
}

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

export async function getAllApps(options?: {
  search?: string;
  category?: string;
  appType?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<AppItem[]> {
  const db = await getDb();
  let query = 'SELECT * FROM apps WHERE 1=1';
  const params: any[] = [];

  if (options?.search) {
    query += ' AND (title LIKE ? OR modInfo LIKE ? OR category LIKE ?)';
    const searchParam = `%${options.search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  if (options?.category && options.category !== 'All') {
    query += ' AND LOWER(category) = LOWER(?)';
    params.push(options.category);
  }

  if (options?.appType && options.appType !== 'all') {
    query += ' AND appType = ?';
    params.push(options.appType);
  }

  if (options?.featuredOnly) {
    query += ' AND isFeatured = 1';
  }

  query += ' ORDER BY id DESC';

  if (options?.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
    if (options?.offset) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  return await db.all<AppItem[]>(query, params);
}

export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  const db = await getDb();
  const app = await db.get<AppItem>('SELECT * FROM apps WHERE slug = ?', [slug]);
  return app || null;
}

export async function getAppById(id: number): Promise<AppItem | null> {
  const db = await getDb();
  const app = await db.get<AppItem>('SELECT * FROM apps WHERE id = ?', [id]);
  return app || null;
}

export async function createApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppItem> {
  const db = await getDb();
  const res = await db.run(
    `INSERT INTO apps (
      title, slug, packageName, category, appType, version, modInfo,
      developer, size, iconUrl, rating, downloadsCount, description,
      downloadUrl, screenshots, source, isFeatured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      appData.title,
      appData.slug,
      appData.packageName || '',
      appData.category,
      appData.appType || 'game',
      appData.version,
      appData.modInfo,
      appData.developer || 'AstraMod Studio',
      appData.size || 'Varies with device',
      appData.iconUrl,
      appData.rating || 4.8,
      appData.downloadsCount || 10000,
      appData.description || '',
      appData.downloadUrl,
      appData.screenshots || '[]',
      appData.source || 'AstraMod',
      appData.isFeatured ? 1 : 0
    ]
  );

  return (await getAppById(res.lastID!))!;
}

export async function updateApp(id: number, appData: Partial<AppItem>): Promise<boolean> {
  const db = await getDb();
  const fields: string[] = [];
  const params: any[] = [];

  Object.entries(appData).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  });

  if (fields.length === 0) return false;

  fields.push('updatedAt = CURRENT_TIMESTAMP');
  params.push(id);

  const res = await db.run(`UPDATE apps SET ${fields.join(', ')} WHERE id = ?`, params);
  return (res.changes || 0) > 0;
}

export async function deleteApp(id: number): Promise<boolean> {
  const db = await getDb();
  const res = await db.run('DELETE FROM apps WHERE id = ?', [id]);
  return (res.changes || 0) > 0;
}

export async function incrementDownloads(id: number): Promise<void> {
  const db = await getDb();
  await db.run('UPDATE apps SET downloadsCount = downloadsCount + 1 WHERE id = ?', [id]);
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const db = await getDb();
  return await db.all<{ name: string; count: number }[]>(`
    SELECT category as name, COUNT(*) as count 
    FROM apps 
    GROUP BY category 
    ORDER BY count DESC
  `);
}

export async function getComments(appId: number): Promise<CommentItem[]> {
  const db = await getDb();
  return await db.all<CommentItem[]>('SELECT * FROM comments WHERE appId = ? ORDER BY id DESC', [appId]);
}

export async function addComment(appId: number, username: string, rating: number, comment: string): Promise<CommentItem> {
  const db = await getDb();
  const res = await db.run(
    'INSERT INTO comments (appId, username, rating, comment) VALUES (?, ?, ?, ?)',
    [appId, username || 'Pengguna MOD', rating || 5, comment]
  );
  return (await db.get<CommentItem>('SELECT * FROM comments WHERE id = ?', [res.lastID!]))!;
}

export default getDb;
