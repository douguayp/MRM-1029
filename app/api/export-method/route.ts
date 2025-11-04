/**
 * GC 方法参数导出 API
 * 
 * v1.3 - 导出 GC 方法的详细参数为 CSV 格式
 * 功能：根据 family 和 methodId 生成方法参数文件
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadMethods } from '@/lib/infra/repo/fileRepo';
import { Family } from '@/lib/types';

export const dynamic = 'force-dynamic';

function generateMethodCSV(method: any, methodId: string): string {
  const lines: string[] = [];
  
  // 标题
  lines.push(`GC-MS/MS Method Parameters: ${methodId}`);
  lines.push('');
  
  // 基本信息
  lines.push('Parameter,Value');
  lines.push(`Method ID,${method.method_id || methodId}`);
  lines.push(`Label,"${method.label || ''}"`);
  lines.push(`Note,"${method.note || ''}"`);
  lines.push('');
  
  // 色谱柱信息
  lines.push('=== Column ===');
  lines.push('Parameter,Value');
  lines.push(`Phase,"${method.column_phase_group || ''}"`);
  lines.push(`Geometry,"${method.column_geometry || ''}"`);
  lines.push('');
  
  // 载气信息
  lines.push('=== Carrier Gas ===');
  lines.push('Parameter,Value');
  lines.push(`Gas,${method.carrier || ''}`);
  lines.push(`Mode,${method.flow_mode || ''}`);
  lines.push(`Flow Rate (mL/min),${method.flow_rate || ''}`);
  if (method.flow_rate_col2) {
    lines.push(`Flow Rate Col2 (mL/min),${method.flow_rate_col2}`);
  }
  lines.push('');
  
  // 进样口信息
  lines.push('=== Inlet ===');
  lines.push('Parameter,Value');
  lines.push(`Mode,${method.inlet_mode || ''}`);
  lines.push(`Temperature (°C),${method.inlet_temp || ''}`);
  if (method.inlet_temp_cold) {
    lines.push(`Temperature Cold (°C),${method.inlet_temp_cold}`);
  }
  lines.push(`Splitless Time (min),${method.splitless_time || ''}`);
  if (method.splitless_time_cold) {
    lines.push(`Splitless Time Cold (min),${method.splitless_time_cold}`);
  }
  lines.push(`Liner,${method.liner || ''}`);
  lines.push('');
  
  // 柱温箱程序
  lines.push('=== Oven Program ===');
  lines.push('Parameter,Value');
  lines.push(`Program,"${method.oven_program || ''}"`);
  if (method.run_time_min) {
    lines.push(`Total Run Time (min),${method.run_time_min}`);
  }
  lines.push('');
  
  // MS 参数
  lines.push('=== MS Parameters ===');
  lines.push('Parameter,Value');
  lines.push(`Transfer Line Temp (°C),${method.transfer_line_temp || ''}`);
  lines.push(`Source Temp (°C),${method.source_temp || ''}`);
  lines.push(`Quad Temp (°C),${method.quad_temp || ''}`);
  
  if (method.ms_params) {
    lines.push(`MS Mode,${method.ms_params.mode || ''}`);
    lines.push(`MS1 Resolution,${method.ms_params.ms1_resolution || ''}`);
    lines.push(`MS2 Resolution,${method.ms_params.ms2_resolution || ''}`);
    if (method.ms_params.collision_gas_N2_mLmin) {
      lines.push(`Collision Gas N2 (mL/min),${method.ms_params.collision_gas_N2_mLmin}`);
    }
    if (method.ms_params.quench_gas_He_mLmin) {
      lines.push(`Quench Gas He (mL/min),${method.ms_params.quench_gas_He_mLmin}`);
    }
    if (method.ms_params.detector_gain) {
      lines.push(`Detector Gain,${method.ms_params.detector_gain}`);
    }
  }
  lines.push('');
  
  // Backflush 参数
  if (method.backflush && method.backflush_params) {
    lines.push('=== Backflush ===');
    lines.push('Parameter,Value');
    lines.push(`Enabled,${method.backflush_params.enabled ? 'Yes' : 'No'}`);
    lines.push(`Analysis Phase,${method.backflush_params.analysis_phase || ''}`);
    lines.push(`Post-run Time (min),${method.backflush_params.postrun_min || ''}`);
    lines.push(`Post-run Oven Temp (°C),${method.backflush_params.postrun_oven_C || ''}`);
    lines.push(`Aux Pressure Run (psi),${method.backflush_params.aux_psi_run || ''}`);
    lines.push(`Aux Pressure Backflush (psi),${method.backflush_params.aux_psi_backflush || ''}`);
    lines.push(`Inlet Pressure Backflush (psi),${method.backflush_params.inlet_psi_backflush || ''}`);
    lines.push('');
  }
  
  // RT Lock 参数
  if (method.rt_lock && method.rt_lock.enabled) {
    lines.push('=== RT Lock ===');
    lines.push('Parameter,Value');
    lines.push(`Enabled,Yes`);
    lines.push(`Lock Compound,"${method.rt_lock.lock_compound || ''}"`);
    lines.push(`Target RT (min),${method.rt_lock.target_rt_min || ''}`);
    lines.push(`Tolerance (min),${method.rt_lock.tolerance_min || ''}`);
    lines.push(`Mode Hint,${method.rt_lock.mode_hint || ''}`);
    lines.push(`Note,"${method.rt_lock.note || ''}"`);
    lines.push('');
  }
  
  // RI 支持
  lines.push('=== RI Support ===');
  lines.push('Parameter,Value');
  lines.push(`Default RT Window (min),${method.default_rt_window || ''}`);
  
  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { family, methodId } = body as {
      family: Family;
      methodId: string;
    };

    if (!family || !methodId) {
      return NextResponse.json(
        { error: 'Invalid request: family and methodId required' },
        { status: 400 }
      );
    }

    const methods = await loadMethods();
    const method = methods[family]?.[methodId];

    if (!method) {
      return NextResponse.json(
        { error: `Method not found: ${methodId} for family ${family}` },
        { status: 404 }
      );
    }

    const csv = generateMethodCSV(method, methodId);

    return NextResponse.json({ csv });
  } catch (error) {
    console.error('Export method API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

