import { useState } from 'react';
import { useAppStore } from '@/store';
import type { HealthRecord } from '@/types';
import { Plus, X } from 'lucide-react';

interface HealthRecordFormProps {
  onSubmit: (data: Omit<HealthRecord, 'id'>) => void;
  onCancel: () => void;
}

export default function HealthRecordForm({ onSubmit, onCancel }: HealthRecordFormProps) {
  const { animals } = useAppStore();
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    animalId: '',
    checkupDate: today,
    veterinarian: '',
    weight: 0,
    temperature: 37,
    heartRate: 80,
    bloodPressure: '120/80',
    overallStatus: '健康',
  });

  const [diagnoses, setDiagnoses] = useState<Array<{ condition: string; treatment: string; medication: string; followUpDate: string }>>([
    { condition: '', treatment: '', medication: '', followUpDate: '' }
  ]);

  const [vaccinations, setVaccinations] = useState<Array<{ vaccineName: string; date: string; nextDue: string }>>([
    { vaccineName: '', date: today, nextDue: '' }
  ]);

  const handleAnimalChange = (animalId: string) => {
    const animal = animals.find((a) => a.id === animalId);
    setFormData({ ...formData, animalId, weight: animal?.weight || 0 });
  };

  const addDiagnosis = () => {
    setDiagnoses([...diagnoses, { condition: '', treatment: '', medication: '', followUpDate: '' }]);
  };

  const removeDiagnosis = (idx: number) => {
    setDiagnoses(diagnoses.filter((_, i) => i !== idx));
  };

  const updateDiagnosis = (idx: number, key: string, value: string) => {
    const next = [...diagnoses];
    (next[idx] as any)[key] = value;
    setDiagnoses(next);
  };

  const addVaccination = () => {
    setVaccinations([...vaccinations, { vaccineName: '', date: today, nextDue: '' }]);
  };

  const removeVaccination = (idx: number) => {
    setVaccinations(vaccinations.filter((_, i) => i !== idx));
  };

  const updateVaccination = (idx: number, key: string, value: string) => {
    const next = [...vaccinations];
    (next[idx] as any)[key] = value;
    setVaccinations(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const animal = animals.find((a) => a.id === formData.animalId);
    if (!animal) return;

    const validDiagnoses = diagnoses.filter((d) => d.condition.trim());
    const validVaccinations = vaccinations.filter((v) => v.vaccineName.trim());

    onSubmit({
      animalId: formData.animalId,
      animalName: animal.name,
      checkupDate: formData.checkupDate,
      veterinarian: formData.veterinarian,
      weight: Number(formData.weight),
      temperature: Number(formData.temperature),
      heartRate: Number(formData.heartRate),
      bloodPressure: formData.bloodPressure,
      diagnoses: validDiagnoses,
      vaccinations: validVaccinations,
      overallStatus: formData.overallStatus,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">动物 *</label>
          <select
            className="input-field"
            value={formData.animalId}
            onChange={(e) => handleAnimalChange(e.target.value)}
            required
          >
            <option value="">请选择动物</option>
            {animals.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.speciesName})</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">检查日期 *</label>
          <input
            type="date"
            className="input-field"
            value={formData.checkupDate}
            onChange={(e) => setFormData({ ...formData, checkupDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">兽医 *</label>
          <input
            type="text"
            className="input-field"
            value={formData.veterinarian}
            onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">综合状态</label>
          <select
            className="input-field"
            value={formData.overallStatus}
            onChange={(e) => setFormData({ ...formData, overallStatus: e.target.value })}
          >
            <option value="健康">健康</option>
            <option value="恢复中">恢复中</option>
            <option value="治疗中">治疗中</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">体重(kg)</label>
          <input
            type="number" step="0.1" min="0"
            className="input-field"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">体温(°C)</label>
          <input
            type="number" step="0.1"
            className="input-field"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">心率(次/分)</label>
          <input
            type="number" min="0"
            className="input-field"
            value={formData.heartRate}
            onChange={(e) => setFormData({ ...formData, heartRate: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">血压</label>
          <input
            type="text"
            className="input-field"
            value={formData.bloodPressure}
            onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
            placeholder="120/80"
          />
        </div>
      </div>

      <div className="bg-cream-100 rounded-xl p-4 border border-cream-200">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-earth-700">诊断记录</label>
          <button type="button" onClick={addDiagnosis} className="text-xs btn-secondary py-1 px-2 flex items-center gap-1">
            <Plus className="w-3 h-3" />添加
          </button>
        </div>
        <div className="space-y-3">
          {diagnoses.map((d, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-cream-200 relative">
              {diagnoses.length > 1 && (
                <button type="button" onClick={() => removeDiagnosis(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-earth-600 mb-1">症状/诊断</label>
                  <input
                    type="text" className="input-field text-sm"
                    value={d.condition}
                    onChange={(e) => updateDiagnosis(idx, 'condition', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">复诊日期</label>
                  <input
                    type="date" className="input-field text-sm"
                    value={d.followUpDate}
                    onChange={(e) => updateDiagnosis(idx, 'followUpDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">治疗方案</label>
                  <input
                    type="text" className="input-field text-sm"
                    value={d.treatment}
                    onChange={(e) => updateDiagnosis(idx, 'treatment', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">用药</label>
                  <input
                    type="text" className="input-field text-sm"
                    value={d.medication}
                    onChange={(e) => updateDiagnosis(idx, 'medication', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-forest-50 rounded-xl p-4 border border-forest-100">
        <div className="flex items-center justify-between mb-3">
          <label className="font-medium text-earth-700">疫苗接种</label>
          <button type="button" onClick={addVaccination} className="text-xs btn-secondary py-1 px-2 flex items-center gap-1">
            <Plus className="w-3 h-3" />添加
          </button>
        </div>
        <div className="space-y-3">
          {vaccinations.map((v, idx) => (
            <div key={idx} className="bg-white rounded-lg p-3 border border-cream-200 relative">
              {vaccinations.length > 1 && (
                <button type="button" onClick={() => removeVaccination(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-earth-600 mb-1">疫苗名称</label>
                  <input
                    type="text" className="input-field text-sm"
                    value={v.vaccineName}
                    onChange={(e) => updateVaccination(idx, 'vaccineName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">接种日期</label>
                  <input
                    type="date" className="input-field text-sm"
                    value={v.date}
                    onChange={(e) => updateVaccination(idx, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-earth-600 mb-1">下次到期</label>
                  <input
                    type="date" className="input-field text-sm"
                    value={v.nextDue}
                    onChange={(e) => updateVaccination(idx, 'nextDue', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>取消</button>
        <button type="submit" className="btn-primary">保存记录</button>
      </div>
    </form>
  );
}
