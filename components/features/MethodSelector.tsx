'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MethodSelectorProps {
  value: string;
  onChange: (methodId: string) => void;
  methods: Array<{ id: string; label: string; description: string }>;
}

export function MethodSelector({ value, onChange, methods }: MethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select GC Method</CardTitle>
        <CardDescription>
          Choose the column configuration for retention time prediction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a method" />
          </SelectTrigger>
          <SelectContent>
            {methods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                <div>
                  <div className="font-medium">{method.label}</div>
                  <div className="text-xs text-muted-foreground">{method.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
