const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'moder.db');
const db = new Database(dbPath);

console.log('🌱 Seeding database...');

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
    source TEXT DEFAULT 'Manual',
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

const initialApps = [
  {
    title: 'Minecraft Pocket Edition',
    slug: 'minecraft-pe-mod',
    packageName: 'com.mojang.minecraftpe',
    category: 'Arcade',
    appType: 'game',
    version: '1.20.80.05',
    modInfo: 'Unlocked Skins, God Mode, Immortality, High Damage',
    developer: 'Mojang Studios',
    size: '650 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-03/1615560940_minecraft.png',
    rating: 4.9,
    downloadsCount: 1540000,
    description: 'Jelajahi dunia tanpa batas dan bangun segala hal mulai dari rumah paling sederhana hingga kastil paling megah. Mainkan dalam mode kreatif dengan sumber daya tak terbatas atau tambang jauh ke dalam dunia dalam mode bertahan hidup.',
    downloadUrl: 'https://files.an1.co/minecraft-mod-1.20.80.05-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/1792/thumbs/minecraft-661244.webp',
      'https://an1.com/uploads/screenshots/1792/thumbs/minecraft-215234.webp',
      'https://an1.com/uploads/screenshots/1792/thumbs/minecraft-982145.webp'
    ]),
    source: 'MODER',
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
    developer: 'Rockstar Games',
    size: '2.4 GB',
    iconUrl: 'https://an1.com/uploads/posts/2016-04/1460395726_grand-theft-auto-san-andreas.png',
    rating: 4.8,
    downloadsCount: 980000,
    description: 'Lima tahun lalu, Carl Johnson melarikan diri dari tekanan hidup di Los Santos, San Andreas. Sekarang, di awal 90-an, Carl harus pulang.',
    downloadUrl: 'https://files.an1.co/gta-sa-mod-2.11.32-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/115/thumbs/gta-sa-882741.webp',
      'https://an1.com/uploads/screenshots/115/thumbs/gta-sa-332910.webp'
    ]),
    source: 'MODER',
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
    developer: 'SYBO Games',
    size: '160 MB',
    iconUrl: 'https://an1.com/uploads/posts/2018-09/1537877562_subway-surfers.png',
    rating: 4.7,
    downloadsCount: 2300000,
    description: 'Lari secepat mungkin! Hindari kereta yang mendekat! Bantu Jake, Tricky & Fresh melarikan diri dari Inspektur pemarah dan anjingnya.',
    downloadUrl: 'https://files.an1.co/subway-surfers-mod-3.25.0-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/23/thumbs/subway-surfers-119284.webp'
    ]),
    source: 'MODER',
    isFeatured: 1
  },
  {
    title: 'Roblox',
    slug: 'roblox-mod-menu',
    packageName: 'com.roblox.client',
    category: 'Adventure',
    appType: 'game',
    version: '2.620.500',
    modInfo: 'Mod Menu, Fly, Jump Hack, Wallhack, Night Mode',
    developer: 'Roblox Corporation',
    size: '175 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-01/1610452391_roblox.png',
    rating: 4.6,
    downloadsCount: 1890000,
    description: 'Roblox adalah alam semesta virtual terbaik yang memungkinkan Anda bermain, berkreasi, berbagi pengalaman dengan teman, dan menjadi apa saja yang dapat Anda bayangkan.',
    downloadUrl: 'https://files.an1.co/roblox-mod-2.620-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'MODER',
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
    developer: 'Spotify Ltd.',
    size: '82 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-02/1613143521_spotify.png',
    rating: 4.9,
    downloadsCount: 3100000,
    description: 'Dengan Spotify, Anda memiliki akses ke dunia musik dan podcast gratis. Dapatkan musik, album, dan playlist favorit Anda tanpa iklan dengan MOD Premium ini.',
    downloadUrl: 'https://files.an1.co/spotify-premium-mod-8.9.18-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'MODER',
    isFeatured: 1
  },
  {
    title: 'CapCut Video Editor Pro',
    slug: 'capcut-pro-mod',
    packageName: 'com.lemon.lvoverseas',
    category: 'Video Players & Editors',
    appType: 'app',
    version: '11.4.0',
    modInfo: 'Pro Unlocked, No Watermark, All Effects & Filters Unlocked',
    developer: 'Bytedance Pte. Ltd.',
    size: '210 MB',
    iconUrl: 'https://an1.com/uploads/posts/2021-06/1623348123_capcut.png',
    rating: 4.8,
    downloadsCount: 2450000,
    description: 'CapCut adalah editor video gratis dan pembuat video terbaik dengan musik untuk TikTok, Instagram, & YouTube yang serbaguna dan mudah digunakan.',
    downloadUrl: 'https://files.an1.co/capcut-pro-mod-11.4.0-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'MODER',
    isFeatured: 1
  },
  {
    title: 'Clash of Clans',
    slug: 'clash-of-clans-mod-private-server',
    packageName: 'com.supercell.clashofclans',
    category: 'Strategy',
    appType: 'game',
    version: '16.253.15',
    modInfo: 'Unlimited Gems, Gold, Elixir, Dark Elixir, Private Server (Nulls Clash)',
    developer: 'Supercell',
    size: '340 MB',
    iconUrl: 'https://an1.com/uploads/posts/2016-04/1460394332_clash-of-clans.png',
    rating: 4.7,
    downloadsCount: 4100000,
    description: 'Bergabunglah dengan jutaan pemain di seluruh dunia saat Anda membangun desa Anda, mendirikan klan, dan bersaing dalam Perang Klan yang epik!',
    downloadUrl: 'https://files.an1.co/coc-mod-16.253-an1.com.apk',
    screenshots: JSON.stringify([]),
    source: 'MODER',
    isFeatured: 1
  },
  {
    title: 'TABS Pocket Edition',
    slug: 'tabs-pocket-edition-mod',
    packageName: 'com.landfall.tabs',
    category: 'Simulation',
    appType: 'game',
    version: '1.1.05',
    modInfo: 'Full Game Unlocked, Unlimited Money',
    developer: 'Landfall Games',
    size: '480 MB',
    iconUrl: 'https://an1.com/uploads/posts/2026-09/1788780672_tabs-pocket-edition.png',
    rating: 4.9,
    downloadsCount: 520000,
    description: 'Totally Accurate Battle Simulator adalah game simulasi pertempuran berbasis fisika yang lucu di mana Anda dapat memimpin pasukan dari berbagai era sejarah.',
    downloadUrl: 'https://files.an1.co/tabs-pocket-edition-mod-1.1.05-an1.com.apk',
    screenshots: JSON.stringify([
      'https://an1.com/uploads/screenshots/7592/thumbs/tabs-pocket-edition-823817.webp',
      'https://an1.com/uploads/screenshots/7592/thumbs/tabs-pocket-edition-577679.webp'
    ]),
    source: 'AN1',
    isFeatured: 0
  }
];

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO apps (
    title, slug, packageName, category, appType, version, modInfo,
    developer, size, iconUrl, rating, downloadsCount, description,
    downloadUrl, screenshots, source, isFeatured
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, ?,
    ?, ?, ?, ?
  )
`);

let count = 0;
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
  count++;
}

console.log(`✅ Database seeded successfully with ${count} apps!`);
