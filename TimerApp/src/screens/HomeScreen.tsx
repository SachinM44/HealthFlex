import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
} from 'react-native';
import { useTimerContext } from '../context/TimerContext';
import CategoryGroup from '../components/CategoryGroup';
import { useTimerLogic } from '../hooks/useTimerLogic';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen: React.FC = () => {
  const { state, dispatch } = useTimerLogic();
  const [modalVisible, setModalVisible] = useState(false);
  const [timerName, setTimerName] = useState('');
  const [timerDuration, setTimerDuration] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleAddTimer = () => {
    if (!timerName || !timerDuration || !selectedCategoryId) return;

    const duration = parseInt(timerDuration, 10);
    if (isNaN(duration) || duration <= 0) return;

    const newTimer = {
      id: `timer_${Date.now()}`,
      name: timerName,
      duration,
      remainingTime: duration,
      status: 'Paused' as const,
      categoryId: selectedCategoryId,
      createdAt: Date.now(),
      halfwayAlert,
      halfwayAlertTriggered: false,
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });
    resetForm();
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;

    const newCategory = {
      id: `category_${Date.now()}`,
      name: newCategoryName,
      expanded: true,
    };

    dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    setNewCategoryName('');
    setSelectedCategoryId(newCategory.id);
    setShowCategoryInput(false);
  };

  const resetForm = () => {
    setTimerName('');
    setTimerDuration('');
    setHalfwayAlert(false);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer App</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add Timer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {state.categories.length === 0 ? (
          <Text style={styles.emptyText}>
            No categories yet. Add a timer to create categories.
          </Text>
        ) : (
          state.categories.map((category) => {
            const categoryTimers = state.timers.filter(
              (timer) => timer.categoryId === category.id
            );
            return (
              <CategoryGroup
                key={category.id}
                category={category}
                timers={categoryTimers}
              />
            );
          })
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Timer</Text>

            <Text style={styles.inputLabel}>Timer Name</Text>
            <TextInput
              style={styles.input}
              value={timerName}
              onChangeText={setTimerName}
              placeholder="Enter timer name"
            />

            <Text style={styles.inputLabel}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              value={timerDuration}
              onChangeText={setTimerDuration}
              placeholder="Enter duration in seconds"
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Category</Text>
            {state.categories.length > 0 && !showCategoryInput ? (
              <View style={styles.categorySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {state.categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryChip,
                        selectedCategoryId === category.id &&
                          styles.selectedCategoryChip,
                      ]}
                      onPress={() => setSelectedCategoryId(category.id)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selectedCategoryId === category.id &&
                            styles.selectedCategoryChipText,
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.newCategoryButton}
                  onPress={() => setShowCategoryInput(true)}
                >
                  <Text style={styles.newCategoryButtonText}>+ New</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.newCategoryInput}>
                <TextInput
                  style={styles.input}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Enter new category name"
                />
                <View style={styles.categoryActions}>
                  <TouchableOpacity
                    style={styles.categoryActionButton}
                    onPress={() => setShowCategoryInput(false)}
                  >
                    <Text style={styles.categoryActionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.categoryActionButton,
                      styles.addCategoryButton,
                    ]}
                    onPress={handleAddCategory}
                  >
                    <Text style={styles.addCategoryButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Halfway Alert</Text>
              <Switch
                value={halfwayAlert}
                onValueChange={setHalfwayAlert}
                trackColor={{ false: '#e0e0e0', true: '#4caf50' }}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddTimer}
              >
                <Text style={styles.saveButtonText}>Save Timer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#757575',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryChip: {
    backgroundColor: '#4caf50',
    borderColor: '#4caf50',
  },
  categoryChipText: {
    fontSize: 14,
  },
  selectedCategoryChipText: {
    color: 'white',
    fontWeight: '500',
  },
  newCategoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  newCategoryButtonText: {
    color: '#4caf50',
    fontWeight: '500',
  },
  newCategoryInput: {
    marginBottom: 16,
  },
  categoryActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  categoryActionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  addCategoryButton: {
    backgroundColor: '#4caf50',
    borderRadius: 4,
  },
  categoryActionButtonText: {
    color: '#757575',
  },
  addCategoryButtonText: {
    color: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#757575',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default HomeScreen;