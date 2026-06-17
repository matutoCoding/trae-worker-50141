import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import type { Animal, HealthStatus, Gender } from '@/types';

interface AnimalFormProps {
  animal?: Animal;
  onSubmit: (data: Omit<Animal, 'id'> | Partial<Animal>) => void;
  onCancel: () => void;
}

export default function AnimalForm({ animal, onSubmit, onCancel }: AnimalFormProps) {
  const { speciesList, enclosures } = useAppStore();
  const isEdit = !!animal;

  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    speciesName: '',
    scientificName: '',
    gender: 'male' as Gender,
    birthDate: '',
    age: 0,
    weight: 0,
    entryDate: '',
    healthStatus: 'healthy' as HealthStatus,
    enclosureId: '',
    enclosureName: '',
    imageUrl: '',
    conservationStatus: '',
    dietType: '',
  });

  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name,
        speciesId: animal.speciesId,
        speciesName: animal.speciesName,
        scientificName: animal.scientificName,
        gender: animal.gender,
        birthDate: animal.birthDate,
        age: animal.age,
        weight: animal.weight,
        entryDate: animal.entryDate,
        healthStatus: animal.healthStatus,
        enclosureId: animal.enclosureId,
        enclosureName: animal.enclosureName,
        imageUrl: animal.imageUrl,
        conservationStatus: animal.conservationStatus,
        dietType: animal.dietType,
      });
    }
  }, [animal]);

  const handleSpeciesChange = (speciesId: string) => {
    const sp = speciesList.find((s) => s.id === speciesId);
    setFormData((prev) => ({
      ...prev,
      speciesId,
      speciesName: sp?.commonName || '',
      scientificName: sp?.scientificName || '',
      conservationStatus: sp?.conservationStatus || '',
      dietType: sp?.dietType || '',
    }));
  };

  const handleEnclosureChange = (enclosureId: string) => {
    const enc = enclosures.find((e) => e.id === enclosureId);
    setFormData((prev) => ({
      ...prev,
      enclosureId,
      enclosureName: enc?.name || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && animal) {
      onSubmit(formData);
    } else {
      onSubmit({
        ...formData,
        pedigree: { childrenIds: [] },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">动物名称 *</label>
          <input
            type="text"
            className="input-field"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">性别 *</label>
          <select
            className="input-field"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            required
          >
            <option value="male">雄性</option>
            <option value="female">雌性</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">物种 *</label>
          <select
            className="input-field"
            value={formData.speciesId}
            onChange={(e) => handleSpeciesChange(e.target.value)}
            required
          >
            <option value="">请选择物种</option>
            {speciesList.map((sp) => (
              <option key={sp.id} value={sp.id}>{sp.commonName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">笼舍 *</label>
          <select
            className="input-field"
            value={formData.enclosureId}
            onChange={(e) => handleEnclosureChange(e.target.value)}
            required
          >
            <option value="">请选择笼舍</option>
            {enclosures.map((enc) => (
              <option key={enc.id} value={enc.id}>{enc.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">出生日期</label>
          <input
            type="date"
            className="input-field"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">入园日期</label>
          <input
            type="date"
            className="input-field"
            value={formData.entryDate}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">年龄</label>
          <input
            type="number"
            min="0"
            className="input-field"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">体重 (kg)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            className="input-field"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-700 mb-1">健康状态</label>
          <select
            className="input-field"
            value={formData.healthStatus}
            onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value as HealthStatus })}
          >
            <option value="healthy">健康</option>
            <option value="sick">生病</option>
            <option value="recovering">恢复中</option>
            <option value="quarantine">隔离中</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-earth-700 mb-1">图片URL</label>
        <input
          type="url"
          className="input-field"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" className="btn-secondary" onClick={onCancel}>取消</button>
        <button type="submit" className="btn-primary">{isEdit ? '保存修改' : '新增动物'}</button>
      </div>
    </form>
  );
}
