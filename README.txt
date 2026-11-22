# Letový radar – opravená verze pro Vercel

## Nasazení
1. Rozbal ZIP.
2. Nahraj celý obsah složky `letovy-radar-oprava` do kořenové složky projektu na GitHubu (nebo nahraď původní `index.html` a přidej složku `api`).
3. Ve Vercelu nech projekt nasadit znovu (Deployments → Redeploy, případně nový commit).
4. Otevři `https://TVOJE-ADRESA.vercel.app/api/aircraft` — očekávaná odpověď je HTTP 400 s hláškou „Chybí parametr url.“. To potvrzuje, že serverová funkce běží.
5. Otevři hlavní stránku radaru, povol polohu a ponech proxy nastavenou na `/api/aircraft?url=`.

## Co je opraveno
- Přidána chybějící serverová funkce Vercel `/api/aircraft`.
- Proxy povoluje pouze konkrétní HTTPS ADS-B endpointy, takže nejde o otevřenou proxy.
- Proxy předává skutečný HTTP status poskytovatele a vrací srozumitelnou chybu při timeoutu.
- OpenSky byl odebrán z automatického načítání; v dodaném screenshotu vracel HTTP 500 a tato verze používá tři komunitní ADS-B zdroje.

## Poznámka
Dostupnost letadel závisí na pokrytí ADS-B přijímači v okolí a na dostupnosti veřejných API. Pokud všechny tři poskytovatele vrátí chybu, zkontroluj text v řádku „Stav“; může jít o výpadek nebo limit poskytovatele, nikoli o chybu mapy.
