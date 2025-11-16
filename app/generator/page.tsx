'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
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
  const [methods, setMethods] = useState<Record<string, any>>({});

  // New states for validation handling
  const [matchedCompounds, setMatchedCompounds] = useState<NormalizedCompound[]>([]);
  const [unmatchedCompounds, setUnmatchedCompounds] = useState<string[]>([]);
  const [validationSummary, setValidationSummary] = useState<{total: number; matched: number} | null>(null);
  const [showValidationResults, setShowValidationResults] = useState(false);

  // Reference for textarea focusing
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load available methods
  const loadAvailableMethods = async () => {
    try {
      const response = await fetch('/api/methods');
      if (!response.ok) throw new Error('Methods loading failed');

      const data = await response.json();
      setMethods(data.Pesticides || {});
      console.log('Loaded Pesticide methods:', data.Pesticides);
    } catch (error) {
      console.error('Error loading methods:', error);
      // Fallback - Keep using default if loading fails
    }
  };

  // Helper function to render a single method card with summary
  const renderMethodCard = (methodId: string, config: any) => {
    if (!config) return null;

    // Create summary line from method config
    const summaryItems = [
      config.run_time_min ? { key: "Runtime", value: `~${config.run_time_min.toFixed(1)} min` } : null,
      config.flow_mode ? { key: "Mode", value: config.flow_mode } : null,
      config.backflush ? { key: "Backflush", value: "✓ Enabled" } : { key: "Backflush", value: "—" },
      config.rt_lock?.enabled ? { key: "RTL", value: "Supported" } : { key: "RTL", value: "—" }
    ].filter(item => item !== null);

    const summaryText = summaryItems.map((item: any) => `${item.key}: ${item.value}`).join(" · ");

    return (
      <div
        key={methodId}
        onClick={() => setMethodId(methodId)}
        className={`rounded-2xl border p-5 cursor-pointer transition ${
          methodId === methodId ? 'border-blue-500 ring-2 ring-blue-500 shadow-md' : 'border-border hover:shadow'
        }`}
      >
        <div className="font-bold text-lg mb-3 text-gray-800">{methodId} — {config.label}</div>

        {summaryText && (
          <div className="text-xs text-gray-500 mb-3">{summaryText}</div>
        )}

        <div className="space-y-2 text-gray-600">
          <div className="text-base"><span className="font-semibold">Column:</span> {config.column_geometry}</div>
          <div className="text-base"><span className="font-semibold">Phase:</span> {config.column_phase_group}</div>
          <div className="text-base"><span className="font-semibold">Carrier:</span>
            {config.carrier} {config.flow_mode}
            {config.flow_rate ? `${config.flow_rate.toFixed(1)}${config.flow_mode.includes('Pressure') ? ' psi' : ' mL/min'}` : ''}
            {config.flow_rate_col2 ? ` + ${config.flow_rate_col2.toFixed(1)} (Col2)` : ''}
          </div>
          <div className="text-base"><span className="font-semibold">Inlet:</span> {config.inlet_mode}</div>
          {config.liner && <div className="text-base"><span className="font-semibold">Liner:</span> {config.liner}</div>}
          {config.backflush && <div className="text-base"><span className="font-semibold">Backflush:</span> <span className="text-green-600">✓ Available</span></div>}

          <div className="text-base border-t pt-2 mt-2">
            <span className="font-semibold">Oven Program:</span>
            <div className="text-sm mt-1 font-mono bg-gray-50 p-2 rounded">{config.oven_program}</div>
          </div>

          {config.run_time_min && <div className="text-base text-blue-600 pt-2">
            Run time: ~{config.run_time_min} min
          </div>}

          {config.rt_lock?.enabled && (
            <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="font-medium text-green-800">RETENTION TIME LOCKING (RTL):</div>
              <div className="text-sm text-green-700 mt-1"><span className="font-semibold">Reference Compound:</span> {config.rt_lock.lock_compound} ({config.rt_lock.target_rt_min} min ±{config.rt_lock.tolerance_min} min)</div>
              <div className="text-sm text-green-700"><span className="font-semibold">Mode:</span> {config.rt_lock.mode_hint || 'N/A'}</div>
              <div className="text-xs text-green-600 mt-1">{config.rt_lock.note || 'RT locking available for enhanced retention time accuracy.'}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadAvailableMethods();
  }, []); // Load only once on mount

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

  // New validation handler for Step 1 - only validates, never progresses
  const handleValidate = async () => {
    setLoading(true);
    const queries = inputText.split('\n').filter(q => q.trim().length > 0);

    if (queries.length === 0) {
      alert('Please enter at least one compound name or CAS number');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ family, query: queries })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const results = data.results || [];
      const unmatched = data.unmatched || [];

      setMatchedCompounds(results);
      setUnmatchedCompounds(unmatched);
      setValidationSummary({ total: queries.length, matched: results.length });

      // Update the main normalized state for use in step 2
      setNormalized(results);

      // Show validation results panel regardless of outcome
      setShowValidationResults(true);

    } catch (error) {
      console.error('Validation error:', error);
      alert('Error validation input, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Edit input" button
  const handleEditInput = () => {
    // Focus on the textarea for editing
    textareaRef?.current?.focus();
    // Also close the validation results panel since user is editing
    setShowValidationResults(false);
  };

  // Handle "Continue with matched compounds only" button
  const handleContinueWithMatched = () => {
    if (matchedCompounds.length === 0) {
      alert('No compounds to continue with');
      return;
    }

    // Use matched compounds for step 2
    setNormalized(matchedCompounds);
    markStepCompleted('input');
    goToStep('path');
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

  // Determine if we have validation results (either matched or unmatched compounds)
  const hasValidationResult = showValidationResults || matchedCompounds.length > 0 || unmatchedCompounds.length > 0;

  // Handle compound click to highlight in textarea
  const handleCompoundClick = (compound: string) => {
    if (!textareaRef?.current) return;

    const textLines = inputText.split('\n').map(line => line.trim());
    const targetLine = textLines.find(line => line === compound || line.trim() === compound.trim());

    if (targetLine) {
      const lineIndex = textLines.findIndex(line => line === targetLine);
      const charsBeforeIndex = textLines.slice(0, lineIndex).join('\n').length;
      const lineLength = targetLine.length;

      // Focus the textarea and select the line
      textareaRef.current.focus();

      // Small delay to ensure focus is set, then select and scroll
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(charsBeforeIndex, charsBeforeIndex + lineLength);
          textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
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
          <aside className="w-72 flex-shrink-0">
            <div className="sticky top-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2 relative">
                  <div className="flex items-center gap-2">
                    <CardTitle className="app-section-title">Target Categories</CardTitle>
                    <span data-tip="Select an analyte category" className="relative cursor-help inline-flex items-center group">
                      <Info className="h-3.5 w-3.5 text-gray-500 hover:text-gray-700 transition-colors" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-1.5">
                    <button
                      onClick={() => setFamily('Pesticides')}
                      className={clsx(
                        'app-nav-button',
                        family === 'Pesticides'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-transparent text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>Pesticide Residues</span>
                        {family === 'Pesticides' && <CheckCircle2 className="h-4 w-4" />}
                      </div>                    </button>

                    <button
                      onClick={() => setFamily('Environmental')}
                      className={clsx(
                        'app-nav-button',
                        family === 'Environmental'
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-transparent text-slate-700 hover:bg-slate-100'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>Environmental Contaminants</span>
                        {family === 'Environmental' && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                    </button>
                     <button
                      disabled
                      className="app-nav-button bg-gray-50 text-gray-400 cursor-not-allowed flex items-center justify-between"
                    >
                      <span>Veterinary Drug Residues</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Updating
                      </span>
                    </button>
                  </nav>
                </CardContent>
              </Card>

              <Card className="mt-3 shadow-sm border-gray-100 bg-white/50">
                <CardContent className="pt-2">
                  <div className="text-[11px] text-muted-foreground">
                    <p
                      className="font-semibold mb-0 text-slate-700 cursor-help hover:text-slate-900 transition-colors"
                      title="Generate GC-QQQ MRM transition tables for multi-residue analysis."
                    >
                      About this tool
                    </p>
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
                      Select Transition Generation Path
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
Configure Method and Export
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
                          <label className="app-label mb-3 block">
                            Paste or type CAS numbers or compound names (one per line)
                          </label>
                          <Textarea
                            ref={textareaRef}
                            placeholder={"1912-24-9\nChlorphyrifos\nMalathion\nFenitrothion\nParathion\n56-38-2"}
                            className="h-48 font-mono text-sm app-textarea"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="app-muted-text">Or upload CSV file</span>
                            <Button variant="outline" size="default" asChild disabled={loading} title="CSV must contain a single column with CAS numbers or compound names.">
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
                              Download CSV template
                            </Button>
                            <span className="text-sm text-gray-400 ml-1">One compound per line · Name or CAS · UTF-8 CSV</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="default"
                              onClick={() => setInputText('')}
                              disabled={loading}
                            >
                              Clear
                            </Button>
                            <Button
                              variant="default"
                              size="default"
                              onClick={() => {
                                handleValidate();
                              }}
                              disabled={loading}
                            >
                              Validate
                            </Button>
                          </div>
                        </div>

                        {normalized.length > 0 && (
                          <div className="p-4 bg-muted/50 rounded-lg border">
                            <div className="flex gap-4 items-center flex-wrap">
                              <span className="app-label">Validation Results</span>
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
                                    className="h-auto p-0 text-primary font-medium"
                                    onClick={() => setShowGapReport(true)}
                                  >
                                    View Gap Report
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* New Validation Results Section */}
                        {showValidationResults && validationSummary && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-blue-800 font-medium flex items-center gap-4">
                                <span>VALIDATION RESULTS</span>
                                <span className="text-green-600 flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  {validationSummary.matched} matched
                                </span>
                                {validationSummary.total - validationSummary.matched > 0 && (
                                  <span className="text-orange-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    {validationSummary.total - validationSummary.matched} not found
                                  </span>
                                )}
                                <span className="text-gray-500">({validationSummary.total} total)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowValidationResults(false)}
                                className="h-auto p-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </Button>
                            </div>

                            <div className="text-sm text-blue-700 mb-3">
                              Unmatched compounds ({unmatchedCompounds.length})
                            </div>

                            <div className="max-h-32 overflow-y-auto mb-3 bg-white rounded p-3 text-sm border">
                              {unmatchedCompounds.map((compound, index) => (
                                <div
                                  key={index}
                                  className="text-gray-700 mb-1 last:mb-0 cursor-pointer hover:bg-blue-50 hover:text-blue-700 p-1 rounded transition-colors"
                                  onClick={() => handleCompoundClick(compound)}
                                  title="Click to highlight this compound in the input"
                                >
                                  • {compound}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleEditInput}
                    >
                      Edit input
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleContinueWithMatched}
                      disabled={loading || matchedCompounds.length === 0}
                    >
                      Continue with matched compounds only
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
                          <Label htmlFor="msdOnly" className="text-base font-semibold cursor-pointer">
                             MSD Only Method (Skip GC)
                           </Label>
                            <p className="text-sm text-gray-600 mt-2">
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
                            <Label htmlFor="withGC" className="text-base font-semibold cursor-pointer">
                              With GC Method (Recommended)
                            </Label>
                            <p className="text-sm text-gray-600 mt-2">
                              Select GC Method + Upload Alkanes for RT
                            </p>
                          </div>
                        </div>
                      </RadioGroup>

                      {mode === 'withGC' && (
                        <div className="pt-4 border-t">
                          <h3 className="text-lg font-semibold mb-4">Select GC Method</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {methods['CF40-LOCKABLE'] ? renderMethodCard('CF40-LOCKABLE', methods['CF40-LOCKABLE']) : (
                              // Fallback static rendering if methods not loaded yet
                              <div
                                onClick={() => setMethodId('CF40-LOCKABLE')}
                                className={`rounded-2xl border p-5 cursor-pointer transition ${
                                  methodId === 'CF40-LOCKABLE'
                                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                    : 'border-border hover:shadow'
                                }`}
                              >
                                <div className="font-bold text-lg mb-3 text-gray-800">CF40-LOCKABLE
                                </div>
                                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                                  <div className="font-medium text-green-800">RETENTION TIME LOCKING (RTL):</div>
                                  <div className="text-sm text-green-700 mt-1"><span className="font-semibold">Reference Compound:</span> Chlorpyrifos-methyl (18.111 min ±0.15 min)</div>
                                  <div className="text-sm text-green-700"><span className="font-semibold">Mode:</span> Standard CI</div>
                                  <div className="text-xs text-green-600 mt-1">RT locking available for enhanced retention time accuracy.</div>
                                </div>
                              </div>
                            )}

                            {methods['CF21-FAST-2x15'] ? renderMethodCard('CF21-FAST-2x15', methods['CF21-FAST-2x15']) : (
                              <div
                                onClick={() => setMethodId('CF21-FAST-2x15')}
                                className={`rounded-2xl border p-5 cursor-pointer transition ${
                                  methodId === 'CF21-FAST-2x15'
                                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                    : 'border-border hover:shadow'
                                }`}
                              >
                                <div className="font-bold text-lg mb-3 text-gray-800">CF21-FAST-2x15</div>
                                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                                  <div className="font-medium text-green-800">RETENTION TIME LOCKING (RTL):</div>
                                  <div className="text-sm text-green-700 mt-1"><span className="font-semibold">Reference Compound:</span> Chlorpyrifos-methyl (9.143 min ±0.15 min)</div>
                                  <div className="text-sm text-green-700"><span className="font-semibold">Mode:</span> Standard CI</div>
                                  <div className="text-xs text-green-600 mt-1">RT locking available for enhanced retention time accuracy.</div>
                                </div>
                              </div>
                            )}

                            {methods['CF20-SV-5x15'] ? renderMethodCard('CF20-SV-5x15', methods['CF20-SV-5x15']) : (
                              <div
                                onClick={() => setMethodId('CF20-SV-5x15')}
                                className={`rounded-2xl border p-5 cursor-pointer transition ${
                                  methodId === 'CF20-SV-5x15'
                                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                    : 'border-border hover:shadow'
                                }`}
                              >
                                <div className="font-bold text-lg mb-3 text-gray-800">CF20-SV-5x15</div>
                                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                                  <div className="font-medium text-green-800">RETENTION TIME LOCKING (RTL):</div>
                                  <div className="text-sm text-green-700 mt-1"><span className="font-semibold">Reference Compound:</span> Chlorpyrifos-methyl (8.524 min ±0.15 min)</div>
                                  <div className="text-sm text-green-700"><span className="font-semibold">Mode:</span> Standard CI</div>
                                  <div className="text-xs text-green-600 mt-1">RT locking available for enhanced retention time accuracy.</div>
                                </div>
                              </div>
                            )}

                            {methods['CP42-30m-BF'] ? renderMethodCard('CP42-30m-BF', methods['CP42-30m-BF']) : (
                              <div
                                onClick={() => setMethodId('CP42-30m-BF')}
                                className={`rounded-2xl border p-5 cursor-pointer transition ${
                                  methodId === 'CP42-30m-BF'
                                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-md'
                                    : 'border-border hover:shadow'
                                }`}
                              >
                                <div className="font-bold text-lg mb-3 text-gray-800">CP42-30m-BF</div>
                                <div className="mt-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                                  <div className="font-medium text-green-800">RETENTION TIME LOCKING (RTL):</div>
                                  <div className="text-sm text-green-700 mt-1"><span className="font-semibold">Reference Compound:</span> Chlorpyrifos-methyl (16.593 min ±0.15 min)</div>
                                  <div className="text-sm text-green-700"><span className="font-semibold">Mode:</span> Standard CI</div>
                                  <div className="text-xs text-green-600 mt-1">RT locking available for enhanced retention time accuracy.</div>
                                </div>
                              </div>
                            )}


                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="outline" size="lg" onClick={() => goToStep('input')}>
                      Previous
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
                        <strong>[Contains GC Status Bar]</strong> Uncalibrated | Upload C7–C30 to get RT_pred<br/>
                        <span className="text-base text-gray-600">Coverage Range: –</span>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-3 md:col-span-12 space-y-4">
                      <Card className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Control Panel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-base">
                          <div className="flex items-center justify-between">
                            <label className="font-medium">CE Expansion</label>
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
                            Method: {methodId || 'MSD Only'}
                          </div>
                        </CardContent>
                      </Card>

                      {mode === 'withGC' && (
                        <Card className="shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">RI Calibration (n-Alkanes C8–C35)</CardTitle>
                            <CardDescription className="text-sm">
                              Enter retention times (RT) for n-alkanes (C8–C35) under the current GC method. The system will complete RI→RT mapping calibration based on RI (retention index) from the database, and calculate predicted retention time RT_pred and suggested time windows for target compounds.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {!calibrated ? (
                              <>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                                  <div className="text-xs text-blue-800 mb-1 font-semibold">Format:</div>
                                  <div className="text-xs text-blue-700 space-y-0.5 font-mono">
                                    <div>• Per line: carbon number, RT (e.g. C7, 0.85)</div>
                                    <div>• At least 5 alkanes recommended</div>
                                  </div>
                                </div>

                                <div>
                                  <label className="app-label block mb-1.5">
                                    Manual RI Calibration Data Input
                                  </label>
                                  <Textarea
                                    placeholder={"C8,  2.466\nC9,  3.014\nC10, 3.513\nC11, 3.970"}
                                    value={alkaneText}
                                    onChange={(e) => setAlkaneText(e.target.value)}
                                    className="h-24 font-mono text-sm app-textarea"
                                  />
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="app-muted-text">Or Upload CSV</span>
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
                                    className="flex-1"
                                  >
Clear
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
                              Search/Filter/Column Show
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
                                Total: {rows.length} rows
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p className="text-lg">No data</p>
                              <p className="text-base mt-2">Complete steps 1 and 2 first</p>
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
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">Reselect method or parameters</span>
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
                          <option value="CF40-LOCKABLE">CF40-LOCKABLE</option>
                          <option value="STD-CF-40">STD-CF-40</option>
                          <option value="FAST-CF-20">FAST-CF-20</option>
                          <option value="CP-40">CP-40</option>
                          <option value="CF-5x15">CF-5x15</option>
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
                            No match found in database
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

