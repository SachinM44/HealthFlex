import { useEffect, useRef } from 'react';
import { useTimerContext } from '../context/TimerContext';
import { Alert } from 'react-native';

export const useTimerLogic = () => {
  const { state, dispatch } = useTimerContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const hasRunningTimers = state.timers.some(
      (timer) => timer.status === 'Running'
    );

    if (hasRunningTimers) {
      intervalRef.current = setInterval(() => {
        state.timers.forEach((timer) => {
          if (timer.status === 'Running') {
            if (timer.remainingTime <= 1) {
              dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
              Alert.alert(
                'Timer Completed!',
                `Congratulations! Your "${timer.name}" timer has completed.`,
                [{ text: 'OK' }]
              );
            } else {
              const halfwayPoint = timer.duration / 2;
              if (
                timer.halfwayAlert &&
                !timer.halfwayAlertTriggered &&
                timer.remainingTime <= halfwayPoint
              ) {
                Alert.alert(
                  'Halfway Point!',
                  `You're halfway through your "${timer.name}" timer!`,
                  [{ text: 'OK' }]
                );
                
                dispatch({
                  type: 'UPDATE_TIMER',
                  payload: { ...timer, halfwayAlertTriggered: true },
                });
              } else {
                dispatch({
                  type: 'UPDATE_TIMER',
                  payload: { ...timer, remainingTime: timer.remainingTime - 1 },
                });
              }
            }
          }
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timers, dispatch]);

  return { state, dispatch };
};