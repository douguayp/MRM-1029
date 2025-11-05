'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Zap, FileOutput } from 'lucide-react';

export function ValueProps() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1: RI→RT 预测 */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-2">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">RI→RT 预测</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                一次 C8–C35 标定，即得当前方法下 RT 与窗口。
              </p>
            </div>
          </Card>

          {/* Feature 2: 两套 GC 预设 */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-2">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">两套 GC 预设</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Standard（≈40 min）/ Fast（≈20 min），参数可审阅。
              </p>
            </div>
          </Card>

          {/* Feature 3: 自动 MRM 离子对 */}
          <Card className="p-6 hover:shadow-lg transition-shadow border-2">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileOutput className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">自动 MRM 离子对</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Q1/Q3、CE、Quant/Qual、RT Window 一键导出。
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

