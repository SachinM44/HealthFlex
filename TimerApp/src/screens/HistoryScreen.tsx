import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView, 
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen: React.FC = () => {
  const { state } = useTimerContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const categories = [
    ...new Set(state.logs.map((log) => log.categoryName)),
  ].sort();

  const filteredLogs = selectedCategory
    ? state.logs.filter((log) => log.categoryName === selectedCategory)
    : state.logs;

  const sortedLogs = [...filteredLogs].sort(
    (a, b) => b.completedAt - a.completedAt
  );

  const exportData = async () => {
    try {
      const jsonData = JSON.stringify(state.logs, null, 2);
      const fileUri = `${FileSystem.documentDirectory}timer_history.json`;
      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          'Sharing not available',
          'Sharing is not available on this device'
        );
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Failed to export timer history');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer History</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportData}>
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === null && styles.selectedFilterChip,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === null && styles.selectedFilterChipText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.selectedFilterChip,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.selectedFilterChipText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {sortedLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No timer history yet</Text>
        </View>
      ) : (
        <FlatList
          data={sortedLogs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <View style={styles.logHeader}>
                <Text style={styles.logName}>{item.timerName}</Text>
                <Text style={styles.logCategory}>{item.categoryName}</Text>
              </View>
              <View style={styles.logDetails}>
                <Text style={styles.logTime}>
                  Duration: {formatTime(item.duration)}
                </Text>
                <Text style={styles.logDate}>
                  Completed: {formatDate(item.completedAt)}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exportButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFilterChip: {
    backgroundColor: '#2196f3',
    borderColor: '#2196f3',
  },
  filterChipText: {
    fontSize: 14,
  },
  selectedFilterChipText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logCategory: {
    fontSize: 14,
    color: '#2196f3',
    fontWeight: '500',
  },
  logDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logTime: {
    fontSize: 14,
    color: '#757575',
  },
  logDate: {
    fontSize: 14,
    color: '#757575',
  },
});

export default HistoryScreen;