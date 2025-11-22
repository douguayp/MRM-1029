'use client';

import type { CSSProperties } from 'react';
import { BuildRow } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ResultsTableProps {
  rows: BuildRow[];
  maxHeight?: string | number;
  visibleRows?: number;
}

const ROW_HEIGHT_PX = 36;
const HEADER_HEIGHT_PX = 40;
const DEFAULT_VISIBLE_ROWS = 12;
const MIN_ROWS_WITHOUT_SCROLL = 5;

export function ResultsTable({ rows, maxHeight, visibleRows = DEFAULT_VISIBLE_ROWS }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        No data to display
      </div>
    );
  }

  const rowsToDisplay = Math.max(Math.min(rows.length, visibleRows), MIN_ROWS_WITHOUT_SCROLL);
  const computedHeight = HEADER_HEIGHT_PX + ROW_HEIGHT_PX * rowsToDisplay;

  let heightStyle: CSSProperties = { maxHeight: `${computedHeight}px` };
  if (rows.length <= visibleRows) {
    heightStyle = { height: `${computedHeight}px` };
  }
  if (typeof maxHeight === 'number') {
    heightStyle = { maxHeight: `${maxHeight}px` };
  } else if (typeof maxHeight === 'string') {
    heightStyle = { maxHeight };
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto" style={heightStyle}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow className="h-9">
                <TableHead className="sticky top-0 bg-white z-10">Compound</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Q1</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Q3</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">CE (V)</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">Type</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">RI</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">RT (min)</TableHead>
                <TableHead className="sticky top-0 bg-white z-10">RT Window</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={`${row.compoundId}-${row.Q1}-${row.Q3}-${idx}`} className="h-9">
                  <TableCell className="font-medium text-xs py-1.5 leading-tight">
                    {row.compound || row.compoundId}
                  </TableCell>
                  <TableCell className="text-xs py-1.5">{row.Q1}</TableCell>
                  <TableCell className="text-xs py-1.5">{row.Q3}</TableCell>
                  <TableCell className="text-xs py-1.5">{row.CE}</TableCell>
                  <TableCell className="text-xs py-1.5">
                    <Badge variant={row.QuantQual === 'Quantifier' ? 'default' : 'outline'}>
                      {row.QuantQual}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs py-1.5">{row.RI_ref ?? '-'}</TableCell>
                  <TableCell className="text-xs py-1.5">{row.RT_pred?.toFixed(2) ?? '-'}</TableCell>
                  <TableCell className="text-xs py-1.5">{row.RT_window ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
