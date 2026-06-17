import Modal from '@/components/UI/Modal';
import { useAppStore } from '@/store';
import type { TimelineItem } from '@/store';
import type { Animal } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Scale, Home, Calendar, Shield, PawPrint, Users, Heart, Clock, ChevronRight } from 'lucide-react';

interface AnimalDetailModalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal | null;
  onSelectAnimal: (animal: Animal) => void;
}

function HealthBadge({ status }: { status: Animal['healthStatus'] }) {
  const styles: Record<Animal['healthStatus'], string> = {
    sick: 'badge-red',
    quarantine: 'badge-yellow',
    recovering: 'badge-warm',
    healthy: 'badge-green',
  };
  const labels: Record<Animal['healthStatus'], string> = {
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

const typeColors: Record<TimelineItem['type'], { dot: string; line: string; badge: string; text: string }> = {
  feeding: { dot: 'bg-forest-500', line: 'bg-forest-200', badge: 'bg-forest-100 text-forest-700', text: '饲喂' },
  health: { dot: 'bg-warm-500', line: 'bg-warm-200', badge: 'bg-warm-100 text-warm-700', text: '健康' },
  breeding: { dot: 'bg-earth-500', line: 'bg-earth-200', badge: 'bg-earth-100 text-earth-700', text: '繁育' },
  behavior: { dot: 'bg-blue-500', line: 'bg-blue-200', badge: 'bg-blue-100 text-blue-700', text: '行为' },
};

export default function AnimalDetailModal({ open, onClose, animal, onSelectAnimal }: AnimalDetailModalProps) {
  const { getAnimalFamilyTree, getAnimalTimeline, animals } = useAppStore();
  const navigate = useNavigate();
  if (!animal) return null;

  const tree = getAnimalFamilyTree(animal.id);
  const allTimeline = getAnimalTimeline(animal.id);
  const timeline = allTimeline.slice(0, 10);
  const hasMore = allTimeline.length > 10;

  const partner = (() => {
    if (tree.children.length > 0) {
      const firstChild = tree.children[0];
      const partnerId = firstChild.pedigree?.fatherId === animal.id
        ? firstChild.pedigree?.motherId
        : firstChild.pedigree?.fatherId;
      return partnerId ? animals.find((a) => a.id === partnerId) : undefined;
    }
    return undefined;
  })();

  const FamilyLink = ({ a, label }: { a?: Animal; label: string }) => {
    if (!a) return <span className="text-xs text-gray-400">{label}：未知</span>;
    return (
      <button
        onClick={() => onSelectAnimal(a)}
        className="text-xs text-forest-600 hover:text-forest-800 underline flex items-center gap-1"
      >
        <Users className="w-3 h-3" />
        {label}：{a.name}
      </button>
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={`档案详情 - ${animal.name}`} size="lg">
      <div className="space-y-5">
        <div className="flex gap-5">
          <img src={animal.imageUrl} alt={animal.name} className="w-36 h-36 rounded-xl object-cover border-2 border-forest-200" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-forest-800 font-serif">{animal.name}</h3>
              <HealthBadge status={animal.healthStatus} />
              {animal.quarantine?.status === 'active' && <span className="badge-yellow">检疫中</span>}
            </div>
            <p className="text-sm text-gray-500 italic">{animal.scientificName}</p>
            <div className="flex flex-wrap items-center gap-2">
              <GenderBadge gender={animal.gender} />
              <span className="badge bg-earth-100 text-earth-700">{animal.speciesName}</span>
              <span className="badge bg-cream-200 text-earth-700">{animal.age}岁</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><Scale className="w-4 h-4 text-earth-500" />体重：{animal.weight}kg</div>
          <div className="flex items-center gap-2 text-gray-600"><Home className="w-4 h-4 text-forest-500" />笼舍：{animal.enclosureName}</div>
          <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-earth-500" />出生：{animal.birthDate}</div>
          <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-earth-500" />入园：{animal.entryDate}</div>
          <div className="flex items-center gap-2 text-gray-600"><Shield className="w-4 h-4 text-warm-500" />保护级别：{animal.conservationStatus}</div>
          <div className="flex items-center gap-2 text-gray-600"><PawPrint className="w-4 h-4 text-forest-500" />食性：{animal.dietType}</div>
        </div>

        <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
          <h4 className="font-semibold text-forest-700 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-warm-500" />家族关系
          </h4>
          <div className="space-y-2">
            <FamilyLink a={tree.father} label="父亲" />
            <FamilyLink a={tree.mother} label="母亲" />
            <FamilyLink a={partner} label="配偶" />
            {tree.children.length > 0 ? (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500">子女：</span>
                {tree.children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectAnimal(c)}
                    className="badge bg-forest-50 text-forest-700 hover:bg-forest-100"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">子女：暂无记录</span>
            )}
          </div>
        </div>

        <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-forest-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-500" />近期记录时间线
            </h4>
            {hasMore && (
              <button
                onClick={() => navigate('/feeding')}
                className="text-xs text-forest-600 hover:text-forest-800 flex items-center gap-1"
              >
                查看更多 <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          {timeline.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">暂无记录</div>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-cream-300" />
              {timeline.map((item) => {
                const colors = typeColors[item.type];
                return (
                  <div key={item.id} className="relative mb-4">
                    <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${colors.dot} ring-2 ring-white z-10`} />
                    <div className="bg-white rounded-lg p-3 border border-cream-200 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>{colors.text}</span>
                            <span className="text-xs text-gray-400">{item.date}</span>
                          </div>
                          <h5 className="text-sm font-medium text-gray-800 truncate">{item.title}</h5>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        <button
                          onClick={() => navigate(item.pagePath)}
                          className="flex-shrink-0 p-1.5 text-forest-500 hover:text-forest-700 hover:bg-forest-50 rounded-md transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
