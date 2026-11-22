# Letový radar – V3

## Co je změněno
- Odstraněno políčko „Vlastní proxy“ i tlačítko „Uložit“. Radar používá automaticky `/api/aircraft?url=`.
- Odstraněn úvodní text o povolení polohy a uchování poslední polohy. Informační panel upozornění se ukáže až po zapnutí upozornění nebo při skutečném upozornění.
- Opraveno přetahování mapy: GPS vystředí mapu pouze při prvním získání polohy. Další GPS aktualizace posouvají pouze značku telefonu a kruh dosahu, nikoli mapu. Kliknutí na letadlo tak může otevřít popup bez soupeření s průběžným centrováním GPS.
- Zachovány oba funkční zdroje ADS-B (adsb.fi a ADSB.lol), upozornění, rozsah mapy, automatické načítání a paměť poslední polohy.

## Nasazení
1. Rozbal ZIP.
2. Nahraj oba soubory do kořenové složky projektu na GitHubu:
   - `index.html`
   - `api/aircraft.js`
3. Nahraď staré soubory novými a nech Vercel provést nové nasazení.
4. Otevři radar a obnov stránku. Není potřeba nic vyplňovat do proxy.

Důležité: složka `api` musí být přímo vedle `index.html` v kořenové složce projektu.
