'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export function Hero() {
  const [compoundInput, setCompoundInput] = useState('');
  const [coverageChecked, setCoverageChecked] = useState(false);
  const [coverageStats, setCoverageStats] = useState({ supported: 0, unsupported: 0, fuzzy: 0, rate: 0 });

  function handleCheckCoverage() {
    // 模拟检查覆盖率
    const lines = compoundInput.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    // 模拟统计
    const supported = Math.floor(lines.length * 0.92);
    const fuzzy = Math.floor(lines.length * 0.05);
    const unsupported = lines.length - supported - fuzzy;
    const rate = Math.round((supported / lines.length) * 100);
    
    setCoverageStats({ supported, unsupported, fuzzy, rate });
    setCoverageChecked(true);
  }

  function handleTryWithList() {
    const appSection = document.getElementById('app-section');
    if (appSection) {
      appSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
            Build GC-QQQ MRM methods
            <br />
            from your list — in minutes
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Paste names or CAS → pick Standard / Fast GC preset → RI-based RT prediction → 
            get ready-to-run transitions (Q1/Q3/CE, Quant/Qual, RT window) with one click.
          </p>

          {/* Coverage Badge */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Now supporting 3,400+ compounds
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
              RI coverage 92% (C8–C35)
            </Badge>
          </div>

          {/* Input Area + Coverage Check */}
          <div className="pt-6 max-w-3xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <Textarea
                placeholder="Paste compound names or CAS (one per line)…"
                value={compoundInput}
                onChange={(e) => {
                  setCompoundInput(e.target.value);
                  setCoverageChecked(false);
                }}
                className="min-h-[120px] px-4 py-3 text-base bg-white border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-primary resize-none"
              />
              <Button 
                variant="outline"
                className="h-[120px] px-6 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 font-medium whitespace-nowrap"
                onClick={handleCheckCoverage}
                disabled={!compoundInput.trim()}
              >
                Check coverage
              </Button>
            </div>

            {/* Coverage Results */}
            {coverageChecked && (
              <div className="flex items-center justify-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Supported: {coverageStats.supported}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Fuzzy: {coverageStats.fuzzy}
                </div>
                <div className="text-sm text-gray-600">
                  Unsupported: {coverageStats.unsupported}
                </div>
                {coverageStats.rate >= 90 && (
                  <Badge className="bg-green-600 text-white font-semibold">
                    Coverage: {coverageStats.rate}%+
                  </Badge>
                )}
              </div>
            )}

            {/* Trust Microcopy */}
            <p className="text-sm text-gray-500 text-center">
              GC method presets · RI-based RT prediction · Auto-generated MRM transitions · CSV/TXT export
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button 
              size="lg"
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold"
              onClick={handleTryWithList}
            >
              Try with my list
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-medium border-2"
            >
              See sample output
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
