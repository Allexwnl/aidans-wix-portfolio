# Plan van aanpak — Aidans portfolio-websitebouwer

Versie: 5.0  
Laatst gewijzigd: 4 november 2026  
Status: eerste lokale bouwer geïmplementeerd. Firebase- en GitHub-serveraansluiting vereisen nog accountinrichting; zie README.md.

## Actuele implementatie

Inigo is de primaire richting voor filmische videopresentatie, grote beelden en rustige typografie. Er is een werkende lokale studio met directe tekstbewerking, pagina's/submenu's, thema's, sectievolgorde, kolomcomposities, desktop/mobiel-preview, presets, optionele tekstintro, conceptopslag, publiceren/terugzetten en JSON-export/import. Projectkaarten kunnen een eigen filmische detailpagina krijgen. Lokale video-export naar 480p/720p/1080p is toegevoegd met een grens van 120 MB voor het bronbestand; de 480p-conversie is met een echte browserclip gecontroleerd.

De aangeleverde Firebase-webconfiguratie staat in de genegeerde `.env.local`. Firebase Authentication/Firestore en een beveiligde GitHub-Worker zijn geïmplementeerd, maar de provider, admin-UID, Rules en Worker-secrets moeten nog in de accounts worden ingericht. `Allexwnl/aidans-portfolio` is de coderepository; foto's gaan in aparte mediarepositories. Aanmaken en kiezen van die bronnen is voorbereid in dashboard en API, met aparte serverrechten. Een eigen Netlify-site aidans-portfolio-studio is aangemaakt en de publieke Firebase-buildconfiguratie is aangesloten. De foto-Worker is nog niet gedeployd. Er is geen nieuwe GitHub-repository aangemaakt.

De editoruitbreiding is ge?mplementeerd: containers tot 12 niveaus, genest verplaatsen/kopi?ren, canvasgrepen, aparte mobiele indeling, woordopmaak, links, uitgebreide typografie en gecontroleerde fontuploads. De filmuitbreiding bevat projectgegevens onder groot filmbeeld, bioscoopweergave, scrolluitbreiding/parallax, extra onthullingen en paginaovergangen. Nog open: live geteste cloudintegraties en grote productie-videoexports. Secties kunnen worden geordend en onderdelen binnen composities kunnen op het canvas worden verschoven, met aparte mobiele offsets. De lokale Git-repository is geïnitialiseerd met `Allexwnl/aidans-portfolio` als origin; er is niets gepusht. De onderstaande hoofdstukken blijven de richting voor verdere uitbreiding. Zie README.md voor starten, bedienen en aansluiten.

Aanvullingen van 4 november: onderdelen afzonderlijk aan/uit zonder inhoud te wissen, vier navbarvarianten met kleur- en zichtbaarheidkeuzes, richting/afstand voor transforms, paginaovergangen voor browsergeschiedenis en snelle klikken, en lokaal bewaarde versleepbare/inklapbare zijpanelen. Netlify wordt vanuit deze projectmap bijgewerkt; automatische GitHub-deployments wachten op een eerste push. Firebase meldde bij de aansluitcontrole dat de Firestore API nog niet actief is.

## 1. Doel en gemaakte keuzes

We bouwen een eenvoudige visuele websitebouwer voor een portfolio. Aidan begint met een lege website of een optioneel startontwerp en maakt zelf zijn pagina's, navigatie, inhoud, vormgeving en animaties. De editor moet overzichtelijk blijven terwijl er veel mogelijk is. Een vast portfolio met alleen invulvelden voldoet niet aan deze opdracht.

Vastgelegd op basis van de laatste wensen:

- React en Vite blijven de basis.
- Firebase Authentication met e-mailadres en wachtwoord voor inloggen en Cloud Firestore voor websitegegevens, concepten en publicaties. Geen Supabase.
- Video's via YouTube-links. Geen grote videobestanden in GitHub of Firestore.
- Foto's en posters in een aparte GitHub-mediarepository, met uploaden en beheren vanuit het dashboard.
- 'Raw' betekent onbewerkte foto's, niet onbewerkte video. Een onderscheid tussen onbewerkt en bewerkt mag als optioneel label; geen verplichte dubbele workflow.
- Zelf pagina's, navbar en submenu's maken. School, opleiding, leerjaar en professioneel zijn instelbare pagina's, categorieën en filters, geen vaste verplichte navigatie.
- Kleuren, fonts, breedtes, indeling, media en animaties zijn bewerkbaar.
- Dashboard met bewerkmodus en voorbeeldmodus; met één klik wisselen en terugkeren naar dezelfde selectie en scrollpositie.
- Mobiel- en desktopvoorbeeld binnen de editor; de mobiele vormgeving is ook aanpasbaar.
- Keuze tussen automatisch concept opslaan en handmatig opslaan.
- Een aparte knop 'Publiceren' stuurt wijzigingen naar de hoofdwebsite.
- Zowel videokwaliteit kiezen als versies maken blijft een wens; de grenzen van YouTube staan in hoofdstuk 7.

Het startpunt was de standaard React/Vite-startpagina. Die is vervangen door de studio en gedeelde portfolio-renderer; de aansluitstatus staat bovenaan dit document.

## 2. Vrijheid van de bouwer

De pagina bestaat uit secties, containers en elementen. Aidan kan ze toevoegen, verplaatsen, dupliceren, verwijderen en aanpassen. Voorbeelden zijn tekst, afbeelding, knop, YouTube-video, galerij, carousel, kolommen en projectraster. Een lagenpaneel toont welke elementen bij elkaar horen; ongedaan maken en opnieuw uitvoeren helpen bij experimenteren.

Breedte wordt niet beperkt tot één vaste gecentreerde strook. Secties kunnen de volledige beschikbare schermbreedte gebruiken; per container zijn procentuele breedte, maximale breedte, uitlijning en marges instelbaar. De desktopvoorbeeldbreedte is instelbaar en zoom schaalt alleen het editorcanvas, niet de gepubliceerde maten. 'Geen breedtelimiet' betekent geen kunstmatige ontwerpgrens: inhoud moet op het scherm van de bezoeker wel bruikbaar blijven zonder onbedoeld horizontaal scrollen.

Voor plaatsing bieden we slepen, invoegpunten, kolommen, grids, uitlijning en ruimte-instellingen. De inhoud stroomt standaard mee met schermbreedte. Overlap en vrije positionering binnen een sectie zijn beschikbaar als expliciete geavanceerde instelling, met een aparte mobiele plaatsing. Zo is de vrijheid groter dan alleen vaste templates, zonder dat iedere handeling coördinaten vereist.

Instellingen werken op drie niveaus: websitebreed thema, pagina en element. Een element kan themakleuren en fonts volgen of een eigen override krijgen. De interface toont waar een instelling vandaan komt en biedt 'Terug naar standaard'.

### Wat Aidan kan aanpassen

| Onderdeel | Instellingen |
| --- | --- |
| Pagina's | Aanmaken, dupliceren, naam, URL, homepage, volgorde, concept/publicatie en verwijderen. |
| Navbar en footer | Logo/tekst, links, stijl, kleuren, positie, sticky gedrag en mobiele menuknop. |
| Submenu's | Items toevoegen, ordenen en koppelen aan pagina, sectie of externe URL; bediening via klik, touch en toetsenbord. |
| Layout | Secties, containers, rijen/kolommen, grid, volgorde, uitlijning, tussenruimte, padding, hoogte en breedte. |
| Tekst | Direct typen, kopniveau, font, grootte, gewicht, kleur, regelafstand, uitlijning en links. |
| Kleuren en fonts | Thema/paletten, achtergronden, tekst- en accentkleuren; gecureerde vrij bruikbare fonts en systeemfonts. |
| Afbeeldingen | Upload/kiezen, alttekst, uitsnede, verhouding, focuspunt, object-fit en optioneel onbewerkt/bewerkt-label. |
| Video | YouTube-link, poster, verhouding, uitlijning, starttijd, afspeelgedrag en geschikte speleropties. |
| Galerij/carousel | Beelden, volgorde, kolommen, pijlen, paginapunten en swipe; een lijst/raster is ook mogelijk. |
| Animaties | Preset, duur, vertraging, richting, sterkte, trigger en mobiele override. |
| Projecten | Categorieën en eigen indeling, waaronder professioneel en school met opleiding/leerjaar/studiejaar. |

Eigen fonts uploaden is beschikbaar met formaat- en browsercontrole: WOFF2, WOFF, TTF of OTF, maximaal 1 MB per font en 3 MB samen. De gebruiker moet webrechten hebben. Fonts reizen in het contentdocument mee; foto's blijven externe media. 'Alles aanpassen' betekent hier visuele controle over de genoemde bouwstenen; willekeurige plugins, eigen JavaScript en een ingebouwde fotobewerker zijn geen stilzwijgende vereisten.

## 3. Dashboard, bewerken en voorbeeld

Het dashboard bevat Website bewerken, Pagina's en menu's, Projecten, Media, Thema, Publicaties en Instellingen. Een nieuwe site kan helemaal leeg beginnen. Optionele templates zijn gewone bewerkbare inhoud en leggen de indeling niet vast.

De editor heeft een paginakiezer, een invoeg-/lagenpaneel, een canvas en een eigenschappenpaneel voor het geselecteerde element. In de bovenbalk staan:

- Bewerken / Voorbeeld: één klik wisselt en behoudt de huidige pagina en apparaatkeuze.
- Desktop / Mobiel, plus optioneel tablet en aangepaste voorbeeldbreedte.
- Ongedaan maken / Opnieuw.
- Opslagmodus: 'Autosave concept' of 'Handmatig opslaan'.
- Opslagstatus en, in handmatige modus, 'Concept opslaan'.
- 'Publiceren' voor wijzigingen naar de hoofdwebsite.

Klikken op tekst maakt direct typen mogelijk; geen aparte knop om iedere tekstwijziging toe te passen. Het canvas toont wijzigingen meteen in beide opslagmodi. Voorbeeld toont de huidige werkversie, inclusief nog niet opgeslagen wijzigingen, en verbergt editorbediening. Terugschakelen verliest geen werk.

Mobiel heeft dezelfde inhoud als desktop, met instelbare overrides voor onder andere kolomindeling, volgorde, spacing, tekstgrootte, zichtbaarheid en animatiesterkte. Het is geen los gekopieerde pagina die bij iedere wijziging uit de pas loopt. Navigatie schakelt naar een configureerbaar mobiel menu met submenu's. Een voorbeeldviewport moet echte responsive breakpoints gebruiken, bijvoorbeeld via een geïsoleerd iframe; alleen een smaller divje is daarvoor onvoldoende.

## 4. Concepten, opslaan en publiceren

### Autosave concept

Na een korte typepauze wordt alleen gewijzigde inhoud opgeslagen. De status toont 'Wijzigingen', 'Opslaan', 'Concept opgeslagen' of een fout met opnieuw proberen. We schrijven niet voor iedere toetsaanslag naar Firestore. Een oudere save mag een nieuwere niet overschrijven.

### Handmatig opslaan

Wijzigingen blijven direct in het canvas zichtbaar, maar worden pas na 'Concept opslaan' naar Firebase geschreven. Een browserherstelkopie kan helpen na een crash, maar telt niet als opgeslagen cloudconcept. Bij verlaten met niet-opgeslagen werk volgt een melding. Wisselen van opslagmodus mag werk niet weggooien; inschakelen van autosave slaat de huidige werkversie op.

### Publiceren

'Publiceren' slaat de actuele werkversie op en maakt daar een consistente openbare release van, ook wanneer handmatig opslaan is gekozen. Dat gebeurt pas na succesvolle validatie en opslag. Bij een fout blijft de bestaande hoofdwebsite actief en blijven wijzigingen herstelbaar. De interface toont welke versie live staat en of er ongepubliceerde wijzigingen zijn.

We bereiden een volledige release voor en wijzigen daarna de actieve releaseverwijzing atomair. Zo krijgen bezoekers geen nieuwe navigatie met oude of ontbrekende pagina's. De vorige release blijft beschikbaar om terug te zetten. Publicatie betreft website-inhoud, geen nieuwe code-deploy voor iedere tekstaanpassing. Updates in andere open browsertabs worden gedetecteerd, zodat stil overschrijven wordt voorkomen; gelijktijdig samenwerken is geen eerste vereiste.

## 5. Techniek en gratis diensten

| Onderdeel | Keuze | Aandachtspunt |
| --- | --- | --- |
| Frontend | Bestaande React/Vite-app | Eén renderer voor editor, voorbeeld en openbare pagina's. |
| Hosting | Cloudflare Pages als voorlopig voorstel | Gratis subdomein; clientroutes en directe paginalinks ondersteunen. |
| Login | Firebase Authentication | Alleen toegestane beheerder(s); geen openbare registratie met bewerkrechten. |
| Content | Cloud Firestore, Spark-plan | Concepten, paginaboom, thema, navigatie, media-index en releases; geen beeldbestanden. |
| Foto's | Aparte GitHub-mediarepository | Webgeschikte foto's, posters en varianten; repo- en API-limieten blijven gelden. |
| Video's | YouTube | Link plakken en embed tonen; rekening houden met externe speler en beschikbare opties. |
| GitHub-schrijftoegang | Kleine beveiligde Cloudflare Worker als voorstel | Token uitsluitend op de server; Firebase-identiteit en toegestane beheerder controleren. |

Firebase vervangt Supabase volledig in dit plan. Spark is kosteloos binnen de beschikbare functies en quota. De actuele [Firestore-quota](https://firebase.google.com/docs/firestore/quotas) noemen onder meer 1 GiB opgeslagen data, 50.000 documentreads en 20.000 writes per dag. Dit zijn grenzen, geen onbeperkte capaciteit. Een compleet groeiend portfolio past niet in één Firestore-document: de documentlimiet is 1 MiB. We splitsen inhoud op per pagina/onderdeel en beperken onnodige listeners, writes en herhaald lezen. Zie ook de [Firebase-prijspagina](https://firebase.google.com/pricing).

Firebase Cloud Storage en Cloud Functions zijn geen vereiste voor deze architectuur. We vermijden daarmee dat de GitHub-koppeling of mediabestanden stilzwijgend een ander Firebase-abonnement vereisen. Voor de Worker gelden eigen [gratis limieten](https://developers.cloudflare.com/workers/platform/limits/); deze is bedoeld voor kleine API-verzoeken, niet videoconversie. Geen automatische betaalde upgrades. Een eigen domein is optioneel en valt buiten de gratis basis.

De ontwikkelaar configureert Firebase, Security Rules en de GitHub-koppeling eenmalig. Aidan hoeft daarna geen consoles, tokens of commits te bedienen voor dagelijks beheer. De inrichting en quota worden vóór ingebruikname met echte media gecontroleerd.

## 6. Foto's via GitHub

Vanuit de mediabibliotheek kan Aidan foto's selecteren of slepen, een voorbeeld bekijken en uploaden. De browser maakt waar mogelijk compacte webvarianten en thumbnails. De server valideert de beheerder, bestemming, grootte en bestandstype en schrijft via de GitHub API. Firestore bewaart de verwijzing en eigenschappen; afbeeldingen gaan niet als Base64 in de database.

- Foto's krijgen unieke of versiegebonden paden zodat vervangen geen oude release of cache beschadigt.
- De media-index houdt repository, pad, versie, afmetingen, alttekst, thumbnail en gebruik per pagina bij.
- GitHub-download-URL's uit de Contents API worden niet blind als blijvend opgeslagen: die kunnen verlopen. We kiezen en toetsen een stabiele publieke bronverwijzing. Zie [GitHub Contents API](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28).
- Begin met een publieke mediarepository voor publieke portfoliofoto's. Een conceptfoto in die repository is technisch al openbaar, ook als de pagina nog niet gepubliceerd is. De editor meldt dit vóór upload; vertrouwelijke foto's horen niet in deze route.
- 'Onbewerkt' betekent hier een foto zonder creatieve nabewerking. Camera-RAW zoals CR3/NEF is geen algemeen webformaat; zo nodig is een JPEG/WebP-export nodig. Een ingebouwde raw-ontwikkelaar is niet vereist.
- Onbewerkt/bewerkt is een optioneel label; beide kunnen gewoon in dezelfde bibliotheek en galerij staan.
- Gebruik per afbeelding tonen vóór verwijderen. Geen bestanden verwijderen die een actieve of bewaarde release nog nodig heeft.
- Voortgang, annuleren waar mogelijk, opnieuw proberen en duidelijke meldingen bij limieten of ingetrokken toegang.
- Repositorygrootte en API-limieten bewaken; Git-geschiedenis houdt oude bestanden vast. GitHub is geen onbeperkt fotoarchief. Zie [bestand- en repositorylimieten](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

De eerdere wens om vanuit het dashboard een nieuwe mediarepository te maken blijft onderdeel van de opslaguitbreiding: 'Opslagbron toevoegen', naam kiezen, aanmaken met de passende GitHub-rechten en daarna uploads naar die bron sturen. Bestaande foto's blijven naar hun oorspronkelijke bron verwijzen. Nieuwe repositories zijn organisatie van opslag, geen omzeiling van quota. De interface hoeft de klant niet met Git-terminologie te belasten.

## 7. YouTube, videoweergave en resolutie

De hoofdroute is een YouTube-link plakken. De editor controleert de URL en embedbaarheid, toont een voorbeeld en laat Aidan poster, verhouding, formaat en afspeelinstellingen kiezen. Opties zijn onder andere standaardspeler, afspelen na een klik op een poster, plaatsing naast tekst en een grote videosectie. Autoplay en herhalen alleen waar de provider en browser het ondersteunen; autoplay met geluid is geen betrouwbare standaard.

Belangrijk onderscheid:

1. Formaat op de pagina: volledig instelbaar via breedte, hoogte en verhouding.
2. Afspeelkwaliteit van YouTube: kwaliteit wordt door YouTube/de speler geregeld. De bouwer mag niet beloven 720p, 1080p of 4K af te dwingen. Beschikbaarheid hangt ook af van upload en verwerking.
3. Nieuwe resolutieversies maken: een embedlink geeft geen toegang tot het originele bestand voor conversie. YouTube verwerkt een geüploade bron zelf. Voor eigen exports is het oorspronkelijke lokale bestand nodig.

De wens voor zowel kiezen als maken is dus behouden, maar wordt niet voorgesteld als een mogelijkheid die een YouTube-link alleen kan leveren. Zie de [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference).

Voor eigen resolutie-export plannen we een apart hulponderdeel in het dashboard: lokaal bronbestand selecteren, exportresolutie kiezen, converteren en downloaden, daarna uploaden naar YouTube en de link koppelen. Eerst een haalbaarheidsproef met browserconversie op desktop; grote films kunnen te veel geheugen of rekentijd vragen. Als dat onvoldoende werkt, is een lokale FFmpeg-helper nodig. Gratis serverless videotranscoding wordt niet beloofd. Deze functie krijgt een eigen fase en bewijs met echte bestanden; zij verdwijnt niet uit de planning doordat de afspeelroute YouTube wordt.

Extra opties zoals volledig eigen MP4-kwaliteitsschakeling vragen later een afzonderlijke mediabron. Ze zijn geen vereiste om de YouTube-route te laten werken. Niet-insluitbare of verwijderde video's krijgen een begrijpelijke fallback. Een niet-vermelde YouTube-video is niet hetzelfde als toegangsbeveiliging.

## 8. Bouwstenen, gegevens en beveiliging

De renderer leest een versieerbaar documentschema met toegestane elementtypen. Er wordt geen willekeurige HTML of JavaScript uitgevoerd vanuit opgeslagen inhoud.

```text
src/
  app/                 routes en appopbouw
  components/          gedeelde interface
  features/
    dashboard/         beheerstart en instellingen
    builder/           canvas, selectie, lagen, historie en eigenschappen
    pages/             pagina's, routes en navigatieboom
    renderer/          gedeelde weergave van bouwstenen
    theme/             kleuren, fonts en stijlinstellingen
    portfolio/         projecten en instelbare categorieën
    media/             GitHub-foto's en YouTube-koppelingen
    animations/        presets en uitvoering
    publishing/        opslagmodus, concepten en releases
    auth/              beheerlogin
  services/            Firebase-client en beveiligde API-koppelingen
  styles/              globale stijlen en tokens
server/                voorgestelde Worker voor GitHub-handelingen
firebase/              Security Rules, indexes en lokale emulatorconfiguratie
```

Gegevensmodel:

- `Site`: identiteit, instellingen, schemaversie en actieve releaseverwijzing.
- `Page`: id, slug, titel, SEO-velden, layoutboom en verwijzingen naar onderdelen.
- `Element`: id, type, inhoud, kinderen, basisstijlen, responsive overrides en animatiepreset.
- `Navigation`: geordende boom van links/submenu's, bestemmingen en menustijl.
- `Theme`: kleurrollen, fonts, typografieschaal, spacing en standaardbewegingen.
- `Project`: optionele categorieën, opleiding/leerjaar/studiejaar, media en gekoppelde detailpagina.
- `MediaAsset`: GitHub-bron of YouTube-id, eigenschappen, varianten en gebruiksverwijzingen.
- `Draft`: werkversie, revisie, opslagstatus en editorvoorkeuren zoals opslagmodus.
- `Release`: onveranderlijke versie van pagina's, thema en navigatie met publicatiedatum.

Concepten en beheerinstellingen zijn alleen leesbaar/schrijfbaar voor toegestane beheerders. Bezoekers lezen gepubliceerde releases; Firebase Security Rules dwingen dat af. De Worker controleert het Firebase ID-token en de beheerderrechten serverzijdig en accepteert geen willekeurige repository of bestandspaden. GitHub-tokens blijven servergeheimen. Publieke Firebase-configuratie vervangt nooit Security Rules.

Verwijderen/hernoemen van pagina's controleert navigatie en interne links. Slugs zijn uniek en gereserveerde dashboardpaden zijn uitgesloten. Publiceren valideert de complete release, inclusief submenuverwijzingen en mediabronnen. Content kan als JSON worden geëxporteerd en hersteld; foto-originelen en GitHub-referenties hebben een apart back-upplan.

De bestaande coderegels uit AGENTS.md blijven gelden, inclusief comments bij nieuwe functies/regels, maximaal vier functies per bestand en een documentatieblok met versie en wijzigingsdatum bovenaan codebestanden.

## 9. Animaties en inspiratie

Per element of sectie zijn presets beschikbaar: geen, vervagen, omhoog verschijnen, tekstzoom, beeld onthullen, na elkaar verschijnen en een lichte scrollbeweging. Daarnaast websitebrede paginatransities en een korte intro met inzoomende tekst. Intro kan worden overgeslagen en standaard eenmaal per sessie afspelen.

Instelbaar zijn duur, vertraging, richting, intensiteit en trigger (bijvoorbeeld verschijnen in beeld). Via 'Animatie bekijken' speelt de selectie opnieuw af. Desktop en mobiel delen de preset, met optionele aangepaste instellingen. Minder beweging via prefers-reduced-motion blijft ondersteund. Gebruik vooral transform en opacity en voorkom dat een overlay navigatie of focus blokkeert.

Inspiratie blijft:

- [Mind of Visuals](https://mindofvisuals.com/): duidelijke identiteit en videogerichte introductie.
- [Inigo](https://www.inigo.film/work/dijkstradraisma-vernieuwgeeftenergie): video en beelden centraal op projectpagina's.
- [Vuhlandes](https://www.vuhlandes.com/): grote beelden en focus op het werk.
- [Beyoung](https://www.beyoung.nl/): herkenbare cases en projectcontext.

Deze richtingen worden optionele startontwerpen en presets. Exacte animaties/timing moeten nog visueel in een browser beoordeeld worden. We kopiëren geen beelden of complete ontwerpen.

## 10. Bouwfasen en oplevercriteria

| Fase | Werk | Klaar wanneer |
| --- | --- | --- |
| 0. Technische proef | Firebase Spark, beveiligde GitHub-upload, YouTube-embed en responsive preview toetsen. | Eén beheerder kan een concept opslaan, een foto via het dashboard uploaden en een film afspelen; kostenroute en rechten zijn gecontroleerd. |
| 1. Dashboard en documentschema | Lege site, paginabeheer, routes, gedeelde renderer en basiscanvas. | Zelf een pagina maken zonder vast portfolio in te vullen; direct openen via de URL werkt. |
| 2. Visuele bouwer | Bouwstenen, lagen, drag-and-drop, uitlijning, breedtes, dupliceren en undo/redo. | Aidan kan een eigen schermvullende pagina opbouwen en de structuur aanpassen. |
| 3. Thema en navigatie | Kleuren, fonts, navbar, footer en submenu's. | Zelf pagina's koppelen en een mobiel navigeerbaar menu maken zonder code. |
| 4. Responsive en voorbeeld | Desktop/mobiel wisselen, overrides en éénklikvoorbeeld/terug. | Preview gebruikt echte breakpoints en verliest geen wijzigingen of selectie. |
| 5. Opslag en publicaties | Autosave/handmatig, foutafhandeling, revisies, releases en terugzetten. | Beide opslagmodi werken; publiceren werkt vanuit de actuele versie en een fout beschadigt de live site niet. |
| 6. Portfolio en media | Vrije categorieën, schoolindeling, foto's, carousel en videoblokken. | Zelf een school- of professioneel project samenstellen en media vervangen zonder console. |
| 7. Motion | Intro, element-/sectiepresets, paginatransities en mobiele overrides. | Animaties zijn vanuit de editor te kiezen en opnieuw te bekijken; mobiel blijft vloeiend. |
| 8. Opslaguitbreiding en video-exportproef | Nieuwe GitHub-opslagbron vanuit dashboard; resolutie-export met lokale bron testen. | Foto's blijven werken over meerdere bronnen; een echte filmexport slaagt of de nodige lokale helper is concreet gespecificeerd. |
| 9. Afronden en overdragen | Rechten, toegankelijkheid, prestaties, herstel, export en handleiding. | Aidan kan vanaf een lege pagina zelfstandig bouwen, opslaan, voorbeeld bekijken en publiceren. |

Dit is meer werk dan het eerdere plan met vaste secties. We leveren verticaal werkende onderdelen op, zonder de eerste vaste portfolio-layout als eindresultaat te presenteren. De visuele bouwer, submenu's, opslagkeuze en publicatie zijn kernfuncties. Willekeurige third-party plugins en gelijktijdig samenwerken zijn geen onderdeel van de eerste versie.

## 11. Controle en resterende details

- Bij codewijzigingen npm run lint en npm run build.
- Gerichte tests voor schema/revisies, autosave-volgorde, handmatig opslaan, publiceren/rollback en Security Rules.
- Onbevoegde GitHub-uploads, foute bestandspaden, quota, conflicterende updates en ingetrokken toegang testen.
- Handmatig slepen, toetsenbordbediening, submenu's, undo/redo en terugschakelen vanuit voorbeeld controleren.
- Werkelijke telefoon en Safari/Firefox/Chrome controleren: een canvasvoorbeeld vervangt geen echte apparaatcontrole.
- Controleren dat wijziging van thema, navbar en pagina's samen in één release verschijnt en bestaande media bewaard blijven.
- Back-up en terugzetten met een echte testexport proberen; gratis automatische cloudback-ups niet aannemen.

Nog te bepalen tijdens de eerste proef: wat 'grid path' precies betekent, aantal/grootte foto's, of enige foto's vertrouwelijk zijn, eerste fonts en een representatief videobestand voor de conversieproef. Deze details veranderen de gemaakte keuzes voor Firebase, YouTube, GitHub en de zelfstandige websitebouwer niet.
