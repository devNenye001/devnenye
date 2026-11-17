import { SocketItem } from '../types';

export class IotSimulator {
  static generateTelemetry(socket: SocketItem): SocketItem {
    if (!socket.isOn) {
      return {
        ...socket,
        voltage: 230.0 + (Math.random() - 0.5) * 1.5,
        current: 0.0,
        power: 0.0,
        frequency: 50.0 + (Math.random() - 0.5) * 0.1,
        powerFactor: 1.0,
      };
    }

    // Realistic baseline based on socket type
    let baseCurrent = 1.2;
    let pf = 0.96;

    if (socket.name.toLowerCase().includes('heater') || socket.id === 's1') {
      baseCurrent = 3.8 + (Math.random() - 0.5) * 0.3; // ~850W
      pf = 0.99;
    } else if (socket.name.toLowerCase().includes('fridge') || socket.id === 's2') {
      baseCurrent = 1.1 + (Math.random() - 0.5) * 0.2; // ~230W
      pf = 0.82;
    } else if (socket.name.toLowerCase().includes('tv') || socket.id === 's3') {
      baseCurrent = 0.45 + (Math.random() - 0.5) * 0.05; // ~100W
      pf = 0.94;
    } else {
      baseCurrent = 0.75 + (Math.random() - 0.5) * 0.1;
      pf = 0.91;
    }

    const voltage = 230.0 + (Math.random() - 0.5) * 3.0;
    const current = Math.max(0.05, baseCurrent);
    const power = voltage * current * pf;
    const addedEnergyKwh = (power / 1000) * (1 / 3600); // 1 second accumulation

    return {
      ...socket,
      voltage: Number(voltage.toFixed(1)),
      current: Number(current.toFixed(2)),
      power: Number(power.toFixed(1)),
      energy: Number((socket.energy + addedEnergyKwh).toFixed(3)),
      frequency: Number((50.0 + (Math.random() - 0.5) * 0.15).toFixed(1)),
      powerFactor: Number(pf.toFixed(2)),
    };
  }
}

