import { SocketItem, AiSafetyState } from '../types';

export class TinyMlEngine {
  static evaluateSafety(
    socket: SocketItem,
    runningMinutes: number,
    voiceAlertsEnabled: boolean
  ): {
    updatedSocket: SocketItem;
    safetyState: AiSafetyState;
  } {
    let isAnomaly = false;
    let anomalyReason = '';
    let isRelayCutoff = false;
    let status: AiSafetyState['status'] = 'Safe Normal';
    let anomalyScore = 0.05;
    let isVampireDrain = false;
    let vampireWatts = 0;
    let isForgotten = false;
    let voiceAlert = '';

    // If socket is OFF, safe state
    if (!socket.isOn) {
      return {
        updatedSocket: {
          ...socket,
          isAnomaly: false,
          anomalyReason: undefined,
          voltage: 230.1,
          current: 0.0,
          power: 0.0,
        },
        safetyState: {
          anomalyScore: 0.0,
          status: 'Safe Normal',
          vampireDrainWatts: 0,
          isVampireDrainDetected: false,
          isApplianceForgotten: false,
          activeRunningMinutes: 0,
          isRelayCutoff: false,
          lastVoiceAlert: 'Socket relay open. Zero load flowing.',
          voiceAlertsEnabled,
        },
      };
    }

    // 1. Extreme Overcurrent (> 13A) -> Instant Cutoff
    if (socket.current > 13.0) {
      isAnomaly = true;
      anomalyReason = `Dangerous overcurrent of ${socket.current.toFixed(1)}A detected. Safety relay opened.`;
      isRelayCutoff = true;
      status = 'Hazard Auto-Trip';
      anomalyScore = 0.98;
      voiceAlert = 'Emergency cutoff! High overcurrent detected. VoltPass automatically disconnected power.';
    }
    // 2. Severe Overvoltage (> 255V)
    else if (socket.voltage > 255.0) {
      isAnomaly = true;
      anomalyReason = `Severe grid surge of ${socket.voltage.toFixed(0)}V detected.`;
      isRelayCutoff = true;
      status = 'Hazard Auto-Trip';
      anomalyScore = 0.92;
      voiceAlert = 'Warning! Grid voltage surge detected. Socket turned off to protect appliance.';
    }
    // 3. Forgotten High-Power Appliance (> 1500W continuously for > 40 minutes)
    else if (socket.power > 1500 && runningMinutes > 40) {
      isAnomaly = true;
      anomalyReason = `Heater or Iron running continuously for ${runningMinutes} mins.`;
      status = 'Elevated Draw';
      anomalyScore = 0.65;
      isForgotten = true;
      voiceAlert = `Notice: High-power appliance has been operating non-stop for ${runningMinutes} minutes.`;
    }
    // 4. Standby / Vampire Drain (< 5W idle draw)
    else if (socket.power > 1.0 && socket.power < 5.0) {
      isVampireDrain = true;
      vampireWatts = socket.power;
      anomalyScore = 0.22;
      status = 'Safe Normal';
      voiceAlert = `Standby vampire drain of ${socket.power.toFixed(1)}W detected on ${socket.name}.`;
    }
    // Normal operation
    else {
      anomalyScore = Math.min(0.25, (socket.power / 3000) * 0.4);
      status = 'Safe Normal';
    }

    const updatedSocket: SocketItem = {
      ...socket,
      isOn: isRelayCutoff ? false : socket.isOn,
      isAnomaly,
      anomalyReason: isAnomaly ? anomalyReason : undefined,
    };

    return {
      updatedSocket,
      safetyState: {
        anomalyScore,
        status,
        vampireDrainWatts: vampireWatts,
        isVampireDrainDetected: isVampireDrain,
        isApplianceForgotten: isForgotten,
        activeRunningMinutes: runningMinutes,
        isRelayCutoff,
        lastVoiceAlert: voiceAlert,
        voiceAlertsEnabled,
      },
    };
  }
}

