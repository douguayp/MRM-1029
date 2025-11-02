'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { AlkanePoint } from '@/lib/types';

interface AlkaneUploadProps {
  onCalibrate: (alkanes: AlkanePoint[]) => void;
  calibrated: boolean;
  loading?: boolean;
}

export function AlkaneUpload({ onCalibrate, calibrated, loading }: AlkaneUploadProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    try {
      const lines = input.split('\n').filter(l => l.trim());
      const alkanes: AlkanePoint[] = [];

      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const rt = parseFloat(parts[1]);

          if (isNaN(rt)) {
            throw new Error(`Invalid RT value for ${name}`);
          }

          alkanes.push({ name, rt });
        }
      }

      if (alkanes.length < 6) {
        throw new Error('At least 6 alkane points are required');
      }

      onCalibrate(alkanes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid format');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Alkane Calibration
          {calibrated && <CheckCircle2 className="h-5 w-5 text-green-600" />}
        </CardTitle>
        <CardDescription>
          Upload C7-C30 alkane retention times (minimum 6 points)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {calibrated ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Calibration complete. RT predictions are now available.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Textarea
              placeholder="C7, 0.85&#10;C8, 1.20&#10;C9, 2.15&#10;C10, 3.45&#10;..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Calibration
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
