## Dokumentation över alla använda prompts och till vilken AI

### ChatGPT
ChatGPT användes för att skriva tydligare prompts till Claude.
- https://chatgpt.com/share/696f4682-c8bc-800a-a619-9ca424115de9

**Prompt 1**
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

**Prompt 2:** Följdfrågor den ställde eftersom första prompten inte täckte allting.
```
Svar på följdfrågor:
1. Det ska vara en webbapplikation
2. Implementera lösningen i en index.html och script.js. Utseende ska endast göras med tailwind css
```

### Claude
Claude användes för att skapa applikationen.
- https://claude.ai/share/5ada5390-afe3-46bf-b378-16882445e40c

**Prompt 1**
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

**Prompt 2** Denna prompt är korrigerande eftersom att första resultatet inte var felfritt
```
Pilen som pekar på vad resultatet är har hamnat fel. Den ska vara på höger sida men har hamnat högst upp.
Spaken fungerar ej som den ska. Den dras åt höger istället för nedåt när man trycker på den.
Lägg till knappen har hamnat utanför sin ruta.
Istället för att man skriver in hexkoden för färgen borde det finnas ett färghjul man kan välja färg från (det finns en sådan typ av input i html är jag ganska säker på)
```