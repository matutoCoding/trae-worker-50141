import { useAppStore } from '@/store';
import {
  Heart, Baby, Users, Calendar, Stethoscope,
  Clock, ChevronRight, Mars, Venus
} from 'lucide-react';
import type { BreedingType } from '@/types';

const breedingTypeLabels: Record<BreedingType, string> = {
  estrus: '发情监测',
  mating: '配种登记',
  pregnancy: '妊娠管理',
  birth: '幼崽出生',
};

const breedingTypeColors: Record<BreedingType, string> = {
  estrus: 'bg-warm-100 text-warm-700 border-warm-300',
  mating: 'bg-forest-100 text-forest-700 border-forest-300',
  pregnancy: 'bg-earth-100 text-earth-700 border-earth-300',
  birth: 'bg-cream-200 text-earth-700 border-earth-300',
};

export default function Breeding() {
  const { breedingRecords, animals } = useAppStore();

  const estrusCount = breedingRecords.filter(r => r.breedingType === 'estrus').length;
  const matingCount = breedingRecords.filter(r => r.breedingType === 'mating').length;
  const pregnancyCount = breedingRecords.filter(r => r.breedingType === 'pregnancy').length;
  const offspringCount = breedingRecords.reduce((acc, r) => acc + (r.offspring?.length || 0), 0);

  const sortedRecords = [...breedingRecords].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  const offspringList = breedingRecords.flatMap(r =>
    (r.offspring || []).map(o => ({
      ...o,
      fatherName: r.partnerName,
      motherName: r.animalName,
    }))
  );

  const statsCards = [
    { label: '发情期动物', value: estrusCount, icon: Heart, color: 'warm', iconBg: 'bg-warm-400/20 text-warm-600' },
    { label: '已配种', value: matingCount, icon: Users, color: 'forest', iconBg: 'bg-forest-400/20 text-forest-600' },
    { label: '妊娠中', value: pregnancyCount, icon: Stethoscope, color: 'earth', iconBg: 'bg-earth-400/20 text-earth-600' },
    { label: '已出生幼崽', value: offspringCount, icon: Baby, color: 'cream', iconBg: 'bg-cream-300 text-earth-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-forest-800">繁育记录</h1>
        <p className="text-sm text-earth-600 mt-1">管理动物繁育全过程，监测繁育状态</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(({ label, value, icon: Icon, iconBg }) => (
          <div
            key={label}
            className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">{label}</p>
                <p className="text-3xl font-bold text-forest-700 mt-1">{value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-cream-50 border border-cream-200 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-forest-800">繁育事件时间线</h2>
            <span className="text-xs text-earth-500">按时间倒序</span>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-cream-300" />
            <div className="space-y-5">
              {sortedRecords.map((record) => (
                <div key={record.id} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-cream-50 border-2 border-forest-400 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-forest-500" />
                  </div>
                  <div className="bg-white border border-cream-200 rounded-xl p-4 hover:shadow-card-hover transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${breedingTypeColors[record.breedingType]}`}>
                            {breedingTypeLabels[record.breedingType]}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-earth-500">
                            <Clock size={12} />
                            {record.eventDate}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          <span className="text-forest-700 font-medium">{record.animalName}</span>
                          {record.partnerName && (
                            <span className="flex items-center gap-1 text-earth-600">
                              <ChevronRight size={14} className="text-earth-400" />
                              配种对象：{record.partnerName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-forest-600 mt-1.5 font-medium">{record.status}</p>
                        {record.notes && (
                          <p className="text-xs text-earth-500 mt-1">{record.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-forest-800 mb-5">幼崽哺育</h2>
          {offspringList.length === 0 ? (
            <div className="text-center py-8 text-earth-500 text-sm">暂无幼崽记录</div>
          ) : (
            <div className="space-y-4">
              {offspringList.map((cub) => (
                <div
                  key={cub.id}
                  className="bg-white border border-cream-200 rounded-xl p-4 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-cream-200 flex items-center justify-center">
                        <Baby size={18} className="text-earth-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-forest-700">{cub.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {cub.gender === 'male' ? (
                            <Mars size={12} className="text-warm-500" />
                          ) : (
                            <Venus size={12} className="text-earth-500" />
                          )}
                          <span className="text-xs text-earth-500">
                            {cub.gender === 'male' ? '雄性' : '雌性'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-forest-100 text-forest-700">
                      {cub.status}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-earth-400" />
                      <span className="text-earth-600">出生日期：{cub.birthDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-earth-400" />
                      <span className="text-earth-600">
                        父亲：{cub.fatherName} · 母亲：{cub.motherName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
