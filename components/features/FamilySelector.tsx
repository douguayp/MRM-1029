/**
 * 化合物家族选择器组件
 * 
 * 修改说明：优化在Header深蓝色背景上的显示效果
 * 修改逻辑：
 * 1. 激活状态使用白色背景 + 深蓝色文字，形成反转效果
 * 2. 未激活和禁用状态使用半透明白色背景，融入Header
 * 3. 增加悬停效果，提升交互体验
 * 4. 调整字体大小和内边距，使其更协调
 */

'use client';

import { Family } from '@/lib/types';

interface FamilySelectorProps {
  value: Family;
  onChange: (family: Family) => void;
}

export function FamilySelector({ value, onChange }: FamilySelectorProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {/* Pesticides - 农药家族（已启用） */}
      <button
        onClick={() => onChange('Pesticides')}
        className={`px-7 py-3 rounded-lg font-semibold text-lg transition-all ${
          value === 'Pesticides'
            ? 'bg-white text-primary shadow-lg scale-105'
            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
        }`}
      >
        Pesticides
        {/* 修改说明：增大标签文字 */}
        {value === 'Pesticides' && <span className="ml-2 text-base font-normal">(Enabled)</span>}
      </button>
      
      {/* Environmental - 环境家族（即将推出） */}
      <button
        disabled
        className="px-7 py-3 rounded-lg font-semibold text-lg bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
      >
        Environmental <span className="text-base font-normal">(Coming Soon)</span>
      </button>
      
      {/* Veterinary - 兽药家族（即将推出） */}
      <button
        disabled
        className="px-7 py-3 rounded-lg font-semibold text-lg bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
      >
        Veterinary <span className="text-base font-normal">(Coming Soon)</span>
      </button>
    </div>
  );
}
