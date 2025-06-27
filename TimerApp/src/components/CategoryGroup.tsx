import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Category, Timer } from '../types';
import TimerItem from './TimerItem';
import { useTimerContext } from '../context/TimerContext';

type CategoryGroupProps = {
  category: Category;
  timers: Timer[];
};

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, timers }) => {
  const { dispatch } = useTimerContext();

  const handleToggleExpanded = () => {
    dispatch({ type: 'TOGGLE_CATEGORY_EXPANDED', payload: category.id });
  };

  const handleStartAll = () => {
    dispatch({ type: 'START_CATEGORY_TIMERS', payload: category.id });
  };

  const handlePauseAll = () => {
    dispatch({ type: 'PAUSE_CATEGORY_TIMERS', payload: category.id });
  };

  const handleResetAll = () => {
    dispatch({ type: 'RESET_CATEGORY_TIMERS', payload: category.id });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={handleToggleExpanded}
      >
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.expandIcon}>
          {category.expanded ? '▼' : '►'}
        </Text>
      </TouchableOpacity>

      {category.expanded && (
        <>
          <View style={styles.bulkActions}>
            <TouchableOpacity
              style={[styles.bulkButton, styles.startButton]}
              onPress={handleStartAll}
            >
              <Text style={styles.buttonText}>Start All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkButton, styles.pauseButton]}
              onPress={handlePauseAll}
            >
              <Text style={styles.buttonText}>Pause All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkButton, styles.resetButton]}
              onPress={handleResetAll}
            >
              <Text style={styles.buttonText}>Reset All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timersList}>
            {timers.map((timer) => (
              <TimerItem key={timer.id} timer={timer} />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expandIcon: {
    fontSize: 16,
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  bulkButton: {
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
  timersList: {
    padding: 12,
  },
});

export default CategoryGroup;