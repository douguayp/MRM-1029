'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, FileText, Download } from 'lucide-react';

export function ProductPreview() {
  return (
    <section className="product-preview-section relative py-16 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Product Mockup */}
        <div className="relative">
          {/* Browser-like Window */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 max-w-md">
                  localhost:3000
                </div>
              </div>
            </div>

            {/* Application Content */}
            <div className="bg-gray-50 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Steps */}
                <Card className="p-6 bg-white">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Method Generation
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Input Compounds</div>
                        <div className="text-xs text-gray-500">127 compounds matched</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Select GC Method</div>
                        <div className="text-xs text-gray-500">CF40-LOCKABLE</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Step 3 — RI→RT Calibration</div>
                        <div className="text-xs text-gray-500">In progress...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-400">Export</div>
                        <div className="text-xs text-gray-400">Pending...</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Middle Panel - Transitions Table */}
                <Card className="p-6 bg-white lg:col-span-2 overflow-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">Generated Transitions</h3>
                      <Badge variant="secondary">382 transitions</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Sample CSV
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        Method TXT
                      </Button>
                    </div>
                  </div>
                  
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr className="text-left">
                          <th className="pb-2 font-medium text-gray-700">Compound</th>
                          <th className="pb-2 font-medium text-gray-700">CAS</th>
                          <th className="pb-2 font-medium text-gray-700">Role</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">Q1 (m/z)</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">Q3 (m/z)</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">CE (V)</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">RT_pred (min)</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">Window (min)</th>
                          <th className="pb-2 font-medium text-gray-700 text-right">RI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { name: 'Chlorpyrifos', cas: '2921-88-2', role: 'Quant', q1: 314.0, q3: 286.0, ce: 15, rt: 18.11, window: 0.30, ri: 1845 },
                          { name: 'Chlorpyrifos', cas: '2921-88-2', role: 'Qual', q1: 314.0, q3: 258.0, ce: 18, rt: 18.11, window: 0.30, ri: 1845 },
                          { name: 'Malathion', cas: '121-75-5', role: 'Quant', q1: 173.0, q3: 99.0, ce: 12, rt: 16.45, window: 0.28, ri: 1702 },
                          { name: 'Malathion', cas: '121-75-5', role: 'Qual', q1: 173.0, q3: 127.0, ce: 10, rt: 16.45, window: 0.28, ri: 1702 },
                          { name: 'Fenitrothion', cas: '122-14-5', role: 'Quant', q1: 277.0, q3: 260.0, ce: 18, rt: 14.23, window: 0.25, ri: 1598 },
                        ].map((row, idx) => (
                          <tr 
                            key={idx}
                            className={`hover:bg-gray-50 transition-colors ${
                              row.role === 'Quant' ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <td className="py-2 font-medium text-gray-900">{row.name}</td>
                            <td className="py-2 text-gray-600 font-mono text-xs">{row.cas}</td>
                            <td className="py-2">
                              <Badge 
                                variant={row.role === 'Quant' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {row.role}
                              </Badge>
                            </td>
                            <td className="py-2 text-right font-mono text-gray-900">{row.q1.toFixed(1)}</td>
                            <td className="py-2 text-right font-mono text-gray-900">{row.q3.toFixed(1)}</td>
                            <td className="py-2 text-right font-mono text-gray-900">{row.ce}</td>
                            <td className="py-2 text-right font-mono text-gray-900 font-medium">{row.rt.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono text-gray-600">±{row.window.toFixed(2)}</td>
                            <td className="py-2 text-right font-mono text-gray-600">{row.ri}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Footer Note */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      * Quant rows highlighted · RT window based on RI confidence · Ready for instrument import
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>
  );
}

