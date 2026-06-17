import { useState } from 'react';
import type { Animal, HealthStatus } from '@/types';
import {
  PawPrint, ChevronDown, ChevronUp, Scale, Home, Calendar,
  Shield, Info, Edit2, Trash2, Users, Heart, Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

function HealthBadge({ status }: { status: HealthStatus }) {
  const styles: Record<HealthStatus, string> = {
    sick: 'badge-red', quarantine: 'badge-yellow', recovering: 'badge-warm', healthy: 'badge-green',
  };
  const labels: Record<HealthStatus, string> = {
    sick: '生病', quarantine: '隔离中', recovering: '恢复中', healthy: '健康',
  };
  return <span className={styles[status]}>{labels[status]}</span>;
}

function GenderBadge({ gender }: { gender: 'male' | 'female' }) {
  return (
    <span className={`badge ${gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
      {gender === 'male' ? '♂ 雄性' : '♀ 雌性'}
    </span>
  );
}

interface AnimalCardProps {
  animal: Animal;
  onEdit: (animal: Animal) => void;
  onDelete: (animal: Animal) => void;
  onViewPedigree: (animal: Animal) => void;
  onViewHealth: (animal: Animal) => void;
}

export default function AnimalCard({ animal, onEdit, onDelete, onViewPedigree, onViewHealth }: AnimalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isQuarantine = animal.quarantine?.status === 'active';

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className={cn(
      'card card-hover-lift overflow-hidden cursor-pointer relative',
      isQuarantine && 'ring-2 ring-yellow-400 ring-offset-1'
    )} onClick={() => setExpanded(!expanded)}>
      {isQuarantine && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-white text-xs font-semibold py-1 px-3 text-center z-10">
          检疫隔离中
        </div>
      )}
      <div className="relative">
        <img src={animal.imageUrl} alt={animal.name} className={cn('w-full h-44 object-cover', isQuarantine && 'pt-6')} />
        <div className="absolute top-3 right-3 flex gap-1">
          <HealthBadge status={animal.healthStatus} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-forest-800 font-serif">{animal.name}</h4>
            <p className="text-sm text-gray-500">{animal.speciesName}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => handleAction(e, () => onEdit(animal))}
              className="p-1.5 rounded-lg text-gray-400 hover:text-forest-600 hover:bg-forest-50 transition-colors"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleAction(e, () => onDelete(animal))}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <GenderBadge gender={animal.gender} />
          <span className="badge bg-earth-100 text-earth-700">{animal.age}岁</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-earth-500" />
            <span>{animal.weight}kg</span>
          </div>
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3 text-forest-500" />
            <span className="truncate">{animal.enclosureName}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-cream-200 space-y-3 text-sm animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <div className="flex items-center gap-1"><Info className="w-4 h-4 text-forest-500" />学名：<em className="text-gray-500 text-xs">{animal.scientificName}</em></div>
              <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-earth-500" />出生：{animal.birthDate}</div>
              <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-warm-500" />保护：{animal.conservationStatus}</div>
              <div className="flex items-center gap-1"><PawPrint className="w-4 h-4 text-forest-500" />食性：{animal.dietType}</div>
              <div className="flex items-center gap-1 col-span-2"><Calendar className="w-4 h-4 text-earth-500" />入园：{animal.entryDate}</div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={(e) => handleAction(e, () => onViewPedigree(animal))}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />查看谱系
              </button>
              <button
                onClick={(e) => handleAction(e, () => onViewHealth(animal))}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Stethoscope className="w-3.5 h-3.5" />健康记录
              </button>
              <button
                onClick={(e) => handleAction(e, () => onEdit(animal))}
                className="btn-warm text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Heart className="w-3.5 h-3.5" />编辑档案
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
