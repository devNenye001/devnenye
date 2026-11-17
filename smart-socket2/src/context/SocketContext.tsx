import React, { createContext, useContext, useState, useEffect } from 'react';
import { SocketItem, RoomItem, EnergyOverview, AiSafetyState, ScreenType } from '../types';
import { IotSimulator } from '../services/iotSimulator';
import { TinyMlEngine } from '../services/aiEngine';

interface SocketContextType {
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  selectedRoomFilter: string;
  setSelectedRoomFilter: (room: string) => void;
  selectedRoom: RoomItem | null;
  setSelectedRoom: (room: RoomItem | null) => void;
  editingSocket: SocketItem | null;
  setEditingSocket: (socket: SocketItem | null) => void;
  sockets: SocketItem[];
  rooms: RoomItem[];
  energyOverview: EnergyOverview;
  toggleSocket: (id: string) => void;
  saveSocket: (socket: SocketItem) => void;
  deleteSocket: (id: string) => void;
  addNewSocket: (socketData: { name: string; room: string }) => void;
  addNewRoom: (name: string, imageUrl?: string) => void;
  isAddModalVisible: boolean;
  setIsAddModalVisible: (visible: boolean) => void;
  aiSafetyState: AiSafetyState;
  setVoiceAlertsEnabled: (enabled: boolean) => void;
  triggerFaultSimulation: (preset: 'normal' | 'overload' | 'surge' | 'vampire') => void;
  emergencyRelayCutoff: () => void;
}

const initialRooms: RoomItem[] = [
  {
    id: 'room_bedroom',
    name: 'Bedroom',
    activeSocketsCount: 4,
    currentUsageKw: '46,2Kw',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'room_kitchen',
    name: 'Kitchen',
    activeSocketsCount: 3,
    currentUsageKw: '13,8Kw',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'room_sitting',
    name: 'Sitting Room',
    activeSocketsCount: 5,
    currentUsageKw: '76,2Kw',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
];

const initialSockets: SocketItem[] = [
  {
    id: 's1',
    name: 'Socket 1',
    room: 'Bedroom',
    isOn: true,
    voltage: 231.2,
    current: 3.82,
    power: 875.0,
    energy: 14.825,
    powerFactor: 0.99,
    frequency: 50.0,
    isScheduleEnabled: true,
    scheduleYear: '2025',
    scheduleMonth: 'Sept',
    scheduleDay: '7',
    onTime: '08:00 AM',
    offTime: '13:00 PM',
  },
  {
    id: 's2',
    name: 'Socket 2',
    room: 'Bedroom',
    isOn: true,
    voltage: 230.8,
    current: 1.15,
    power: 218.0,
    energy: 8.42,
    powerFactor: 0.82,
    frequency: 50.0,
    isScheduleEnabled: false,
    onTime: '09:00 AM',
    offTime: '18:00 PM',
  },
  {
    id: 's3',
    name: 'Socket 3',
    room: 'Bedroom',
    isOn: false,
    voltage: 230.0,
    current: 0.0,
    power: 0.0,
    energy: 19.31,
    powerFactor: 1.0,
    frequency: 50.0,
    isScheduleEnabled: false,
  },
  {
    id: 's4',
    name: 'Socket 4',
    room: 'Bedroom',
    isOn: true,
    voltage: 230.5,
    current: 0.62,
    power: 130.0,
    energy: 5.12,
    powerFactor: 0.91,
    frequency: 50.0,
    isScheduleEnabled: true,
    onTime: '07:00 AM',
    offTime: '23:00 PM',
  },
];

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('Bedroom');
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(initialRooms[0]);
  const [editingSocket, setEditingSocket] = useState<SocketItem | null>(null);
  const [sockets, setSockets] = useState<SocketItem[]>(initialSockets);
  const [rooms, setRooms] = useState<RoomItem[]>(initialRooms);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true);

  const [aiSafetyState, setAiSafetyState] = useState<AiSafetyState>({
    anomalyScore: 0.06,
    status: 'Safe Normal',
    vampireDrainWatts: 0,
    isVampireDrainDetected: false,
    isApplianceForgotten: false,
    activeRunningMinutes: 18,
    isRelayCutoff: false,
    lastVoiceAlert: 'VoltPass TinyML engine is actively monitoring socket safety.',
    voiceAlertsEnabled: true,
  });

  // Calculate active sockets and total consumption
  const activeSocketsCount = sockets.filter((s) => s.isOn).length;
  const energyOverview: EnergyOverview = {
    activeSockets: activeSocketsCount > 0 ? 17 : 0, // matching screenshot default representation
    todayKw: '76,2Kw',
  };

  // Continuous IoT Telemetry & AI Safety Evaluation Loop (1.5s interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setSockets((prev) =>
        prev.map((sock) => {
          if (!sock.isOn) return sock;
          const updated = IotSimulator.generateTelemetry(sock);
          const evaluation = TinyMlEngine.evaluateSafety(
            updated,
            aiSafetyState.activeRunningMinutes,
            voiceAlertsEnabled
          );
          if (evaluation.safetyState.isRelayCutoff) {
            setAiSafetyState(evaluation.safetyState);
          }
          return evaluation.updatedSocket;
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [voiceAlertsEnabled, aiSafetyState.activeRunningMinutes]);

  const toggleSocket = (id: string) => {
    setSockets((prev) =>
      prev.map((sock) => {
        if (sock.id === id) {
          const newState = !sock.isOn;
          return {
            ...sock,
            isOn: newState,
            power: newState ? 180.0 : 0.0,
            current: newState ? 0.8 : 0.0,
          };
        }
        return sock;
      })
    );
  };

  const saveSocket = (updated: SocketItem) => {
    setSockets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSocket(null);
  };

  const deleteSocket = (id: string) => {
    setSockets((prev) => prev.filter((s) => s.id !== id));
  };

  const addNewSocket = (data: { name: string; room: string }) => {
    const newId = `s_${Date.now()}`;
    const newSocket: SocketItem = {
      id: newId,
      name: data.name,
      room: data.room,
      isOn: true,
      voltage: 230.0,
      current: 0.95,
      power: 210.0,
      energy: 0.01,
      powerFactor: 0.96,
      frequency: 50.0,
      isScheduleEnabled: false,
    };
    setSockets((prev) => [...prev, newSocket]);
  };

  const addNewRoom = (name: string, imageUrl?: string) => {
    const newRoom: RoomItem = {
      id: `room_${Date.now()}`,
      name,
      activeSocketsCount: 0,
      currentUsageKw: '0,0Kw',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const emergencyRelayCutoff = () => {
    setSockets((prev) => prev.map((s) => ({ ...s, isOn: false })));
    setAiSafetyState((prev) => ({
      ...prev,
      isRelayCutoff: true,
      status: 'Hazard Auto-Trip',
      lastVoiceAlert: 'Emergency Trip! All smart sockets disconnected from mains.',
    }));
  };

  const triggerFaultSimulation = (preset: 'normal' | 'overload' | 'surge' | 'vampire') => {
    setSockets((prev) =>
      prev.map((s, index) => {
        if (index === 0) {
          if (preset === 'overload') {
            return { ...s, isOn: true, current: 15.2, power: 3450.0 };
          } else if (preset === 'surge') {
            return { ...s, isOn: true, voltage: 258.0, current: 2.5, power: 620.0 };
          } else if (preset === 'vampire') {
            return { ...s, isOn: true, current: 0.02, power: 3.8 };
          } else {
            return { ...s, isOn: true, voltage: 230.0, current: 1.2, power: 270.0 };
          }
        }
        return s;
      })
    );
  };

  return (
    <SocketContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedRoomFilter,
        setSelectedRoomFilter,
        selectedRoom,
        setSelectedRoom,
        editingSocket,
        setEditingSocket,
        sockets,
        rooms,
        energyOverview,
        toggleSocket,
        saveSocket,
        deleteSocket,
        addNewSocket,
        addNewRoom,
        isAddModalVisible,
        setIsAddModalVisible,
        aiSafetyState,
        setVoiceAlertsEnabled,
        triggerFaultSimulation,
        emergencyRelayCutoff,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

