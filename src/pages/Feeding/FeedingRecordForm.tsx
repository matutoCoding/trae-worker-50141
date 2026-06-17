import { useState } from 'react';
import type { FeedingPlan, FeedingRecord } from '@/types';

interface FeedingRecordFormProps {
  plan: FeedingPlan;
  onSubmit: (data: Omit<FeedingRecord, 'id'>) => void;
  onCancel: () => void;
}

export default function FeedingRecordForm({ plan, onSubmit, onCancel }: FeedingRecordFormProps) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    actualQuantity: plan.quantity,
    remainingAmount: 0,
    feeder: '',
    notes: '',
    status: 'completed' as FeedingRecord['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status: FeedingRecord['status'] = formData.actualQuantity >= plan.quantity
      ? 'completed'
      : formData.actualQuantity > 0
        ? 'partial'
        : 'missed';
    onSubmit({
      planId: plan.id,
      animalId: plan.animalId,
      animalName: plan.animalName,
      formulaName: plan.formulaName,
      feedingDateTime: dateStr,
      plannedQuantity: plan.quantity,
      actualQuantity: formData.actualQuantity,
      remainingAmount: formData.remainingAmount,
      feeder: formData.feeder,
      notes: formData.notes,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
        <h4 className="font-semibold text-forest-700 mb-2">饲喂计划信息</h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
          <div>动物：<span className="font-medium text-earth-800">{plan.animalName}</span></div>
          <div>配方：<span className="font-medium text-earth-800">{plan.formulaName}</span></div>
          <div>时间：<span className="font-medium text-earth-800">{plan.feedingTime}</span></div>
          <div>计划量：<span className="font-medium text-earth-800">{plan.quantity} {plan.unit}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">实际投喂量 ({plan.unit}) *</label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="input-field"
            value={formData.actualQuantity}
            onChange={(e) => setFormData({ ...formData, actualQuantity: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">剩余量 ({plan.unit})</label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="input-field"
            value={formData.remainingAmount}
            onChange={(e) => setFormData({ ...formData, remainingAmount: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">投喂人 *</label>
        <input
          type="text"
          className="input-field"
          value={formData.feeder}
          onChange={(e) => setFormData({ ...formData, feeder: e.target.value })}
          placeholder="请输入投喂人姓名"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">备注</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="记录进食情况、动物状态等..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>取消</button>
        <button type="submit" className="btn-primary">提交记录</button>
      </div>
    </form>
  );
}
