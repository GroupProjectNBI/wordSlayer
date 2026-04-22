# Overview

WordSlayer is built as a modern, real-time mulitplayer word-combat game. The architecture is intentionally modular, test-driven and optimized for fast iteration, clear separation of concerns and predictable game state transitions.

The system consists of three major layers:

### 1. Frontend (React + Vite)
### 2. Backend (Minimal API + SignalR )
### 3. CI/CD pipelines (GitHub Actions)

Each layer is designed to be independently testable, scalable and maintainable.

---

## 1. Frontend Architecture

### 1.1 Technolgy Stack
- React 18 with functional components
- TypeScript for type-saftey
- Vite for fast development and optimized buil
- TailwindCSS for styling
- Playwright + BDD for and-to-end testing
- Custom hooks for game logic (e.g., useWebsocket, useSound)

### 1.2 Project structure
frontend/
  src/
    components/
      GameBoard/
      Timer/
      HPBar/
      WordInput/
      WordHistory/
      DamagePopup/
    hooks/
      useWebsocket.ts
      useSound.ts
    pages/
      PlayGame.tsx
      Home.tsx
    assets/
    styles/


### 1.3 Component Architecture
The UI is built using a container + presentational pattern:
- PlayGame.tsx
The main container responsible for: 
-- WebSocket communication
-- Timer logic
-- Game state transitions
-- Music control
-- Overlay logic
-- Passing state down to GameBoard

- GameBoard.tsx
Pure UI layout for: 
-- Player info
-- HP Bars
-- Timer
-- Word input
-- Damage popups

- Atomic components
Each UI elemnt (Timer, HPBar, Username, WordInput) is isolatedfor: 
-- Reusability
-- TEstability
-- Visual consistency

### 1.4 State Management 
The frontend uses React local state instead of global state libraries.
This is intentional because:
- Game state is session-scoped
- Real-time updates come from SignalR
- Predictability is more important than global caching

Key state includes:
- player1, player 2
- turn
- timer
- timerRunning
- history
- popups
- musicMuted

### 1.5 Real-Time Communication
The frontend communicates with the backend using:
- SignalR WebSockets for turn changes
- REST API for :
-- submitting words
-- fetching initial game state
-- timeout events

The custom hook useWebsocket abstratcs all SignalR logic.

### 1.6 Testing Architecture
Playwright is used with BDD (Gherkin):
- Human-readable scenarios
- Step definitions in JavaSript 
- Mocked timers
- Mocked API responses
- Simulated SignalR events
This ensures:
- deterministic tests
- no flakiness
- full UI coverage

---

## 2. Backend Architecture

### 2.1 Technology Stack
- ASP.NET 
- SignalR for real-time communication
- REST API for synchronous operations
- C# for game logic
- In-memory session storage (future: Redis)

### 2.2 Responsibilities
The backend handles:
- Player connections
- Turn switching
- Word validation
- Damage calculation
- Timer enforcement
- Broadcasting game state updates

### 2.3 Game Session Model
A session contains:
- Session ID
- Player list
- Current turn
- HP values
- Language/dictionary setting

### 2.4 SignalR Hub
The hub is responsible for:
- notifying players when turns change
- broadcasting HP updates
- handling disconnetcs
- syncing game state

### 2.5 REST Endpoint
Example:
GET /api/game/{sessionId}
POST /api/game/{sessionId}/playword
POST /api/game/{sessionId}/timeout


REST is used for deterministic actions, while SignalR is used for real-time updates. 

---

## 3. CI/CD Architecture

### 3.1 GitHub Actions Workflows
Located in:
.github/workflows/


The pipelines include:
- Build & Tst
-- Install dependencies
-- Run TypeScript checks
-- Run Playwright tests
-- Build frontend
-- Build backend

- Deployment 
-- Docker build
-- Push to registry
-- Deploy to Render

### 3.2 Pipeline Goals
- Ensure code quality
- Prevent regressions
- Automate testing
- Prepare for continuous deployment

---

## 4. Game Logic Architecture

### 4.1 Turn System
The turn system is deterministic:
1. Player submits a word
2. Backend validates
3. Damage is calculated
4. HP is updated
5. Turn switches
6. SignalR notifies client

### 4.2 Timer System
The timer is:

- controlled by the frontend
- reset on every turn
- enforced by backend timeout endpoint
- visually represented by TimerRing + TimerBar

### 4.3 Damage System 
Damage = word lenght
This is intentionally simple for MVP, but future updates may include:
- multiplies
- popwer-ups
- critical hits

--- 

## 5. Audio Architecture
### 5.1 useSound Hook 
Handles: 
- music playback
- looping
- volume
- autoplay restrictions
- test-mode suppression

### 5.2 Music Logic
Music starts when:
- both players are connected
- user has not muted sound

Music stops when:
- game ends
- user mutes
- component unmounts

---

## 6. Future Achitectural Improvments
(Also documented in FUTURE_UPDATES.md)
- Horizontal scaling for SignalR
- Modular game engine
- Plugin system for custom rules

---

## Conclusion
WordSlayer's architecture is designed for clarity, maintainability and real-time performance.
The separation between UI, game logic, networking and audio ensures that each part of the ystem can evolve independently while maintaining a cohesive gameplay experince. 
