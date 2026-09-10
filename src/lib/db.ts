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

export async function getAllApps(options?: {
  search?: string;
  category?: string;
  appType?: string;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<AppItem[]> {
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

export async function getAppBySlug(slug: string): Promise<AppItem | null> {
  return memoryApps.find(a => a.slug === slug) || null;
}

export async function getAppById(id: number): Promise<AppItem | null> {
  return memoryApps.find(a => a.id === id) || null;
}

export async function createApp(appData: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppItem> {
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

  // Avoid duplicate slug
  const existingIndex = memoryApps.findIndex(a => a.slug === newApp.slug);
  if (existingIndex !== -1) {
    memoryApps[existingIndex] = newApp;
  } else {
    memoryApps.unshift(newApp);
  }

  return newApp;
}

export async function updateApp(id: number, appData: Partial<AppItem>): Promise<boolean> {
  const index = memoryApps.findIndex(a => a.id === id);
  if (index === -1) return false;
  memoryApps[index] = { ...memoryApps[index], ...appData, updatedAt: new Date().toISOString() };
  return true;
}

export async function deleteApp(id: number): Promise<boolean> {
  const initialLen = memoryApps.length;
  memoryApps = memoryApps.filter(a => a.id !== id);
  return memoryApps.length < initialLen;
}

export async function incrementDownloads(id: number): Promise<void> {
  const app = memoryApps.find(a => a.id === id);
  if (app) {
    app.downloadsCount += 1;
  }
}

export async function getCategories(): Promise<{ name: string; count: number }[]> {
  const counts: Record<string, number> = {};
  for (const app of memoryApps) {
    counts[app.category] = (counts[app.category] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getComments(appId: number): Promise<CommentItem[]> {
  return memoryComments.filter(c => c.appId === appId).sort((a, b) => b.id - a.id);
}

export async function addComment(appId: number, username: string, rating: number, comment: string): Promise<CommentItem> {
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

export default function getClient() {
  return null;
}
