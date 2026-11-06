"use client";

import { useSyncExternalStore } from "react";

export interface Store<TState extends object> {
  getState: () => TState;
  getInitialState: () => TState;
  setState: (
    updater: Partial<TState> | ((state: TState) => Partial<TState>),
  ) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<TState extends object>(
  initialState: TState,
): Store<TState> {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    getInitialState: () => initialState,
    setState: (updater) => {
      const patch =
        typeof updater === "function" ? updater(state) : updater;
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useStore<TState extends object, TSlice>(
  store: Store<TState>,
  selector: (state: TState) => TSlice,
): TSlice {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getInitialState()),
  );
}
