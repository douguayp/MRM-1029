'use client';

import { useState } from 'react';
import { Family, GenerationMode, NormalizedCompound, BuildRow, AlkanePoint } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Download, AlertCircle, CheckCircle2, FileText, Info, FileDown } from 'lucide-react';
import { ResultsTable } from '@/components/features/ResultsTable';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

type Step = 'input' | 'path' | 'configure';

export default function Generator() {
  const [family, setFamily] = useState<Family>('Pesticides');
  const [step, setStep] = useState<Step>('input');
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [mode, setMode] = useState<GenerationMode>('withGC');
  const [methodId, setMethodId] = useState('CF40-LOCKABLE');
  const [normalized, setNormalized] = useState<NormalizedCompound[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [rows, setRows] = useState<BuildRow[]>([]);
  const [calibrated, setCalibrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [alkaneText, setAlkaneText] = useState('');
  const [expandCE, setExpandCE] = useState(true);
  const [ceDelta, setCeDelta] = useState(4);
  const [showGapReport, setShowGapReport] = useState(false);
  const [selectedMethodForExport, setSelectedMethodForExport] = useState<string>('');

  function markStepCompleted(stepToMark: Step) {
    if (!completedSteps.includes(stepToMark)) {
      setCompletedSteps([...completedSteps, stepToMark]);
    }
  }

  function goToStep(nextStep: Step) {
    setStep(nextStep);
  }

  const handleInputSubmit = async (queries: string[]) => {
    setLoading(true);
    try {
      const filtered = queries.filter(q => q.trim().length > 0);

      if (filtered.length === 0) {
        alert('Please enter at least one compound name or CAS number');
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
        alert('No matching compounds found, please check your input');
      } else {
        markStepCompleted('input');
        goToStep('path');
      }
    } catch (error) {
      console.error('Normalization error:', error);
      alert('Error processing input, please try again');
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
      const lines = alkaneText
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('#') && !l.toLowerCase().startsWith('alkane'));
      
      const alkanes: AlkanePoint[] = [];
      const parseErrors: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(/[,\t\s]+/).filter(p => p.trim());
        
        if (parts.length >= 2) {
          const name = parts[0].toUpperCase().trim();
          const rtStr = parts[1].replace(/,/g, '.');
          const rt = parseFloat(rtStr);
          
          if (!isNaN(rt) && rt > 0) {
            alkanes.push({ name, rt });
          } else {
            parseErrors.push(`Line ${i + 1}: Invalid RT value "${parts[1]}"`);
          }
        } else {
          parseErrors.push(`Line ${i + 1}: Invalid format "${line}"`);
        }
      }

      if (alkanes.length < 5) {
        const errorMsg = `Successfully parsed only ${alkanes.length} alkanes, need at least 5.\n\nParse errors:\n${parseErrors.slice(0, 5).join('\n')}${parseErrors.length > 5 ? '\n...' : ''}`;
        alert(errorMsg);
        setLoading(false);
        return;
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

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Calibration failed: ${errorData.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.mapped || !Array.isArray(data.mapped)) {
        alert('Calibration failed: Server returned invalid data format');
        setLoading(false);
        return;
      }

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
      alert(`RI calibration successful! Updated RT prediction values for ${data.mapped.length} compounds.`);
    } catch (error) {
      console.error('Calibration error:', error);
      alert(`Calibration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      markStepCompleted('configure');
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const downloadCSV = (content: string, filename: string) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMethod = async () => {
    if (!selectedMethodForExport) {
      alert('Please select a GC method to export');
      return;
    }

    try {
      const res = await fetch('/api/export-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          family,
          methodId: selectedMethodForExport
        })
      });

      const data = await res.json();

      if (data.csv) {
        downloadCSV(data.csv, `GC_Method_${selectedMethodForExport}.csv`);
      }
    } catch (error) {
      console.error('Export method error:', error);
      alert('GC method export failed');
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent = `Compound Name or CAS Number
Chlorpyrifos
1912-24-9
Malathion
Fenitrothion
Parathion
56-38-2`;
    
    downloadCSV(templateContent, 'compound_input_template.csv');
  };

  const handleDownloadAlkaneTemplate = () => {
    const alkaneTemplateContent = `Alkane,RT(min)
C8,2.466
C9,3.014
C10,3.513
C11,3.970
C12,4.400
C13,4.810
C14,5.210
C15,5.600
C16,5.980
C17,6.350
C18,6.720
C19,7.080
C20,7.430
C21,7.770
C22,8.110
C23,8.440
C24,8.770
C25,9.090
C26,9.410
C27,9.720
C28,10.030
C29,10.330
C30,10.630
C31,10.930
C32,11.220
C33,11.510
C34,11.790
C35,12.070`;
    
    downloadCSV(alkaneTemplateContent, 'alkane_calibration_template.csv');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 py-3 px-6">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
         
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="w-full flex gap-4 px-4 py-4">
          {/* Left Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="sticky top-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Categories</CardTitle>
                  <CardDescription className="text-sm">Select a family</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1.5">
                    <button
                      onClick={() => setFamily('Pesticides')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                        family === 'Pesticides'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Pesticides</span>
                        {family === 'Pesticides' && <CheckCircle2 className="h-4 w-4" />}
                      </div>                    </button>

                    <button
                      disabled
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-400 cursor-not-allowed"
                    >
                      <span>Environmental</span>
                    </button>
                     <button
                      disabled
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-400 cursor-not-allowed"
                    >
                      <span>Veterinary</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>

              <Card className="mt-3 shadow-sm bg-blue-50 border-blue-200">
                <CardContent className="pt-3">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                      <p className="font-semibold mb-1">About this tool</p>
                      <p>Generate GC-QQQ methods for multi-residue analysis with optimized MRM transitions.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 min-w-0">
            {/* Step Indicator */}
            <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => completedSteps.includes('input') && goToStep('input')}
                  className={`flex items-center gap-3 flex-1 text-left ${
                    completedSteps.includes('input') ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                  } transition-opacity`}
                  disabled={!completedSteps.includes('input') && step !== 'input'}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.includes('input') ? 'bg-green-500 text-white' :
                    step === 'input' ? 'bg-primary text-white ring-4 ring-primary/20' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {completedSteps.includes('input') ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-xl font-bold">1</span>}
                  </div>
                  <div>
                    <div className={`text-base font-semibold ${step === 'input' ? 'text-primary' : 'text-gray-700'}`}>
                      Enter Target Compounds
                    </div>
                    {completedSteps.includes('input') && step !== 'input' && (
                      <div className="text-xs text-gray-500">Click to Return</div>
                    )}
                  </div>
                </button>

                <svg className="w-8 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 32 16">
                  <path stroke="currentColor" strokeWidth="2" d="M0 8 L28 8 M22 2 L28 8 L22 14" />
                </svg>

                <button 
                  onClick={() => completedSteps.includes('path') && goToStep('path')}
                  className={`flex items-center gap-3 flex-1 text-left ${
                    completedSteps.includes('path') ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                  } transition-opacity`}
                  disabled={!completedSteps.includes('path') && step !== 'path'}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.includes('path') ? 'bg-green-500 text-white' :
                    step === 'path' ? 'bg-primary text-white ring-4 ring-primary/20' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {completedSteps.includes('path') ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-xl font-bold">2</span>}
                  </div>
                  <div>
                    <div className={`text-base font-semibold ${step === 'path' ? 'text-primary' : 'text-gray-700'}`}>
                      Select Generation Path
                    </div>
                    {completedSteps.includes('path') && step !== 'path' && (
                      <div className="text-xs text-gray-500">Click to Return</div>
                    )}
                  </div>
                </button>

                <svg className="w-8 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 32 16">
                  <path stroke="currentColor" strokeWidth="2" d="M0 8 L28 8 M22 2 L28 8 L22 14" />
                </svg>

                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedSteps.includes('configure') ? 'bg-green-500 text-white' :
                    step === 'configure' ? 'bg-primary text-white ring-4 ring-primary/20' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {completedSteps.includes('configure') ? <CheckCircle2 className="h-6 w-6" /> : <span className="text-xl font-bold">3</span>}
                  </div>
                  <div className="text-left">
                    <div className={`text-base font-semibold ${step === 'configure' ? 'text-primary' : 'text-gray-700'}`}>
Configure and Export
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-6">
              {/* STEP 1: INPUT */}
              {step === 'input' && (
                <div className="space-y-6">
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-lg font-medium mb-3 block">
                            Paste/Input (CAS or Name; one per line)
                          </label>
                          <Textarea
                            placeholder={"1912-24-9\nChlorphyrifos\nMalathion\nFenitrothion\nParathion\n56-38-2"}
                            className="h-48 font-mono text-lg"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-lg text-gray-600">Or Upload CSV</span>
                          <Button variant="outline" size="default" asChild disabled={loading}>
                            <label className="cursor-pointer">
                              Select File
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
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-base h-auto p-0"
                            onClick={handleDownloadTemplate}
                          >
                            (Template Download)
                          </Button>
                        </div>

                        {normalized.length > 0 && (
                          <div className="p-4 bg-muted/50 rounded-lg border">
                            <div className="flex gap-4 text-lg text-gray-600 items-center flex-wrap">
                              <span className="font-medium">Validation Results:</span>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span>Matched {normalized.length}</span>
                              </div>
                              {unmatched.length > 0 && (
                                <>
                                  <div className="flex items-center gap-1.5">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    <span>Unmatched {unmatched.length}</span>
                                  </div>
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-primary text-lg font-medium"
                                    onClick={() => setShowGapReport(true)}
                                  >
                                    View Gap Report
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setInputText('')}
                    >
                      Clear
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => {
                        if (normalized.length > 0) {
                          markStepCompleted('input');
                          goToStep('path');
                        } else {
                          handleInputSubmit(inputText.split('\n'));
                        }
                      }}
                      disabled={loading || !inputText.trim()}
                    >
                      {loading ? 'Processing...' : normalized.length > 0 ? 'Next' : 'Process Input and Next'}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: PATH */}
              {step === 'path' && (
                <div className="space-y-6">
                  <Card className="rounded-2xl shadow-sm">
                    <CardContent className="pt-6 space-y-6">
                      <RadioGroup value={mode} onValueChange={(v) => setMode(v as GenerationMode)}>
                        <div
                          className={`flex items-start space-x-3 rounded-2xl border p-4 cursor-pointer transition ${
                            mode === 'msdOnly' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-border hover:shadow'
                          }`}
                          onClick={() => setMode('msdOnly')}
                        >
                          <RadioGroupItem value="msdOnly" id="msdOnly" className="mt-1" />
                          <div className="flex-1">
                          <Label htmlFor="msdOnly" className="text-xl font-semibold cursor-pointer">
                             MSD Only Method (Skip GC)
                           </Label>
                            <p className="text-lg text-gray-600 mt-2">
                              Generate Q1/Q3/CE first, RT can be added later
                            </p>
                          </div>
                        </div>

                        <div
                          className={`flex items-start space-x-3 rounded-2xl border p-4 cursor-pointer transition ${
                            mode === 'withGC' ? 'border-blue-500 ring-2 ring-blue-500' : 'border-border hover:shadow'
                          }`}
                          onClick={() => setMode('withGC')}
                        >
                          <RadioGroupItem value="withGC" id="withGC" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="withGC" className="text-xl font-semibold cursor-pointer">
                              With GC Method (Recommended)
                            </Label>
                            <p className="text-lg text-gray-600 mt-2">
                              Select GC Method + Upload Alkanes for RT
                            </p>
                          </div>
                        </div>
                      </RadioGroup>

                      {mode === 'withGC' && (
                        <div className="pt-4 border-t">
                          <h3 className="text-xl font-semibold mb-4">Select GC Method (Visible when with GC)</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Method 1: CF40-LOCKABLE */}
                            <div
                              onClick={() => setMethodId('CF40-LOCKABLE')}
                              className={`rounded-2xl border p-5 cursor-pointer transition ${
                                methodId === 'CF40-LOCKABLE'
                                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                  : 'border-border hover:shadow'
                              }`}
                            >
                              <div className="font-bold text-2xl mb-3 text-gray-800">
                                Constant Flow Mode (~40min)
                              </div>
                              <div className="text-sm text-gray-500 mb-3 italic">CF-40 Equivalent (~40.5 min), Series 2×15 m, Backflush-capable</div>
                              <div className="space-y-2 text-gray-600">
                                <div className="text-base">
                                  <span className="font-semibold">色谱柱:</span> 2×15 m × 0.25 mm × 0.25 μm (串联)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">固定相:</span> 5% phenyl-methylpolysiloxane
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">载气:</span> He, 1.0 mL/min (柱1) + 1.2 mL/min (柱2)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">进样:</span> Splitless (Hot 280°C)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">反吹:</span> <span className="text-green-600">✓ Post-run</span> (5 min @ 310°C)
                                </div>
                                <div className="text-base border-t pt-2 mt-2">
                                  <span className="font-semibold">温度程序:</span>
                                  <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">
                                    60°C(1)→40°C/min→120; 5°C/min→310
                                  </div>
                                </div>
                                <div className="text-base font-medium text-blue-600 pt-2">
                                  运行时间: ~40.5 min
                                </div>
                                <div className="text-sm text-gray-500 pt-2 border-t mt-2">
                                  <span className="font-semibold">建议RTL:</span> Chlorpyrifos-methyl（CAS：5598-13-0）：18.111 min
                                </div>
                              </div>
                            </div>

                            {/* Method 2: STD-CF-40 */}
                            <div
                              onClick={() => setMethodId('STD-CF-40')}
                              className={`rounded-2xl border p-5 cursor-pointer transition ${
                                methodId === 'STD-CF-40'
                                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                  : 'border-border hover:shadow'
                              }`}
                            >
                              <div className="font-bold text-2xl mb-3 text-gray-800">STD-CF-40</div>
                              <div className="text-sm text-gray-500 mb-3 italic">Standard Separation — Constant Flow</div>
                              <div className="space-y-2 text-gray-600">
                                <div className="text-base">
                                  <span className="font-semibold">色谱柱:</span> 30 m × 0.25 mm × 0.25 μm
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">固定相:</span> 5% phenyl-methylpolysiloxane
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">载气:</span> He, 1.0 mL/min (恒流)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">进样:</span> Splitless (260°C, 1.0 min)
                                </div>
                                <div className="text-base border-t pt-2 mt-2">
                                  <span className="font-semibold">温度程序:</span>
                                  <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">
                                    70°C(1)→25°C/min→150; 3°C/min→200; 8°C/min→300(5)
                                  </div>
                                </div>
                                <div className="text-base font-medium text-blue-600 pt-2">
                                  运行时间: ~40 min | RI 支持: C8–C35
                                </div>
                              </div>
                            </div>

                            {/* Method 3: FAST-CF-20 */}
                            <div
                              onClick={() => setMethodId('FAST-CF-20')}
                              className={`rounded-2xl border p-5 cursor-pointer transition ${
                                methodId === 'FAST-CF-20'
                                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                  : 'border-border hover:shadow'
                              }`}
                            >
                              <div className="font-bold text-2xl mb-3 text-gray-800">FAST-CF-20</div>
                              <div className="text-sm text-gray-500 mb-3 italic">Fast Screening — Constant Flow</div>
                              <div className="space-y-2 text-gray-600">
                                <div className="text-base">
                                  <span className="font-semibold">色谱柱:</span> 15 m × 0.25 mm × 0.25 μm
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">固定相:</span> 5% phenyl-methylpolysiloxane
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">载气:</span> He, 1.2 mL/min (恒流)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">进样:</span> Splitless (260°C, 0.75 min)
                                </div>
                                <div className="text-base border-t pt-2 mt-2">
                                  <span className="font-semibold">温度程序:</span>
                                  <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">
                                    70°C(0.5)→40°C/min→180; 10°C/min→300(2.5)
                                  </div>
                                </div>
                                <div className="text-base font-medium text-blue-600 pt-2">
                                  运行时间: ~20 min | RI 支持: C8–C35
                                </div>
                              </div>
                            </div>

                            {/* Method 4: CP-40 */}
                            <div
                              onClick={() => setMethodId('CP-40')}
                              className={`rounded-2xl border p-5 cursor-pointer transition ${
                                methodId === 'CP-40'
                                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                  : 'border-border hover:shadow'
                              }`}
                            >
                              <div className="font-bold text-2xl mb-3 text-gray-800">CP-40</div>
                              <div className="text-sm text-gray-500 mb-3 italic">Standard Separation — Constant Pressure</div>
                              <div className="space-y-2 text-gray-600">
                                <div className="text-base">
                                  <span className="font-semibold">色谱柱:</span> 30 m × 0.25 mm × 0.25 μm
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">固定相:</span> 5% phenyl-methylpolysiloxane
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">载气:</span> He, 10.0 psi (恒压)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">进样:</span> Splitless (260°C, 1.0 min)
                                </div>
                                <div className="text-base border-t pt-2 mt-2">
                                  <span className="font-semibold">温度程序:</span>
                                  <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">
                                    70°C(1)→25°C/min→150; 3°C/min→200; 8°C/min→300(5)
                                  </div>
                                </div>
                                <div className="text-base font-medium text-blue-600 pt-2">
                                  运行时间: ~40 min | RI 支持: C8–C35
                                </div>
                              </div>
                            </div>

                            {/* Method 5: CF-5x15 */}
                            <div
                              onClick={() => setMethodId('CF-5x15')}
                              className={`rounded-2xl border p-5 cursor-pointer transition ${
                                methodId === 'CF-5x15'
                                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                  : 'border-border hover:shadow'
                              }`}
                            >
                              <div className="font-bold text-2xl mb-3 text-gray-800">CF-5x15</div>
                              <div className="text-sm text-gray-500 mb-3 italic">Constant Flow with Backflush (series 2×15 m)</div>
                              <div className="space-y-2 text-gray-600">
                                <div className="text-base">
                                  <span className="font-semibold">色谱柱:</span> 2×15 m × 0.25 mm × 0.25 μm (串联)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">固定相:</span> 5% phenyl-methylpolysiloxane
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">载气:</span> He, 1.0 mL/min (恒流)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">进样:</span> Splitless (280°C, 0.75 min)
                                </div>
                                <div className="text-base">
                                  <span className="font-semibold">反吹:</span> <span className="text-green-600">✓ 开启</span> (5 min @ 310°C)
                                </div>
                                <div className="text-base border-t pt-2 mt-2">
                                  <span className="font-semibold">温度程序:</span>
                                  <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">
                                    60°C(1)→40°C/min→120; 5°C/min→310
                                  </div>
                                </div>
                                <div className="text-base font-medium text-blue-600 pt-2">
                                  适用于复杂基质 | RI 支持: C8–C35
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="outline" size="lg" onClick={() => goToStep('input')}>
                    <Button variant="outline" size="lg" onClick={() => goToStep('input')}>
                      Previous
                    </Button>
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => {
                        markStepCompleted('path');
                        handleBuild();
                        goToStep('configure');
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Building...' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: CONFIGURE */}
              {step === 'configure' && (
                <div className="space-y-6">
                  {mode === 'withGC' && !calibrated && (
                    <Alert className="border-orange-200 bg-orange-50/50 rounded-2xl">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                      <AlertDescription className="text-lg">
                        <strong>[含 GC 状态条]</strong> 未标定 | 上传 C7–C30 可获得 RT_pred<br/>
                        <span className="text-base text-gray-600">覆盖范围: –</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-3 md:col-span-12 space-y-4">
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">控制面板</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-base">
                          <div className="flex items-center justify-between">
                            <label className="font-medium">三点 CE 展开</label>
                            <Switch checked={expandCE} onCheckedChange={setExpandCE} />
                          </div>
                          <div className="space-y-2">
                            <label className="font-medium block">Δ (eV):</label>
                            <Input
                              type="number"
                              value={ceDelta}
                              onChange={(e) => setCeDelta(parseInt(e.target.value) || 4)}
                              className="w-20"
                              min="2"
                              max="6"
                            />
                          </div>
                          <Separator />
                          <div className="text-sm text-gray-600">
                            方法：{methodId || 'MSD Only'}
                          </div>
                        </CardContent>
                      </Card>

                      {mode === 'withGC' && (
                        <Card className="shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">RI 标定（正构烷烃 C8–C35）</CardTitle>
                            <CardDescription className="text-sm">
                              在当前 GC 方法下输入正构烷烃（C8–C35）的保留时间（RT）。系统将基于数据库提供的 RI（保留指数）完成 RI→RT 映射标定，并计算目标化合物的 预测保留时间 RT_pred 与建议时间窗。
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {!calibrated ? (
                              <>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                                  <div className="text-xs text-blue-800 mb-1 font-semibold">格式说明：</div>
                                  <div className="text-xs text-blue-700 space-y-0.5 font-mono">
                                    <div>• 每行: 碳数, RT (如 C7, 0.85)</div>
                                    <div>• 建议至少 5 个烷烃</div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm text-gray-700 font-medium block mb-1.5">
                                    Manual RI Calibration Data Input
                                  </label>
                                  <Textarea
                                    placeholder={"C8,  2.466\nC9,  3.014\nC10, 3.513\nC11, 3.970"}
                                    value={alkaneText}
                                    onChange={(e) => setAlkaneText(e.target.value)}
                                    className="h-24 font-mono text-xs"
                                  />
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-sm text-gray-600">Or Upload CSV</span>
                                  <Button variant="outline" size="sm" asChild>
                                    <label className="cursor-pointer">
                                      Select File
                                      <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                              const text = event.target?.result as string;
                                              setAlkaneText(text);
                                            };
                                            reader.readAsText(file);
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                  </Button>
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="text-xs h-auto p-0"
                                    onClick={handleDownloadAlkaneTemplate}
                                  >
                                    (Template Download)
                                  </Button>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={handleCalibrate}
                                    disabled={loading || !alkaneText.trim()}
                                    size="sm"
                                    className="flex-1"
                                  >
                                    Apply Calibration
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setAlkaneText('')}
                                    size="sm"
                                  >
                                    Clear
                                    size="sm"
                                    className="flex-1"
                                  >
Apply Calibration
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setAlkaneText('')}
                                    size="sm"
                                  >
                                    清除
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <Alert className="border-green-200 bg-green-50">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-xs">Calibration Applied</AlertDescription>
                              </Alert>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div className="lg:col-span-9 md:col-span-12">
                      <Card className="rounded-2xl shadow-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Generated Method Transitions</CardTitle>
                            <div className="text-base text-gray-600">
                              搜索/筛选/列显隐
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {rows.length > 0 ? (
                            <>
                              <div className="max-h-[600px] overflow-y-auto">
                                <ResultsTable rows={rows} />
                              </div>
                              <div className="mt-4 text-lg text-gray-600 font-medium">
                                合计: {rows.length} 行
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="text-lg">暂无数据</p>
                              <p className="text-base mt-2">请先完成前两步操作</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      onClick={() => goToStep('path')}
                      className="gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    <Button variant="outline" size="lg" onClick={() => goToStep('input')}>
                      Previous
                    </Button>
                    </Button>
                    <span className="text-sm text-gray-500">重新选择方法或参数</span>
                  </div>
                </div>
              )}

              {/* Export Bar */}
              {step === 'configure' && rows.length > 0 && (
                <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 p-5 shadow-lg">
                  <div className="container mx-auto max-w-6xl space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="text-lg font-semibold text-gray-700">
                        Export Transitions
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg text-gray-600 mr-2">Select Format:</span>
                        <Button onClick={() => handleExport('generic')} variant="outline" size="lg" className="font-medium">
                          Generic CSV
                        </Button>
                        <Button onClick={() => handleExport('masshunter')} variant="outline" size="lg" className="font-medium">
                          Vendor-A Compatible
                        </Button>
                        <Button onClick={() => handleExport('both')} size="lg" className="font-medium">
                          Export All
                        </Button>
                        {unmatched.length > 0 && (
                          <>
                            <Separator orientation="vertical" className="h-6 mx-2" />
                            <Button variant="link" size="default" onClick={() => setShowGapReport(true)} className="text-primary hover:text-primary/80 text-lg">
                              View Gap Report ({unmatched.length})
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="text-lg font-semibold text-gray-700">
                        Export GC Method Parameters
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg text-gray-600 mr-2">Select Method:</span>
                        <select
                          value={selectedMethodForExport}
                          onChange={(e) => setSelectedMethodForExport(e.target.value)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">-- Select Method --</option>
                          <option value="CF40-LOCKABLE">CF40-LOCKABLE (恒流模式约40min)</option>
                          <option value="STD-CF-40">STD-CF-40 (标准分离~40min)</option>
                          <option value="FAST-CF-20">FAST-CF-20 (快速筛查~20min)</option>
                          <option value="CP-40">CP-40 (恒压模式~40min)</option>
                          <option value="CF-5x15">CF-5x15 (快速5层~15min)</option>
                        </select>
                        <Button 
                          onClick={handleExportMethod} 
                          variant="default" 
                          size="lg" 
                          className="font-medium"
                          disabled={!selectedMethodForExport}
                        >
                          <FileDown className="h-5 w-5 mr-2" />
                          Export Method
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Gap Report Sheet */}
      <Sheet open={showGapReport} onOpenChange={setShowGapReport}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Gap Report</SheetTitle>
            <SheetDescription>
              Compounds not found in the database
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {unmatched.length > 0 ? (
              <>
                <div className="space-y-2">
                  {unmatched.map((item, idx) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg text-sm">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium break-all">{item}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            未匹配到数据库记录
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Complete Gap Report CSV
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <p>All compounds matched</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

