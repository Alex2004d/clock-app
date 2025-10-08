import { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ClockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [format24Hours, setFormat24Hours] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    if (format24Hours) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}${showSeconds ? ':' + seconds.toString().padStart(2, '0') : ''}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes
        .toString()
        .padStart(2, '0')}${showSeconds ? ':' + seconds.toString().padStart(2, '0') : ''} ${period}`;
    }
  };

  const formatDate = () => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayName = days[currentTime.getDay()];
    const day = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();

    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.clockContainer}>
        <Text style={styles.timeText}>{formatTime()}</Text>
        <Text style={styles.dateText}>{formatDate()}</Text>
      </View>

      <TouchableOpacity
        style={styles.configButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.configButtonText}>⚙️ Configuración</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración del Reloj</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Formato 24 horas</Text>
              <Switch
                value={format24Hours}
                onValueChange={setFormat24Hours}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={format24Hours ? '#2196F3' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Mostrar segundos</Text>
              <Switch
                value={showSeconds}
                onValueChange={setShowSeconds}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={showSeconds ? '#2196F3' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  timeText: {
    fontSize: 72,
    color: '#ffffff',
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: 18,
    color: '#aaaaaa',
    marginTop: 10,
  },
  configButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  configButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  settingLabel: {
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});