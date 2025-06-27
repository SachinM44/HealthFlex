import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer, Category, TimerLog } from '../types';

type TimerState = {
  timers: Timer[];
  categories: Category[];
  logs: TimerLog[];
};

type TimerAction =
  | { type: 'ADD_TIMER'; payload: Timer }
  | { type: 'UPDATE_TIMER'; payload: Timer }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'RESET_TIMER'; payload: string }
  | { type: 'COMPLETE_TIMER'; payload: string }
  | { type: 'START_CATEGORY_TIMERS'; payload: string }
  | { type: 'PAUSE_CATEGORY_TIMERS'; payload: string }
  | { type: 'RESET_CATEGORY_TIMERS'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'TOGGLE_CATEGORY_EXPANDED'; payload: string }
  | { type: 'ADD_LOG'; payload: TimerLog }
  | { type: 'SET_STATE'; payload: TimerState };

const initialState: TimerState = {
  timers: [],
  categories: [],
  logs: [],
};

const TimerContext = createContext<{
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
}>({ state: initialState, dispatch: () => null });

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [...state.timers, action.payload],
      };

    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload.id ? action.payload : timer
        ),
      };

    case 'DELETE_TIMER':
      return {
        ...state,
        timers: state.timers.filter((timer) => timer.id !== action.payload),
      };

    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'Running' }
            : timer
        ),
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? { ...timer, status: 'Paused' }
            : timer
        ),
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                status: 'Paused',
                halfwayAlertTriggered: false,
              }
            : timer
        ),
      };

    case 'COMPLETE_TIMER':
      const completedTimer = state.timers.find(
        (timer) => timer.id === action.payload
      );
      const now = Date.now();

      if (completedTimer) {
        // Create a log entry
        const category = state.categories.find(
          (cat) => cat.id === completedTimer.categoryId
        );

        const newLog: TimerLog = {
          id: `log_${now}`,
          timerId: completedTimer.id,
          timerName: completedTimer.name,
          categoryId: completedTimer.categoryId,
          categoryName: category?.name || 'Unknown',
          completedAt: now,
          duration: completedTimer.duration,
        };

        return {
          ...state,
          timers: state.timers.map((timer) =>
            timer.id === action.payload
              ? {
                  ...timer,
                  status: 'Completed',
                  remainingTime: 0,
                  completedAt: now,
                }
              : timer
          ),
          logs: [...state.logs, newLog],
        };
      }
      return state;

    case 'START_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.categoryId === action.payload && timer.status !== 'Completed'
            ? { ...timer, status: 'Running' }
            : timer
        ),
      };

    case 'PAUSE_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.categoryId === action.payload && timer.status === 'Running'
            ? { ...timer, status: 'Paused' }
            : timer
        ),
      };

    case 'RESET_CATEGORY_TIMERS':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.categoryId === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                status: 'Paused',
                halfwayAlertTriggered: false,
              }
            : timer
        ),
      };

    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case 'TOGGLE_CATEGORY_EXPANDED':
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.id === action.payload
            ? { ...category, expanded: !category.expanded }
            : category
        ),
      };

    case 'ADD_LOG':
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };

    case 'SET_STATE':
      return action.payload;

    default:
      return state;
  }
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedState = await AsyncStorage.getItem('timerState');
        if (storedState) {
          dispatch({
            type: 'SET_STATE',
            payload: JSON.parse(storedState),
          });
        } else {
          const defaultCategories = [
            { id: 'category_work', name: 'Work', expanded: true },
            { id: 'category_personal', name: 'Personal', expanded: true },
            { id: 'category_fitness', name: 'Fitness', expanded: true },
          ];
          
          defaultCategories.forEach(category => {
            dispatch({ type: 'ADD_CATEGORY', payload: category });
          });
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };

    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('timerState', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };

    saveState();
  }, [state]);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => useContext(TimerContext);