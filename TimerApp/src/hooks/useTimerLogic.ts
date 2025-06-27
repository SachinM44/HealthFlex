import { useEffect, useRef } from 'react';
import { useTimerContext } from '../context/TimerContext';
import { Alert } from 'react-native';

export const useTimerLogic = () => {
  const { state, dispatch } = useTimerContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle timer updates
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Only set up interval if there are running timers
    const hasRunningTimers = state.timers.some(
      (timer) => timer.status === 'Running'
    );

    if (hasRunningTimers) {
      intervalRef.current = setInterval(() => {
        state.timers.forEach((timer) => {
          if (timer.status === 'Running') {
            // Check if timer should complete
            if (timer.remainingTime <= 1) {
              dispatch({ type: 'COMPLETE_TIMER', payload: timer.id });
              // Show completion alert
              Alert.alert(
                'Timer Completed!',
                `Congratulations! Your "${timer.name}" timer has completed.`,
                [{ text: 'OK' }]
              );
            } else {
              // Check for halfway alert
              const halfwayPoint = timer.duration / 2;
              if (
                timer.halfwayAlert &&
                !timer.halfwayAlertTriggered &&
                timer.remainingTime <= halfwayPoint
              ) {
                // Show halfway alert
                Alert.alert(
                  'Halfway Point!',
                  `You're halfway through your "${timer.name}" timer!`,
                  [{ text: 'OK' }]
                );
                
                // Update timer to mark alert as triggered
                dispatch({
                  type: 'UPDATE_TIMER',
                  payload: { ...timer, halfwayAlertTriggered: true },
                });
              } else {
                // Normal time update
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

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timers, dispatch]);

  return { state, dispatch };
};