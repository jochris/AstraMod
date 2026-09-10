const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  envContent.split('\n').forEach((line: string) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
} catch (e) {}

async function run() {
  console.log('=== STARTING AUTOMATIC APK SCRAPER & GDRIVE UPLOADER ===');
  console.log('Target GDrive Folder:', process.env.GDRIVE_FOLDER_ID);
  console.log('Service Account:', process.env.GDRIVE_CLIENT_EMAIL);

  const { scrapeAN1 } = require('./src/lib/scraper');

  console.log('\n--- Scraping AN1 Games ---');
  const resultAN1 = await scrapeAN1('');
  console.log('AN1 Result:', resultAN1.message, `(${resultAN1.imported} imported)`);
  console.log('\n=== AUTO SCRAPING & GDRIVE UPLOAD COMPLETED! ===');
}

run().catch(err => console.error('Scraper Execution Error:', err));
