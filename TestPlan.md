# Testplan

## 1. Purpose
The purpose of this test plan is to define the testing strategy, scope, methodology, and quality goals for WordSlayer.
The document ensures that all critical gameplay mechanics, UI flows, backend interactions, and real‑time features are validated through automated and manual testing.

---

## 2. Testing Scope
### 2.1 In Scope 
- Frontend UI and gameplay logic 
- Real-time communication via SignalR
- REST API intercations
- Timer behavior and turn switching
- Word submission flow
- HP updates and damage calucaltions
- Overlays and game-end conditions
- Audio toggle (mute/unmute)
- Multi-language dicitionary flags
- Error handling and loading states

### 2.2 Out of Scope 
- Backend dicitonary correctness (handled by external sources)
- Performamnce testing (future)
- Load testing for concurrent sessions (furure)
- Mobile-specific behavior (furure)

---

## Test Levels
### 3.1 Unit Test (Backend & Frontend)
Backend (xUnit)
- Word validation logic
- Damage calucaltion
- Turn switching
- Timeout logic
- Session initialization

Fronted (React Testing Libary - future):
- Component rendering 
- Timer logic
- HPBar behavior
- WordInput behavior

### 3.2 Integration Tests
- REST API endpoints, POSTMAN/ NEWMAN
- SignalR hub communication
- Combined game-state transitions


### 3.3 End-to-End Tests (PlayWright + BDD)
This is teh pripary test layer for the frontend.
Covers: 
- Full gameplay flow
- Word submission
- Timer countdown
- Turn switiching
- HP updates
- Overlays
- Damage popups 
- Dicitonary flags
- Audio mute/unmute
- Error states
- Loading states

--- 

## 4. Test Stratgy
### 4.1 BDD (Behavior-Driven Development)
All E2E tests use:
- Gherkin feature files
- Readable scenarios
- Reusable step definitons
This ensures: 
- High clarity
- Business-aligned test cases 
- Easy onboarding for new contributors

### 4.2 Mocking Strategy
To ensure deterministic tests:
- Timer is mocked
-- No real time passes
-- Manual tick events simulate countdown
- API responses are intercepted
-- /api/game/{id}
-- /api/game/{id}/playword
-- /api/game/{id}/timeout

- SignalR is simulated
-- Custom DOM events trigger turn changes

- Audio is suppressed in test mode
-- No sound playback
-- Mute button still toggles UI state

### 4.3 Test Mode
The application supportsa dedicated test mode via: 
?test

This mode:
- Disables real audio
- Disables real timers
- Allows deterministic state transitions
- Enables test‑only UI helpers

--- 

## 5. Test Enviroments
### 5.1 Local Development
- Run Playwright tests locally
- Hot‑reload frontend
- Mock backend via intercepts

### 5.2 CI Environment (GitHub Actions)
The CI pipeline:
- Installs dependencies
- Builds frontend
- Builds backend
- Runs Playwright tests headless
- Produces HTML reports
- Uploads videos and screenshots on failure

--- 

## 6. Test Data
### 6.1 Static Test Session
A fixed GUID is used for all tests:
00000000-0000-0000-0000-000000000000


### 6.2 Player Names
- Player 1
- Player 2

### 6.3 Word Samples
- “dragon”
- “testword”
- “abc”

### 6.4 HP Values
- Start: 100
- Damage: word lenght

--- 
## 7. Test Cases Overview 
### 7.1 Core Gameplay
- Word submission updates HP
- Damage popup appears
- Turn switches correctly
- Timer resets on turn change
- Timeout triggers turn switch

### 7.2 UI Behavior
- Player names visible
- HP bars update
- Overlay appears/disappears
- Word history updates
- Dictionary flag matches language
 
### 7.3 Audio 
- Mute button visible
- Mute toggles UI state
- Music does not play in test mode

### 7.4 Error Handling
- Invalid word shows error
- Server unreachable shows error
- Loading screen appears before game state loads

---

## 8. Risk & Mitigations
### 8.1 Real‑Time Flakiness
Risk: SignalR timing issues
Mitigation: Simulated events in test mode

### 8.2 Timer Instability
Risk: Real timers cause flaky tests
Mitigation: Timer mocking

### 8.3 UI Animation Delays
Risk: Animations cause timing issues
Mitigation: Use deterministic selectors and waits

---

## 9. Future Improvements
- Snapshot testing for UI components
- Load testing for SignalR
- Performance profiling
- Visual regression testing
- Backend integration test suite

---

## 10. Approval
This test plan is considered a living document and will evolve as the project grows.
All contributors are encouraged to update it when new features or testing strategies are introduced.
