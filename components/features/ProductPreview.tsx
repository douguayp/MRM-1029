'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, FileText, Download, Database, CheckCircle, Loader2, Mail, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ScenarioData {
  id: string;
  title: string;
  compounds: number;
  method: string;
  transitions: number;
  samples: Array<{
    name: string;
    cas: string;
    role: string;
    q1: number;
    q3: number;
    ce: number;
    rt: number;
    window: number;
    ri: number;
  }>;
}

const scenarios: ScenarioData[] = [
  {
    id: 'pesticides',
    title: '农药残留检测',
    compounds: 127,
    method: 'CF40-LOCKABLE',
    transitions: 382,
    samples: [
      { name: 'Chlorpyrifos', cas: '2921-88-2', role: 'Quant', q1: 314.0, q3: 286.0, ce: 15, rt: 18.11, window: 0.30, ri: 1845 },
      { name: 'Chlorpyrifos', cas: '2921-88-2', role: 'Qual', q1: 314.0, q3: 258.0, ce: 18, rt: 18.11, window: 0.30, ri: 1845 },
      { name: 'Malathion', cas: '121-75-5', role: 'Quant', q1: 173.0, q3: 99.0, ce: 12, rt: 16.45, window: 0.28, ri: 1702 },
      { name: 'Malathion', cas: '121-75-5', role: 'Qual', q1: 173.0, q3: 127.0, ce: 10, rt: 16.45, window: 0.28, ri: 1702 },
      { name: 'Fenitrothion', cas: '122-14-5', role: 'Quant', q1: 277.0, q3: 260.0, ce: 18, rt: 14.23, window: 0.25, ri: 1598 },
    ]
  },
  {
    id: 'environmental',
    title: '环境污染物筛查',
    compounds: 156,
    method: 'CF40-FAST',
    transitions: 468,
    samples: [
      { name: 'Bisphenol A', cas: '80-05-7', role: 'Quant', q1: 228.0, q3: 213.0, ce: 16, rt: 14.56, window: 0.26, ri: 1567 },
      { name: 'Bisphenol A', cas: '80-05-7', role: 'Qual', q1: 228.0, q3: 133.0, ce: 28, rt: 14.56, window: 0.26, ri: 1567 },
      { name: 'Phthalate DEHP', cas: '117-81-7', role: 'Quant', q1: 279.0, q3: 149.0, ce: 15, rt: 19.23, window: 0.35, ri: 1912 },
      { name: 'Phthalate DEHP', cas: '117-81-7', role: 'Qual', q1: 279.0, q3: 167.0, ce: 18, rt: 19.23, window: 0.35, ri: 1912 },
      { name: 'PCB-153', cas: '35065-27-1', role: 'Quant', q1: 360.0, q3: 290.0, ce: 22, rt: 17.45, window: 0.31, ri: 1789 },
    ]
  }
];

export function ProductPreview() {
  const [activeDataset, setActiveDataset] = useState('pesticides');
  const [animatedStep, setAnimatedStep] = useState(0);
  const [displayedTransitions, setDisplayedTransitions] = useState(0);
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const [showAutoSwitchNotice, setShowAutoSwitchNotice] = useState(false);
  const [showDatasetDropdown, setShowDatasetDropdown] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({
    email: '',
    organization: '',
    instrument: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const currentScenario = scenarios.find(s => s.id === activeDataset) || scenarios[0];
  
  const datasetLabels = {
    pesticides: { name: '农残', description: '自动', count: '3,400+' },
    environmental: { name: '环境', description: '自动', count: '200+' }
  };

  function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟提交
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // 2秒后关闭对话框并重置
      setTimeout(() => {
        setShowWaitlistDialog(false);
        setSubmitSuccess(false);
        setWaitlistForm({ email: '', organization: '', instrument: '' });
      }, 2000);
    }, 1000);
  }

  function handleDatasetChange(datasetId: string) {
    if (datasetId === 'pesticides' || datasetId === 'environmental') {
      setActiveDataset(datasetId);
      setShowDatasetDropdown(false);
      setAnimatedStep(0);
    } else if (datasetId === 'veterinary') {
      setShowDatasetDropdown(false);
      setShowWaitlistDialog(true);
    }
  }

  // 模拟自动识别切换（实际应用中从输入内容触发）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function simulateAutoSwitch(toDataset: 'pesticides' | 'environmental') {
    setActiveDataset(toDataset);
    setShowAutoSwitchNotice(true);
    
    // 3秒后隐藏提示
    setTimeout(() => {
      setShowAutoSwitchNotice(false);
    }, 3000);
  }

  // 动画效果：步骤进度
  useEffect(() => {
    const stepTimers = [
      setTimeout(() => setAnimatedStep(1), 500),
      setTimeout(() => setAnimatedStep(2), 1000),
      setTimeout(() => setAnimatedStep(3), 1500),
      setTimeout(() => setAnimatedStep(4), 2000),
    ];
    
    return () => stepTimers.forEach(clearTimeout);
  }, [activeDataset]);

  // 动画效果：数字计数
  useEffect(() => {
    setDisplayedTransitions(0);
    const interval = setInterval(() => {
      setDisplayedTransitions(prev => {
        if (prev >= currentScenario.transitions) {
          clearInterval(interval);
          return currentScenario.transitions;
        }
        return prev + Math.ceil(currentScenario.transitions / 20);
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [activeDataset, currentScenario.transitions]);

  return (
    <section className="product-preview-section relative py-20 px-6 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            实时预览产品功能
          </h2>
          <p className="text-base text-gray-600">
            从输入到导出，全流程自动化，3 步完成
          </p>
        </div>

        {/* 三个轻量图标要点 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
          <div className="flex items-start gap-3 max-w-xs">
            <div className="flex-shrink-0">
              <Clock className="h-9 w-9 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {'<2'} 分钟出方法
              </h3>
              <p className="text-sm text-gray-600">
                输入清单即生成 transitions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 max-w-xs">
            <div className="flex-shrink-0">
              <Database className="h-9 w-9 text-green-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                覆盖 3,400+ 化合物
              </h3>
              <p className="text-sm text-gray-600">
                持续补充、自动去重
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 max-w-xs">
            <div className="flex-shrink-0">
              <FileText className="h-9 w-9 text-orange-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                多格式导出
              </h3>
              <p className="text-sm text-gray-600">
                CSV/TXT；兼容主流平台
              </p>
            </div>
          </div>
        </div>

        {/* 数据覆盖状态条 */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-semibold text-gray-900">农残：</span>
                  <span className="text-gray-600">Available · 3,400+ compounds</span>
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-semibold text-gray-900">环境：</span>
                  <span className="text-gray-600">Available（核心 200+）</span>
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500 flex-shrink-0" />
                <span className="text-sm">
                  <span className="font-semibold text-gray-900">兽残：</span>
                  <span className="text-gray-600">In progress · </span>
                  <Dialog open={showWaitlistDialog} onOpenChange={setShowWaitlistDialog}>
                    <DialogTrigger asChild>
                      <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                        加入等候名单
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>加入兽残数据库等候名单</DialogTitle>
                        <DialogDescription>
                          我们正在构建兽药残留数据库。请留下您的信息，我们会在上线时第一时间通知您。
                        </DialogDescription>
                      </DialogHeader>
                      
                      {submitSuccess ? (
                        <div className="py-8 text-center">
                          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            提交成功！
                          </h3>
                          <p className="text-sm text-gray-600">
                            我们会在兽残数据库上线时通知您
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleWaitlistSubmit} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">邮箱 *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="pl-10"
                                value={waitlistForm.email}
                                onChange={(e) => setWaitlistForm(prev => ({ ...prev, email: e.target.value }))}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="organization">实验室/行业 *</Label>
                            <Input
                              id="organization"
                              placeholder="例如：食品检测实验室"
                              required
                              value={waitlistForm.organization}
                              onChange={(e) => setWaitlistForm(prev => ({ ...prev, organization: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="instrument">仪器品牌</Label>
                            <Input
                              id="instrument"
                              placeholder="例如：Agilent, Thermo, Waters"
                              value={waitlistForm.instrument}
                              onChange={(e) => setWaitlistForm(prev => ({ ...prev, instrument: e.target.value }))}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                提交中...
                              </>
                            ) : (
                              '提交'
                            )}
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 预览容器 */}
        <div className="relative">
          {/* 自动切换提示 */}
          {showAutoSwitchNotice && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in fade-in slide-in-from-top-2">
              已自动切换至{datasetLabels[activeDataset as keyof typeof datasetLabels].name}
            </div>
          )}

          {/* Browser-like Window */}
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            {/* Browser Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer animate-pulse"></div>
                </div>
                <div className="flex-1 ml-4">
                  <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 max-w-md shadow-inner">
                    localhost:3000
                  </div>
                </div>
              </div>
              
              {/* Dataset 下拉选择 */}
              <div className="relative">
                <button
                  onClick={() => setShowDatasetDropdown(!showDatasetDropdown)}
                  className="flex items-center gap-2 bg-white rounded px-3 py-1.5 border border-gray-200 shadow-sm hover:border-gray-300 transition-colors"
                >
                  <span className="text-xs text-gray-500">Dataset:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {datasetLabels[activeDataset as keyof typeof datasetLabels].name}（自动） · 可用：{datasetLabels[activeDataset as keyof typeof datasetLabels].count}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </button>
                
                {showDatasetDropdown && (
                  <>
                    {/* 遮罩层 */}
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDatasetDropdown(false)}
                    ></div>
                    
                    {/* 下拉菜单 */}
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                      {/* 农残 */}
                      <button
                        onClick={() => handleDatasetChange('pesticides')}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          activeDataset === 'pesticides'
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-900">农残</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">3,400+</Badge>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">农药残留检测数据库</p>
                      </button>

                      {/* 环境 */}
                      <button
                        onClick={() => handleDatasetChange('environmental')}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          activeDataset === 'environmental'
                            ? 'bg-blue-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-900">环境</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">200+</Badge>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">环境污染物筛查数据库（核心）</p>
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      {/* 兽残 - 置灰但可点击 */}
                      <button
                        onClick={() => handleDatasetChange('veterinary')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors opacity-60"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-semibold text-gray-700">兽残</span>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-gray-200">建设中</Badge>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">
                          兽药残留分析 · 
                          <span className="text-blue-600 font-medium"> 加入等候名单</span>
                        </p>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

                  {/* Application Content */}
                  <div className="bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 p-4 md:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                      {/* Left Panel - Steps */}
                      <Card className="p-4 md:p-6 bg-white shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Method Generation
                        </h3>
                        <div className="space-y-3">
                          <div 
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                              animatedStep >= 1 ? 'bg-green-50 opacity-100' : 'opacity-60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              animatedStep >= 1 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-200'
                            }`}>
                              <CheckCircle2 className={`h-4 w-4 ${animatedStep >= 1 ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Input Compounds</div>
                              <div className="text-xs text-gray-500 font-medium">{currentScenario.compounds} compounds matched</div>
                            </div>
                          </div>
                          
                          <div 
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                              animatedStep >= 2 ? 'bg-green-50 opacity-100' : 'opacity-60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              animatedStep >= 2 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-200'
                            }`}>
                              <CheckCircle2 className={`h-4 w-4 ${animatedStep >= 2 ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Select GC Method</div>
                              <div className="text-xs text-gray-500 font-medium">{currentScenario.method}</div>
                            </div>
                          </div>
                          
                          <div 
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                              animatedStep >= 3 ? 'bg-blue-50 opacity-100' : 'opacity-60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              animatedStep >= 3 ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-gray-200'
                            }`}>
                              {animatedStep >= 4 ? (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              ) : (
                                <Clock className={`h-4 w-4 ${animatedStep >= 3 ? 'text-white animate-pulse' : 'text-gray-400'}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">Step 3 — RI→RT Calibration</div>
                              <div className="text-xs text-gray-500">
                                {animatedStep >= 4 ? 'Completed!' : 'In progress...'}
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                              animatedStep >= 4 ? 'bg-green-50 opacity-100' : 'opacity-60'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              animatedStep >= 4 ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-gray-200'
                            }`}>
                              <FileText className={`h-4 w-4 ${animatedStep >= 4 ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className={`text-sm font-medium ${animatedStep >= 4 ? 'text-gray-900' : 'text-gray-400'}`}>
                                Export
                              </div>
                              <div className={`text-xs ${animatedStep >= 4 ? 'text-gray-500' : 'text-gray-400'}`}>
                                {animatedStep >= 4 ? 'Ready to download' : 'Pending...'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Right Panel - Transitions Table */}
                      <Card className="p-4 md:p-6 bg-white lg:col-span-2 overflow-auto shadow-lg border-2 border-gray-100 hover:border-blue-200 transition-all">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">Generated Transitions</h3>
                            <Badge variant="default" className="bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
                              {displayedTransitions} transitions
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all">
                              <Download className="h-3 w-3 mr-1" />
                              CSV
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs hover:bg-blue-50 hover:border-blue-300 transition-all">
                              <Download className="h-3 w-3 mr-1" />
                              TXT
                            </Button>
                          </div>
                        </div>
                        
                        {/* Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs md:text-sm">
                            <thead className="border-b-2 border-gray-200 bg-gray-50">
                              <tr className="text-left">
                                <th className="pb-2 px-2 font-semibold text-gray-700">Compound</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700">CAS</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700">Role</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">Q1</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">Q3</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">CE</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">RT_pred</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">Window</th>
                                <th className="pb-2 px-2 font-semibold text-gray-700 text-right">RI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {currentScenario.samples.map((row, idx) => (
                                <tr 
                                  key={`${activeDataset}-${idx}`}
                                  className={`hover:bg-blue-50 transition-all cursor-pointer group ${
                                    row.role === 'Quant' ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'hover:border-l-4 hover:border-l-gray-300'
                                  }`}
                                  style={{
                                    animation: `slideDownFadeIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.2}s both`
                                  }}
                                >
                                  <td className="py-3 px-2 font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {row.name}
                                  </td>
                                  <td className="py-3 px-2 text-gray-600 font-mono text-xs">{row.cas}</td>
                                  <td className="py-3 px-2">
                                    <Badge 
                                      variant={row.role === 'Quant' ? 'default' : 'secondary'}
                                      className={`text-xs ${
                                        row.role === 'Quant' 
                                          ? 'bg-blue-600 text-white shadow-md' 
                                          : 'bg-gray-200 text-gray-700'
                                      }`}
                                    >
                                      {row.role}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-2 text-right font-mono text-gray-900">{row.q1.toFixed(1)}</td>
                                  <td className="py-3 px-2 text-right font-mono text-gray-900">{row.q3.toFixed(1)}</td>
                                  <td className="py-3 px-2 text-right font-mono text-gray-900">{row.ce}</td>
                                  <td className="py-3 px-2 text-right font-mono text-blue-700 font-bold">
                                    {row.rt.toFixed(2)}
                                  </td>
                                  <td className="py-3 px-2 text-right font-mono text-gray-600">±{row.window.toFixed(2)}</td>
                                  <td className="py-3 px-2 text-right font-mono text-gray-600">{row.ri}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Footer Note */}
                        <div className="mt-4 pt-3 border-t border-gray-200 bg-blue-50/30 -mx-6 px-6 -mb-6 pb-6 rounded-b-lg">
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold text-blue-700">💡 提示：</span>
                            Quant 行已高亮显示 · RT 窗口基于 RI 置信度 · 可直接导入仪器
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

      </div>

      <style jsx>{`
        @keyframes slideDownFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
            filter: blur(5px);
          }
          30% {
            opacity: 0.3;
          }
          60% {
            opacity: 0.7;
            transform: translateY(5px) scale(1.02);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-20px);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

