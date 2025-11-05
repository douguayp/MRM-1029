'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export function Hero() {
  const router = useRouter();
  const [compoundInput, setCompoundInput] = useState('');
  const [coverageChecked, setCoverageChecked] = useState(false);
  const [coverageStats, setCoverageStats] = useState({ supported: 0, unsupported: 0, fuzzy: 0, rate: 0 });

  function handleCheckCoverage() {
    // 模拟检查覆盖率
    const lines = compoundInput.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    // 模拟统计（包含duplicates）
    const supported = Math.floor(lines.length * 0.90);
    const unresolved = Math.floor(lines.length * 0.07);
    const duplicates = Math.floor(lines.length * 0.03);
    const rate = Math.round((supported / lines.length) * 100);
    
    setCoverageStats({ supported, unsupported: unresolved, fuzzy: duplicates, rate });
    setCoverageChecked(true);
  }

  function handleViewUnmatched() {
    alert('查看未命中的化合物列表\n\n这个功能将显示所有未能识别的化合物，帮助您了解需要补充的数据。');
  }

  function handleLoadSampleCSV() {
    const sampleData = `Chlorpyrifos
2921-88-2
Malathion
Fenitrothion
121-75-5
Parathion
Diazinon
Atrazine`;
    setCompoundInput(sampleData);
    setCoverageChecked(false);
  }

  function handleTryWithList() {
    router.push('/generator');
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

            {/* Coverage Results - Mini Result Bar */}
            {coverageChecked && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-green-700">
                      Supported {coverageStats.supported}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="font-medium text-orange-600">
                      Unresolved {coverageStats.unsupported}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="font-medium text-gray-600">
                      Duplicates {coverageStats.fuzzy}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-orange-200 hover:bg-orange-50"
                    onClick={handleViewUnmatched}
                  >
                    查看未命中
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-blue-200 hover:bg-blue-50"
                    onClick={handleLoadSampleCSV}
                  >
                    导入示例 CSV
                  </Button>
                </div>
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
