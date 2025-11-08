'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Lock, Database, TrendingUp, Leaf } from 'lucide-react';
import Link from 'next/link';
import compoundsData from '@/data/compounds.json';

export default function CompoundLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');

  // 统计信息
  const stats = useMemo(() => {
    const families = compoundsData.reduce((acc, compound) => {
      acc[compound.family] = (acc[compound.family] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: compoundsData.length,
      families
    };
  }, []);

  // 筛选化合物
  const filteredCompounds = useMemo(() => {
    return compoundsData.filter(compound => {
      const matchesSearch = searchQuery === '' || 
        compound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        compound.cas.includes(searchQuery) ||
        (compound.synonyms && compound.synonyms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchesFamily = selectedFamily === 'all' || compound.family === selectedFamily;
      
      return matchesSearch && matchesFamily;
    });
  }, [searchQuery, selectedFamily]);

  // 热门化合物（前20个）
  const popularCompounds = compoundsData.slice(0, 20);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-primary text-white py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Database className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Compound Library
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              覆盖 {stats.total}+ 化合物的 MRM 参数库
            </p>
            
            {/* 搜索框 */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜索化合物名称、CAS号或同义词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 统计卡片 */}
      <div className="container mx-auto max-w-7xl px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white shadow-lg border-2 border-green-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.families['Pesticides'] || 0}
                </div>
                <div className="text-sm text-gray-600">农药残留</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg border-2 border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">200+</div>
                <div className="text-sm text-gray-600">环境污染物</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg border-2 border-orange-100 opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">Coming</div>
                <div className="text-sm text-gray-500">兽药残留</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 主内容 */}
      <div className="container mx-auto max-w-7xl px-6 pb-16">
        {searchQuery === '' ? (
          <>
            {/* 热门化合物 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">热门化合物</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularCompounds.map((compound) => (
                  <Card key={compound.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{compound.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {compound.family}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">CAS: {compound.cas}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        查看详情
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary" disabled>
                        <Lock className="h-3 w-3 mr-1" />
                        MRM 参数
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="p-8 bg-gradient-to-r from-primary/5 to-blue-50 border-2 border-primary/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  查看完整化合物数据库
                </h3>
                <p className="text-gray-600 mb-6">
                  免费注册即可访问 {stats.total}+ 种化合物的完整 MRM 参数
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/generator">
                    <Button size="lg" className="bg-primary">
                      立即试用
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    查看全部列表
                  </Button>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* 搜索结果 */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                搜索结果 ({filteredCompounds.length})
              </h2>
            </div>

            {filteredCompounds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompounds.map((compound) => (
                  <Card key={compound.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{compound.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {compound.family}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">CAS: {compound.cas}</p>
                    {compound.synonyms && compound.synonyms.length > 0 && (
                      <p className="text-xs text-gray-500 mb-3">
                        又名: {compound.synonyms[0]}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        查看详情
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary" disabled>
                        <Lock className="h-3 w-3 mr-1" />
                        参数
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg">
                  没有找到匹配的化合物
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  请尝试其他关键词或 CAS 号
                </p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

