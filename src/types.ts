export type ActiveTab = 'magFieldTab' | 'circuitSimTab';
export type SidebarTab = 'concepts' | 'equations' | 'materials';

export interface MagSimState {
  current: number; // in Amperes (A)
  coilRadius: number; // in millimeters (mm)
  isReversed: boolean;
  zoomScale: number;
}

export interface CircuitSimState {
  isSeries: boolean;
  voltage: number; // in Volts (V)
  R1: number; // in Ohms
  R2: number; // in Ohms
  zoomScale: number;
}
