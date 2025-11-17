'use client';

import { BuildRow } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResultsTableProps {
  rows: BuildRow[];
}

export function ResultsTable({ rows }: ResultsTableProps) {
  if (rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>No data to display</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compound</TableHead>
                <TableHead>Q1</TableHead>
                <TableHead>Q3</TableHead>
                <TableHead>CE (V)</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>RI</TableHead>
                <TableHead>RT (min)</TableHead>
                <TableHead>RT Window</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{row.compound || row.compoundId}</TableCell>
                  <TableCell>{row.Q1}</TableCell>
                  <TableCell>{row.Q3}</TableCell>
                  <TableCell>{row.CE}</TableCell>
                  <TableCell>
                    <Badge variant={row.QuantQual === 'Quantifier' ? 'default' : 'outline'}>
                      {row.QuantQual}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.RI_ref ?? '-'}</TableCell>
                  <TableCell>{row.RT_pred?.toFixed(2) ?? '-'}</TableCell>
                  <TableCell className="text-xs">{row.RT_window ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
