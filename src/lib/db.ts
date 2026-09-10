import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let dbPath: string;
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  dbPath = path.join('/tmp', 'moder.db');
} else {
  dbPath = path.join(process.cwd(), 'moder.db');
}

const db = new Database(dbPath);

// Initialize schema and seed data if db is new
db.exec(`
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

// Seed initial apps if database is empty
const countStmt = db.prepare('SELECT COUNT(*) as count FROM apps');
const { count } = countStmt.get() as { count: number };

if (count === 0) {
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

  const insertStmt = db.prepare(`
    INSERT INTO apps (
      title, slug, packageName, category, appType, version, modInfo,
      developer, size, iconUrl, rating, downloadsCount, description,
      downloadUrl, screenshots, source, isFeatured
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const app of initialApps) {
    insertStmt.run(
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
    );
  }
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

export function getAllApps(options?: {
  search?: string;
  category?: string;
  appType?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): AppItem[] {
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

  const stmt = db.prepare(query);
  return stmt.all(...params) as AppItem[];
}

export function getAppBySlug(slug: string): AppItem | null {
  const stmt = db.prepare('SELECT * FROM apps WHERE slug = ?');
  const app = stmt.get(slug) as AppItem | undefined;
  return app || null;
}

export function getAppById(id: number): AppItem | null {
  const stmt = db.prepare('SELECT * FROM apps WHERE id = ?');
  const app = stmt.get(id) as AppItem | undefined;
  return app || null;
}

export function createApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): AppItem {
  const stmt = db.prepare(`
    INSERT INTO apps (
      title, slug, packageName, category, appType, version, modInfo,
      developer, size, iconUrl, rating, downloadsCount, description,
      downloadUrl, screenshots, source, isFeatured
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  const info = stmt.run(
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
  );

  return getAppById(info.lastInsertRowid as number)!;
}

export function updateApp(id: number, appData: Partial<AppItem>): boolean {
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

  const stmt = db.prepare(`UPDATE apps SET ${fields.join(', ')} WHERE id = ?`);
  const result = stmt.run(...params);
  return result.changes > 0;
}

export function deleteApp(id: number): boolean {
  const stmt = db.prepare('DELETE FROM apps WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function incrementDownloads(id: number): void {
  const stmt = db.prepare('UPDATE apps SET downloadsCount = downloadsCount + 1 WHERE id = ?');
  stmt.run(id);
}

export function getCategories(): { name: string; count: number }[] {
  const stmt = db.prepare(`
    SELECT category as name, COUNT(*) as count 
    FROM apps 
    GROUP BY category 
    ORDER BY count DESC
  `);
  return stmt.all() as { name: string; count: number }[];
}

export function getComments(appId: number): CommentItem[] {
  const stmt = db.prepare('SELECT * FROM comments WHERE appId = ? ORDER BY id DESC');
  return stmt.all(appId) as CommentItem[];
}

export function addComment(appId: number, username: string, rating: number, comment: string): CommentItem {
  const stmt = db.prepare(`
    INSERT INTO comments (appId, username, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(appId, username || 'Pengguna MOD', rating || 5, comment);
  const getStmt = db.prepare('SELECT * FROM comments WHERE id = ?');
  return getStmt.get(info.lastInsertRowid as number) as CommentItem;
}

export default db;
