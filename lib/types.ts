export type Family = 'Pesticides' | 'Environmental' | 'Veterinary';

export type GenerationMode = 'withGC' | 'msdOnly';

export interface Compound {
  id: string;
  cas: string;
  name: string;
  family: Family;
  inchikey?: string;
  synonyms?: string[];
}

export interface Transition {
  family: Family;
  compound_id: string;
  Q1: number;
  Q3: number;
  CE_nominal: number;
  CE_low?: number;
  CE_high?: number;
  QuantQual: 'Quantifier' | 'Qualifier';
  RelativeIntensity: number;
  Target: string;
  Source: string;
}

export interface RIData {
  family: Family;
  compound_id: string;
  RI_ref: number;
  RT_window?: string;
  source: string;
}

export interface MethodConfig {
  method_id: string;
  column_phase_group: string;
  column_geometry: string;
  carrier: string;
  flow_mode: string;
  flow_rate: number;
  oven_program: string;
  inlet_mode: string;
  inlet_temp: number;
  splitless_time: number;
  liner: string;
  transfer_line_temp: string;
  source_temp: string;
  note: string;
  default_rt_window: number;
}

export interface AlkanePoint {
  name: string;
  ri?: number;
  rt: number;
}

export interface NormalizedCompound {
  compoundId: string;
  cas: string;
  name: string;
  family: Family;
  matched: boolean;
}

export interface BuildRow {
  family: Family;
  compound: string;
  cas: string;
  methodId: string;
  compoundId: string;
  Q1: number;
  Q3: number;
  CE: number;
  CE_low: number;
  CE_high: number;
  QuantQual: string;
  RelativeIntensity: number;
  RI_ref?: number;
  RT_window?: string;
  RT_pred?: number;
  ColumnPhase: string;
  ColumnGeom: string;
  Carrier: string;
  FlowMode: string;
  FlowRate: number;
  OvenProgram: string;
  Inlet: string;
  Target: string;
  Source: string;
  Comment?: string;
}

export interface CalibrationModel {
  type: 'piecewise_linear_monotone';
  points: number;
  rangeRT: [number, number];
  alkanes: AlkanePoint[];
}

export interface MappedCompound {
  compoundId: string;
  RT_pred: number;
  RT_window: [number, number];
  warning?: string;
}
