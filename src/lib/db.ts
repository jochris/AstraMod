import { createClient, Client } from '@libsql/client';

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

const initialApps: AppItem[] = [
  {
    id: 1,
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
    isFeatured: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
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
    isFeatured: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
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
    isFeatured: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
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
    isFeatured: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let memoryApps: AppItem[] = [...initialApps];
let memoryComments: CommentItem[] = [];
let nextAppId = 5;
let nextCommentId = 1;

let clientInstance: Client | null = null;
let useFallbackStore = false;
let isInitialized = false;

function getClient(): Client | null {
  if (useFallbackStore) return null;
  if (clientInstance) return clientInstance;

  try {
    let dbUrl: string;
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      dbUrl = 'file:/tmp/moder.db';
    } else {
      dbUrl = 'file:moder.db';
    }

    clientInstance = createClient({
      url: dbUrl,
    });
    return clientInstance;
  } catch (err) {
    console.warn('[DB] Failed to create LibSQL client, using fallback store:', err);
    useFallbackStore = true;
    return null;
  }
}

async function initDb() {
  if (isInitialized) return;
  const client = getClient();
  if (!client) {
    useFallbackStore = true;
    isInitialized = true;
    return;
  }

  try {
    await client.execute(`
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
    `);

    await client.execute(`
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

    const countRes = await client.execute('SELECT COUNT(*) as count FROM apps');
    const count = Number(countRes.rows[0]?.count || 0);

    if (count === 0) {
      for (const app of initialApps) {
        await client.execute({
          sql: `INSERT INTO apps (
            title, slug, packageName, category, appType, version, modInfo,
            developer, size, iconUrl, rating, downloadsCount, description,
            downloadUrl, screenshots, source, isFeatured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            app.title,
            app.slug,
            app.packageName ?? '',
            app.category,
            app.appType,
            app.version,
            app.modInfo,
            app.developer ?? 'AstraMod Studio',
            app.size ?? 'Varies with device',
            app.iconUrl,
            app.rating,
            app.downloadsCount,
            app.description ?? '',
            app.downloadUrl,
            app.screenshots ?? '[]',
            app.source ?? 'AstraMod',
            app.isFeatured
          ]
        });
      }
    }
    isInitialized = true;
  } catch (err) {
    console.warn('[DB] Init error, falling back to memory store:', err);
    useFallbackStore = true;
    isInitialized = true;
  }
}

function mapRowToApp(row: any): AppItem {
  return {
    id: Number(row.id),
    title: String(row.title),
    slug: String(row.slug),
    packageName: String(row.packageName || ''),
    category: String(row.category),
    appType: String(row.appType) as 'game' | 'app',
    version: String(row.version),
    modInfo: String(row.modInfo),
    developer: String(row.developer || 'AstraMod Studio'),
    size: String(row.size || 'Varies with device'),
    iconUrl: String(row.iconUrl),
    rating: Number(row.rating || 4.8),
    downloadsCount: Number(row.downloadsCount || 1000),
    description: String(row.description || ''),
    downloadUrl: String(row.downloadUrl),
    screenshots: String(row.screenshots || '[]'),
    source: String(row.source || 'AstraMod'),
    isFeatured: Number(row.isFeatured || 0),
    createdAt: String(row.createdAt || ''),
    updatedAt: String(row.updatedAt || ''),
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
  const client = getClient();

  if (!client || useFallbackStore) {
    let result = [...memoryApps];
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        a =>
          a.title.toLowerCase().includes(q) ||
          a.modInfo.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    if (options?.category && options.category !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === options.category!.toLowerCase());
    }
    if (options?.appType && options.appType !== 'all') {
      result = result.filter(a => a.appType === options.appType);
    }
    if (options?.featuredOnly) {
      result = result.filter(a => a.isFeatured === 1);
    }
    result.sort((a, b) => b.id - a.id);
    if (options?.offset || options?.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : result.length;
      result = result.slice(start, end);
    }
    return result;
  }

  try {
    let query = 'SELECT * FROM apps WHERE 1=1';
    const args: any[] = [];

    if (options?.search) {
      query += ' AND (title LIKE ? OR modInfo LIKE ? OR category LIKE ?)';
      const searchParam = `%${options.search}%`;
      args.push(searchParam, searchParam, searchParam);
    }

    if (options?.category && options.category !== 'All') {
      query += ' AND LOWER(category) = LOWER(?)';
      args.push(options.category);
    }

    if (options?.appType && options.appType !== 'all') {
      query += ' AND appType = ?';
      args.push(options.appType);
    }

    if (options?.featuredOnly) {
      query += ' AND isFeatured = 1';
    }

    query += ' ORDER BY id DESC';

    if (options?.limit) {
      query += ' LIMIT ?';
      args.push(options.limit);
      if (options?.offset) {
        query += ' OFFSET ?';
        args.push(options.offset);
      }
    }

    const res = await client.execute({ sql: query, args });
    return res.rows.map(mapRowToApp);
  } catch (err) {
    console.warn('[DB] Query error, using fallback memory apps:', err);
    useFallbackStore = true;
    return getAllApps(options);
  }
}

export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    return memoryApps.find(a => a.slug === slug) || null;
  }

  try {
    const res = await client.execute({ sql: 'SELECT * FROM apps WHERE slug = ?', args: [slug] });
    if (res.rows.length === 0) return null;
    return mapRowToApp(res.rows[0]);
  } catch (err) {
    useFallbackStore = true;
    return memoryApps.find(a => a.slug === slug) || null;
  }
}

export async function getAppById(id: number): Promise<AppItem | null> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    return memoryApps.find(a => a.id === id) || null;
  }

  try {
    const res = await client.execute({ sql: 'SELECT * FROM apps WHERE id = ?', args: [id] });
    if (res.rows.length === 0) return null;
    return mapRowToApp(res.rows[0]);
  } catch (err) {
    useFallbackStore = true;
    return memoryApps.find(a => a.id === id) || null;
  }
}

export async function createApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppItem> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const newApp: AppItem = {
      ...appData,
      id: nextAppId++,
      packageName: appData.packageName || '',
      developer: appData.developer || 'AstraMod Studio',
      size: appData.size || 'Varies with device',
      rating: appData.rating || 4.8,
      downloadsCount: appData.downloadsCount || 10000,
      description: appData.description || '',
      screenshots: appData.screenshots || '[]',
      source: appData.source || 'AstraMod',
      isFeatured: appData.isFeatured ? 1 : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryApps.unshift(newApp);
    return newApp;
  }

  try {
    const res = await client.execute({
      sql: `INSERT INTO apps (
        title, slug, packageName, category, appType, version, modInfo,
        developer, size, iconUrl, rating, downloadsCount, description,
        downloadUrl, screenshots, source, isFeatured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
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
    });

    const lastId = Number(res.lastInsertRowid);
    return (await getAppById(lastId))!;
  } catch (err) {
    useFallbackStore = true;
    return createApp(appData);
  }
}

export async function updateApp(id: number, appData: Partial<AppItem>): Promise<boolean> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const index = memoryApps.findIndex(a => a.id === id);
    if (index === -1) return false;
    memoryApps[index] = { ...memoryApps[index], ...appData, updatedAt: new Date().toISOString() };
    return true;
  }

  try {
    const fields: string[] = [];
    const args: any[] = [];

    Object.entries(appData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        args.push(value);
      }
    });

    if (fields.length === 0) return false;

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    args.push(id);

    const res = await client.execute({ sql: `UPDATE apps SET ${fields.join(', ')} WHERE id = ?`, args });
    return res.rowsAffected > 0;
  } catch (err) {
    useFallbackStore = true;
    return updateApp(id, appData);
  }
}

export async function deleteApp(id: number): Promise<boolean> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const initialLen = memoryApps.length;
    memoryApps = memoryApps.filter(a => a.id !== id);
    return memoryApps.length < initialLen;
  }

  try {
    const res = await client.execute({ sql: 'DELETE FROM apps WHERE id = ?', args: [id] });
    return res.rowsAffected > 0;
  } catch (err) {
    useFallbackStore = true;
    return deleteApp(id);
  }
}

export async function incrementDownloads(id: number): Promise<void> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const app = memoryApps.find(a => a.id === id);
    if (app) app.downloadsCount += 1;
    return;
  }

  try {
    await client.execute({ sql: 'UPDATE apps SET downloadsCount = downloadsCount + 1 WHERE id = ?', args: [id] });
  } catch (err) {
    useFallbackStore = true;
    incrementDownloads(id);
  }
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const counts: Record<string, number> = {};
    for (const app of memoryApps) {
      counts[app.category] = (counts[app.category] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  try {
    const res = await client.execute(`
      SELECT category as name, COUNT(*) as count 
      FROM apps 
      GROUP BY category 
      ORDER BY count DESC
    `);
    return res.rows.map(r => ({ name: String(r.name), count: Number(r.count) }));
  } catch (err) {
    useFallbackStore = true;
    return getCategories();
  }
}

export async function getComments(appId: number): Promise<CommentItem[]> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    return memoryComments.filter(c => c.appId === appId).sort((a, b) => b.id - a.id);
  }

  try {
    const res = await client.execute({ sql: 'SELECT * FROM comments WHERE appId = ? ORDER BY id DESC', args: [appId] });
    return res.rows.map(r => ({
      id: Number(r.id),
      appId: Number(r.appId),
      username: String(r.username),
      rating: Number(r.rating),
      comment: String(r.comment),
      createdAt: String(r.createdAt || ''),
    }));
  } catch (err) {
    useFallbackStore = true;
    return getComments(appId);
  }
}

export async function addComment(appId: number, username: string, rating: number, comment: string): Promise<CommentItem> {
  await initDb();
  const client = getClient();

  if (!client || useFallbackStore) {
    const newComment: CommentItem = {
      id: nextCommentId++,
      appId,
      username: username || 'Pengguna MOD',
      rating: rating || 5,
      comment,
      createdAt: new Date().toISOString(),
    };
    memoryComments.unshift(newComment);
    return newComment;
  }

  try {
    const res = await client.execute({
      sql: 'INSERT INTO comments (appId, username, rating, comment) VALUES (?, ?, ?, ?)',
      args: [appId, username || 'Pengguna MOD', rating || 5, comment]
    });
    const lastId = Number(res.lastInsertRowid);
    return (await getComments(appId)).find(c => c.id === lastId)!;
  } catch (err) {
    useFallbackStore = true;
    return addComment(appId, username, rating, comment);
  }
}

export default getClient;
