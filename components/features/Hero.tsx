'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function Hero() {
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
    window.location.href = '/generator';
  }

  return (
    <section className="relative bg-primary py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Build GC-QQQ MRM methods
            <br />
            from your list — in minutes
          </h1>

          {/* Input Area + Coverage Check */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-start gap-3">
              <Textarea
                placeholder="Paste compound names or CAS (one per line)…"
                value={compoundInput}
                onChange={(e) => {
                  setCompoundInput(e.target.value);
                  setCoverageChecked(false);
                }}
                className="min-h-[90px] px-4 py-3 text-base bg-white border-2 border-white/20 focus-visible:ring-2 focus-visible:ring-white resize-none"
              />
              <Button 
                variant="outline"
                className="h-[90px] px-6 border-2 border-white text-white hover:bg-white hover:text-primary font-medium whitespace-nowrap transition-colors"
                onClick={handleCheckCoverage}
                disabled={!compoundInput.trim()}
              >
                Check coverage
              </Button>
            </div>

            {/* Coverage Results - Mini Result Bar */}
            {coverageChecked && (
              <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-lg shadow-lg">
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
                    className="text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                    onClick={handleViewUnmatched}
                  >
                    查看未命中
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-primary text-primary hover:bg-primary/10"
                    onClick={handleLoadSampleCSV}
                  >
                    导入示例 CSV
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg"
              className="h-12 px-8 bg-white text-primary hover:bg-white/90 text-base font-semibold shadow-lg"
              onClick={handleTryWithList}
            >
              Try with my list
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-medium border-2 border-white text-white hover:bg-white hover:text-primary transition-colors"
            >
              See sample output
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
