'use client';

import { useState } from 'react';
import { Family, GenerationMode, NormalizedCompound, BuildRow, AlkanePoint } from '@/lib/types';
import { FamilySelector } from '@/components/features/FamilySelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, AlertCircle, CheckCircle2, Upload, FileText, Info, Zap } from 'lucide-react';
import { ResultsTable } from '@/components/features/ResultsTable';

type Step = 'input' | 'path' | 'configure';

export default function Home() {
  const [family, setFamily] = useState<Family>('Pesticides');
  const [step, setStep] = useState<Step>('input');
  const [mode, setMode] = useState<GenerationMode>('withGC');
  const [methodId, setMethodId] = useState('A-30m-CF');
  const [normalized, setNormalized] = useState<NormalizedCompound[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [rows, setRows] = useState<BuildRow[]>([]);
  const [calibrated, setCalibrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [alkaneText, setAlkaneText] = useState('');
  const [expandCE, setExpandCE] = useState(true);
  const [ceDelta, setCeDelta] = useState(4);

  const handleInputSubmit = async (queries: string[]) => {
    setLoading(true);
    try {
      const filtered = queries.filter(q => q.trim().length > 0);

      if (filtered.length === 0) {
        alert('请输入至少一个化合物名称或CAS号');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ family, query: filtered })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setNormalized(data.results || []);
      setUnmatched(data.unmatched || []);

      if ((data.results || []).length === 0 && (data.unmatched || []).length === 0) {
        alert('未找到任何匹配的化合物，请检查输入');
      }
    } catch (error) {
      console.error('Normalization error:', error);
      alert('处理输入时出错，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBuild = async () => {
    setLoading(true);
    try {
      const compoundIds = normalized.map(n => n.compoundId);
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          family,
          mode,
          methodId: mode === 'withGC' ? methodId : undefined,
          compoundIds,
          expandCE,
          delta: ceDelta
        })
      });

      const data = await res.json();
      const builtRows = data.rows || [];

      const enriched = builtRows.map((row: BuildRow) => {
        const compound = normalized.find(n => n.compoundId === row.compoundId);
        return {
          ...row,
          compound: compound?.name || '',
          cas: compound?.cas || ''
        };
      });

      setRows(enriched);
    } catch (error) {
      console.error('Build error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalibrate = async () => {
    setLoading(true);
    try {
      const lines = alkaneText.split('\n').filter(l => l.trim());
      const alkanes: AlkanePoint[] = [];

      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          alkanes.push({ name: parts[0], rt: parseFloat(parts[1]) });
        }
      }

      const riRows = rows
        .filter((r, idx, self) => self.findIndex(x => x.compoundId === r.compoundId) === idx)
        .map(r => ({
          compoundId: r.compoundId,
          RI_ref: r.RI_ref || 0,
          RT_window: r.RT_window
        }))
        .filter(r => r.RI_ref > 0);

      const res = await fetch('/api/calibrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          family,
          methodId,
          alkanes,
          rows: riRows
        })
      });

      const data = await res.json();
      const mappedMap = new Map(data.mapped.map((m: any) => [m.compoundId, m]));

      const updated = rows.map(row => {
        const mapped = mappedMap.get(row.compoundId);
        if (mapped && typeof mapped === 'object' && 'RT_pred' in mapped && 'RT_window' in mapped) {
          const rtWindow = (mapped as any).RT_window;
          return {
            ...row,
            RT_pred: (mapped as any).RT_pred,
            RT_window: `±${Math.abs(rtWindow[0]).toFixed(2)}`
          };
        }
        return row;
      });

      setRows(updated);
      setCalibrated(true);
    } catch (error) {
      console.error('Calibration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'generic' | 'masshunter' | 'both') => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows,
          format,
          unmatched
        })
      });

      const data = await res.json();

      if (format === 'generic' || format === 'both') {
        downloadCSV(data.generic, 'method_generic.csv');
      }

      if (format === 'masshunter' || format === 'both') {
        downloadCSV(data.masshunter, 'method_masshunter.csv');
      }

      if (data.gap && unmatched.length > 0) {
        downloadCSV(data.gap, 'gap_report.csv');
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white text-primary rounded-lg p-3 shadow-md">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 2v6h6V2" />
                  <path d="M15 8v6h6V8" />
                  <path d="M3 14v6h6v-6" />
                  <path d="M9 14h6" />
                  <path d="M14 9v5" />
                  <path d="M6 20v-3" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  GC-QQQ Method Generator
                </h1>
              </div>
            </div>
            <div>
              <FamilySelector value={family} onChange={setFamily} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl flex-1">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-2">
            Step {step === 'input' ? '1' : step === 'path' ? '2' : '3'} of 3
          </div>
          <h2 className="text-xl font-semibold">
            {step === 'input' && '输入目标化合物'}
            {step === 'path' && '选择生成路径'}
            {step === 'configure' && '配置 & 结果'}
          </h2>
        </div>

        {step === 'input' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>输入目标化合物</CardTitle>
                <CardDescription>
                  粘贴/输入 CAS 或英文名（一行一个），然后点击"处理输入"按钮
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="1912-24-9&#10;Chlorpyrifos&#10;Malathion&#10;333-41-5&#10;Dichloromethane&#10;trans-1,2-Dichloroethylene&#10;Fenitrothion&#10;Parathion&#10;Parathion-methyl"
                  className="h-48 font-mono text-sm"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <Button
                    onClick={() => handleInputSubmit(inputText.split('\n'))}
                    disabled={loading || !inputText.trim()}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        处理输入
                      </>
                    )}
                  </Button>
                  <Button variant="outline" asChild disabled={loading}>
                    <label>
                      <Upload className="mr-2 h-4 w-4" />
                      上传 CSV
                      <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const text = event.target?.result as string;
                              setInputText(text);
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </Button>
                  <Button variant="ghost" onClick={() => setInputText('')}>
                    清空
                  </Button>
                </div>

                {normalized.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex gap-6 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="font-medium">命中 {normalized.length}</span>
                      </div>
                      {unmatched.length > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span>未匹配 {unmatched.length}</span>
                          </div>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            查看缺口报告
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {normalized.length > 0 && (
              <div className="flex justify-end">
                <Button onClick={() => setStep('path')} size="lg">
                  下一步
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'path' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>选择生成路径</CardTitle>
                <CardDescription>
                  含 GC 方法（推荐）：上传 C7–C30 烷烃 RT，系统据 RI 计算本机 RT，导出后可直接上机。<br/>
                  Only MSD：先生成 Q1/Q3/CE 与方法指纹，不含 Retention Time，适合快速搭框架。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as GenerationMode)}>
                  <div className="flex items-start space-x-3 rounded-2xl border-2 p-4 hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="msdOnly" id="msdOnly" />
                    <div className="flex-1">
                      <Label htmlFor="msdOnly" className="flex items-center gap-2 font-medium cursor-pointer">
                        <Zap className="h-5 w-5 text-primary" />
                        仅 MSD 方法（跳过 GC）
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        先生成 Q1/Q3/CE，RT 可稍后补
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-2xl border-2 p-4 hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="withGC" id="withGC" />
                    <div className="flex-1">
                      <Label htmlFor="withGC" className="flex items-center gap-2 font-medium cursor-pointer">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        含 GC 方法（推荐）
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        选择 GC 方法 + 上传烷烃获取 RT
                      </p>
                    </div>
                  </div>
                </RadioGroup>

                {mode === 'withGC' && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">选择 GC 方法</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setMethodId('A-30m-CF')}
                        className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                          methodId === 'A-30m-CF'
                            ? 'border-primary ring-2 ring-primary/20 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-2">A-30m-CF</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>5% phenyl-methylpolysiloxane</div>
                          <div>30 m × 0.25 mm × 0.25 μm</div>
                          <div>1.0 mL/min (CF)</div>
                          <div className="text-xs">~40 min runtime</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setMethodId('A-15m-CF')}
                        className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                          methodId === 'A-15m-CF'
                            ? 'border-primary ring-2 ring-primary/20 shadow-md'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-2">A-15m-CF</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>5% phenyl-methylpolysiloxane</div>
                          <div>15 m × 0.25 mm × 0.25 μm</div>
                          <div>1.2 mL/min (CF)</div>
                          <div className="text-xs">~20 min runtime (Fast)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button onClick={() => setStep('input')} variant="outline">
                上一步
              </Button>
              <Button onClick={() => { handleBuild(); setStep('configure'); }} size="lg" disabled={loading}>
                下一步 & 构建方法
              </Button>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="space-y-6">
            {mode === 'withGC' && !calibrated && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  未上传烷烃标曲，Retention Time 将留空。可先导出 MSD 框架，稍后补齐。
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">控制面板</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">三点 CE 展开</label>
                      <input
                        type="checkbox"
                        checked={expandCE}
                        onChange={(e) => setExpandCE(e.target.checked)}
                        className="h-4 w-4"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Δ (eV)</label>
                      <input
                        type="number"
                        value={ceDelta}
                        onChange={(e) => setCeDelta(parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                        min="2"
                        max="6"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      方法：{methodId || 'MSD Only'}
                    </div>
                  </CardContent>
                </Card>

                {mode === 'withGC' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">烷烃标曲</CardTitle>
                      <CardDescription className="text-xs">
                        上传 C7-C30 可获得 RT_pred
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {!calibrated ? (
                        <>
                          <Textarea
                            placeholder="C7, 0.85&#10;C8, 1.20&#10;C9, 2.15&#10;C10, 3.45&#10;..."
                            value={alkaneText}
                            onChange={(e) => setAlkaneText(e.target.value)}
                            className="h-32 font-mono text-xs"
                          />
                          <Button onClick={handleCalibrate} disabled={loading || !alkaneText.trim()} size="sm" className="w-full">
                            应用标曲
                          </Button>
                        </>
                      ) : (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription>标曲已应用</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="lg:col-span-8">
                <ResultsTable rows={rows} />
              </div>
            </div>
          </div>
        )}
      </div>

      {step === 'configure' && rows.length > 0 && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t shadow-lg">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                合计: {rows.length} 行
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => handleExport('generic')} variant="outline" size="sm">
                  Generic CSV
                </Button>
                <Button onClick={() => handleExport('masshunter')} variant="outline" size="sm">
                  MassHunter CSV
                </Button>
                <Button onClick={() => handleExport('both')} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  导出全部格式
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
