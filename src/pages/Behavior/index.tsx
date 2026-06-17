import { useAppStore } from '@/store';
import type { BehaviorType, Severity } from '@/types';
import {
  Leaf,
  Calendar,
  Star,
  User,
  Clock,
  Activity,
  AlertTriangle,
  HeartPulse,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const behaviorTypeMap: Record<BehaviorType, { label: string; color: string; icon: typeof Activity }> = {
  normal: { label: '正常', color: 'bg-forest-100 text-forest-700 border-forest-200', icon: Activity },
  stereotypic: { label: '刻板', color: 'bg-warm-100 text-warm-700 border-warm-200', icon: AlertTriangle },
  aggressive: { label: '攻击', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
  social: { label: '社交', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Users },
};

const severityMap: Record<Severity, { label: string; color: string }> = {
  mild: { label: '轻度', color: 'bg-yellow-100 text-yellow-700' },
  moderate: { label: '中度', color: 'bg-warm-100 text-warm-700' },
  severe: { label: '重度', color: 'bg-red-100 text-red-700' },
};

function EffectivenessBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-forest-500' : value >= 70 ? 'bg-warm-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-medium text-forest-800 w-10 text-right">{value}%</span>
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  const stars = Math.round((value / 100) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          className={i <= stars ? 'text-warm-500 fill-warm-500' : 'text-cream-300'}
        />
      ))}
    </div>
  );
}

export default function BehaviorPage() {
  const { enrichmentActivities, behaviorRecords } = useAppStore();

  const stereotypicRecords = behaviorRecords.filter((r) => r.behaviorType === 'stereotypic');

  const stereotypicAnimals = stereotypicRecords.reduce<Record<string, typeof stereotypicRecords>>((acc, record) => {
    if (!acc[record.animalId]) acc[record.animalId] = [];
    acc[record.animalId].push(record);
    return acc;
  }, {});

  return (
    <div className="space-y-6 p-6 bg-cream-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-forest-100 rounded-xl">
          <HeartPulse className="w-6 h-6 text-forest-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-forest-900">行为观察</h1>
          <p className="text-sm text-gray-600">丰容设施管理与动物行为监测</p>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-warm-600" />
          <h2 className="text-lg font-semibold text-forest-800">丰容设施</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enrichmentActivities.map((activity) => (
            <div key={activity.id} className="card p-5 card-hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-forest-50 rounded-lg">
                    <Leaf className="w-4 h-4 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900">{activity.name}</h3>
                    <span className="badge badge-warm text-xs">{activity.type}</span>
                  </div>
                </div>
                <StarRating value={activity.effectiveness} />
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {activity.targetSpecies.map((s) => (
                  <span key={s} className="badge badge-green text-xs">
                    {s}
                  </span>
                ))}
              </div>
              <div className="space-y-2 pt-3 border-t border-cream-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  最近使用: {activity.lastUsed}
                </div>
                <EffectivenessBar value={activity.effectiveness} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-forest-800">行为观察记录</h2>
        </div>
        <div className="card p-1">
          <div className="relative pl-8 pr-4 py-4">
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-cream-300" />
            {behaviorRecords.map((record, idx) => {
              const typeInfo = behaviorTypeMap[record.behaviorType];
              const TypeIcon = typeInfo.icon;
              return (
                <div key={record.id} className="relative mb-5 last:mb-0">
                  <div
                    className={`absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                      record.behaviorType === 'normal'
                        ? 'bg-forest-500'
                        : record.behaviorType === 'stereotypic'
                        ? 'bg-warm-500'
                        : record.behaviorType === 'aggressive'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="p-4 bg-cream-50 rounded-xl border border-cream-200">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`badge ${typeInfo.color} border`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {typeInfo.label}
                      </span>
                      <span className="font-medium text-forest-800">{record.behaviorName}</span>
                      {record.severity && (
                        <span className={`badge ${severityMap[record.severity].color}`}>
                          {severityMap[record.severity].label}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-forest-500" />
                        {record.observationDate}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Users className="w-3.5 h-3.5 text-forest-500" />
                        {record.animalName}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 text-forest-500" />
                        {record.observer}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-forest-500" />
                        {record.durationMinutes}分钟
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-cream-200 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>发生频率: <strong className="text-forest-700">{record.frequency}次</strong></span>
                      {record.enrichmentActivity && (
                        <span>丰容干预: <strong className="text-warm-700">{record.enrichmentActivity}</strong></span>
                      )}
                      {record.notes && <span className="text-gray-500">备注: {record.notes}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {Object.keys(stereotypicAnimals).length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warm-600" />
            <h2 className="text-lg font-semibold text-forest-800">刻板行为观察专区</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(stereotypicAnimals).map(([animalId, records]) => {
              const latest = records[0];
              return (
                <div key={animalId} className="card p-5 border-l-4 border-l-warm-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-warm-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-warm-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-forest-900">{latest.animalName}</h3>
                        <p className="text-xs text-gray-500">记录次数: {records.length}</p>
                      </div>
                    </div>
                    <span className="badge bg-warm-100 text-warm-700">持续关注</span>
                  </div>
                  <div className="space-y-3">
                    {records.map((r) => (
                      <div key={r.id} className="p-3 bg-cream-50 rounded-lg text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-forest-800">{r.behaviorName}</span>
                          {r.severity && (
                            <span className={`badge ${severityMap[r.severity].color} text-xs`}>
                              {severityMap[r.severity].label}
                            </span>
                          )}
                        </div>
                        {r.enrichmentActivity && (
                          <div className="flex items-center gap-1.5 text-xs text-warm-700 mt-1">
                            <TrendingUp className="w-3 h-3" />
                            干预: {r.enrichmentActivity}
                          </div>
                        )}
                        {r.notes && <p className="text-xs text-gray-600 mt-1">{r.notes}</p>}
                        <p className="text-xs text-gray-400 mt-1">{r.observationDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
