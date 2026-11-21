OPRAVENY LETOVY RADAR – NASAZENI

PROBLEM:
ADSB.lol API nema CORS hlavicky, a proto jej browser nemuze volat primo z GitHub Pages.
Samotny HTML soubor na GitHub Pages tento problem nevyresi.

OPRAVA:
Tento projekt obsahuje index.html a serverovou proxy funkci api/aircraft.js.
Proxy vola ADSB.lol ze serveru a webova stranka vola proxy na stejnem hostu.

NASAZENI (Vercel):
1. Rozbal ZIP.
2. Nahraj obsah slozky flight-radar-fixed do noveho GitHub repozitare (index.html v koreni a slozka api).
3. Na vercel.com se prihlas a zvol Add New -> Project, importuj tento repozitar.
4. Vercel projekt nasadi automaticky; nepotrebujes nastavovat build command ani framework.
5. Otevri pridelenou adresu https://...vercel.app na telefonu.

POZOR:
GitHub Pages samotny nepodporuje serverovou funkci. Pro funkcni radar je potreba pouzivat
Vercel URL (ne URL github.io). Vercel hostuje stranku i proxy.

Radar sleduje pevny stred 50.3102143, 12.9507147, kruh 10 km a upozorneni 2/3 km.
