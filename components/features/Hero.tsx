'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type CheckButtonState = 'idle' | 'loading' | 'done';

export function Hero() {
  const [compoundInput, setCompoundInput] = useState('');
  const [checkButtonState, setCheckButtonState] = useState<CheckButtonState>('idle');
  const [coverageStats, setCoverageStats] = useState({ supported: 0, unsupported: 0, fuzzy: 0, rate: 0 });

  // 自动重置按钮状态（done -> idle，3秒后）
  useEffect(() => {
    if (checkButtonState === 'done') {
      const timer = setTimeout(() => {
        setCheckButtonState('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [checkButtonState]);

  function handleCheckCoverage() {
    if (!compoundInput.trim()) return;
    
    setCheckButtonState('loading');
    
    // 模拟异步检查
    setTimeout(() => {
      const lines = compoundInput.split('\n').filter(line => line.trim());
      
      // 模拟统计
      const supported = Math.floor(lines.length * 0.90);
      const unresolved = Math.floor(lines.length * 0.07);
      const duplicates = Math.floor(lines.length * 0.03);
      const rate = Math.round((supported / lines.length) * 100);
      
      setCoverageStats({ supported, unsupported: unresolved, fuzzy: duplicates, rate });
      setCheckButtonState('done');
    }, 800);
  }

  function handleTryWithList() {
    window.location.href = '/generator';
  }

  function handleSeeSampleOutput() {
    // TODO: 实现查看示例输出
    console.log('See sample output clicked');
  }

  // 检查输入是否有效（至少有一行非空内容）
  const hasValidInput = compoundInput.split('\n').some(line => line.trim().length > 0);

  // 按钮③的内容（根据状态）
  function getCheckButtonContent() {
    switch (checkButtonState) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Checking…
          </>
        );
      case 'done':
        const isLowCoverage = coverageStats.rate < 70;
        return (
          <>
            {isLowCoverage ? (
              <AlertCircle className="h-4 w-4 mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            {coverageStats.rate}% covered
          </>
        );
      default:
        return 'Check coverage';
    }
  }

  return (
    <section className="relative bg-primary py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-10">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Build GC-QQQ MRM methods
            <br />
            from your list — in minutes
          </h1>

          {/* 输入行：输入框 + Check coverage 小按钮（同一行） */}
          <div className="flex items-start gap-4 w-[720px] mx-auto">
            <Textarea
              placeholder="Paste compound names or CAS (one per line)…"
              value={compoundInput}
              onChange={(e) => {
                setCompoundInput(e.target.value);
                if (checkButtonState === 'done') {
                  setCheckButtonState('idle');
                }
              }}
              className="w-[560px] min-h-[100px] px-5 py-4 text-base bg-white rounded-xl border-2 border-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 resize-none shadow-sm transition-all"
              tabIndex={0}
            />
            
            {/* 按钮③（Tertiary）- Check coverage 小按钮 */}
            <Button
              onClick={handleCheckCoverage}
              disabled={!hasValidInput || checkButtonState === 'loading'}
              className={`
                w-[156px] min-h-[100px] px-4 text-base font-medium whitespace-nowrap rounded-xl
                border-2 border-white bg-transparent text-white
                transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary
                ${
                  checkButtonState === 'done'
                    ? coverageStats.rate >= 70
                      ? 'border-green-400 hover:bg-green-500/20'
                      : 'border-orange-400 hover:bg-orange-500/20'
                    : 'hover:bg-white/10 hover:border-white/80'
                }
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
              `}
              tabIndex={1}
            >
              <span className="flex items-center justify-center">
                {getCheckButtonContent()}
              </span>
            </Button>
          </div>

          {/* 主/次 CTA 按钮行（两端对齐，与输入框等宽） */}
          <div className="flex items-center gap-4 pt-2 w-[560px] mx-auto">
            {/* 按钮①（Primary）- Try with my list - 主 CTA */}
            <Button
              onClick={handleTryWithList}
              className="flex-1 h-14 px-8 text-base font-bold rounded-xl border-2 border-white bg-white text-primary hover:bg-white/95 hover:shadow-lg active:bg-white/90 shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              tabIndex={2}
            >
              Try with my list
            </Button>

            {/* 按钮②（Secondary）- See sample output - 次要按钮 */}
            <Button
              onClick={handleSeeSampleOutput}
              className="flex-1 h-14 px-8 text-base font-medium rounded-xl border-2 border-white/70 bg-transparent text-white hover:bg-white/10 hover:border-white active:bg-white/20 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              tabIndex={3}
            >
              See sample output
            </Button>
          </div>

          {/* 轻量 Toast 提示（覆盖率详情） */}
          {checkButtonState === 'done' && (
            <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="font-semibold text-green-600">
                    {coverageStats.supported} supported
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="font-medium text-orange-600">
                    {coverageStats.unsupported} unresolved
                  </span>
                  <span className="text-gray-300">·</span>
                  <span className="font-medium text-gray-500">
                    {coverageStats.fuzzy} duplicates
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
