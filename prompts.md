## Dokumentation över alla använda prompts och till vilken AI

## 2026-01-20
### ChatGPT
ChatGPT användes för att skriva tydligare prompts till Claude.
- https://chatgpt.com/share/696f4682-c8bc-800a-a619-9ca424115de9

**Prompt 1**
- *Syfte:* Skapa en tydlig och meningsfull prompt till Claude för att utveckla och förtydliga våra ideer.
- *Förväntad output:* En bra och tydlig prompt som instruerade Claude tydligt för att få ett bra resultat.
- *Faktisk output:* En tydlig prompt som instruerade Claude på bra vis men behövde tydligöras en liten del.
- *Vad fungerade, vad saknades?* Det gick bra med att få fram en prompt och granska våran projektbeskrivning. Dock ansåg AI:n att vi saknade en del angående vilket ramverk vi skulle ha och hur koden skulle vara uppdelad.
```

Jag ska skapa en spin-the-wheel applikation eftersom jag fått i uppgift att träna på ai-prompting och dokumentation.

Jag har lagt till alla önskade features och vad som målet är.

Hjälp mig skriva en tydlig och meningsfull prompt som jag ska bifoga vidare till claude AI så att den kan utföra ett så bra arbete som möjligt. Lägg inte till några extra funktioner, problem eller vad ett lyckat resultat är. Förfina/förtydliga endast det du anser vara nödvändigt.
Ställ frågor till mig ifall någonting blir oklart och gå igenom ditt svar steg för steg.

Features: 
Lägga till objekt på hjulet.
Ta bort objekt på hjulet.
Snurra för att få ett slumpmässigt resultat.
Kunna redigera färger på de olika objekten på hjulet.
En historik över de 5 senaste resultaten.
En enkel popup som visar vad hjulet landade på.
En spak vid sidan om hjulet som låter en snurra hjulet men man ska också kunna bara klicka på hjulet för att snurra.
Med animationer (snurrar, konfetti när den snurrat klart, dra i spaken).
Ljudeffekter (vid snurr och resultat).

Problem: Vi kunde inte bestämma oss vad vi ville göra. Så vi skapar en applikation för att kunna bestämma oss. 

Mood-board: Proffessionell med lite liv i det, lite färglatt kanske. 

Målgrupp: Unga vuxna 18-25.

Vad är ett lyckat resultat: Alla features finns med och inga buggar som hindrar funktionaliteten finns i applikationen.
```

**Prompt 2:**
- *Syfte:* Följdfrågor den ställde eftersom första prompten inte täckte allting.
- *Förväntad output:* En prompt som täcker alla aspekter vi tänkte på.
- *Faktisk output:* En prompt som täcker alla aspekter vi tänkte på fast fortfarande med små fel i UI.
- *Vad fungerade, vad saknades?* Vi fick en tydlig prompt som täckte allt vi ville ha med i applikationen och la upp det på ett sätt så att Claude kunde implementera allting. Vi kunde dock ha varit mer specifika med hur vi ville implementera vissa funktioner, exempelvis hur man valde färg för varje tårtdel av hjulet.

```
Svar på följdfrågor:
1. Det ska vara en webbapplikation
2. Implementera lösningen i en index.html och script.js. Utseende ska endast göras med tailwind css
```

### Claude
Claude användes för att skapa applikationen.
- https://claude.ai/share/5ada5390-afe3-46bf-b378-16882445e40c

**Prompt 1**
- *Syfte:* Skapa en första itteration av vår applikation.
- *Förväntad output:* En fungerade applikation som mötte alla krav.
- *Faktisk output:* En applikation som fungerade som den ska men med brister i UI:n.
- *Vad fungerade, vad saknades?* Alla funktioner fungerade direkt. Dock var UI inte korrekt då exempelvis spaken inte rörde sig som vi ville. Pilen som pekar på svaret man fick visade fel och "lägg till" knappen för flera objekt gick utanför sin egna ruta.

```
Du är en erfaren fullstack webbutvecklare ska implementera en webbaserad spin-the-wheel-applikation. Syftet med uppgiften är att träna på AI-prompting och dokumentation, så lösningen ska vara tydligt strukturerad, lätt att följa och väl kommenterad.

Teknisk ram
* Applikationen ska bestå av:
   * `index.html`
   * `script.js`
* Applikationen ska köras direkt i webbläsaren
* All styling ska göras med Tailwind CSS
* Ingen annan stylinglösning ska användas

Funktionella krav (features)
Applikationen ska innehålla följande funktionalitet:
* Möjlighet att lägga till objekt på hjulet.
* Möjlighet att ta bort objekt från hjulet.
* Möjlighet att snurra hjulet för att få ett slumpmässigt resultat.
* Möjlighet att redigera färger på de olika objekten på hjulet.
* En historik som visar de 5 senaste resultaten.
* En enkel popup som visar vilket objekt hjulet landade på.
* En spak vid sidan av hjulet som kan användas för att snurra, samt möjlighet att klicka direkt på hjulet för att snurra.
* Animationer (snurrande hjul, konfetti när snurret är klart, animation vid drag i spaken).
* Ljudeffekter (vid snurr och när resultatet visas).

Problemformulering
Vi hade svårt att bestämma oss för vad vi ville göra, därför skapar vi en applikation som hjälper användare att fatta beslut.
Visuell stil (mood-board)
Stilen ska kännas professionell men levande, med inslag av färg och rörelse.

Målgrupp
Unga vuxna i åldern 18–25 år.

Viktigt
* Lägg inte till fler funktioner än de som listas ovan
* Ändra inte problemformuleringen, målgruppen eller definitionen av ett lyckat resultat
* Fokusera på korrekt funktionalitet, tydlig struktur och läsbar kod
Implementera lösningen så att alla krav uppfylls utan buggar som hindrar funktionaliteten.
```

**Prompt 2**
- *Syfte:* Denna prompt är korrigerande eftersom att första resultatet inte var felfritt.
- *Förväntad output:* En applikation som inte har några fel överhuvudtaget angående funktionaliteten eller UI:n.
- *Faktisk output:* En applikation som har löst majoriteten av alla UI problem men med några problem kvar.
- *Vad fungerade, vad saknades?* Till sort del fungerade all kod utan problem. De problem som uppståd angick främst pilen som pekade på svaret man fick. I den andra prompten så bad vi den korrigera problemet som uppstod. AI gjorde dock inte detta så en av gruppmedlemmarna gick in i koden och löste det manuellt.

```
Pilen som pekar på vad resultatet är har hamnat fel. Den ska vara på höger sida men har hamnat högst upp.
Spaken fungerar ej som den ska. Den dras åt höger istället för nedåt när man trycker på den.
Lägg till knappen har hamnat utanför sin ruta.
Istället för att man skriver in hexkoden för färgen borde det finnas ett färghjul man kan välja färg från (det finns en sådan typ av input i html är jag ganska säker på)
```

## 2026-01-21

### ChatGPT
- https://chatgpt.com/share/69709f87-1aa8-800a-885e-6100a2194676
**Prompt 1**
- *Syfte:* Skapa en så bra som möjlig prompt till Claude.
- *Förväntad output:* Ett prompt som kan instruera Claude till att utföra det arbete vi vill att den ska göra.
- *Faktisk output:* 
- *Vad fungerade, vad saknades?* 

```
Du är en erfaren fullstack utvecklare som arbetat mycket med att skriva prompts till claude AI.

Hjälp mig förtydliga denna prompt så att Claude förstår den och kan arbeta med det på bästa sätt.

Prompten: "Du är en erfaren fullstack webbutvecklare som har gjort många applikation med login funktioner med google auth och firebase.

Du ska skapa en login till en spin-the-wheel applikation med google auth och firebase. Användare ska kunna spara sina resultat de får från hjulet. Det som ska sparas ska alltså vara alla olika alternativ som fanns på hjulet och det svar man fick.

Login sidan ska vara på samma sida som spin-the-wheel applikationen, alltså ska inte någon ny html fil som länkar vidare skapas. Det ska alltså vara en sorts modal som sätts över applikationen. Själva spin-the-wheel delen ska vara suddig tills man har loggat in.

Just nu finns det redan en funktion som sparar det senaste 5 resultaten man fick från hjulet. Ändra om denna funktion så att det blir en dropdown meny där man kan see alla sina resultat med alla alternativ på hjulet och vilket resultat man fick. Numrera sedan dessa i ordningen de sparades. Det ska inte finnas någon gräns över hur många resultat som sparas.

Gå igenom ditt svar steg för steg och var kritisk mot dig själv för att komma fram till bästa lösningen. Ändra inte befintlig kod utan att tänka igenom först och ställ frågor till mig ifall någonting är otydligt innan du börjar koda över huvudtaget."
```

### Claude
- https://claude.ai/share/f4ef09f5-cdc8-4010-95b8-6c209a889c42
**Prompt 1**
- *Syfte:* Säkerställa att prompten vi fick från ChatGPT har tillräckligt med information för att kunna börja arbeta.
- *Förväntad output:* Att Claude skulle ställa frågor som gjorde att den hade tillräkligt med information.
- *Faktisk output:* Claude ställde viktiga frågor utan att skriva någon kod.
- *Vad fungerade, vad saknades?* Allting fungerade som det skulle. Vi bad Claude att ställa frågor ifall den var osäker på någonting, vilket Claude sedan gjorde. Ingenting gick fel.
```
Du är en senior fullstack webbutvecklare med djup erfarenhet av:
* Firebase (Auth + Firestore/Realtime DB)
* Google OAuth
* Frontend-arkitektur
* Att bygga produktionstjänster med bra UX och säkerhet.
Kontext
Jag har en befintlig webbaserad spin-the-wheel-applikation. Idag finns:
* En enkel funktion som sparar de senaste 5 resultaten lokalt.
* Ingen inloggning.
* Allt körs i en single-page-app (ingen routing mellan HTML-filer).
Mål
Jag vill lägga till:
1. Google-inloggning via Firebase.
2. Möjlighet för varje användare att spara alla sina resultat i molnet.
3. En förbättrad UI för att visa alla tidigare resultat.
Funktionella krav
Login
* Inloggning ska ske med Google Auth via Firebase.
* Login ska ske i form av en modal overlay ovanpå befintlig sida.
* Spin-the-wheel-appen ska vara suddig/disabled tills användaren är inloggad.
* Ingen ny HTML-sida får skapas – allt ska ske på samma sida.
Resultat
Varje sparat resultat ska innehålla:
* Alla alternativ som fanns på hjulet vid snurrtillfället.
* Det valda resultatet.
* Tidsstämpel.
Historik
* Den nuvarande funktionen som sparar senaste 5 resultat ska ersättas.
* Istället ska det vara en dropdown-meny där användaren kan:
   * Se alla sina tidigare resultat.
   * Se dem numrerade i den ordning de sparades.
   * Det ska inte finnas någon maxgräns.
Icke-funktionella krav
* Lösningen ska vara skalbar.
* Datamodellen ska vara rimlig för Firebase.
* UX ska vara enkel och tydlig.
Arbetsprocess (mycket viktigt)
Du ska:
1. Först analysera kraven.
2. Vara kritisk mot potentiella fallgropar.
3. Föreslå arkitektur och datamodell.
4. Ställa frågor om något är oklart.
5. Inte skriva någon kod alls förrän jag bekräftat att designen är korrekt.
Regler
* Ändra inte befintlig kod utan att först motivera varför.
* Anta inte framework (React/Vue/etc) om jag inte har sagt det.
* Om något är otydligt: fråga istället för att gissa.
```

**Prompt 2**
- *Syfte:* Svara på viktiga frågor som Claude hade.
- *Förväntad output:* Efter denna prompt så ska Claude kunna arbeta och nå målet.
- *Faktisk output:* Claude arbetade utan problem och implementerade inloggning med google auth och firebase.
- *Vad fungerade, vad saknades?* Inloggningen fungerade som den skulle. Ingenting från vad vi specifierade i prompten gjordes fel eller saknades.
```
Svar på frågor:
1. 1. Räcker med att ladda om vid siduppdatering. 2. Listan ska alltid börja om från standardalternativen. 3. Räcker med en textlista med paginering. 4. Det ska inte finnas offline-funktionalitet.
2. Färger ska inte sparas.
3. Ja användaren ska kunna radera historik.
4. Jag har redan ett firebase projekt, du behöver endast ge mig instruktioner för hur kopplingen ska ske sedan.
5. Ta 20 sedan paginering.
6. Det räcker med disable-state.
```