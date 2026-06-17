import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAppStore } from '@/store';
import type { Animal, Gender, HealthStatus } from '@/types';
import { PawPrint, Info } from 'lucide-react';

interface AnimalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  initialData?: Animal;
}

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'male', label: '雄性' },
  { value: 'female', label: '雌性' },
];

const healthStatusOptions: { value: HealthStatus; label: string }[] = [
  { value: 'healthy', label: '健康' },
  { value: 'sick', label: '患病' },
  { value: 'quarantine', label: '隔离中' },
  { value: 'recovering', label: '康复中' },
];

const defaultImageUrl =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=adorable%20zoo%20animal%20portrait%20professional%20photo%20natural%20lighting&image_size=square';

export default function AnimalForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AnimalFormProps) {
  const { speciesList, enclosures, addAnimal, updateAnimal } = useAppStore();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    speciesId: '',
    speciesName: '',
    scientificName: '',
    gender: 'male' as Gender,
    birthDate: '',
    weight: 0,
    entryDate: '',
    healthStatus: 'healthy' as HealthStatus,
    enclosureId: '',
    enclosureName: '',
    conservationStatus: '',
    dietType: '',
    imageUrl: defaultImageUrl,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        speciesId: initialData.speciesId,
        speciesName: initialData.speciesName,
        scientificName: initialData.scientificName,
        gender: initialData.gender,
        birthDate: initialData.birthDate,
        weight: initialData.weight,
        entryDate: initialData.entryDate,
        healthStatus: initialData.healthStatus,
        enclosureId: initialData.enclosureId,
        enclosureName: initialData.enclosureName,
        conservationStatus: initialData.conservationStatus,
        dietType: initialData.dietType,
        imageUrl: initialData.imageUrl || defaultImageUrl,
      });
    } else {
      setFormData({
        name: '',
        speciesId: '',
        speciesName: '',
        scientificName: '',
        gender: 'male',
        birthDate: new Date().toISOString().slice(0, 10),
        weight: 0,
        entryDate: new Date().toISOString().slice(0, 10),
        healthStatus: 'healthy',
        enclosureId: '',
        enclosureName: '',
        conservationStatus: '',
        dietType: '',
        imageUrl: defaultImageUrl,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSpeciesChange = (speciesId: string) => {
    const species = speciesList.find((s) => s.id === speciesId);
    setFormData((prev) => ({
      ...prev,
      speciesId,
      speciesName: species?.commonName || '',
      scientificName: species?.scientificName || '',
      conservationStatus: species?.conservationStatus || '',
      dietType: species?.dietType || '',
    }));
  };

  const handleEnclosureChange = (enclosureId: string) => {
    const enclosure = enclosures.find((e) => e.id === enclosureId);
    setFormData((prev) => ({
      ...prev,
      enclosureId,
      enclosureName: enclosure?.name || '',
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入动物名称';
    if (!formData.speciesId) newErrors.speciesId = '请选择物种';
    if (!formData.birthDate) newErrors.birthDate = '请选择出生日期';
    if (formData.weight <= 0) newErrors.weight = '请输入有效体重';
    if (!formData.entryDate) newErrors.entryDate = '请选择入园日期';
    if (!formData.enclosureId) newErrors.enclosureId = '请选择笼舍';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && initialData) {
      updateAnimal(initialData.id, formData);
    } else {
      addAnimal(formData);
    }

    onSubmit?.();
    onClose();
  };

  const inputClass = (field: string) =>
    `input-field ${errors[field] ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`;

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? '编辑动物档案' : '新增动物档案'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            取消
          </button>
          <button
            type="submit"
            form="animal-form"
            className="btn-primary flex items-center gap-2"
          >
            <PawPrint className="w-4 h-4" />
            {isEditing ? '保存修改' : '创建档案'}
          </button>
        </>
      }
    >
      <form id="animal-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-start gap-4 p-4 bg-forest-50 rounded-xl border border-forest-100">
          <img
            src={formData.imageUrl || defaultImageUrl}
            alt="预览"
            className="w-24 h-24 rounded-xl object-cover border-2 border-cream-300"
          />
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-forest-700">
              图片URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="输入图片链接，留空使用默认图片"
              className="input-field text-sm"
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              图片将显示在动物卡片和档案中
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              动物名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="例如：团团"
              className={inputClass('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              物种 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.speciesId}
              onChange={(e) => handleSpeciesChange(e.target.value)}
              className={inputClass('speciesId')}
            >
              <option value="">请选择物种</option>
              {speciesList.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.commonName}
                </option>
              ))}
            </select>
            {errors.speciesId && (
              <p className="text-xs text-red-500 mt-1">{errors.speciesId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              学名
            </label>
            <input
              type="text"
              value={formData.scientificName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  scientificName: e.target.value,
                }))
              }
              placeholder="选择物种后自动填充"
              className="input-field italic text-gray-600"
              readOnly={!!formData.speciesId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              性别 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  gender: e.target.value as Gender,
                }))
              }
              className="input-field"
            >
              {genderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              出生日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, birthDate: e.target.value }))
              }
              className={inputClass('birthDate')}
            />
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              体重 (kg) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={formData.weight}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  weight: parseFloat(e.target.value) || 0,
                }))
              }
              className={inputClass('weight')}
            />
            {errors.weight && (
              <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              入园日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.entryDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, entryDate: e.target.value }))
              }
              className={inputClass('entryDate')}
            />
            {errors.entryDate && (
              <p className="text-xs text-red-500 mt-1">{errors.entryDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              健康状态
            </label>
            <select
              value={formData.healthStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  healthStatus: e.target.value as HealthStatus,
                }))
              }
              className="input-field"
            >
              {healthStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              所在笼舍 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.enclosureId}
              onChange={(e) => handleEnclosureChange(e.target.value)}
              className={inputClass('enclosureId')}
            >
              <option value="">请选择笼舍</option>
              {enclosures.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} (容量: {e.capacity}，当前: {e.currentOccupancy})
                </option>
              ))}
            </select>
            {errors.enclosureId && (
              <p className="text-xs text-red-500 mt-1">
                {errors.enclosureId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              保护级别
            </label>
            <input
              type="text"
              value={formData.conservationStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  conservationStatus: e.target.value,
                }))
              }
              placeholder="选择物种后自动填充，如：易危、濒危"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-700 mb-1.5">
              食性
            </label>
            <input
              type="text"
              value={formData.dietType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dietType: e.target.value }))
              }
              placeholder="选择物种后自动填充，如：植食性、肉食性"
              className="input-field"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
