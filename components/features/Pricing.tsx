'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export function Pricing() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-600">Start free, upgrade when you need more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Plan */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">永久免费</Badge>
                <h3 className="text-xl font-bold text-gray-900">Free</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Coverage detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Preview first 5 transitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">≤20 compounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Sample export</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </div>
          </Card>

          {/* Pay-per-Use Plan */}
          <Card className="p-6 border-2">
            <div className="space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">单次导出</Badge>
                <h3 className="text-xl font-bold text-gray-900">Pay-per-Use</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$5.9</span>
                  <span className="text-gray-600">/次</span>
                </div>
              </div>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">单次完整方法导出</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">包含所有 Pro 功能</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">无月费承诺</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">适合偶尔使用</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full">
                按次购买
              </Button>
            </div>
          </Card>

          {/* Pro Plan - Monthly */}
          <Card className="p-6 border-2 border-primary relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white">
              Most Popular
            </Badge>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$19.9</span>
                  <span className="text-gray-600">/月</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">1 席位 · 12 次导出/月</p>
              </div>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">≤100 compounds/pkg</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">12 次导出/月</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Save methods + Version history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">GC presets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">RI→RT mapping</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">Template export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">幂等保护</span>
                </li>
              </ul>

              <Button className="w-full">
                Start Pro
              </Button>
              <p className="text-center text-xs text-gray-500">7-day trial</p>
            </div>
          </Card>

          {/* Pro Plan - Annual */}
          <Card className="p-6 border-2 border-green-500 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white">
              Save 33%
            </Badge>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pro Annual</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$159</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <p className="text-sm text-green-600 font-medium mt-1">
                  ~$13.25/mo · Save 33%
                </p>
              </div>
              
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">包含所有 Pro 月付功能</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">≤100 compounds/pkg</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">12 次导出/月</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">GC presets + RI→RT</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">幂等保护 + 7天重下载</span>
                </li>
                <li className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded p-1.5 -mx-1">
                  <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-900 font-semibold">🎁 +3 exports on signup</span>
                </li>
                <li className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded p-1.5 -mx-1">
                  <CheckCircle2 className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-900 font-semibold">🎁 +1 month when LC-QQQ launches</span>
                </li>
              </ul>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                Go Annual – Save ~33%
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
