import { useEffect, useReducer } from "react";

// -----------------------------
// TIMER STATE (enum‑ersättning)
// -----------------------------
export const TimerState = {
  Idle: "Idle",
  Running: "Running",
  Finished: "Finished",
} as const;

export type TimerState = typeof TimerState[keyof typeof TimerState];

// -----------------------------
// STATE + ACTION TYPES
// -----------------------------
interface State {
  value: number;
  state: TimerState;
}

type Action =
  | { type: "TURN_START"; }
  | { type: "TICK"; }
  | { type: "RESET"; };

// -----------------------------
// REDUCER
// -----------------------------
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TURN_START":
      return { state: TimerState.Running, value: 30 };

    case "TICK":
      if (state.value <= 1) {
        return { state: TimerState.Finished, value: 0 };
      }
      return { ...state, value: state.value - 1 };

    case "RESET":
      return { state: TimerState.Idle, value: 30 };

    default:
      return state;
  }
}

// -----------------------------
// HOOK: useTurnManager
// -----------------------------
export function useTurnManager(isTest: boolean, onTimeout: () => void) {
  const [timer, dispatch] = useReducer(reducer, {
    value: 30,
    state: TimerState.Idle,
  });

  // LIVE MODE ticking
  useEffect(() => {
    if (isTest) return;
    if (timer.state !== TimerState.Running) return;

    const id = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(id);
  }, [timer.state, isTest]);

  // TIMEOUT HANDLING
  useEffect(() => {
    if (timer.state === TimerState.Finished) {
      onTimeout();
      dispatch({ type: "RESET" });
    }
  }, [timer.state, onTimeout]);

  return { timer, dispatch };
}
