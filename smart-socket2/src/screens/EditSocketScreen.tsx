import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, ScrollView } from 'react-native';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useSocketContext } from '../context/SocketContext';

export const EditSocketScreen: React.FC = () => {
  const { setCurrentScreen, editingSocket, saveSocket, rooms } = useSocketContext();

  const [name, setName] = useState(editingSocket?.name || 'Smart Socket');
  const [isOn, setIsOn] = useState(editingSocket?.isOn ?? true);
  const [room, setRoom] = useState(editingSocket?.room || 'Bedroom');
  const [isScheduleEnabled, setIsScheduleEnabled] = useState(editingSocket?.isScheduleEnabled ?? true);
  const [year, setYear] = useState(editingSocket?.scheduleYear || '2025');
  const [month, setMonth] = useState(editingSocket?.scheduleMonth || 'Sept');
  const [day, setDay] = useState(editingSocket?.scheduleDay || '7');
  const [onTime, setOnTime] = useState(editingSocket?.onTime || '08:00 AM');
  const [offTime, setOffTime] = useState(editingSocket?.offTime || '13:00 PM');
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  useEffect(() => {
    if (editingSocket) {
      setName(editingSocket.name);
      setIsOn(editingSocket.isOn);
      setRoom(editingSocket.room);
      setIsScheduleEnabled(editingSocket.isScheduleEnabled ?? true);
      setYear(editingSocket.scheduleYear || '2025');
      setMonth(editingSocket.scheduleMonth || 'Sept');
      setDay(editingSocket.scheduleDay || '7');
      setOnTime(editingSocket.onTime || '08:00 AM');
      setOffTime(editingSocket.offTime || '13:00 PM');
    }
  }, [editingSocket]);

  const handleDone = () => {
    if (editingSocket) {
      saveSocket({
        ...editingSocket,
        name,
        isOn,
        room,
        isScheduleEnabled,
        scheduleYear: year,
        scheduleMonth: month,
        scheduleDay: day,
        onTime,
        offTime,
      });
    }
    setCurrentScreen('home');
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#F8FAFC" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit</Text>

        <TouchableOpacity onPress={handleDone} activeOpacity={0.7}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Smart Socket Toggle Header */}
        <View style={styles.topToggleRow}>
          <Text style={styles.socketMainTitle}>{name || 'Smart Socket'}</Text>
          <Switch
            value={isOn}
            onValueChange={setIsOn}
            trackColor={{ false: '#334155', true: '#2563EB' }}
            thumbColor={isOn ? '#FFFFFF' : '#94A3B8'}
          />
        </View>

        {/* Enter socket name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter socket name</Text>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter socket name"
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Enter room name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Enter room name</Text>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.dropdownValue}>{room}</Text>
            <ChevronDown size={18} color="#94A3B8" />
          </TouchableOpacity>

          {isRoomDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {rooms.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setRoom(r.name);
                    setIsRoomDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{r.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Schedule Card */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeaderRow}>
            <Text style={styles.scheduleTitle}>Schedule</Text>
            <Switch
              value={isScheduleEnabled}
              onValueChange={setIsScheduleEnabled}
              trackColor={{ false: '#334155', true: '#2563EB' }}
              thumbColor={isScheduleEnabled ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          {/* Date Selectors: Year, Month, Day */}
          <View style={styles.dateSelectorsRow}>
            <View style={styles.datePickerBox}>
              <Text style={styles.datePickerText}>{year}</Text>
              <ChevronDown size={14} color="#94A3B8" />
            </View>

            <View style={styles.datePickerBox}>
              <Text style={styles.datePickerText}>{month}</Text>
              <ChevronDown size={14} color="#94A3B8" />
            </View>

            <View style={styles.datePickerBox}>
              <Text style={styles.datePickerText}>{day}</Text>
              <ChevronDown size={14} color="#94A3B8" />
            </View>
          </View>

          {/* On Time / Off Time Row */}
          <View style={styles.timeScheduleRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>On Time</Text>
              <Text style={styles.timeValue}>{onTime}</Text>
            </View>

            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>Off Time</Text>
              <Text style={styles.timeValue}>{offTime}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  doneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
  },
  topToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  socketMainTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1E2533',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  dropdownInput: {
    backgroundColor: '#1E2533',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  dropdownValue: {
    color: '#F8FAFC',
    fontSize: 15,
  },
  dropdownMenu: {
    backgroundColor: '#1E2533',
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  dropdownItemText: {
    color: '#F8FAFC',
    fontSize: 14,
  },
  scheduleCard: {
    backgroundColor: '#161B26',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#232A3B',
    marginTop: 10,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#2D3748',
    marginBottom: 18,
  },
  dateSelectorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  datePickerBox: {
    backgroundColor: '#1E2533',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2D3748',
    width: '30%',
  },
  datePickerText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  timeScheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeColumn: {
    flex: 1,
  },
  timeLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  timeValue: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
});

