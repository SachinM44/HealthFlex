import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Timer } from '../types';
import { useTimerContext } from '../context/TimerContext';

type TimerItemProps = {
  timer: Timer;
};

const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { dispatch } = useTimerContext();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progress = (timer.remainingTime / timer.duration) * 100;

  const handleStart = () => {
    dispatch({ type: 'START_TIMER', payload: timer.id });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER', payload: timer.id });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER', payload: timer.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerInfo}>
        <Text style={styles.timerName}>{timer.name}</Text>
        <Text style={styles.timerTime}>{formatTime(timer.remainingTime)}</Text>
        <Text
          style={[
            styles.timerStatus,
            timer.status === 'Running'
              ? styles.statusRunning
              : timer.status === 'Completed'
              ? styles.statusCompleted
              : styles.statusPaused,
          ]}
        >
          {timer.status}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>

      <View style={styles.controls}>
        {timer.status !== 'Completed' && (
          <>
            {timer.status === 'Paused' ? (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStart}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.pauseButton]}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  timerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  timerTime: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 8,
  },
  timerStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  statusRunning: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  statusPaused: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  statusCompleted: {
    backgroundColor: '#2196f3',
    color: 'white',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: '#4caf50',
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  resetButton: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default TimerItem;