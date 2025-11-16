/**
 * API route to get all available methods
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadMethods } from '@/lib/infra/repo/fileRepo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await loadMethods();

    // Extract just the IDs and basic information for the interface
    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to load methods:', error);
    return NextResponse.json({
      error: 'Failed to load methods'
    }, {
      status: 500
    });
  }
}

// Alternative POST method if needed
export async function POST() {
  try {
    const response = await loadMethods();
    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}