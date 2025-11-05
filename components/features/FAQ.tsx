'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about RT prediction and method generation</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              RT 预测的前提与误差范围？
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              RT预测基于RI（保留指数）标定。需要使用C8–C35正构烷烃在当前GC方法下进行标定。
              典型误差范围：±0.2–0.5 min（取决于化合物极性、柱况、标定质量）。
              建议设置RT窗口为预测值±0.3 min以确保覆盖。
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              方法不等效时怎么办？（重新做 RI 标定）
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              如果您使用的GC方法与预设不同（不同温度程序、不同柱长/内径），需要重新进行RI标定：
              1. 在您的方法下运行C8–C35烷烃混标
              2. 记录各烷烃的实际RT
              3. 上传到系统进行RI→RT映射
              4. 系统将根据化合物RI自动计算新方法下的RT
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              是否支持 RT Lock？在什么条件下可用？
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              支持RT Lock功能（仅CF40-LOCKABLE方法）。使用条件：
              1. 选择支持RT Lock的GC方法（如CF40-LOCKABLE）
              2. 指定锁定化合物（推荐：Chlorpyrifos-methyl）
              3. 输入该化合物在您系统中的实际RT
              4. 系统将自动平移所有其他化合物的RT以匹配您的系统
              适用场景：不同仪器间方法迁移、系统性RT偏移校正。
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              不同厂商 CE 差异如何处理？（CE 基线 + ΔCE）
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              CE值基于文献优化的基线值。不同厂商QQQ仪器的CE可能存在±5 eV差异。
              解决方案：
              1. 使用提供的CE基线值作为起点
              2. 开启ΔCE扫描功能（Pro功能）：自动生成CE±4 eV或±6 eV的梯度
              3. 根据实际响应选择最优CE
              4. 保存优化后的CE值供后续使用
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-6">
            <AccordionTrigger className="text-left font-semibold">
              导出格式与兼容性？（CSV/TXT；vendor-compatible 另见 Pro）
            </AccordionTrigger>
            <AccordionContent className="text-gray-600">
              支持多种导出格式：
              - Generic CSV：标准CSV格式，包含所有MRM参数（Q1/Q3/CE/RT/Window）
              - Vendor-compatible TXT：特定厂商格式（Pro功能）
              - 支持直接导入主流GC-MS/MS软件
              Free用户可导出示例数据（前5条transitions）
              Pro用户可导出完整方法并选择特定厂商格式
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
