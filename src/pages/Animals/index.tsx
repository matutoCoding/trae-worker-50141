import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import type { Animal, HealthStatus } from '@/types';
import {
  PawPrint, Filter, ChevronDown, ChevronUp, Scale, Home, Calendar,
  AlertCircle, Users, TreeDeciduous, Shield, Info
} from 'lucide-react';

function HealthBadge({ status }: { status: HealthStatus }) {
  const styles: Record<HealthStatus, string> = {
    sick: 'badge-red',
    quarantine: 'badge-yellow',
    recovering: 'badge-warm',
    healthy: 'badge-green',
  };
  const labels: Record<HealthStatus, string> = {
    sick: '生病',
    quarantine: '隔离中',
    recovering: '恢复中',
    healthy: '健康',
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

function AnimalCard({ animal, expanded, onToggle }: { animal: Animal; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="card card-hover-lift overflow-hidden cursor-pointer" onClick={onToggle}>
      <div className="relative">
        <img src={animal.imageUrl} alt={animal.name} className="w-full h-44 object-cover" />
        <div className="absolute top-3 right-3">
          <HealthBadge status={animal.healthStatus} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-lg font-bold text-forest-800 font-serif">{animal.name}</h4>
            <p className="text-sm text-gray-500">{animal.speciesName}</p>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
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
          <div className="mt-4 pt-4 border-t border-cream-200 space-y-2 text-sm animate-fade-in">
            <div className="flex items-center gap-2 text-gray-600">
              <Info className="w-4 h-4 text-forest-500" />
              <span>学名：<em className="text-gray-500">{animal.scientificName}</em></span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-earth-500" />
              <span>出生日期：{animal.birthDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4 text-warm-500" />
              <span>保护级别：{animal.conservationStatus}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <PawPrint className="w-4 h-4 text-forest-500" />
              <span>食性：{animal.dietType}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 text-earth-500" />
              <span>入园日期：{animal.entryDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PedigreeNode({ animal, isRoot, relation }: { animal?: Animal; isRoot?: boolean; relation?: string }) {
  if (!animal) {
    return (
      <div className="w-36 h-24 rounded-xl border-2 border-dashed border-cream-300 flex items-center justify-center text-xs text-gray-400">
        未知
      </div>
    );
  }
  return (
    <div className={`flex flex-col items-center ${isRoot ? '' : ''}`}>
      {relation && <span className="text-xs text-gray-400 mb-1">{relation}</span>}
      <div className={`w-36 rounded-xl overflow-hidden border-2 ${isRoot ? 'border-forest-400 ring-2 ring-forest-200' : 'border-cream-300'} bg-white shadow-sm`}>
        <img src={animal.imageUrl} alt={animal.name} className="w-full h-20 object-cover" />
        <div className="p-2 text-center">
          <p className="font-semibold text-sm text-forest-800">{animal.name}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <GenderBadge gender={animal.gender} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Animals() {
  const { animals, speciesList } = useAppStore();
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedHealth, setSelectedHealth] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      if (selectedSpecies !== 'all' && a.speciesId !== selectedSpecies) return false;
      if (selectedHealth !== 'all' && a.healthStatus !== selectedHealth) return false;
      return true;
    });
  }, [animals, selectedSpecies, selectedHealth]);

  const quarantinedAnimals = animals.filter((a) => a.healthStatus === 'quarantine');

  const tuanTuanFamily = useMemo(() => {
    const tuanTuan = animals.find((a) => a.id === 'a001');
    const yuanYuan = animals.find((a) => a.id === 'a002');
    const children = animals.filter((a) => a.pedigree?.fatherId === 'a001' || a.pedigree?.motherId === 'a002');
    const father = tuanTuan?.pedigree?.fatherName ? { name: tuanTuan.pedigree.fatherName, id: tuanTuan.pedigree.fatherId } : null;
    const mother = tuanTuan?.pedigree?.motherName ? { name: tuanTuan.pedigree.motherName, id: tuanTuan.pedigree.motherId } : null;
    return { tuanTuan, yuanYuan, children, father, mother };
  }, [animals]);

  const healthOptions: { value: string; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'healthy', label: '健康' },
    { value: 'sick', label: '生病' },
    { value: 'recovering', label: '恢复中' },
    { value: 'quarantine', label: '隔离中' },
  ];

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex items-center gap-2 text-forest-700">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">筛选条件</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="input-field w-44"
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
            >
              <option value="all">全部物种</option>
              {speciesList.map((sp) => (
                <option key={sp.id} value={sp.id}>{sp.commonName}</option>
              ))}
            </select>
            <select
              className="input-field w-44"
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
            >
              {healthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              共 <span className="font-bold text-forest-700">{filteredAnimals.length}</span> 只动物
            </div>
          </div>
        </div>
      </div>

      {quarantinedAnimals.length > 0 && (
        <div className="card p-5 border-yellow-300 bg-yellow-50/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-forest-800 font-serif">检疫隔离区</h3>
            <span className="badge-yellow">{quarantinedAnimals.length} 只</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quarantinedAnimals.map((animal) => (
              <div key={animal.id} className="p-4 bg-white rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3">
                  <img src={animal.imageUrl} alt={animal.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{animal.name}</p>
                      <HealthBadge status={animal.healthStatus} />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{animal.speciesName} · {animal.enclosureName}</p>
                    {animal.quarantine && (
                      <p className="text-xs text-yellow-700">
                        隔离开始：{animal.quarantine.startDate} · {animal.quarantine.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <PawPrint className="w-5 h-5 text-forest-600" />
          <h3 className="text-lg font-bold text-forest-800 font-serif">动物档案</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              expanded={expandedId === animal.id}
              onToggle={() => setExpandedId(expandedId === animal.id ? null : animal.id)}
            />
          ))}
        </div>
        {filteredAnimals.length === 0 && (
          <div className="card p-12 text-center text-gray-400">未找到符合条件的动物</div>
        )}
      </div>

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-6">
          <TreeDeciduous className="w-5 h-5 text-forest-600" />
          <h3 className="text-lg font-bold text-forest-800 font-serif">谱系血缘 - 团团家族</h3>
        </div>
        <div className="flex flex-col items-center py-4 overflow-x-auto">
          <div className="flex items-center gap-12 mb-6">
            <PedigreeNode relation="父亲" />
            <PedigreeNode relation="母亲" />
          </div>
          <div className="w-px h-6 bg-cream-400" />
          <div className="flex items-center gap-8 mb-2">
            <PedigreeNode animal={tuanTuanFamily.tuanTuan} isRoot relation="团团（父）" />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 text-warm-600 text-lg">❤</div>
            <PedigreeNode animal={tuanTuanFamily.yuanYuan} isRoot relation="圆圆（母）" />
          </div>
          <div className="flex items-center gap-8 my-2">
            <div className="w-px h-6 bg-cream-400" />
          </div>
          <div className="flex items-center gap-6">
            {tuanTuanFamily.children.map((child) => (
              <PedigreeNode key={child.id} animal={child} relation={child.gender === 'male' ? '儿子' : '女儿'} />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <Users className="w-4 h-4" />
            <span>家族成员：共 {2 + tuanTuanFamily.children.length} 只 · 大熊猫物种</span>
          </div>
        </div>
      </div>
    </div>
  );
}
