# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build (ESLint disabled)
npm start            # Production server
npm run lint         # ESLint check
npm run typecheck    # TypeScript validation (strict mode)
```

## Architecture Overview

**MRM Method Builder** - Desktop-first GC-MS/MS method generator for pesticide, environmental, and veterinary compound analysis using RI→RT conversion algorithms.

### Core Technology Stack
- **Framework**: Next.js 13.5.1 App Router with TypeScript 5.2.2 (strict mode)
- **UI**: Radix UI components (35+) + TailwindCSS 3.3.3
- **Rendering**: All API routes use `export const dynamic = 'force-dynamic'`
- **Platform**: Desktop-only (≥1280px), no mobile adaptation

### Data Architecture
The system operates on a **file-based architecture** with real-time CSV parsing:

```
data/database.csv (Single Source of Truth) → CSV Parsing → RI→RT Conversion → MRM Generation
```

**Critical Files**:
- `data/database.csv` - 1.4MB compound database (300k+ records, 300k+ compounds)
- `data/methods.json` - GC method configurations
- `data/transitions.csv` - MRM transition data

### Processing Pipeline
1. **Normalization** (`/api/normalize`) - Compound validation and standardization
2. **RT Calibration** (`/api/calibrate`) - RI→RT conversion using alkanes
3. **Method Building** (`/api/build`) - MRM parameter generation
4. **Export** (`/api/export`) - CSV/TXT format generation

### Key Implementation Files
- `app/generator/page.tsx` - Main interface (1162 lines, client component)
- `lib/utils/riMapping.ts` - RI→RT conversion algorithm
- `lib/utils/csvParser.ts` - Database parsing and caching
- `lib/utils/ceExpansion.ts` - Collision energy calculations

### API Route Pattern
All API routes follow this structure:
```typescript
export const dynamic = 'force-dynamic'
import fs from 'fs'

export async function POST(request: Request) {
  // File system operations on data/database.csv
  // No database, direct CSV parsing
}
```

## Important Constraints

1. **Single Point of Failure**: `data/database.csv` corruption breaks the entire system
2. **Performance**: 1.4MB file loaded completely on each API request
3. **No ESLint Validation**: Builds skip linting (`ignoreDuringBuilds: true`)
4. **No Testing**: Zero test coverage - manual verification required
5. **No Environment Setup**: Empty `.env` file, no templates provided
6. **Mixed Language**: Interface uses Chinese placeholders with English labels

## Development Guidelines

### File Modification Strategy
- **Incremental Changes**: Modify ≤5-10 files per commit
- **Database Modifications**: Always backup `data/database.csv` first
- **API Changes**: Test with real compound data from database.csv
- **UI Updates**: Maintain desktop-first design (≥1280px minimum)

### Common Data Operations
```typescript
// Reading compound data (from csvParser.ts pattern)
const data = fs.readFileSync('data/database.csv', 'utf-8')
const lines = data.split('\n')
// Parse columns: Common Name (col4), CAS# (col23/7), Chinese Name (col40)

// Caching approach (file modification time based)
const stats = fs.statSync('data/database.csv')
const cacheKey = stats.mtimeMs
```

### Critical Algorithm: RI→RT Conversion
The RI→RT mapping uses C8-C35 alkane calibration data:
```typescript
// From riMapping.ts - Converts Retention Index to Retention Time
export function riToRt(ri: number, method: string): number {
  // Uses method-specific alkane calibration curves
}
```

## When Making Changes

1. **Database Schema**: The CSV columns are fixed - verify column indices before changes
2. **Caching Logic**: File modification time (mtimeMs) is used for cache invalidation
3. **Export Formats**: Support both CSV and TXT output formats
4. **Error Handling**: API routes should return proper error responses for missing compounds
5. **TypeScript**: Strict mode is enabled - ensure type safety

## Known Limitations

- **No Mobile Support**: Interface designed exclusively for desktop
- **No Real-time Updates**: File watching not implemented for data changes
- **No Concurrent Access**: File locking not implemented for database operations
- **No Data Validation**: Limited compound data validation on import
- **No Backup System**: Manual backup required for data file changes