/**
 * 步骤指示器组件
 * 
 * 功能说明：
 * 1. 显示工作流的3个主要步骤：输入化合物 -> 选择路径 -> 配置结果
 * 2. 动态显示步骤状态（进行中/已完成/未开始）
 * 3. 响应式设计：桌面端显示完整信息，移动端显示紧凑版本
 * 4. 使用EPA风格的深蓝色配色方案
 */

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// 步骤类型定义：限制只能是这三个值之一
export type StepType = 'input' | 'path' | 'configure';

// 单个步骤的数据结构
interface Step {
  id: StepType;           // 步骤唯一标识符
  number: number;         // 步骤序号（用于显示）
  title: string;          // 步骤标题
  description: string;    // 步骤描述
}

// 组件Props接口
interface StepIndicatorProps {
  currentStep: StepType;        // 当前激活的步骤
  completedSteps: StepType[];   // 已完成的步骤数组
}

// 步骤配置：定义所有步骤的静态信息
const steps: Step[] = [
  {
    id: 'input',
    number: 1,
    title: '输入目标化合物',
    description: '粘贴或上传化合物列表'
  },
  {
    id: 'path',
    number: 2,
    title: '选择生成路径',
    description: '选择方法类型'
  },
  {
    id: 'configure',
    number: 3,
    title: '配置 & 结果',
    description: '查看和导出方法'
  }
];

/**
 * 步骤指示器主组件
 */
export function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  // 获取当前步骤在数组中的索引位置（用于判断连接线的状态）
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  /**
   * 判断步骤的状态
   * 
   * 状态判断逻辑（优先级从高到低）：
   * 1. 如果在已完成列表中 -> completed（已完成）
   * 2. 如果是当前步骤 -> active（进行中）
   * 3. 其他情况 -> inactive（未开始）
   * 
   * @param step - 要判断的步骤对象
   * @returns 步骤状态：'completed' | 'active' | 'inactive'
   */
  function getStepStatus(step: Step): 'completed' | 'active' | 'inactive' {
    if (completedSteps.includes(step.id)) return 'completed';
    if (step.id === currentStep) return 'active';
    return 'inactive';
  }

  return (
    <div className="w-full mb-8">
      {/* 桌面端视图：显示完整的步骤信息，包括图标、标题和描述 */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          // 获取步骤状态并转换为布尔值，便于条件渲染
          const status = getStepStatus(step);
          const isActive = status === 'active';      // 当前进行中的步骤
          const isCompleted = status === 'completed'; // 已完成的步骤
          const isInactive = status === 'inactive';   // 未开始的步骤
          const isLast = index === steps.length - 1;  // 是否是最后一个步骤（用于判断是否显示连接线）

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* 步骤圆圈：显示步骤序号或完成图标 */}
                <div
                  className={cn(
                    'relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300',
                    {
                      'bg-primary border-primary text-primary-foreground shadow-lg scale-110':
                        isActive,
                      'bg-primary/90 border-primary text-white shadow-md': isCompleted,
                      'bg-gray-100 border-gray-300 text-gray-400': isInactive
                    }
                  )}
                >
                  {/* 已完成：显示对勾图标；未完成：显示步骤序号 */}
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-base font-bold">{step.number}</span>
                  )}
                </div>

                {/* 步骤信息：标题和描述 */}
                <div className="mt-3 text-center px-2">
                  {/* 修改说明：增大步骤标题字体 */}
                  <div
                    className={cn('text-lg font-semibold transition-colors whitespace-nowrap', {
                      'text-primary': isActive,
                      'text-gray-900': isCompleted,
                      'text-gray-400': isInactive
                    })}
                  >
                    {step.title}
                  </div>
                  {/* 修改说明：增大步骤描述字体 */}
                  <div
                    className={cn('text-base mt-1 transition-colors', {
                      'text-gray-600': isActive || isCompleted,
                      'text-gray-400': isInactive
                    })}
                  >
                    {step.description}
                  </div>
                </div>
              </div>

              {/* 连接线：连接相邻步骤的横线，根据进度变色 */}
              {!isLast && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4 mb-12 transition-all duration-300',
                    {
                      // 已完成步骤之间的连接线：深蓝色实线
                      'bg-primary': index < currentStepIndex,
                      // 当前步骤前的连接线：浅蓝色
                      'bg-primary/70': index === currentStepIndex - 1,
                      // 未完成步骤之间的连接线：灰色
                      'bg-gray-300': index >= currentStepIndex
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 移动端视图：紧凑式圆点显示，节省空间 */}
      <div className="md:hidden">
        {/* 步骤圆点行：横向排列的小圆点 */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step);
            const isActive = status === 'active';
            const isCompleted = status === 'completed';
            const isInactive = status === 'inactive';

            return (
              <div key={step.id} className="flex items-center">
                {/* 步骤圆点：移动端使用较小的圆圈 */}
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300',
                    {
                      'bg-primary border-primary text-primary-foreground shadow-md scale-110':
                        isActive,
                      'bg-primary/90 border-primary text-white shadow-sm': isCompleted,
                      'bg-gray-100 border-gray-300 text-gray-400': isInactive
                    }
                  )}
                >
                  {/* 圆点内容：对勾或序号 */}
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{step.number}</span>
                  )}
                </div>
                {/* 步骤间的短连接线 */}
                {index < steps.length - 1 && (
                  <div
                    className={cn('w-8 h-0.5 mx-1 transition-all duration-300', {
                      'bg-primary': index < currentStepIndex,
                      'bg-primary/70': index === currentStepIndex - 1,
                      'bg-gray-300': index >= currentStepIndex
                    })}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* 当前步骤的详细信息：显示在圆点下方 */}
        <div className="text-center">
          {steps.map(
            (step) =>
              step.id === currentStep && (
                <div key={step.id}>
                  {/* 修改说明：移动端增大当前步骤标题 */}
                  <div className="text-xl font-semibold text-primary">
                    {step.title}
                  </div>
                  {/* 修改说明：移动端增大当前步骤描述 */}
                  <div className="text-lg text-gray-600 mt-1">
                    {step.description}
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}

