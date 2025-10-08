import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function AlarmScreen() {
  const [alarms, setAlarms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);
  const [alarmTime, setAlarmTime] = useState({ hours: '07', minutes: '00' });
  const [alarmLabel, setAlarmLabel] = useState('');
  const [selectedMusic, setSelectedMusic] = useState('Tono 1');
  const [musicModalVisible, setMusicModalVisible] = useState(false);

  const musicOptions = [
    'Tono 1 - Clásico',
    'Tono 2 - Suave',
    'Tono 3 - Energético',
    'Tono 4 - Natural',
    'Tono 5 - Digital',
  ];

  const addOrUpdateAlarm = () => {
    const newAlarm = {
      id: editingAlarm ? editingAlarm.id : Date.now(),
      time: `${alarmTime.hours}:${alarmTime.minutes}`,
      label: alarmLabel || 'Alarma',
      music: selectedMusic,
      enabled: true,
    };

    if (editingAlarm) {
      setAlarms(alarms.map(alarm => 
        alarm.id === editingAlarm.id ? newAlarm : alarm
      ));
    } else {
      setAlarms([...alarms, newAlarm]);
    }

    resetForm();
  };

  const resetForm = () => {
    setModalVisible(false);
    setEditingAlarm(null);
    setAlarmTime({ hours: '07', minutes: '00' });
    setAlarmLabel('');
    setSelectedMusic('Tono 1');
  };

  const editAlarm = (alarm) => {
    const [hours, minutes] = alarm.time.split(':');
    setAlarmTime({ hours, minutes });
    setAlarmLabel(alarm.label);
    setSelectedMusic(alarm.music);
    setEditingAlarm(alarm);
    setModalVisible(true);
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(alarms.map(alarm =>
      alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
    ));
  };

  const incrementHours = () => {
    const hours = parseInt(alarmTime.hours);
    setAlarmTime({
      ...alarmTime,
      hours: ((hours + 1) % 24).toString().padStart(2, '0'),
    });
  };

  const decrementHours = () => {
    const hours = parseInt(alarmTime.hours);
    setAlarmTime({
      ...alarmTime,
      hours: ((hours - 1 + 24) % 24).toString().padStart(2, '0'),
    });
  };

  const incrementMinutes = () => {
    const minutes = parseInt(alarmTime.minutes);
    setAlarmTime({
      ...alarmTime,
      minutes: ((minutes + 1) % 60).toString().padStart(2, '0'),
    });
  };

  const decrementMinutes = () => {
    const minutes = parseInt(alarmTime.minutes);
    setAlarmTime({
      ...alarmTime,
      minutes: ((minutes - 1 + 60) % 60).toString().padStart(2, '0'),
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.alarmsList}>
        {alarms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay alarmas configuradas</Text>
          </View>
        ) : (
          alarms.map((alarm) => (
            <View key={alarm.id} style={styles.alarmItem}>
              <View style={styles.alarmInfo}>
                <Text style={[styles.alarmTime, !alarm.enabled && styles.disabledText]}>
                  {alarm.time}
                </Text>
                <Text style={styles.alarmLabel}>{alarm.label}</Text>
                <Text style={styles.alarmMusic}>🎵 {alarm.music}</Text>
              </View>
              <View style={styles.alarmControls}>
                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm.id)}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={alarm.enabled ? '#2196F3' : '#f4f3f4'}
                />
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => editAlarm(alarm)}
                >
                  <Text style={styles.iconButtonText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => deleteAlarm(alarm.id)}
                >
                  <Text style={styles.iconButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>➕ Agregar Alarma</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAlarm ? 'Modificar Alarma' : 'Nueva Alarma'}
            </Text>

            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                <TouchableOpacity onPress={incrementHours}>
                  <Text style={styles.arrowButton}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.timePickerText}>{alarmTime.hours}</Text>
                <TouchableOpacity onPress={decrementHours}>
                  <Text style={styles.arrowButton}>▼</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timePicker}>
                <TouchableOpacity onPress={incrementMinutes}>
                  <Text style={styles.arrowButton}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.timePickerText}>{alarmTime.minutes}</Text>
                <TouchableOpacity onPress={decrementMinutes}>
                  <Text style={styles.arrowButton}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Etiqueta de la alarma"
              placeholderTextColor="#999"
              value={alarmLabel}
              onChangeText={setAlarmLabel}
            />

            <TouchableOpacity
              style={styles.musicButton}
              onPress={() => setMusicModalVisible(true)}
            >
              <Text style={styles.musicButtonText}>🎵 {selectedMusic}</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addOrUpdateAlarm}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={musicModalVisible}
        onRequestClose={() => setMusicModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.musicModalContent}>
            <Text style={styles.modalTitle}>Seleccionar Música</Text>
            {musicOptions.map((music, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.musicOption,
                  selectedMusic === music && styles.selectedMusicOption,
                ]}
                onPress={() => {
                  setSelectedMusic(music);
                  setMusicModalVisible(false);
                }}
              >
                <Text style={styles.musicOptionText}>{music}</Text>
              </TouchableOpacity>
            ))}
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
  alarmsList: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
  },
  alarmItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#666',
  },
  alarmLabel: {
    fontSize: 16,
    color: '#aaaaaa',
    marginTop: 5,
  },
  alarmMusic: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  alarmControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
  iconButtonText: {
    fontSize: 24,
  },
  addButton: {
    backgroundColor: '#2196F3',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timePicker: {
    alignItems: 'center',
  },
  arrowButton: {
    fontSize: 30,
    color: '#2196F3',
    padding: 10,
  },
  timePickerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  musicButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  musicButtonText: {
    fontSize: 16,
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
  musicModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  musicOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedMusicOption: {
    backgroundColor: '#e3f2fd',
  },
  musicOptionText: {
    fontSize: 16,
  },
});