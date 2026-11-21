export default async function handler(req, res) {
  const { lat, lon, dist = '25' } = req.query || {};
  const nlat = Number(lat), nlon = Number(lon), ndist = Number(dist);
  if (!Number.isFinite(nlat) || !Number.isFinite(nlon) || !Number.isFinite(ndist) || ndist < 1 || ndist > 250) {
    return res.status(400).json({ error: 'Invalid lat/lon/dist parameters' });
  }
  try {
    const upstream = `https://api.adsb.lol/v2/lat/${nlat}/lon/${nlon}/dist/${ndist}`;
    const response = await fetch(upstream, { headers: { Accept: 'application/json' } });
    if (!response.ok) return res.status(response.status).json({ error: `ADSB upstream returned HTTP ${response.status}` });
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=5');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'ADS-B provider connection failed', detail: String(error?.message || error) });
  }
}
