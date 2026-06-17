import Modal from '@/components/UI/Modal';
import { useAppStore } from '@/store';
import type { TimelineItem } from '@/store';
import type { Animal } from '@/types';
import { useNavigate } from 'react-router-dom';
import {
  Scale, Home, Calendar, Shield, PawPrint, Users, Heart, Clock, ChevronRight,
  Thermometer, Activity, Baby, Eye
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface AnimalDetailModalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal | null;
  onSelectAnimal: (animal: Animal) => void;
}

type FilterType = 'all' | TimelineItem['type'];

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

const filterButtons: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'feeding', label: '饲喂' },
  { key: 'health', label: '健康' },
  { key: 'breeding', label: '繁育' },
  { key: 'behavior', label: '行为' },
];

interface TimelineDetail {
  feeding?: {
    formulaName: string;
    feedingTime: string;
    plannedQuantity: number;
    actualQuantity: number;
    remainingAmount: number;
    feeder: string;
    notes: string;
  };
  health?: {
    veterinarian: string;
    weight: number;
    temperature: number;
    heartRate: number;
    bloodPressure: string;
    diagnoses: string[];
    vaccinations: string[];
    overallStatus: string;
  };
  breeding?: {
    breedingType: string;
    status: string;
    partnerName?: string;
    offspringNames: string[];
    notes: string;
  };
  behavior?: {
    observationDate: string;
    observer: string;
    behaviorType: string;
    behaviorName: string;
    frequency: number;
    durationMinutes: number;
    severity?: string;
    enrichmentActivity?: string;
    notes: string;
  };
}

export default function AnimalDetailModal({ open, onClose, animal, onSelectAnimal }: AnimalDetailModalProps) {
  const { getAnimalFamilyTree, getAnimalTimeline, animals, feedingRecords, healthRecords, breedingRecords, behaviorRecords } = useAppStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!animal) return null;

  const tree = getAnimalFamilyTree(animal.id);
  const allTimeline = getAnimalTimeline(animal.id);

  const filteredTimeline = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? allTimeline
      : allTimeline.filter((item) => item.type === activeFilter);
    return filtered.slice(0, 10);
  }, [allTimeline, activeFilter]);

  const hasMore = allTimeline.length > 10;

  const getTimelineDetail = (item: TimelineItem): TimelineDetail => {
    if (item.type === 'feeding') {
      const record = feedingRecords.find((r) => r.id === item.relatedId);
      if (record) {
        return {
          feeding: {
            formulaName: record.formulaName,
            feedingTime: record.feedingDateTime,
            plannedQuantity: record.plannedQuantity,
            actualQuantity: record.actualQuantity,
            remainingAmount: record.remainingAmount,
            feeder: record.feeder,
            notes: record.notes,
          },
        };
      }
    }
    if (item.type === 'health') {
      const record = healthRecords.find((r) => r.id === item.relatedId);
      if (record) {
        return {
          health: {
            veterinarian: record.veterinarian,
            weight: record.weight,
            temperature: record.temperature,
            heartRate: record.heartRate,
            bloodPressure: record.bloodPressure,
            diagnoses: record.diagnoses.map((d) => d.condition),
            vaccinations: record.vaccinations.map((v) => `${v.vaccineName} (${v.date})`),
            overallStatus: record.overallStatus,
          },
        };
      }
    }
    if (item.type === 'breeding') {
      const record = breedingRecords.find((r) => r.id === item.relatedId);
      if (record) {
        const breedingTypeLabels: Record<string, string> = {
          estrus: '发情', mating: '交配', pregnancy: '怀孕', birth: '出生',
        };
        return {
          breeding: {
            breedingType: breedingTypeLabels[record.breedingType] || record.breedingType,
            status: record.status,
            partnerName: record.partnerName,
            offspringNames: (record.offspring || []).map((o) => o.name),
            notes: record.notes,
          },
        };
      }
    }
    if (item.type === 'behavior') {
      const record = behaviorRecords.find((r) => r.id === item.relatedId);
      if (record) {
        const behaviorTypeLabels: Record<string, string> = {
          normal: '正常', stereotypic: '刻板行为', aggressive: '攻击', social: '社交',
        };
        const severityLabels: Record<string, string> = {
          mild: '轻微', moderate: '中等', severe: '严重',
        };
        return {
          behavior: {
            observationDate: record.observationDate,
            observer: record.observer,
            behaviorType: behaviorTypeLabels[record.behaviorType] || record.behaviorType,
            behaviorName: record.behaviorName,
            frequency: record.frequency,
            durationMinutes: record.durationMinutes,
            severity: record.severity ? severityLabels[record.severity] : undefined,
            enrichmentActivity: record.enrichmentActivity,
            notes: record.notes,
          },
        };
      }
    }
    return {};
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  const renderDetail = (detail: TimelineDetail) => {
    if (detail.feeding) {
      const d = detail.feeding;
      return (
        <div className="space-y-2 pt-3 border-t border-cream-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600"><span className="text-gray-400">配方名：</span>{d.formulaName}</div>
            <div className="text-gray-600"><span className="text-gray-400">投喂时间：</span>{d.feedingTime}</div>
            <div className="text-gray-600"><span className="text-gray-400">计划量：</span>{d.plannedQuantity}kg</div>
            <div className="text-gray-600"><span className="text-gray-400">实际量：</span>{d.actualQuantity}kg</div>
            <div className="text-gray-600"><span className="text-gray-400">剩余量：</span>{d.remainingAmount}kg</div>
            <div className="text-gray-600"><span className="text-gray-400">投喂人：</span>{d.feeder}</div>
          </div>
          {d.notes && (
            <div className="text-gray-600 bg-cream-50 rounded-md px-2 py-1.5">
              <span className="text-gray-400">备注：</span>{d.notes}
            </div>
          )}
        </div>
      );
    }
    if (detail.health) {
      const d = detail.health;
      return (
        <div className="space-y-2 pt-3 border-t border-cream-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" />{d.veterinarian}</div>
            <div className="text-gray-600 flex items-center gap-1"><Scale className="w-3 h-3 text-gray-400" />{d.weight}kg</div>
            <div className="text-gray-600 flex items-center gap-1"><Thermometer className="w-3 h-3 text-gray-400" />{d.temperature}°C</div>
            <div className="text-gray-600 flex items-center gap-1"><Activity className="w-3 h-3 text-gray-400" />心率{d.heartRate}</div>
            <div className="text-gray-600 col-span-2"><span className="text-gray-400">血压：</span>{d.bloodPressure}</div>
          </div>
          {d.diagnoses.length > 0 && (
            <div className="text-gray-600">
              <span className="text-gray-400">诊断：</span>
              {d.diagnoses.map((x, i) => (
                <span key={i} className="inline-block ml-1 px-2 py-0.5 bg-warm-50 text-warm-700 rounded text-xs">{x}</span>
              ))}
            </div>
          )}
          {d.vaccinations.length > 0 && (
            <div className="text-gray-600">
              <span className="text-gray-400">疫苗：</span>
              {d.vaccinations.map((x, i) => (
                <span key={i} className="inline-block ml-1 px-2 py-0.5 bg-forest-50 text-forest-700 rounded text-xs">{x}</span>
              ))}
            </div>
          )}
          <div className="text-gray-600"><span className="text-gray-400">综合状态：</span>{d.overallStatus}</div>
        </div>
      );
    }
    if (detail.breeding) {
      const d = detail.breeding;
      return (
        <div className="space-y-2 pt-3 border-t border-cream-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 flex items-center gap-1"><Baby className="w-3 h-3 text-gray-400" />{d.breedingType}</div>
            <div className="text-gray-600"><span className="text-gray-400">状态：</span>{d.status}</div>
          </div>
          {d.partnerName && (
            <div className="text-gray-600"><span className="text-gray-400">配种对象：</span>{d.partnerName}</div>
          )}
          {d.offspringNames.length > 0 && (
            <div className="text-gray-600">
              <span className="text-gray-400">后代：</span>
              {d.offspringNames.map((n, i) => (
                <span key={i} className="inline-block ml-1 px-2 py-0.5 bg-earth-50 text-earth-700 rounded text-xs">{n}</span>
              ))}
            </div>
          )}
          {d.notes && (
            <div className="text-gray-600 bg-cream-50 rounded-md px-2 py-1.5">
              <span className="text-gray-400">备注：</span>{d.notes}
            </div>
          )}
        </div>
      );
    }
    if (detail.behavior) {
      const d = detail.behavior;
      return (
        <div className="space-y-2 pt-3 border-t border-cream-200 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600 flex items-center gap-1"><Eye className="w-3 h-3 text-gray-400" />{d.observationDate}</div>
            <div className="text-gray-600 flex items-center gap-1"><Users className="w-3 h-3 text-gray-400" />{d.observer}</div>
            <div className="text-gray-600"><span className="text-gray-400">类型：</span>{d.behaviorType}</div>
            <div className="text-gray-600"><span className="text-gray-400">行为：</span>{d.behaviorName}</div>
            <div className="text-gray-600"><span className="text-gray-400">频率：</span>{d.frequency}次</div>
            <div className="text-gray-600"><span className="text-gray-400">持续：</span>{d.durationMinutes}分钟</div>
          </div>
          {d.severity && (
            <div className="text-gray-600"><span className="text-gray-400">严重程度：</span>{d.severity}</div>
          )}
          {d.enrichmentActivity && (
            <div className="text-gray-600"><span className="text-gray-400">丰容活动：</span>{d.enrichmentActivity}</div>
          )}
          {d.notes && (
            <div className="text-gray-600 bg-cream-50 rounded-md px-2 py-1.5">
              <span className="text-gray-400">备注：</span>{d.notes}
            </div>
          )}
        </div>
      );
    }
    return null;
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
          <div className="flex flex-col gap-3 mb-3">
            <div className="flex items-center justify-between">
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
            <div className="flex flex-wrap gap-2">
              {filterButtons.map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setActiveFilter(btn.key)}
                  className={`text-xs px-3 py-1 rounded-full transition-all duration-200 font-medium ${
                    activeFilter === btn.key
                      ? 'bg-forest-600 text-white shadow-sm'
                      : 'bg-cream-100 text-earth-700 border border-cream-300 hover:bg-cream-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          {filteredTimeline.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">暂无记录</div>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-cream-300" />
              {filteredTimeline.map((item) => {
                const colors = typeColors[item.type];
                const isExpanded = expandedId === item.id;
                const detail = getTimelineDetail(item);
                return (
                  <div key={item.id} className="relative mb-4">
                    <div className={`absolute -left-6 top-1 w-3 h-3 rounded-full ${colors.dot} ring-2 ring-white z-10`} />
                    <div
                      onClick={() => toggleExpand(item.id)}
                      className={`bg-white rounded-lg border border-cream-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
                        isExpanded ? 'shadow-sm' : ''
                      }`}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>{colors.text}</span>
                              <span className="text-xs text-gray-400">{item.date}</span>
                            </div>
                            <h5 className="text-sm font-medium text-gray-800 truncate">{item.title}</h5>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(item.pagePath); }}
                              className="flex-shrink-0 p-1.5 text-forest-500 hover:text-forest-700 hover:bg-forest-50 rounded-md transition-colors text-xs"
                            >
                              查看详情
                            </button>
                            <ChevronRight
                              className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-300 ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-3 pb-3">
                          {renderDetail(detail)}
                        </div>
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
