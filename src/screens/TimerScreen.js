import { useEffect, useRef, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TimerScreen() {
  const [timers, setTimers] = useState([
    { id: 1, name: '1 minuto', duration: 60 },
    { id: 2, name: '3 minutos', duration: 180 },
    { id: 3, name: '5 minutos', duration: 300 },
    { id: 4, name: '10 minutos', duration: 600 },
    { id: 5, name: '15 minutos', duration: 900 },
  ]);
  const [activeTimer, setActiveTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTimer, setEditingTimer] = useState(null);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [customName, setCustomName] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            pauseTimer();
            alert('¡Tiempo terminado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, remainingTime]);

  const startTimer = (timer) => {
    setActiveTimer(timer);
    setRemainingTime(timer.duration);
    setIsRunning(true);
    setModalVisible(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeTimer = () => {
    if (remainingTime > 0) {
      setIsRunning(true);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setActiveTimer(null);
    setRemainingTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const addCustomTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0) {
      const newTimer = {
        id: Date.now(),
        name: customName || `${minutes}m ${seconds}s`,
        duration: totalSeconds,
      };
      setTimers([...timers, newTimer]);
      setCustomMinutes('');
      setCustomSeconds('');
      setCustomName('');
      setModalVisible(false);
    }
  };

  const editTimer = (timer) => {
    const minutes = Math.floor(timer.duration / 60);
    const seconds = timer.duration % 60;
    setEditingTimer(timer);
    setCustomMinutes(minutes.toString());
    setCustomSeconds(seconds.toString());
    setCustomName(timer.name);
    setEditModalVisible(true);
  };

  const updateTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds > 0 && editingTimer) {
      setTimers(timers.map(timer =>
        timer.id === editingTimer.id
          ? { ...timer, name: customName || `${minutes}m ${seconds}s`, duration: totalSeconds }
          : timer
      ));
      setCustomMinutes('');
      setCustomSeconds('');
      setCustomName('');
      setEditingTimer(null);
      setEditModalVisible(false);
    }
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter(timer => timer.id !== id));
    if (activeTimer && activeTimer.id === id) {
      resetTimer();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0 && secs > 0) {
      return `${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <View style={styles.container}>
      {activeTimer ? (
        <View style={styles.activeTimerContainer}>
          <Text style={styles.activeTimerName}>{activeTimer.name}</Text>
          <Text style={styles.activeTimerTime}>{formatTime(remainingTime)}</Text>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${(remainingTime / activeTimer.duration) * 100}%` }
              ]} 
            />
          </View>

          <View style={styles.activeTimerButtons}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.timerButton, styles.startButton]}
                onPress={resumeTimer}
              >
                <Text style={styles.buttonText}>▶️ Iniciar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.timerButton, styles.pauseButton]}
                onPress={pauseTimer}
              >
                <Text style={styles.buttonText}>⏸️ Pausar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.timerButton, styles.resetButton]}
              onPress={resetTimer}
            >
              <Text style={styles.buttonText}>🔄 Regresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Temporizadores Definidos</Text>
            <TouchableOpacity
              style={styles.addTimerButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addTimerButtonText}>➕ Nuevo</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.timersList}>
            {timers.map((timer) => (
              <View key={timer.id} style={styles.timerItem}>
                <View style={styles.timerInfo}>
                  <Text style={styles.timerName}>{timer.name}</Text>
                  <Text style={styles.timerDuration}>
                    ⏱️ {formatDuration(timer.duration)}
                  </Text>
                </View>
                <View style={styles.timerActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startTimer(timer)}
                  >
                    <Text style={styles.actionButtonText}>▶️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => editTimer(timer)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteTimer(timer.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nuevo Temporizador</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre (opcional)"
              placeholderTextColor="#999"
              value={customName}
              onChangeText={setCustomName}
            />

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Minutos</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  maxLength={3}
                />
              </View>

              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Segundos</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setCustomMinutes('');
                  setCustomSeconds('');
                  setCustomName('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addCustomTimer}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Temporizador</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre (opcional)"
              placeholderTextColor="#999"
              value={customName}
              onChangeText={setCustomName}
            />

            <View style={styles.timeInputContainer}>
              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Minutos</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  maxLength={3}
                />
              </View>

              <View style={styles.timeInputGroup}>
                <Text style={styles.timeInputLabel}>Segundos</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={customSeconds}
                  onChangeText={setCustomSeconds}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingTimer(null);
                  setCustomMinutes('');
                  setCustomSeconds('');
                  setCustomName('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={updateTimer}
              >
                <Text style={styles.buttonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  activeTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  activeTimerName: {
    fontSize: 24,
    color: '#aaaaaa',
    marginBottom: 20,
  },
  activeTimerTime: {
    fontSize: 72,
    color: '#ffffff',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginVertical: 30,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  activeTimerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timerButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addTimerButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addTimerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timersList: {
    flex: 1,
    padding: 15,
  },
  timerItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerInfo: {
    flex: 1,
  },
  timerName: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  timerDuration: {
    fontSize: 14,
    color: '#aaaaaa',
    marginTop: 5,
  },
  timerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  timeInputGroup: {
    alignItems: 'center',
  },
  timeInputLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 24,
    width: 100,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});