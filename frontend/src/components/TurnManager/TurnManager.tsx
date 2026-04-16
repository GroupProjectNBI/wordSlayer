import { useEffect, useReducer } from "react";

export enum TimerState {
  Idle,
  Running,
  Finished
}

interface State {
  value: number;
  state: TimerState;
}

function reducer(state: State, action: any): State {
  switch (action.type) {
    case "TURN_START":
      return { state: TimerState.Running, value: 30 };

    case "TICK":
      if (state.value <= 1)
        return { state: TimerState.Finished, value: 0 };
      return { ...state, value: state.value - 1 };

    case "RESET":
      return { state: TimerState.Idle, value: 30 };

    default:
      return state;
  }
}

export function useTurnManager(isTest: boolean, onTimeout: () => void) {
  const [timer, dispatch] = useReducer(reducer, {
    value: 30,
    state: TimerState.Idle
  });

  // LIVE MODE ticking
  useEffect(() => {
    if (isTest) return;
    if (timer.state !== TimerState.Running) return;

    const id = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(id);
  }, [timer.state, isTest]);

  // TIMEOUT
  useEffect(() => {
    if (timer.state === TimerState.Finished) {
      onTimeout();
      dispatch({ type: "RESET" });
    }
  }, [timer.state]);

  return { timer, dispatch };
}
