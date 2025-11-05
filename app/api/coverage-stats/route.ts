import { NextResponse } from 'next/server';
import { getCoverageStats } from '@/lib/utils/coverage-stats';

export async function GET() {
  try {
    const stats = await getCoverageStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching coverage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coverage stats' },
      { status: 500 }
    );
  }
}

