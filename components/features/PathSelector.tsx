'use client';

import { GenerationMode } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Zap } from 'lucide-react';

interface PathSelectorProps {
  value: GenerationMode;
  onChange: (mode: GenerationMode) => void;
}

export function PathSelector({ value, onChange }: PathSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Generation Path</CardTitle>
        <CardDescription>
          Choose whether to include GC method with RT prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as GenerationMode)}>
          <div className="flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 hover:bg-accent hover:border-primary/50 transition-colors">
            <RadioGroupItem value="withGC" id="withGC" />
            <div className="flex-1">
              <Label htmlFor="withGC" className="flex items-center gap-2 font-medium cursor-pointer">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                With GC Method (Recommended)
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Select GC method, upload alkane retention times, and get RT predictions with windows.
                Ready for direct instrument import.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0 rounded-lg border-2 p-4 hover:bg-accent hover:border-primary/50 transition-colors">
            <RadioGroupItem value="msdOnly" id="msdOnly" />
            <div className="flex-1">
              <Label htmlFor="msdOnly" className="flex items-center gap-2 font-medium cursor-pointer">
                <Zap className="h-5 w-5 text-primary" />
                MSD Method Only
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Skip GC configuration. Generate Q1/Q3/CE transitions only. Add RT information later.
              </p>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
