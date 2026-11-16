# Coderegels — Aidans portfolio

Dit bestand is de plek voor projectafspraken en geldt voor deze map en onderliggende mappen. Pas de regels hieronder aan of voeg eigen regels toe. Expliciete instructies van de gebruiker gaan voor. `PLAN_VAN_AANPAK.md` beschrijft het voorstel; dat maakt toekomstige functies niet automatisch onderdeel van iedere opdracht.

## Eigen regels invullen

Vervang de invulregels door concrete afspraken. Een lege invulregel is geen verplichting.

- Gewenste opmaak en inspringing: simpel en met elke nieuwe functie/regel comments van wat die lijn doet zodat ik makelijk die lijn kan vinden.
- Maximale grootte van bestanden/componenten: niet meer dan 4 functies per bestand 
- Gewenste uitleg en documentatie: documentatie blokken zijn belangrijk dus per bestand moet een een blok hebben boven aan het bestand versie, laatst geweizigd datum.

### Code en structuur

- Gebruik de bestaande React/Vite-basis met JavaScript en JSX. Stap niet zonder opdracht over naar een ander framework of TypeScript.
- Volg de bestaande opmaak: twee spaties, enkele quotes in JavaScript en geen onnodige puntkomma's.
- Gebruik functionele React-componenten en hooks. Geef componenten PascalCase-namen en functies/variabelen camelCase-namen.
- Houd App.jsx gericht op het samenstellen van de applicatie; plaats editor, media en portfoliofuncties in eigen onderdelen zodra die worden gebouwd.
- Scheid inhoud, visuele componenten en opslagkoppelingen. Hardcode geen klantprojecten in herbruikbare componenten.
- De visuele websitebouwer is expliciet onderdeel van de opdracht: ondersteun zelf pagina's opbouwen, thema's, navbar/submenu's, responsive instellingen en animaties. Maak abstracties voor deze concrete functies; voeg geen hypothetische pluginarchitectuur toe.
- Gebruik Nederlandse interface- en foutteksten; gebruik consistente Engelse namen in de code.

### Vastgelegde product- en opslagkeuzes

- Volg de bijgewerkte richting in PLAN_VAN_AANPAK.md: een zelfstandige visuele portfolio-websitebouwer, met een lege start en optionele templates.
- Gebruik Firebase Authentication en Cloud Firestore voor login en content. Gebruik geen Supabase.
- Gebruik YouTube-links voor video's en een aparte GitHub-mediarepository voor foto's/posters. Bewaar in Firestore alleen de media-index en verwijzingen.
- Laat GitHub-schrijfacties via een beveiligde serverkoppeling verlopen; geen private toegangstokens in de browser. Toets de gratis hostingroute vóór ingebruikname.
- Bied een instelbare opslagmodus: autosave concept of handmatig concept opslaan. Tekstwijzigingen zijn in beide modi direct zichtbaar.
- Houd publiceren apart van concept opslaan. De publiceerknop publiceert de actuele werkversie pas na succesvolle opslag en validatie.
- Ondersteun éénklik wisselen tussen bewerken en voorbeeld, met behoud van werk, en een desktop-/mobielkeuze met echte responsive breakpoints.
- Leg geen vaste maximale paginabreedte op. Maak volledige schermbreedte en instelbare containerbreedtes mogelijk; voorkom onbedoelde mobiele overflow.
- Behandel onbewerkt/bewerkt als optionele fotolabels, niet als een verplichte workflow voor video's.
- Houd de wens voor videoresolutie kiezen én maken in het plan, maar beloof geen kwaliteitsforcering of bestandsconversie vanuit alleen een YouTube-link. Eigen exports vereisen het bronbestand.

### Vormgeving en animaties

- Gebruik gedeelde CSS-variabelen voor kleuren, spacing, typografie en animatietiming.
- Bewaar animatiepresets centraal en maak ze instelbaar via data.
- Ondersteun desktop en mobiel, inclusief touch en toetsenbord. Verberg essentiële bediening niet achter hover.
- Respecteer prefers-reduced-motion en voorkom dat animaties navigatie of focus blokkeren.
- Voeg geen animatiebibliotheek toe zonder concrete noodzaak; leg de reden kort vast als er een nodig is.

### Bewerken, data en veiligheid

- Gebruik dezelfde weergavecomponenten voor editorvoorbeeld en publieke site.
- Laat tekstwijzigingen direct zien; geef bij autosave een duidelijke status en herstelbare fouten.
- Maak onderscheid tussen concept en gepubliceerde inhoud zolang er geen andere opdracht is.
- Dwing beheertoegang af in backend/databasebeleid. Alleen een verborgen route is onvoldoende.
- Zet geen wachtwoorden, private tokens of service-role-sleutels in broncode, browseropslag of Vite-clientvariabelen. Publieke clientconfiguratie is alleen toegestaan met passende toegangsregels.
- Valideer media en externe URL's. Render ingevoerde tekst veilig; accepteer niet zomaar uitvoerbare HTML.
- Bewaar grote bronvideo's buiten de code-repository. Voeg geen klantmedia toe zonder duidelijke bestemming en rechten.
- Voeg geen automatische betaalde upgrades of omzeiling van opslagquota toe.

### Werkwijze en controle

- Lees het plan en relevante bestaande code vóór implementatie. Een opdracht om alleen een plan te maken is geen opdracht om de website te bouwen.
- Wijzig alleen bestanden die voor de opdracht nodig zijn; behoud bestaand werk van de gebruiker.
- Voeg dependencies alleen toe als ze een concrete functie oplossen en controleer actuele documentatie bij integraties.
- Voer bij codewijzigingen npm run lint en npm run build uit en rapporteer blokkades eerlijk.
- Schrijf gerichte tests voor risicovol gedrag zoals toegangsrechten, autosave en publiceren; geen tests die alleen triviale opmaak kopiëren.
- Test responsive gedrag en animaties ook handmatig zodra die worden aangepast.
- Werk het plan bij als een gekozen oplossing wezenlijk afwijkt. Benoem aannames en beperkingen expliciet.
