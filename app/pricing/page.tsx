'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Building2, Users, ArrowRight, Download, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: '免费试用，探索基础功能',
      badge: '永久免费',
      features: [
        { text: 'CAS↔名称批量互查（最多 30 个/日）', detail: '仅页面预览，需登录', included: true },
        { text: 'Transitions 预览', detail: '最多 5 个化合物，每个最多 2 条', included: true },
        { text: '覆盖检索（名称/CAS）', detail: '判断是否收录', included: true },
        { text: '隐藏 CE/RT 窗口细节', included: true },
        { text: '任何正式导出', included: false },
        { text: 'RI→RT 写入', included: false },
        { text: '保存方法', included: false },
        { text: '版本历史', included: false }
      ],
      note: '我们不保存你的化合物清单',
      cta: '免费开始',
      popular: false,
      link: '/generator'
    },
    {
      name: 'Pay-per-Use',
      price: '5.9',
      period: '/次',
      description: '按需付费，灵活使用',
      badge: '单次导出',
      features: [
        { text: '单次完整方法导出', included: true },
        { text: '包含所有 Pro 功能', included: true },
        { text: '无月费承诺', included: true },
        { text: '适合偶尔使用', included: true }
      ],
      cta: '按次购买',
      popular: false,
      link: '/generator'
    },
    {
      name: 'Pro',
      price: '19.9',
      period: '/月',
      description: '专业用户的最佳选择',
      badge: 'Most Popular',
      seats: '1 席位',
      exports: '12 次导出/月',
      features: [
        { text: '支持 >30 化合物/包，单包上限 ≤100', included: true },
        { text: '12 次导出/月', detail: '超额 $5.9/次', included: true },
        { text: '保存方法 + 版本历史（30 天）', included: true },
        { text: 'GC 预设方法下载', detail: 'Standard / Fast / 自定义', included: true },
        { text: 'RI→RT 写入（含推荐 RT 窗口）', included: true },
        { text: '模板导出', detail: 'Agilent / Thermo / SCIEX（三选一/次）', included: true },
        { text: 'CAS↔名称互查 CSV', detail: '每次 ≤5,000 行', included: true },
        { text: '导出记录（近 30 天）', detail: '7 天内可重复下载', included: true },
        { text: '幂等保护', detail: '24h 内相同请求不重复计费', included: true, highlight: true },
        { text: '标准支持', detail: '工作日 24-48h 响应', included: true }
      ],
      cta: 'Start Pro',
      ctaNote: '7-day trial',
      popular: true,
      link: '/generator'
    },
    {
      name: 'Pro Annual',
      price: '159',
      period: '/年',
      priceDetail: '相当于 $13.25/月',
      description: '年付省 33%，更多福利',
      badge: 'Save 33%',
      seats: '1 席位',
      exports: '12 次导出/月',
      features: [
        { text: '包含所有 Pro 月付功能', included: true },
        { text: '单包上限 ≤100，12 次导出/月', detail: '按月刷新，不结转', included: true },
        { text: '保存方法 + 版本历史（30 天）', included: true },
        { text: 'GC 预设方法下载', detail: 'Standard / Fast / 自定义', included: true },
        { text: 'RI→RT 写入（含推荐 RT 窗口）', included: true },
        { text: '模板导出', detail: 'Agilent / Thermo / SCIEX（三选一/次）', included: true },
        { text: 'CAS↔名称互查 CSV', detail: '每次 ≤5,000 行', included: true },
        { text: '幂等保护 + 7 天重下载', included: true, highlight: true },
        { text: '年付专享：购买即送 +3 次导出', detail: '首月自动发放', included: true, highlight: true },
        { text: '年付专享：LC-QQQ 上线赠送', detail: '+1 个月使用权（自动叠加）', included: true, highlight: true }
      ],
      cta: 'Go Annual',
      ctaNote: 'Save ~33%',
      popular: false,
      link: '/generator'
    }
  ];

  const faqs = [
    {
      q: '什么是幂等保护？为什么重要？',
      a: '幂等保护确保相同的方法生成请求（相同化合物清单 + 模板 + 预设）在 24 小时内不会重复计费。这意味着您可以放心调试和测试，不用担心误操作导致额外费用。'
    },
    {
      q: 'Pro 版每月 12 次导出用完了怎么办？',
      a: '超出配额后，每次额外导出仅需 $5.9。您也可以选择关闭超额导出功能，避免意外费用。'
    },
    {
      q: '年付版相比月付版有什么优势？',
      a: 'Pro 年付版价格为 $159/年（相当于 $13.25/月），比月付版省约 33%。此外还享有两项专属福利：1) 购买即送 +3 次导出（首月自动发放）；2) LC-QQQ 功能上线后自动赠送 +1 个月使用权。'
    },
    {
      q: '7 天内重复下载不计费是什么意思？',
      a: '成功导出后，您可以在 7 天内免费重新下载相同的文件（例如换了电脑、文件丢失等情况），不会消耗导出次数或额外收费。'
    },
    {
      q: '单包化合物数量限制如何计算？',
      a: 'Pro 版（月付/年付）单包上限 100 个化合物。如果您上传 150 个化合物，系统会自动分为 2 包处理（100 + 50），消耗 2 次导出配额。'
    },
    {
      q: '可以随时取消订阅吗？',
      a: '是的，您可以随时取消订阅。取消后，在当前计费周期结束前，您仍可继续使用所有付费功能。我们不收取任何取消费用。年付用户取消后，剩余时间按月折算退款。'
    },
    {
      q: '年付版的配额是每月刷新还是一次性给 144 次？',
      a: '年付版配额按月刷新，每月固定 12 次导出，不累积结转。例如 1 月用了 8 次，剩余 4 次不会转入 2 月，2 月重新计为 12 次。'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-blue-600 text-white py-20">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            简单透明的定价
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            选择适合您的方案，随时可以升级或取消
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Shield className="h-4 w-4 mr-1 inline" />
              7天免费试用
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Check className="h-4 w-4 mr-1 inline" />
              随时取消
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Zap className="h-4 w-4 mr-1 inline" />
              幂等保护
            </Badge>
          </div>
        </div>
      </section>

      {/* Key Features Banner */}
      <section className="py-12 px-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-y border-yellow-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">幂等保护</h3>
              <p className="text-sm text-gray-600">
                24h内相同请求不重复计费<br/>
                放心调试，无需担心误操作
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">7天免费重下载</h3>
              <p className="text-sm text-gray-600">
                导出成功后7天内<br/>
                可免费重新下载相同文件
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">灵活付费</h3>
              <p className="text-sm text-gray-600">
                按次购买或订阅<br/>
                根据使用频率自由选择
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative p-6 ${
                  plan.popular 
                    ? 'border-2 border-primary shadow-2xl scale-105' 
                    : 'border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1 font-semibold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  {!plan.popular && plan.badge && (
                    <Badge variant="secondary" className="mb-4">
                      {plan.badge}
                    </Badge>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-lg text-gray-600">$</span>
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 text-lg">{plan.period}</span>
                    )}
                  </div>
                  
                  {/* Price Detail */}
                  {plan.priceDetail && (
                    <p className="text-sm text-green-600 font-medium mb-3">
                      {plan.priceDetail}
                    </p>
                  )}
                  
                  {/* Seats and Exports info */}
                  {(plan.seats || plan.exports) && (
                    <div className="space-y-1 mb-4">
                      {plan.seats && (
                        <p className="text-xs text-gray-500">{plan.seats}</p>
                      )}
                      {plan.exports && (
                        <p className="text-xs text-gray-500 font-medium">{plan.exports}</p>
                      )}
                    </div>
                  )}
                </div>

                <Link href={plan.link}>
                  <Button 
                    className={`w-full mb-2 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                    {!plan.ctaNote && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </Link>
                
                {plan.ctaNote && (
                  <p className="text-center text-xs text-gray-500 mb-4">
                    {plan.ctaNote}
                  </p>
                )}

                <div className="space-y-2.5 mt-4">
                  {plan.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2.5 ${
                        !feature.included ? 'opacity-40' : ''
                      } ${
                        feature.highlight ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-2 -mx-1' : ''
                      }`}
                    >
                      {feature.included ? (
                        <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          feature.highlight ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      ) : (
                        <X className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <span className={`text-xs ${
                          feature.highlight ? 'font-semibold text-gray-900' : 'text-gray-700'
                        }`}>
                          {feature.text}
                        </span>
                        {feature.detail && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {feature.detail}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {plan.note && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 italic text-center">
                      {plan.note}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              功能对比
            </h2>
            <p className="text-lg text-gray-600">
              详细了解各版本的功能差异
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
                      功能
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">
                      Free
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900">
                      Pay-per-Use
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 bg-primary/5">
                      Pro (月付)
                    </th>
                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-900 bg-green-50">
                      Pro (年付)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">价格</td>
                    <td className="py-3 px-4 text-center text-xs font-semibold">$0</td>
                    <td className="py-3 px-4 text-center text-xs font-semibold">$5.9/次</td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5 font-semibold">$19.9/月</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50 font-semibold">$159/年<br/><span className="text-green-600">($13.25/月)</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">单包化合物上限</td>
                    <td className="py-3 px-4 text-center text-xs">预览 5 个</td>
                    <td className="py-3 px-4 text-center text-xs">≤100</td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5 font-medium">≤100</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50 font-medium">≤100</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">导出配额</td>
                    <td className="py-3 px-4 text-center text-xs">-</td>
                    <td className="py-3 px-4 text-center text-xs">按次付费</td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5">12 次/月</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50">12 次/月</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">RI→RT 写入</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-green-50"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">幂等保护（24h）</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-green-50"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">7天免费重下载</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-green-50"><Check className="h-4 w-4 text-green-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">版本历史</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5">30 天</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50">30 天</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">CAS↔名称互查</td>
                    <td className="py-3 px-4 text-center text-xs">30 个/日</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5">≤5,000 行</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50">≤5,000 行</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="py-3 px-4 text-sm text-gray-700 font-semibold">年付专享福利</td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center bg-primary/5"><X className="h-4 w-4 text-gray-400 mx-auto" /></td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50">
                      <div className="font-medium text-green-700">
                        首月 +3 次导出<br/>
                        LC-QQQ +1 月
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-sm text-gray-700">技术支持</td>
                    <td className="py-3 px-4 text-center text-xs">社区</td>
                    <td className="py-3 px-4 text-center text-xs">社区</td>
                    <td className="py-3 px-4 text-center text-xs bg-primary/5">24-48h</td>
                    <td className="py-3 px-4 text-center text-xs bg-green-50">24-48h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              常见问题
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            还有疑问？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            联系我们的团队，获取定制化方案
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Users className="mr-2 h-5 w-5" />
              联系销售
            </Button>
            <Link href="/generator">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                先试用再决定
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

