import { useState, useMemo } from 'react';
import { useAppStore } from '@/store';
import type { Animal, HealthStatus } from '@/types';
import { PawPrint, Filter, AlertCircle, Users, TreeDeciduous, Plus, Search, Trash2 } from 'lucide-react';
import AnimalCard from './AnimalCard';
import AnimalDetailModal from './AnimalDetailModal';
import Modal from '@/components/UI/Modal';
import AnimalForm from '@/components/Forms/AnimalForm';

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

function PedigreeNode({
  animal, isRoot, relation, highlightId, onClick
}: {
  animal?: Animal;
  isRoot?: boolean;
  relation?: string;
  highlightId?: string;
  onClick?: (animal: Animal) => void;
}) {
  if (!animal) {
    return (
      <div className="w-36 h-24 rounded-xl border-2 border-dashed border-cream-300 flex items-center justify-center text-xs text-gray-400">
        未知
      </div>
    );
  }
  const isHighlight = animal.id === highlightId;
  return (
    <div className="flex flex-col items-center">
      {relation && <span className="text-xs text-gray-400 mb-1">{relation}</span>}
      <div
        onClick={() => onClick?.(animal)}
        className={`w-36 rounded-xl overflow-hidden border-2 bg-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
          isRoot ? 'border-forest-400 ring-2 ring-forest-200' : isHighlight ? 'border-warm-400 ring-2 ring-warm-200' : 'border-cream-300'
        }`}
      >
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
  const { animals, speciesList, enclosures, addAnimal, updateAnimal, deleteAnimal } = useAppStore();

  const [filters, setFilters] = useState({ species: 'all', health: 'all', enclosure: 'all', quarantine: 'all', search: '' });
  const [detailAnimal, setDetailAnimal] = useState<Animal | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editAnimal, setEditAnimal] = useState<Animal | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<Animal | null>(null);

  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      if (filters.species !== 'all' && a.speciesId !== filters.species) return false;
      if (filters.health !== 'all' && a.healthStatus !== filters.health) return false;
      if (filters.enclosure !== 'all' && a.enclosureId !== filters.enclosure) return false;
      if (filters.quarantine !== 'all') {
        if (filters.quarantine === 'active' && a.quarantine?.status !== 'active') return false;
        if (filters.quarantine === 'completed' && a.quarantine?.status !== 'completed') return false;
      }
      if (filters.search && !a.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [animals, filters]);

  const quarantinedAnimals = animals.filter((a) => a.quarantine?.status === 'active');

  const tuanTuanFamily = useMemo(() => {
    const tuanTuan = animals.find((a) => a.id === 'a001');
    const yuanYuan = animals.find((a) => a.id === 'a002');
    const children = animals.filter((a) => a.pedigree?.fatherId === 'a001' || a.pedigree?.motherId === 'a002');
    return { tuanTuan, yuanYuan, children };
  }, [animals]);

  const healthOptions: { value: string; label: string }[] = [
    { value: 'all', label: '全部状态' },
    { value: 'healthy', label: '健康' },
    { value: 'sick', label: '生病' },
    { value: 'recovering', label: '恢复中' },
    { value: 'quarantine', label: '隔离中' },
  ];

  const handleViewPedigree = (animal: Animal) => {
    setDetailAnimal(animal);
    setDetailOpen(true);
  };

  const handleViewHealth = (animal: Animal) => {
    setDetailAnimal(animal);
    setDetailOpen(true);
  };

  const handleEdit = (animal: Animal) => {
    setEditAnimal(animal);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteAnimal(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editAnimal) {
      updateAnimal(editAnimal.id, data);
    } else {
      addAnimal(data);
    }
    setFormOpen(false);
    setEditAnimal(undefined);
  };

  const handlePedigreeClick = (animal: Animal) => {
    setDetailAnimal(animal);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-forest-700">
              <Filter className="w-5 h-5" />
              <span className="font-semibold">筛选条件</span>
            </div>
            <button
              onClick={() => { setEditAnimal(undefined); setFormOpen(true); }}
              className="btn-primary flex items-center gap-1.5 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />新增动物
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="input-field w-44"
              value={filters.species}
              onChange={(e) => setFilters({ ...filters, species: e.target.value })}
            >
              <option value="all">全部物种</option>
              {speciesList.map((sp) => (<option key={sp.id} value={sp.id}>{sp.commonName}</option>))}
            </select>
            <select
              className="input-field w-40"
              value={filters.health}
              onChange={(e) => setFilters({ ...filters, health: e.target.value })}
            >
              {healthOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            <select
              className="input-field w-44"
              value={filters.enclosure}
              onChange={(e) => setFilters({ ...filters, enclosure: e.target.value })}
            >
              <option value="all">全部笼舍</option>
              {enclosures.map((enc) => (<option key={enc.id} value={enc.id}>{enc.name}</option>))}
            </select>
            <select
              className="input-field w-36"
              value={filters.quarantine}
              onChange={(e) => setFilters({ ...filters, quarantine: e.target.value })}
            >
              <option value="all">全部检疫</option>
              <option value="active">隔离中</option>
              <option value="completed">已解除</option>
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="input-field pl-9"
                placeholder="搜索动物名称..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 self-center">
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
                      <p className="text-xs text-yellow-700">隔离开始：{animal.quarantine.startDate} · {animal.quarantine.notes}</p>
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
              onEdit={handleEdit}
              onDelete={(a) => setDeleteConfirm(a)}
              onViewPedigree={handleViewPedigree}
              onViewHealth={handleViewHealth}
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
          <span className="text-xs text-gray-400">（点击卡片查看详情）</span>
        </div>
        <div className="flex flex-col items-center py-4 overflow-x-auto">
          <div className="flex items-center gap-12 mb-6">
            <PedigreeNode relation="父亲" onClick={handlePedigreeClick} highlightId={detailAnimal?.id} />
            <PedigreeNode relation="母亲" onClick={handlePedigreeClick} highlightId={detailAnimal?.id} />
          </div>
          <div className="w-px h-6 bg-cream-400" />
          <div className="flex items-center gap-8 mb-2">
            <PedigreeNode animal={tuanTuanFamily.tuanTuan} isRoot relation="团团（父）" onClick={handlePedigreeClick} highlightId={detailAnimal?.id} />
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-warm-100 text-warm-600 text-lg">❤</div>
            <PedigreeNode animal={tuanTuanFamily.yuanYuan} isRoot relation="圆圆（母）" onClick={handlePedigreeClick} highlightId={detailAnimal?.id} />
          </div>
          <div className="flex items-center gap-8 my-2">
            <div className="w-px h-6 bg-cream-400" />
          </div>
          <div className="flex items-center gap-6">
            {tuanTuanFamily.children.map((child) => (
              <PedigreeNode key={child.id} animal={child} relation={child.gender === 'male' ? '儿子' : '女儿'} onClick={handlePedigreeClick} highlightId={detailAnimal?.id} />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <Users className="w-4 h-4" />
            <span>家族成员：共 {2 + tuanTuanFamily.children.length} 只 · 大熊猫物种</span>
          </div>
        </div>
      </div>

      <AnimalDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        animal={detailAnimal}
        onSelectAnimal={(a) => setDetailAnimal(a)}
      />

      <Modal open={formOpen} onClose={() => { setFormOpen(false); setEditAnimal(undefined); }} title={editAnimal ? '编辑动物档案' : '新增动物'} size="lg">
        <AnimalForm
          animal={editAnimal}
          onSubmit={handleFormSubmit}
          onCancel={() => { setFormOpen(false); setEditAnimal(undefined); }}
        />
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="确认删除"
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>取消</button>
            <button className="btn-primary bg-red-600 hover:bg-red-700" onClick={handleDelete}>确认删除</button>
          </>
        }
      >
        <div className="py-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-gray-800 font-medium">确定要删除 "{deleteConfirm?.name}" 吗？</p>
            <p className="text-sm text-gray-500 mt-1">此操作不可撤销，相关数据将永久丢失。</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
