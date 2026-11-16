# Aidan Studio

Visuele portfolio-websitebouwer in React en Vite. Een filmisch startontwerp met grote videobeelden en rustige typografie, met Inigo als belangrijkste inspiratie. Je kunt ook helemaal leeg beginnen.

Versie: 1.1 · Laatst gewijzigd: 16 november 2026.

## Lokaal bekijken

```powershell
npm install
npm run dev
```

Open de URL die Vite toont, meestal `http://localhost:5173`.

- `/studio?demo=1`: lokale proef van de volledige editor, zonder Firebase-login.
- `/?demo=1`: de lokaal gepubliceerde website; zolang er geen lokale release is, zie je het startontwerp.
- `/studio`: echte Firebase-beheerlogin.
- `/`: uitsluitend de echte Firebase-publicatie wanneer Firebase is geconfigureerd.

De expliciete proefmodus werkt alleen op localhost/127.0.0.1. Deze maakt geen cloudpublicatie en verandert geen Firebase-data. De browser bewaart proefconcepten en lokale publicaties; ze zijn niet beschikbaar op een andere computer. De echte website is pas openbaar ingericht nadat Firebase en hosting zijn aangesloten.

De aangeleverde publieke Firebase-configuratie staat in `.env.local`. Dit bestand wordt door Git genegeerd. `.env.example` toont welke waarden een andere checkout nodig heeft. Na een wijziging aan omgevingsvariabelen de devserver opnieuw starten.

## Wat werkt

- Direct tekst bewerken op het canvas, zonder knop per tekst.
- Pagina's maken, dupliceren, hernoemen, verwijderen en URL's aanpassen.
- Navbarlinks en submenu's maken, ordenen en koppelen aan pagina's; een mobiel menu.
- Lege website of volledig bewerkbaar filmisch startontwerp.
- Introductie, tekst, video, afbeelding, fotocarousel, projectraster, contact en vrije kolomcomposities.
- Secties slepen/ordenen, dupliceren, verwijderen en via pijlen verplaatsen.
- Composities met tekst/beeld/video/knoppen, instelbare kolommen, uitlijning en verschuiving; onderdelen op het canvas verslepen.
- Kleuren, systeemfonts, afstanden, breedtes, schermvullende beelden, hoekafronding en tekstgrootte aanpassen.
- Desktop- en mobielvoorbeeld met echte viewportbreedte; een eigen desktopbreedte invoeren. Het voorbeeld schaalt passend in de werkruimte.
- Mobiele overrides voor introductietekst, ruimte, kolommen en verschuivingen.
- Eén klik wisselen tussen bewerken en voorbeeld zonder het werk kwijt te raken.
- Fade, rise, zoom en filmisch onthullen, met instelbare duur en opnieuw afspelen. Optionele korte tekstintro, eenmaal per sessie en over te slaan.
- YouTube-links met poster, starttijd, herhalen en verschillende beeldverhoudingen. De speler laadt pas na een klik.
- Projecten met categorie, opleiding, leerjaar en jaar. Filters op categorie en leerjaar.
- Vanuit een projectkaart een eigen bewerkbare pagina maken met film, verhaal en fotocarousel.
- Autosave of handmatig concept opslaan, opslagstatus, undo/redo en revisieconflicten tussen tabbladen.
- Concept apart publiceren, vorige release terugzetten, en JSON-export/import.
- Foto-upload met browsercompressie, GitHub-mediabibliotheek en kiezen/aanmaken van een nieuwe publieke opslagbron zodra de server is aangesloten.
- Lokale MP4-export naar 480p, 720p of 1080p. De bron gaat niet naar een server; alleen de rekenmodule wordt gedownload. Eerste export downloadt circa 32 MB. Bronlimiet: 120 MB; bedoeld voor korte desktopclips. Annuleren beëindigt de rekenworker. Blijf tijdens de export in het mediapaneel.

YouTube bepaalt de kwaliteit tijdens afspelen; de site kan geen 1080p afdwingen. De lokale export maakt een nieuw bestand dat je zelf naar YouTube uploadt. Vergroten van een lage resolutie herstelt geen details.

## Nieuwe editor- en filmgereedschappen

- **Toevoegen → Container**: voeg raster, rij of stapel toe. Selecteer een container voordat je een bouwsteen toevoegt. Verplaats bestaande inhoud via de lagenboom of **Vrije indeling → Plaatsen in**. Kopiëren/verwijderen werkt voor de volledige inhoud.
- **Canvasgrepen** rechtsboven de selectie: verplaatsen of breedte aanpassen. Pijltjestoetsen werken ook; Shift maakt grotere stappen. Mobiele waarden blijven apart.
- **Tekstopmaak**: selecteer woorden in het canvas voor vet, cursief, onderstrepen, doorhalen en links. Het eigenschappenpaneel bepaalt de stijl per tekstveld en apparaat.
- **Vormgeving → Eigen lettertypen**: upload een webfont. Het font gaat mee in concept, publicatie en JSON-export. Verwijderen herstelt verwijzingen. Grote fonts kunnen de beperkte lokale browseropslag eerder vullen; cloudinhoud heeft een grens van 8 MiB.
- **Videoblok → Filmische presentatie**: één knop voor de rustige projectstijl met groot filmbeeld, projectgegevens en bioscoopvenster. Los instelbaar: omslag/project/minimaal, inline/bioscoop/zonder geluid starten, breedbeeld 21:9, kaderuitbreiding of parallax tijdens scrollen.
- **Animatie**: dertien presets, duur, vertraging, bewegingscurve en herhalen. **Animatie bekijken** opent het voorbeeld. **Vormgeving → Paginaovergangen** kiest vervaging of filmdoek. Minder beweging wordt gerespecteerd.

De browsertests controleren geneste publicaties, opgemaakte tekst, een echt fontbestand, desktop/mobiel, filmvenster sluiten/focus en paginaovergangen. YouTube is in de interactietest vervangen door een testspeler; afspeelbaarheid van Aidans uiteindelijke video's moet met die links worden gecontroleerd. Het testfont ABeeZee heeft de meegeleverde OFL-licentie in tests/fixtures.

## Zichtbaarheid, navigatie en werkruimte

- **Onderdelen aan / uit** in de eigenschappen: titel, tekst, bijschriften, carouselknoppen, projectgegevens, filters en contactknop waar toepasselijk. Uitgeschakelde inhoud blijft opgeslagen. Een hele uitgeschakelde bouwsteen blijft gedimd selecteerbaar in de editor en ontbreekt in preview/live.
- **Navigatie → Navbarvariant**: klassiek, gecentreerd, zwevend of compact uitklapmenu. Woordmerk, tekst naast logo en pijlen kunnen aan/uit. Eigen kleuren of themakleuren en vaste navigatie zijn instelbaar.
- **Animatie** bevat ook links/rechts, van boven, draaien en uitzoomen, met instelbare afstand. Paginaovergangen vangen klikken, browser-terug/vooruit en snelle vervolgnavigatie af. Ze draaien in Voorbeeld en op de bezoekerssite; bewerken wisselt direct.
- **Zijpanelen**: sleep de binnenrand om breder/smaller te maken; sleep helemaal dicht of gebruik het pijltje om in/uit te klappen. De rand ondersteunt pijltjestoetsen en Home/End. Breedtes blijven lokaal bewaard. Op smalle schermen wordt de gestapelde studio gebruikt.

## Toegevoegd op 16 november

- **Animatie → Start**: kies of een animatie begint zodra de bouwsteen in beeld komt, pas verder in beeld, of direct bij het openen van de pagina. **Na elkaar verschijnen** laat de onderdelen van een bouwsteen één voor één binnenkomen. **Sterkte** schaalt afstand, zoom en onscherpte.
- **Mobiele animatie**: zet het voorbeeld op Mobiel en open Animatie; effect, duur, vertraging en sterkte gelden dan alleen voor mobiel. 'Mobiel gelijk aan desktop' wist de afwijking.
- **Navigatie → Bestemming**: een menulink, submenu of footerlink wijst naar een pagina, een sectie op een pagina of een externe link (https, mailto of tel). Externe webadressen openen in een nieuw tabblad.
- **Navigatie → Footer**: footer aan/uit, woordmerk en jaartal aan/uit, voettekst, eigen kleuren en links.
- **Afbeelding**: alttekst, verhouding, vullen of hele foto tonen, focuspunt en het optionele label onbewerkt/bewerkt. Voor galerijfoto's staan dezelfde instellingen per foto onder Foto's.
- **Galerijweergave**: carousel, raster of lijst. Bij raster kies je het aantal kolommen, apart voor mobiel; bij carousel kun je paginapunten tonen.
- **Tabletvoorbeeld**: derde knop naast Desktop en Mobiel, 820 px breed. Tablet gebruikt de desktopindeling; de mobiele instellingen gelden tot 600 px.
- **Publicatiestatus**: de werkbalk toont 'Nog niet gepubliceerd', 'Wijzigingen nog niet live' of 'Live is actueel'. Een mislukte opslag heeft de knop 'Opnieuw proberen'.

De browsertests starten met nepwaarden voor Firebase en werken dus ook zonder `.env.local`.

## Netlify

Deze projectmap is gekoppeld aan **aidans-portfolio-studio** op account Allexwnl. Online: https://aidans-portfolio-studio.netlify.app · studio: https://aidans-portfolio-studio.netlify.app/studio. De loginpagina is via HTTPS gecontroleerd; online opslag wacht nog op Firebase-inrichting. De koppeling staat lokaal in de genegeerde .netlify-map. netlify.toml bouwt met npm run build en publiceert dist; public/_redirects ondersteunt /studio en directe projectpaden. De vier publieke Firebase-instellingen staan ook als Netlify-buildvariabelen ingesteld.

Dit gebruikt voorlopig handmatige deployments vanuit deze map. De GitHub-repository heeft nog geen gepushte commit van deze code; automatisch deployen na een Git-push is daarom nog niet aangesloten. De bestaande andere portfoliosite op het Netlify-account is niet gewijzigd.

Bijwerken na codewijzigingen:

~~~powershell
npm run build
npx netlify-cli deploy --prod --no-build --dir dist
~~~

Content publiceren vanuit de studio vereist Firebase-inrichting hieronder. Voeg **aidans-portfolio-studio.netlify.app** toe aan Authentication → Settings → Authorized domains. Een incomplete productieconfiguratie opent geen lokale proefeditor.

## Echte Firebase aansluiten

De studio gebruikt Firebase Email/Password voor bestaande accounts. Wachtwoorden worden niet in de projectconfiguratie opgeslagen. De Firebase CLI-login is apart: die geeft ontwikkeltools toegang tot het Firebase-project en vervangt de studio-login niet. Inloggen in de studio verleent alleen beheerrechten als admins/UID bestaat.

De clientcode is aangesloten op project `aidans-portfolio-41dc9`; de accountinrichting hieronder moet nog gebeuren. Een publieke webconfiguratie geeft geen beheerrechten.

1. Open het project in de Firebase-console en maak een Cloud Firestore-database in productie-/vergrendelde modus. Kies bewust de regio voordat je de database maakt.
2. Schakel onder Authentication → Sign-in method Email/Password in. Gebruik het bestaande e-mail/wachtwoord-account of voeg het toe onder Authentication → Users. Voeg onder Authorized domains je lokale en uiteindelijke domein toe; nieuwe projecten staan localhost mogelijk niet standaard toe.
3. Publiceer de inhoud van `firebase/firestore.rules` via Firestore → Rules. Alternatief via de Firebase CLI:

   ```powershell
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules --project aidans-portfolio-41dc9
   ```

4. Log één keer in op `/studio`. Er worden nog geen schrijfrechten toegekend. Kopieer de gebruikers-UID uit Authentication → Users.
5. Maak via de Firebase-console een document `admins/DEZE_UID`, bijvoorbeeld met `label: 'Aidan beheerder'`. Maak dit niet clientzijdig. Alleen expliciet toegevoegde UID's mogen content lezen/bewerken.
6. Herlaad `/studio`. Maak een concept, herlaad en controleer behoud. Publiceer en open `/` in een uitgelogd venster. Controleer ook dat concepten voor bezoekers niet leesbaar zijn.

Content staat onder `sites/portfolio/documents/{draft|live|previous}`. Inhoud is opgesplitst in onveranderlijke snapshotdelen onder `sites/portfolio/snapshots/{id}/chunks/{index}`, zodat een groeiend portfolio niet in één 1-MiB-document hoeft te passen. Alleen de actieve live snapshot is openbaar. Een transactie wisselt de openbare manifestverwijzing; een mislukte publicatie laat de eerdere versie staan.

De client probeert vervangen, niet langer gebruikte snapshots op te ruimen; Rules weigeren verwijderen van actieve concept-/live-/herstelinhoud. Afgebroken uploads of transacties kunnen ongebruikte snapshotdelen achterlaten. Houd het Firebase-gebruik in de gaten en controleer zulke resten bij onderhoud. Er is een grens van 8 MiB content per snapshot; foto's horen buiten Firestore.

Firebase blijft op Spark. Er zijn geen Firebase Cloud Functions of Cloud Storage nodig. De echte e-mail/wachtwoord-login en cloudregels zijn nog niet end-to-end geverifieerd in jouw account. De Java-runtime voor lokale Firestore-emulatortests is op deze computer niet aanwezig.

## GitHub-foto's aansluiten

`Allexwnl/aidans-portfolio` is voor **code**. De Worker mag daar niet ongemerkt foto's plaatsen. Gebruik een aparte **publieke** bron, bijvoorbeeld `Allexwnl/aidan-media-basis`.

1. Maak een openbare mediarepository op het juiste account of configureer de onderstaande aanmaakfunctie.
2. Vul in `wrangler.jsonc` de `ADMIN_UID` (dezelfde als bij Firebase), `MEDIA_OWNER`, `MEDIA_REPO` en `ALLOWED_ORIGINS` in. Origins bevatten schema en eventuele poort, zonder afsluitende slash. Voeg later je echte websitedomein toe.
3. Stel `GITHUB_TOKEN` alleen als Worker-secret in. Gebruik minimale rechten voor de gekozen mediarepositories: metadata lezen en contents lezen/schrijven. Nooit als `VITE_`-variabele of in de broncode zetten.

   ```powershell
   npx wrangler login
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler deploy
   ```

4. Zet de teruggegeven Worker-URL in `VITE_MEDIA_API_URL` in `.env.local` en later bij de frontendhosting. Herstart Vite of bouw opnieuw.
5. Log in als de ingestelde beheerder en open Media. Kies de opslagbron en test uploaden vanaf twee apparaten.

De Worker verifieert het Firebase-token met Google's roterende publieke sleutels en vergelijkt de UID. Alleen het vaste GitHub-account en bronnen met prefix `aidan-media-` (of de expliciet ingestelde basisbron) zijn toegestaan. Bestanden krijgen unieke paden en commitgebonden openbare verwijzingen. De server accepteert alleen voorbereide WebP-bestanden tot 3 MB; browserinvoer mag JPEG/PNG/WebP tot 8 MB zijn en wordt tot maximaal 2400 px verkleind.

**Nieuwe opslagbron vanuit het dashboard:** zet `ALLOW_CREATE_SOURCES` op `true` en kies een GitHub-credential die repositories op dit gebruikersaccount mag aanmaken. Een token voor uitsluitend één bestaande repository is hiervoor niet voldoende. De dashboardflow toont de openbare bestemming en vraagt een bewuste keuze, maakt `aidan-media-<naam>` aan en houdt oude beeldverwijzingen intact. Aanmaakfouten worden getoond. Er wordt geen extra capaciteit of onbeperkte opslag beloofd.

De bibliotheek leest maximaal de GitHub Contents-directorylimiet per bron; gebruik voor grotere verzamelingen een nieuwe bron. Bronnen ontdekken kijkt maximaal vijf pagina's van honderd accountrepositories door. Er is nog geen verwijderknop voor bronbestanden, zodat bestaande publicaties niet per ongeluk beschadigd worden. Weglaten uit een pagina verwijdert het origineel niet uit GitHub.

Foto's in een publieke repository zijn meteen openbaar, ook als de pagina nog concept is. Vertrouwelijke beelden en camera-RAW-bestanden horen niet in deze uploadroute. 'Onbewerkt' en 'bewerkt' zijn optionele omschrijvingen voor webgeschikte foto's.

## Hosting en code

Er is nog geen externe deployment of push gedaan. De lokale Git-repository is geïnitialiseerd op `main`, met `https://github.com/Allexwnl/aidans-portfolio.git` als `origin`. De bestanden zijn nog niet gecommit, zodat je de volledige eerste versie kunt beoordelen. `.env.local`, node_modules, buildoutput en testartefacten zijn genegeerd.

De app blijft in de bestaande projectmap. Voor Cloudflare Pages: bouw met `npm run build`, outputmap `dist`, zet dezelfde publieke Firebase-variabelen bij de build en configureer de Worker-URL. `public/_redirects` ondersteunt directe React-paginapaden. Voeg het domein toe aan Firebase Authorized domains en aan de Worker-origins.

`Publiceren` in het dashboard wijzigt content in Firebase; dat is iets anders dan nieuwe applicatiecode uitrollen. Alle bestanden in `dist` zijn door de build gegenereerd en worden niet gecommit.

## Controles

```powershell
npm run lint
npm test
npm run test:e2e
npm run build
```

De browsertests starten zelf Vite op `127.0.0.1:5180` en gebruiken uitsluitend de lokale proef. Installeer zo nodig eenmalig de browser met `npx playwright install chromium`. Screenshots staan na de tests in `test-results/`.

Getest: directe tekstbewerking, mobiele viewport, handmatig opslaan/herladen, publicatie, afwijzen van ongeldige publicaties, tabbladconflicten, pagina's/submenu's, eigen projectdetailpagina, mobiel menu zonder overflow en een echte lokale clip naar afspeelbare 480p-MP4. De Worker-tests controleren CORS, ontbrekende authenticatie en repositorygrenzen. Dit vervangt de echte accounttests na inrichting niet.

Bij dependency-installatie is Firebase vastgezet op een Node-22-compatibele versie. De override van `@grpc/grpc-js` haalt een kwetsbare indirecte versie weg; `npm audit` meldt bij oplevering nul kwetsbaarheden.

## Bestanden en verdere uitbreiding

- `AGENTS.md`: jouw coderegels; zelfstandige componenten/helpers blijven verdeeld over kleine bestanden met maximaal vier per bestand. Eventcallbacks staan bij de bediening.
- `PLAN_VAN_AANPAK.md`: ontwerp en actuele implementatiestatus.
- `src/features/builder`: studio en bediening.
- `src/features/renderer`: dezelfde rendercomponenten voor bewerken, voorbeeld en bezoekers.
- `src/features/panels`: eigenschappen, thema, menu's en instellingen.
- `src/services`: Firebase, snapshots, foto-opslag en video-export.
- `server`: geauthenticeerde GitHub-Worker.

De bouwer ondersteunt geneste containers (tot 12 niveaus), rasters, rijen, lagen verplaatsen, canvasgrepen voor positie/breedte en aparte mobiele instellingen. Tekst heeft woordopmaak en links; per veld zijn font, grootte, dikte, kleur, regelhoogte, letterafstand en uitlijning instelbaar. Eigen WOFF2/WOFF/TTF/OTF-fonts worden gecontroleerd en met het ontwerp opgeslagen (1 MB per font, 3 MB samen). De mobiele versie van de studio is bruikbaar, maar desktop is de prettigste werkplek. De publieke site is responsive; een test op een echte iPhone/Android blijft onderdeel van de uiteindelijke overdracht.

Tijdelijke voorbeeldfoto's zijn gedownload via Unsplash Images en lokaal opgeslagen in `public/images`: [kust](https://images.unsplash.com/photo-1518837695005-2083093ee35b), [architectuur](https://images.unsplash.com/photo-1600607687939-ce8a6c25118c), [bos](https://images.unsplash.com/photo-1441974231531-c6227db76b6e). Vervang ze vóór de definitieve oplevering door Aidans eigen werk. Video-export gebruikt ffmpeg.wasm; laat de meegeleverde licentievermeldingen van dependencies intact.
