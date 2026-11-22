// Serverless funkce pro Vercel (/api/aircraft)
// Bezpečně přeposílá požadavky na povolené komunitní ADS-B zdroje a přidává CORS hlavičky.

const ALLOWED_PREFIXES = [
  'https://opendata.adsb.fi/api/v3/',
  'https://api.adsb.lol/v2/point/',
  'https://api.airplanes.live/v2/point/'
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Povolena je pouze metoda GET' });
  }

  const targetUrl = typeof req.query?.url === 'string' ? req.query.url.trim() : '';

  if (!targetUrl || !ALLOWED_PREFIXES.some((prefix) => targetUrl.startsWith(prefix))) {
    return res.status(403).json({
      error: 'Nepovolená cílová adresa ADS-B zdroje'
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, text/plain, /',
        'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; LetovyRadarGPS/1.0; +https://vercel.app)'
      }
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      const safeStatus = upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502;
      return res.status(safeStatus).json({
        error: Upstream HTTP ${upstream.status},
        upstreamStatus: upstream.status,
        details: text.slice(0, 200)
      });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).send(text);
  } catch (err) {
    const isTimeout = err && err.name === 'AbortError';
    const causeMsg = err?.cause?.message || err?.cause?.code || '';
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'Upstream timeout (7 s)'
        : ${err?.message || 'Chyba spojení se zdrojem'}${causeMsg ? ` (${causeMsg}) : ''}`
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
