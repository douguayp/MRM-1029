/**
 * 方法构建API路由
 * 
 * v2.0 - 完全从 database.csv 读取数据
 * 修改说明：不再使用旧的 transitions.csv 和 ri.csv，改为统一从 database.csv 读取
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadMethods } from '@/lib/infra/repo/fileRepo';
import { loadCompoundDatabase, loadTransitionsFromCSV } from '@/lib/utils/csvParser';
import { Family, GenerationMode, BuildRow } from '@/lib/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// 缓存数据库以提高性能 + 文件修改时间检测
let cachedDatabase: ReturnType<typeof loadCompoundDatabase> | null = null;
let lastModifiedTime: number = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      family,
      mode,
      methodId,
      compoundIds,
      expandCE = true,
      delta = 4
    } = body as {
      family: Family;
      mode: GenerationMode;
      methodId?: string;
      compoundIds: string[];
      expandCE?: boolean;
      delta?: number;
    };

    if (!family || !mode || !compoundIds || !Array.isArray(compoundIds)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    console.log(`Build API v2.1 - Received ${compoundIds.length} compound IDs:`, compoundIds);

    // 检查文件是否被修改，如果修改则重新加载
    const csvPath = path.join(process.cwd(), 'data', 'database.csv');
    const stats = fs.statSync(csvPath);
    const currentModifiedTime = stats.mtimeMs;
    
    if (!cachedDatabase || currentModifiedTime > lastModifiedTime) {
      const action = cachedDatabase ? 'Reloading' : 'Loading';
      console.log(`${action} compound database from database.csv...`);
      cachedDatabase = loadCompoundDatabase();
      lastModifiedTime = currentModifiedTime;
      console.log(`✓ Loaded ${cachedDatabase.length} compounds (last modified: ${new Date(currentModifiedTime).toLocaleString()})`);
    }

    // 从 database.csv 加载 transitions
    const transitionsData = loadTransitionsFromCSV(compoundIds);
    console.log(`Build API - Loaded ${transitionsData.length} transitions from CSV`);

    // 加载方法配置
    const methods = await loadMethods();
    const method = methodId ? methods[family]?.[methodId] : null;

    const rows: BuildRow[] = [];

    for (const t of transitionsData) {
      // 从数据库中查找化合物信息（用于获取 RI）
      const compound = cachedDatabase.find(
        c => c.casNoDashes === t.casNoDashes || c.formalCAS === t.formalCAS
      );

      // 基础行数据
      const baseRow: BuildRow = {
        family,
        compound: t.commonName,
        cas: t.formalCAS,
        methodId: methodId || '',
        compoundId: t.casNoDashes || t.formalCAS,
        Q1: t.precursorIon,
        Q3: t.productIon,
        CE: t.collisionEnergy,
        CE_low: t.collisionEnergy - delta,
        CE_high: t.collisionEnergy + delta,
        QuantQual: t.quantQual as 'Quantifier' | 'Qualifier',
        RelativeIntensity: parseFloat(t.relativeIntensity) || 0,
        RI_ref: compound?.ri_CF40 || undefined,  // 使用 CF40 的 RI（根据你的方法调整）
        RT_window: method?.default_rt_window?.toString(),
        RT_pred: undefined,
        ColumnPhase: method?.column_phase_group || '',
        ColumnGeom: method?.column_geometry || '',
        Carrier: method?.carrier || '',
        FlowMode: method?.flow_mode || '',
        FlowRate: method?.flow_rate || 0,
        OvenProgram: method?.oven_program || '',
        Inlet: method?.inlet_mode || '',
        Target: t.quantQual === 'Q0' ? 'Target' : '',
        Source: 'Database',
        Comment: undefined
      };

      // CE 扩展：生成 L/N/H 三行
      if (expandCE) {
        rows.push({ ...baseRow, CE: baseRow.CE_low, Comment: 'CE_tier: L' });
        rows.push({ ...baseRow, Comment: 'CE_tier: N' });
        rows.push({ ...baseRow, CE: baseRow.CE_high, Comment: 'CE_tier: H' });
      } else {
        rows.push(baseRow);
      }
    }

    console.log(`Build API - Returning ${rows.length} rows`);

    return NextResponse.json({
      rows,
      methodFingerprint: methodId ? methods[family]?.[methodId] : null
    });
  } catch (error) {
    console.error('Build API v2.0 error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
