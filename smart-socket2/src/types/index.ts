export interface SocketItem {
  id: string;
  name: string;
  room: string;
  isOn: boolean;
  voltage: number; // PZEM-004T measurement (V)
  current: number; // Current (A)
  power: number; // Active Power (W)
  energy: number; // Accumulated Energy (kWh)
  powerFactor: number; // 0.0 - 1.0
  frequency: number; // Hz (50Hz)
  isScheduleEnabled?: boolean;
  scheduleYear?: string;
  scheduleMonth?: string;
  scheduleDay?: string;
  onTime?: string;
  offTime?: string;
  applianceType?: string;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface RoomItem {
  id: string;
  name: string;
  activeSocketsCount: number;
  currentUsageKw: string;
  imageUrl: string;
}

export interface EnergyOverview {
  activeSockets: number;
  todayKw: string;
}

export interface AiSafetyState {
  anomalyScore: number; // 0.0 - 1.0 (TinyML inference output)
  status: 'Safe Normal' | 'Elevated Draw' | 'Hazard Auto-Trip';
  vampireDrainWatts: number;
  isVampireDrainDetected: boolean;
  isApplianceForgotten: boolean;
  activeRunningMinutes: number;
  isRelayCutoff: boolean;
  lastVoiceAlert: string;
  voiceAlertsEnabled: boolean;
}

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'home'
  | 'rooms'
  | 'roomDetail'
  | 'addSocket'
  | 'addRoom'
  | 'editSocket'
  | 'analytics'
  | 'settings';

