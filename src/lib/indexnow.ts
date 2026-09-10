// IndexNow API helper for instant indexing on Bing, Yandex, Seznam, and Naver

export async function pingIndexNow(urls: string[]): Promise<{ success: boolean; message: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, message: 'Tidak ada URL untuk di-ping.' };
  }

  const host = 'mod.astralune.cfd';
  const apiKey = 'astramod2026indexnowkey';

  try {
    const payload = {
      host,
      key: apiKey,
      keyLocation: `https://${host}/${apiKey}.txt`,
      urlList: urls,
    };

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      return {
        success: true,
        message: `Berhasil mengirimkan ${urls.length} URL ke IndexNow (Bing/Yandex) untuk pengindeksan instan!`,
      };
    } else {
      return {
        success: false,
        message: `IndexNow merespons dengan status ${res.status}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal IndexNow ping: ${error.message}`,
    };
  }
}
