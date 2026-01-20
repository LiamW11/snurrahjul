# Utvecklingsprocess – AI-stödd applikation

```mermaid
flowchart TD
    A[Idé] --> B[Formulera en projektbeskrivning];

    B --> C[Prompta ChatGPT för att förtydliga våra idéer];
    C --> D[Prompta Claude för att skapa vår applikation];

    D --> E[Implementera Claude-kod i VS code];
    E --> F[Testa applikation för att se vilka buggar som uppstår];
    F --> G[Sammanställa alla fel vi hittade med applikationen]

    G --> H[Prompta om Claude med nya insikter efter våra tester];
    H --> I[Implementera ny kod från Claude];
    I --> J[Testa applikation igen och leta efter buggar];
    J --> K[Sammanställa alla fel vi hittade med applikationen]

    K --> L[Fixa koden själv];
    L --> M[Slutför applikation];
```