/**
 * 化合物规范化API路由
 * 
 * 修改说明：添加动态路由配置，修复Next.js静态生成错误
 * 修改逻辑：
 * 1. 添加 export const dynamic = 'force-dynamic' 声明
 * 2. 告诉Next.js这个路由需要在运行时处理请求
 * 3. 避免"couldn't be rendered statically"错误
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadCompounds } from '@/lib/infra/repo/fileRepo';
import { Family, NormalizedCompound } from '@/lib/types';

// 强制动态渲染，因为需要处理POST请求体
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { family, query } = body as { family: Family; query: string[] };
    
    // 调试日志：打印接收到的请求参数
    console.log('Normalize API - Family:', family, 'Query:', query);

    if (!family || !query || !Array.isArray(query)) {
      return NextResponse.json(
        { error: 'Invalid request: family and query array required' },
        { status: 400 }
      );
    }

    const compounds = await loadCompounds(family);
    const results: NormalizedCompound[] = [];
    const unmatched: string[] = [];

    for (const q of query) {
      const normalized = q.trim().toLowerCase();

      const match = compounds.find(c => {
        if (c.cas.toLowerCase() === normalized) return true;
        if (c.name.toLowerCase() === normalized) return true;
        if (c.synonyms?.some(s => s.toLowerCase() === normalized)) return true;
        if (c.name.toLowerCase().includes(normalized)) return true;
        return false;
      });

      if (match) {
        if (!results.some(r => r.compoundId === match.id)) {
          results.push({
            compoundId: match.id,
            cas: match.cas,
            name: match.name,
            family: match.family,
            matched: true
          });
        }
      } else {
        unmatched.push(q);
      }
    }

    return NextResponse.json({
      results,
      unmatched
    });
  } catch (error) {
    console.error('Normalize API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
