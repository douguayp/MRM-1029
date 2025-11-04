/**
 * 化合物规范化API路由
 * 
 * v2.0 - 完全从 database.csv 读取数据
 * 修改说明：不再使用旧的 compounds.json，改为统一从 database.csv 读取
 */

import { NextRequest, NextResponse } from 'next/server';
import { Family, NormalizedCompound } from '@/lib/types';
import { loadCompoundDatabase, smartSearch } from '@/lib/utils/csvParser';

export const dynamic = 'force-dynamic';

// 缓存数据库以提高性能
let cachedDatabase: ReturnType<typeof loadCompoundDatabase> | null = null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { family, query } = body as { family: Family; query: string[] };
    
    console.log('Normalize API v2.0 - Family:', family, 'Query:', query);

    if (!family || !query || !Array.isArray(query)) {
      return NextResponse.json(
        { error: 'Invalid request: family and query array required' },
        { status: 400 }
      );
    }

    // 加载数据库（只加载一次）
    if (!cachedDatabase) {
      console.log('Loading compound database from database.csv...');
      cachedDatabase = loadCompoundDatabase();
      console.log(`Loaded ${cachedDatabase.length} compounds from database`);
    }

    const results: NormalizedCompound[] = [];
    const unmatched: string[] = [];

    for (const q of query) {
      const queryTrimmed = q.trim();
      if (!queryTrimmed) continue;

      // 使用智能搜索（支持 CAS 号、名称、中文名）
      const matches = smartSearch(queryTrimmed, cachedDatabase);

      if (matches.length > 0) {
        const match = matches[0]; // 取第一个匹配结果
        
        // 去重：避免重复添加同一个化合物
        if (!results.some(r => r.cas === match.formalCAS)) {
          results.push({
            compoundId: match.casNoDashes || match.formalCAS,
            cas: match.formalCAS,
            name: match.commonName,
            family: family,
            matched: true
          });
          console.log(`✓ Matched: "${queryTrimmed}" → ${match.commonName} (CAS: ${match.formalCAS})`);
        }
      } else {
        unmatched.push(q);
        console.log(`✗ Not found: "${queryTrimmed}"`);
      }
    }

    console.log(`Results: ${results.length} matched, ${unmatched.length} unmatched`);

    return NextResponse.json({
      results,
      unmatched
    });
  } catch (error) {
    console.error('Normalize API v2.0 error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
