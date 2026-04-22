# ⚔️ Word Slayer

**Group E/5:**
- [Jarl (@webcrunch)](https://github.com/webcrunch)
- [Edvin (@Grevendev)](https://github.com/Grevendev)
- [Kifle (@KHS1993)](https://github.com/KHS1993)
- [Cecilia (@ceccav)](https://github.com/ceccav)
- [Zhaneta (@Zhaneta-Lecini)](https://github.com/Zhaneta-Lecini)

Word Slayer is a two-player turn-based word game built as a group project. The project demonstrates real-time communication, automated testing, and CI/CD workflows.

---

## 🚀 Demo & Deployment

A deployed version of the application is available here:

**Live application:** https://wordslayer-akha.onrender.com/

The repository also includes GitHub Actions workflows for testing and deployment.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** ASP.NET Core Minimal API, SignalR
- **Testing:** Playwright, xUnit, Postman/Newman
- **CI/CD:** GitHub Actions
- **Deployment:** The project is configured for deployment on Render
- **State / Validation:** Game sessions and word validation are handled in the backend

---

## 🎮 What the game is

Word Slayer is a multiplayer word game where two players compete by entering valid words in turns.

### How it works

- Player 1 creates a new game
- A game code / session ID is generated
- Player 2 joins using that code
- Players take turns entering valid words
- A valid word deals damage based on its length
- The game ends when one player's HP reaches 0
- A winner overlay is shown at the end of the game

The frontend supports both **English** and **Swedish**.

---


## 📂 Project Structure

```text
wordSlayer/
├── backend/
├── frontend/
├── tests/
│   ├── playwright/
│   ├── postman/
│   └── wordslayer.Tests/
├── .github/workflows/
├── Dockerfile
└── wordSlayer.sln

``` 
## ▶️ How to clone the project
```bash
git clone https://github.com/GroupProjectNBI/wordSlayer.git
cd wordSlayer
```


## ▶️ How to run locally

Start backend

```bash
cd backend
dotnet run
```
backend runs on:
http://localhost:5002


```bash
Start frontend
Open a second terminal:
cd frontend
npm install
npm run dev
```


Frontend runs on:
http://localhost:3000


## 🕹️ How to play the game
1. Open the application
2. Click New Game
3. Copy the generated game code
4. Open another browser/tab/session
5. Go to Join Game
6. Enter the game code
7. Start playing by entering valid words

## 🔌 Main API endpoints
- GET /health
- GET /api/newGame
- POST /api/game/{sessionId}/join
- GET /api/game/{sessionId}
- PUT /api/game/{sessionId}/language
- POST /api/game/{sessionId}/playword
- POST /api/game/{sessionId}/surrender
- POST /api/game/{sessionId}/timeout
- SignalR hub: /gamehub

## 🧪 Testing
We use several types of tests to verify the system:
1. Unit Tests
Located in:
tests/wordslayer.Tests/

Run with:

```bash
dotnet test tests/wordslayer.Tests
```

These tests cover core backend and game logic.


### 2. API Tests

Located in:

'tests/postman/'

Run with:

``` bash
cd tests/postman
npm install
npm run test:api:ci
```

These tests use Postman/Newman

3. UI / End-to-End Tests

Located in:
tests/playwright/

Run with: 
 ``` bash
cd tests/playwright
npm install
npm run test
```

## 🔄 CI/CD

The repository contains GitHub Actions workflows for testing and deployment.

Test workflow

The test workflow includes:

- backend build
- frontend build
- Docker build validation
- unit tests
- API tests
- UI tests
- Deployment workflow

The repository also contains a deployment workflow configured for Render.

## 🐳 Docker

The project includes a root-level Dockerfile.

Docker build is validated in CI.


## 📝 Notes
- The frontend stores language selection in localStorage
- The backend serves the built frontend from backend/wwwroot
- The project includes support for both English and Swedish
- The repository includes code, tests, and workflow configuration for the assignment

## 📌 Submission

This repository contains:

- source code
- automated tests
- CI/CD workflow configuration

