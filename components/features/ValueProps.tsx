'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Zap, FileOutput } from 'lucide-react';

export function ValueProps() {
  const features = [
    {
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      cardBg: 'bg-blue-50',
      title: 'RI→RT 预测',
      description: '一次 C8–C35 标定，即得当前方法下 RT 与窗口。支持常见非极性/中等极性化合物；极性/热不稳化合物请谨慎确认。提供 RT 置信度提示，便于快速审阅与调整。'
    },
    {
      icon: Zap,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      cardBg: 'bg-cyan-50',
      title: '两套 GC 预设',
      description: 'Standard（≈40 min）与 Fast（≈20 min）可切换。关键参数透明可调，兼顾分离度与通量。预设与 RI 预测联动，快速评估窗口与通量。'
    },
    {
      icon: FileOutput,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      cardBg: 'bg-indigo-50',
      title: '自动 MRM 离子对',
      description: '一键导出 Q1/Q3、CE、Quant/Qual、RT Window。提供样例 CSV/TXT；主流平台模板兼容。支持列表/CSV 输入，覆盖 3,400+ 化合物库。'
    }
  ];

  return (
    <section className="pt-8 pb-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`group relative flex flex-col ${feature.cardBg} rounded-3xl border-0 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex flex-col items-center text-center h-full p-8">
                  {/* 图标徽章 */}
                  <div className="mb-5">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.iconBg}`}
                      role="img"
                      aria-label={feature.title}
                    >
                      <Icon className={`w-9 h-9 ${feature.iconColor}`} strokeWidth={2} />
                    </div>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>

                  {/* 描述文本 */}
                  <p className="text-base leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

