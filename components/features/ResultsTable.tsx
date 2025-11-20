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
}

const DEFAULT_MAX_HEIGHT = '100%';

export function ResultsTable({ rows, maxHeight = DEFAULT_MAX_HEIGHT }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        No data to display
      </div>
    );
  }

  let heightStyle: CSSProperties;
  if (typeof maxHeight === 'number') {
    heightStyle = { height: `${maxHeight}px` };
  } else if (maxHeight === '100%') {
    heightStyle = { height: '100%' };
  } else {
    heightStyle = { maxHeight };
  }

  return (
    <div className="rounded-md border bg-white h-full">
      <div className="overflow-x-auto h-full">
        <div className="overflow-y-auto h-full" style={heightStyle}>
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow className="h-10">
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
                <TableRow key={`${row.compoundId}-${row.Q1}-${row.Q3}-${idx}`} className="h-10">
                  <TableCell className="font-medium text-sm py-2 leading-tight">
                    {row.compound || row.compoundId}
                  </TableCell>
                  <TableCell className="text-sm py-2">{row.Q1}</TableCell>
                  <TableCell className="text-sm py-2">{row.Q3}</TableCell>
                  <TableCell className="text-sm py-2">{row.CE}</TableCell>
                  <TableCell className="text-sm py-2">
                    <Badge variant={row.QuantQual === 'Quantifier' ? 'default' : 'outline'}>
                      {row.QuantQual}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm py-2">{row.RI_ref ?? '-'}</TableCell>
                  <TableCell className="text-sm py-2">{row.RT_pred?.toFixed(2) ?? '-'}</TableCell>
                  <TableCell className="text-xs py-2">{row.RT_window ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
