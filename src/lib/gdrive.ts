export async function uploadToGoogleDrive(
  fileUrl: string,
  fileName: string
): Promise<string> {
  const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
  const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const folderId = process.env.GDRIVE_FOLDER_ID;

  if (!clientEmail || !privateKey) {
    return fileUrl;
  }

  try {
    const token = await getGoogleAccessToken(clientEmail, privateKey);
    if (!token) {
      console.warn('[GDrive] Failed to acquire Google OAuth token. Using fallback URL.');
      return fileUrl;
    }

    console.log(`[GDrive] Fetching source APK: ${fileUrl}`);
    const res = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      console.warn(`[GDrive] Source APK fetch failed (${res.status}). Using fallback URL.`);
      return fileUrl;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`[GDrive] Uploading "${fileName}" (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) to Google Drive 5TB...`);

    const metadata = {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    };

    const boundary = '----------' + Date.now().toString(16);
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const headerPart = delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + JSON.stringify(metadata);
    const mediaPartHeader = delimiter + 'Content-Type: application/vnd.android.package-archive\r\n\r\n';

    const payload = Buffer.concat([
      Buffer.from(headerPart),
      Buffer.from(mediaPartHeader),
      buffer,
      Buffer.from(closeDelimiter),
    ]);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': payload.length.toString(),
        },
        body: payload,
      }
    );

    const data: any = await uploadRes.json();
    if (!data.id) {
      console.warn('[GDrive] Upload failed or no file ID returned:', data);
      return fileUrl;
    }

    // Set permission to anyone reader
    try {
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${data.id}/permissions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: 'reader', type: 'anyone' }),
        }
      );
    } catch (permErr) {
      console.warn('[GDrive] Failed to set public permission:', permErr);
    }

    const directUrl = `https://drive.google.com/uc?export=download&id=${data.id}`;
    console.log(`[GDrive] Successfully uploaded to 5TB Google Drive! File ID: ${data.id} -> ${directUrl}`);
    return directUrl;
  } catch (err) {
    console.error('[GDrive] Error uploading to GDrive:', err);
    return fileUrl;
  }
}

async function getGoogleAccessToken(email: string, key: string): Promise<string | null> {
  try {
    const crypto = await import('crypto');
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: email,
      scope: 'https://www.googleapis.com/auth/drive',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const encodeBase64Url = (obj: any) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const unsignedToken = `${encodeBase64Url(header)}.${encodeBase64Url(claimSet)}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(unsignedToken);
    const signature = signer
      .sign(key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${unsignedToken}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const json: any = await res.json();
    return json.access_token || null;
  } catch (e) {
    console.error('[GDrive Auth Error]:', e);
    return null;
  }
}
