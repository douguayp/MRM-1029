/**
 * 方法构建API路由
 * 
 * 修改说明：添加动态路由配置
 * 修改逻辑：强制动态渲染，处理POST请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadTransitions, loadRI, loadMethods } from '@/lib/infra/repo/fileRepo';
import { expandThreePointCE } from '@/lib/utils/ceExpansion';
import { Family, GenerationMode, BuildRow } from '@/lib/types';

// 强制动态渲染
export const dynamic = 'force-dynamic';

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

    const transitions = await loadTransitions({ family, ids: compoundIds });
    const riData = await loadRI({ family, ids: compoundIds });
    const methods = await loadMethods();

    const riMap = new Map(riData.map(r => [r.compound_id, r]));

    let expanded = transitions;
    if (expandCE) {
      expanded = expandThreePointCE(transitions, delta);
    }

    const rows: BuildRow[] = [];

    for (const t of expanded) {
      const ri = riMap.get(t.compound_id);
      const method = methodId ? methods[family]?.[methodId] : null;

      const row: BuildRow = {
        family: t.family,
        compound: '',
        cas: '',
        methodId: methodId || '',
        compoundId: t.compound_id,
        Q1: t.Q1,
        Q3: t.Q3,
        CE: (t as any).CE_value ?? t.CE_nominal,
        CE_low: t.CE_low ?? t.CE_nominal - delta,
        CE_high: t.CE_high ?? t.CE_nominal + delta,
        QuantQual: t.QuantQual,
        RelativeIntensity: t.RelativeIntensity,
        RI_ref: ri?.RI_ref,
        RT_window: ri?.RT_window,
        RT_pred: undefined,
        ColumnPhase: method?.column_phase_group || '',
        ColumnGeom: method?.column_geometry || '',
        Carrier: method?.carrier || '',
        FlowMode: method?.flow_mode || '',
        FlowRate: method?.flow_rate || 0,
        OvenProgram: method?.oven_program || '',
        Inlet: method?.inlet_mode || '',
        Target: t.Target,
        Source: t.Source,
        Comment: expandCE ? `CE_tier: ${(t as any).CE_tier || 'N'}` : undefined
      };

      rows.push(row);
    }

    return NextResponse.json({
      rows,
      methodFingerprint: methodId ? methods[family]?.[methodId] : null
    });
  } catch (error) {
    console.error('Build API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
