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

/**
 * GC 方法配置接口
 * 
 * 说明：定义了 GC-MS 方法的所有参数
 * 用途：用于 methods.json 数据的类型检查
 * 
 * 版本历史：
 * - v1.1 (厂商中立化): label, quad_temp, backflush, backflush_params
 * - v1.2 (RT Lock): flow_rate_col2, inlet_temp_cold, run_time_min, ms_params, rt_lock
 */
export interface MethodConfig {
  method_id: string;                    // 方法唯一标识符（如 CF40-LOCKABLE）
  label: string;                        // 方法标签（如 "Constant Flow (~40.5 min), Series 2×15 m"）
  column_phase_group: string;           // 色谱柱固定相（如 "5% phenyl-methylpolysiloxane"）
  column_geometry: string;              // 色谱柱规格（如 "2×15 m × 0.25 mm × 0.25 μm"）
  carrier: string;                      // 载气（通常是 He 或 H2）
  flow_mode: string;                    // 流量模式（Constant Flow 或 Constant Pressure）
  flow_rate: number;                    // 流速（mL/min）或压力（psi）
  flow_rate_col2?: number;              // 第二段色谱柱流速（串联时）- v1.2
  oven_program: string;                 // 炉温程序（如 "60°C(1)→40°C/min→120"）
  inlet_mode: string;                   // 进样模式（Splitless、Split 等）
  inlet_temp: number;                   // 进样口温度（°C）
  inlet_temp_cold?: number;             // 冷进样温度（°C）- v1.2
  splitless_time: number;               // 不分流时间（min）
  splitless_time_cold?: number;         // 冷进样不分流时间（min）- v1.2
  liner: string;                        // 衬管类型
  transfer_line_temp: string;           // 传输线温度（°C）
  source_temp: string;                  // 离子源温度（°C）
  quad_temp: string;                    // 四极杆温度（°C）
  note: string;                         // 备注说明
  run_time_min?: number;                // 总运行时间（min）- v1.2
  default_rt_window: number;            // 默认保留时间窗口（min）
  backflush: boolean;                   // 是否支持反吹
  backflush_params?: {                  // 反吹参数（可选）
    enabled?: boolean;                  // 反吹是否启用
    analysis_phase?: string;            // 分析阶段反吹状态（"off" 表示仅 post-run）
    postrun_min: number;                // 反吹后运行时间（min）
    postrun_oven_C?: number;            // 反吹炉温（°C）
    oven_C?: number;                    // 反吹炉温（°C）- 兼容旧字段
    aux_psi_run?: number;               // 运行时辅助压力（psi）
    aux_psi_backflush?: number;         // 反吹时辅助压力（psi）
    aux_psi?: number;                   // 辅助压力（psi）- 兼容旧字段
    inlet_psi_backflush?: number;       // 反吹时进样口压力（psi）
  };
  ms_params?: {                         // MS 详细参数（可选）- v1.2
    mode: string;                       // 电离模式（如 "EI"）
    transfer_C: number;                 // 传输线温度（°C）
    source_C: number;                   // 离子源温度（°C）
    quad_C: number;                     // 四极杆温度（°C）
    ms1_resolution?: string;            // MS1 分辨率
    ms2_resolution?: string;            // MS2 分辨率
    collision_gas_N2_mLmin?: number;    // 碰撞气 N2 流量（mL/min）
    quench_gas_He_mLmin?: number;       // 淬灭气 He 流量（mL/min）
    detector_gain?: number;             // 检测器增益
  };
  rt_lock?: {                           // RT 锁定配置（可选）- v1.2
    enabled: boolean;                   // 是否启用 RT 锁定
    lock_compound: string;              // 锁定化合物名称（如 "Chlorpyrifos-methyl"）
    target_rt_min: number;              // 目标保留时间（min）
    tolerance_min: number;              // 容差（min）
    mode_hint: string;                  // 模式提示（如 "CF"）
    note: string;                       // 锁定说明
  };
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
