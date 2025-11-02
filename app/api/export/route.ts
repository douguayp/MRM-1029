/**
 * 方法导出API路由
 * 
 * 修改说明：添加动态路由配置
 * 修改逻辑：强制动态渲染，处理POST请求
 */

import { NextRequest, NextResponse } from 'next/server';
import { BuildRow, GenerationMode } from '@/lib/types';

// 强制动态渲染
export const dynamic = 'force-dynamic';

function escapeCSVField(field: string | number | undefined): string {
  if (field === undefined || field === null || field === '') {
    return '';
  }
  const str = String(field);
  // 如果包含逗号、引号、换行符或中文字符，用引号包裹
  if (str.includes(',') || str.includes('"') || str.includes('\n') || /[\u4e00-\u9fa5]/.test(str)) {
    // 转义内部的引号
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateGenericCSV(rows: BuildRow[]): string {
  const headers = [
    'Family', 'Compound', 'CAS', 'MethodID', 'Q1', 'Q3', 'CE',
    'CE_low', 'CE_high', 'QuantQual', 'RelativeIntensity',
    'RI_ref', 'RT_window', 'RT_pred', 'ColumnPhase', 'ColumnGeom',
    'Carrier', 'FlowMode', 'FlowRate', 'OvenProgram', 'Inlet',
    'Target', 'Source', 'Comment'
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = [
      escapeCSVField(row.family),
      escapeCSVField(row.compound),
      row.cas,
      row.methodId,
      row.Q1,
      row.Q3,
      row.CE,
      row.CE_low,
      row.CE_high,
      row.QuantQual,
      row.RelativeIntensity,
      row.RI_ref ?? '',
      escapeCSVField(row.RT_window),
      row.RT_pred ?? '',
      escapeCSVField(row.ColumnPhase),
      escapeCSVField(row.ColumnGeom),
      row.Carrier,
      row.FlowMode,
      row.FlowRate,
      escapeCSVField(row.OvenProgram),
      escapeCSVField(row.Inlet),
      row.Target,
      row.Source,
      escapeCSVField(row.Comment)
    ];
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

function generateMassHunterCSV(rows: BuildRow[]): string {
  const headers = [
    'Compound Name',
    'Precursor m/z',
    'Product m/z',
    'CE (V)',
    'Quantifier/Qualifier',
    'Retention Time',
    'RT Window (min)',
    'Comment'
  ];

  const lines = [headers.join(',')];

  for (const row of rows) {
    const rtWindowText = row.RT_window || '';
    let rtWindowValue = '';

    if (rtWindowText) {
      const match = rtWindowText.match(/[±]\s*([\d.]+)/);
      if (match) {
        rtWindowValue = match[1];
      } else {
        const rangeMatch = rtWindowText.match(/([\d.]+)\s*[-–—]\s*([\d.]+)/);
        if (rangeMatch) {
          rtWindowValue = rangeMatch[2];
        }
      }
    }

    const comment = [
      row.family,
      row.methodId,
      row.ColumnGeom,
      row.Comment
    ].filter(Boolean).join(' | ');

    const values = [
      escapeCSVField(row.compound || row.compoundId),
      row.Q1,
      row.Q3,
      row.CE,
      row.QuantQual,
      row.RT_pred ?? '',
      rtWindowValue,
      escapeCSVField(comment)
    ];
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

function generateGapReport(unmatched: string[]): string {
  const headers = ['Query', 'Status'];
  const lines = [headers.join(',')];

  for (const q of unmatched) {
    lines.push(`"${q}",Not Found`);
  }

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      rows,
      format = 'both',
      unmatched = []
    } = body as {
      rows: BuildRow[];
      format?: 'generic' | 'masshunter' | 'both';
      unmatched?: string[];
    };

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json(
        { error: 'Invalid request: rows array required' },
        { status: 400 }
      );
    }

    const result: any = {};

    if (format === 'generic' || format === 'both') {
      result.generic = generateGenericCSV(rows);
    }

    if (format === 'masshunter' || format === 'both') {
      result.masshunter = generateMassHunterCSV(rows);
    }

    if (unmatched && unmatched.length > 0) {
      result.gap = generateGapReport(unmatched);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Export API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
