# ⚔️ Word Slayer
**Group E/5:**
* [Jarl (@webcrunch)](https://github.com/webcrunch)
* [Edvin (@Grevendev)](https://github.com/Grevendev)
* [Kifle (@KHS1993)](https://github.com/KHS1993)
* [Cecilia (@ceccav)](https://github.com/ceccav)
* [Zhaneta (@Zhaneta-Lecini)](https://github.com/Zhaneta-Lecini)

Word Slayer är ett realtidsbaserat ordspel där två spelare möts i en språklig duell. Projektet är byggt som en del av ett grupparbete och demonstrerar en komplett CI/CD-pipeline, realtidskommunikation och automatiserad testning.

---

## 🚀 Demo & Deployment

Applikationen är deployad via Render med hjälp av Docker.

Frontend: [Länk-------------------------------]

Backend: [Länk--------------------------------]

---

## 🛠️ Teknikstack & Arkitektur

* **Frontend:** React (TypeScript) & Tailwind CSS.

* **Backend:** .NET Core API & SignalR för realtidssynkronisering.

* **Containerisering:** Docker (Dockerfiles för både frontend och backend).

* **Deployment:** Render (automatisk pipeline via GitHub).

* **CI/CD:** Automatiserad deployment till Render via GitHub Actions vid varje lyckad merge till main.

Datalagring: In-memory ordlistor för snabb validering (ingen extern databas behövs).

---

## 🎮 Så fungerar spelet

Matchmaking: Spelare loggar in och väntar på en motståndare.

Duell: Spelarna turas om att skriva ord på det valda språket (Svenska/Engelska).

Skada: Validerade ord ger skada baserat på längd.

Game Over: När en spelares HP når 0 visas en overlay med vinst- eller förlustmeddelande ("YOU LOSE" eller vinst-pokal).

---

## 🧪 Testning (CI/CD)
Vi har implementerat en rigorös testprocess för att säkerställa hög kvalitet:

1. Frontend E2E (Playwright & BDD)
Vi använder Cucumber/Gherkin för att skriva mänskligt läsbara tester.

Fokus: UI-flöden, overlay-meddelanden och visuell feedback.

Kommando: cd tests/playwright && npm run test

2. Backend Unit Tests (xUnit)
Fokus: Spelsessionens logik, HP-uträkning och ordvalidering.

3. API Testing (Postman): Vi har inkluderat en Postman-collection för att manuellt testa API-endpoints.

Kommando: dotnet test

---

## 🐳 Docker
Projektet är helt containeriserat. För att köra lokalt med Docker:

Bash
docker-compose up --build
🛠 Deployment-flöde (Render)
Varje "push" till main-branchen triggar en automatisk build:

Docker-images byggs för frontend och backend.

Testerna verifieras.

Render uppdaterar instanserna med de senaste images.