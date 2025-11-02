/**
 * RI 标定校准API路由
 * 
 * 修改说明：添加动态路由配置
 * 修改逻辑：强制动态渲染，处理POST请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildCalibrationModel, validateAlkanes, mapCompoundsToRT } from '@/lib/utils/riMapping';
import { loadMethods } from '@/lib/infra/repo/fileRepo';
import { AlkanePoint, Family } from '@/lib/types';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { family, methodId, alkanes, rows } = body as {
      family: Family;
      methodId: string;
      alkanes: AlkanePoint[];
      rows: Array<{ compoundId: string; RI_ref: number; RT_window?: string }>;
    };

    if (!family || !methodId || !alkanes || !rows) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const validation = validateAlkanes(alkanes);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid alkane data', details: validation.errors },
        { status: 400 }
      );
    }

    const model = buildCalibrationModel(alkanes);
    const methods = await loadMethods();
    const method = methods[family]?.[methodId];

    if (!method) {
      return NextResponse.json(
        { error: 'Method not found' },
        { status: 404 }
      );
    }

    const mapped = mapCompoundsToRT(
      rows.filter(r => r.RI_ref),
      model,
      method.default_rt_window
    );

    const warnings: string[] = [];
    mapped.forEach(m => {
      if (m.warning) {
        warnings.push(`${m.compoundId}: ${m.warning}`);
      }
    });

    return NextResponse.json({
      model: {
        type: model.type,
        points: model.points,
        rangeRT: model.rangeRT
      },
      mapped,
      warnings
    });
  } catch (error) {
    console.error('Calibrate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
