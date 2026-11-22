# Letový radar – oprava poskakování mapy a HTTP 403

## Nasazení
1. Rozbal ZIP.
2. Nahraj celý obsah složky `letovy-radar-oprava` do kořenové složky projektu na GitHubu.
3. Nahraď původní `index.html` a ponech soubor `api/aircraft.js` z předchozí opravy.
4. Ulož změny a nech Vercel projekt znovu nasadit.
5. Otevři radar, obnov stránku a případně ponech proxy `/api/aircraft?url=`.

## Co je v této verzi změněno
- Stavový panel pod mapou má pevnou výšku 108 px a vlastní posuvník. Dlouhé chybové hlášky už nemění výšku stránky a mapa neposkakuje.
- Airplanes.live je dočasně vyřazen, protože vrací HTTP 403 a v chybové zprávě žádá kontaktování provozovatele. Radar používá adsb.fi a ADSB.lol, které podle posledního screenshotu data vracely.
- Mapa, GPS, upozornění, vzdálenosti, paměť poslední polohy a automatická obnova zůstávají zachované.

Poznámka: Počet letadel závisí na pokrytí ADS-B a dostupnosti veřejných zdrojů.
