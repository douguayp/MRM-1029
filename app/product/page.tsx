'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, FileOutput, Database, Clock, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const features = [
    {
      icon: TrendingUp,
      title: 'RI→RT 预测',
      description: '一次 C8–C35 标定，即得当前方法下 RT 与窗口。支持常见非极性/中等极性化合物；极性/热不稳化合物请谨慎确认。',
      benefits: ['自动计算RT窗口', 'RI置信度提示', '支持多种色谱柱'],
      badge: '核心技术'
    },
    {
      icon: Zap,
      title: '两套 GC 预设',
      description: 'Standard（≈40 min）与 Fast（≈20 min）可切换。关键参数透明可调，兼顾分离度与通量。',
      benefits: ['灵活切换方法', '参数完全可控', 'RT预测联动'],
      badge: '高效'
    },
    {
      icon: FileOutput,
      title: '自动 MRM 离子对',
      description: '一键导出 Q1/Q3、CE、Quant/Qual、RT Window。提供样例 CSV/TXT；主流平台模板兼容。',
      benefits: ['多格式导出', '仪器兼容', '批量处理'],
      badge: '便捷'
    },
    {
      icon: Database,
      title: '3,400+ 化合物库',
      description: '覆盖农药残留、环境污染物等多个领域。持续更新，自动去重，确保数据质量。',
      benefits: ['农残 3400+', '环境 200+', '持续更新'],
      badge: '全面'
    }
  ];

  const useCases = [
    {
      title: '农药残留检测',
      description: '快速构建农残多残留筛查方法，覆盖主要农药类别',
      compounds: '127 种',
      time: '< 2 分钟',
      icon: '🌾'
    },
    {
      title: '环境污染物分析',
      description: '环境监测、水质分析的理想选择',
      compounds: '200+ 种',
      time: '< 2 分钟',
      icon: '🌍'
    },
    {
      title: '食品安全检测',
      description: '食品中多种污染物的快速筛查',
      compounds: '定制化',
      time: '< 3 分钟',
      icon: '🍎'
    }
  ];

  const workflow = [
    { step: '1', title: '输入化合物清单', description: '复制粘贴名称或CAS号' },
    { step: '2', title: '选择 GC 方法', description: 'Standard 或 Fast 模式' },
    { step: '3', title: 'RI→RT 校准', description: '一次标定，自动计算' },
    { step: '4', title: '导出方法文件', description: 'CSV/TXT 直接导入仪器' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                GC-QQQ MRM Method Builder
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                从化合物清单到完整方法
                <br />
                只需 3 步
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                基于 RI 预测的 MRM 方法构建工具，覆盖 3,400+ 化合物，支持农残、环境等多个领域
              </p>
              <div className="flex gap-4">
                <Link href="/generator">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    立即试用
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/compound-library">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    浏览化合物库
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span>自动 RI→RT 转换</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span>智能 RT 窗口计算</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span>多格式方法导出</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                    <span>主流仪器兼容</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              核心功能
            </h2>
            <p className="text-lg text-gray-600">
              专为质谱分析工作者设计的高效工具
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-all border-2 hover:border-primary/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              应用场景
            </h2>
            <p className="text-lg text-gray-600">
              适用于多个检测领域
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {useCase.description}
                </p>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Database className="h-4 w-4 text-primary" />
                    <span>{useCase.compounds}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{useCase.time}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              工作流程
            </h2>
            <p className="text-lg text-gray-600">
              简单四步，轻松完成
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                </Card>
                {index < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好提升您的工作效率了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            立即开始使用，无需注册，完全免费试用
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/generator">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                <Zap className="mr-2 h-5 w-5" />
                立即试用
              </Button>
            </Link>
            <Link href="/compound-library">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                浏览化合物库
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

