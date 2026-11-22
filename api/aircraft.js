// Vercel Serverless Function: /api/aircraft?url=<encoded upstream URL>
// Proxy only the three known public ADS-B endpoints. This allowlist prevents
// the endpoint from becoming an open proxy / SSRF primitive.
const ALLOWED = [
  { host: "opendata.adsb.fi", path: /^\/api\/v3\/lat\/-?\d+(?:\.\d+)?\/lon\/-?\d+(?:\.\d+)?\/dist\/\d+$/ },
  { host: "api.adsb.lol", path: /^\/v2\/point\/-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\/\d+$/ },
  { host: "api.airplanes.live", path: /^\/v2\/point\/-?\d+(?:\.\d+)?\/-?\d+(?:\.\d+)?\/\d+$/ }
];

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Pouze metoda GET." });
  }

  const rawUrl = typeof req.query.url === "string" ? req.query.url : "";
  if (!rawUrl) {
    return res.status(400).json({
      error: "Chybí parametr url.",
      help: "Použij /api/aircraft?url=https%3A%2F%2F..."
    });
  }

  let target;
  try {
    target = new URL(rawUrl);
  } catch (_) {
    return res.status(400).json({ error: "Neplatná cílová URL." });
  }

  if (target.protocol !== "https:" || target.username || target.password) {
    return res.status(400).json({ error: "Povoleny jsou pouze HTTPS adresy." });
  }

  const allowed = ALLOWED.some(
    item => target.hostname === item.host && item.path.test(target.pathname)
  );
  if (!allowed) {
    return res.status(403).json({ error: "Tento datový zdroj není povolen." });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const upstream = await fetch(target.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "LetovyRadar/1.0 (personal ADS-B map)"
      },
      cache: "no-store",
      signal: controller.signal
    });

    const body = await upstream.text();
    // Preserve the provider's HTTP status so the frontend can distinguish
    // provider errors (e.g. 429/503) from proxy crashes.
    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json; charset=utf-8"
    );
    return res.send(body);
  } catch (error) {
    const timedOut = error && error.name === "AbortError";
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? "Datový zdroj neodpověděl v limitu 6,5 sekundy." : "Nepodařilo se spojit s datovým zdrojem.",
      details: error && error.message ? error.message : String(error)
    });
  } finally {
    clearTimeout(timeout);
  }
};
