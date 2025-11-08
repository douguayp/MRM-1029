'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';

interface BatchInputProps {
  onSubmit: (queries: string[]) => void;
  loading?: boolean;
}

export function BatchInput({ onSubmit, loading }: BatchInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length > 0) {
      onSubmit(lines);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInput(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Compounds</CardTitle>
        <CardDescription>
          Enter CAS numbers or compound names (one per line), or upload a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="1912-24-9&#10;Chlorpyrifos&#10;Malathion"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
            <FileText className="mr-2 h-4 w-4" />
            Process Input
          </Button>
          <Button variant="outline" asChild disabled={loading}>
            <label>
              <Upload className="mr-2 h-4 w-4" />
              Upload CSV
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
