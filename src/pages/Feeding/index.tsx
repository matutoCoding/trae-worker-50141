import { useMemo, useState } from 'react';
import { useAppStore } from '@/store';
import {
  Cookie, Clock, Star, CheckCircle2, AlertCircle, XCircle,
  Scale, Leaf, ChefHat, Calendar, Utensils, User, Plus, Bell, Stethoscope, ArrowRight,
  Baby, Minus, Thermometer, TrendingUp, TrendingDown, Minus as MinusIcon, Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedFormula, FeedingPlan, FeedingRecord, HealthStatus, Animal, CareLog } from '@/types';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal from '@/components/UI/Modal';
import FeedingRecordForm from './FeedingRecordForm';

const statusConfig = {
  completed: { label: '完成', icon: CheckCircle2, className: 'bg-forest-100 text-forest-700 border-forest-200' },
  partial: { label: '部分', icon: AlertCircle, className: 'bg-warm-100 text-warm-700 border-warm-200' },
  missed: { label: '错过', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200' },
};

const nutritionColors = { protein: 'bg-forest-500', fat: 'bg-warm-500', carbohydrate: 'bg-earth-500', fiber: 'bg-forest-400' };
const nutritionLabels: Record<string, string> = { protein: '蛋白质', fat: '脂肪', carbohydrate: '碳水', fiber: '纤维' };

function NutritionBar({ value, colorKey }: { value: number; colorKey: keyof typeof nutritionColors }) {
  const percentage = Math.min((value / 60) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-earth-700">
        <span>{nutritionLabels[colorKey]}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', nutritionColors[colorKey])} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function FormulaCard({ formula }: { formula: FeedFormula }) {
  return (
    <div className="bg-cream-50 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-cream-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-semibold text-earth-900">{formula.name}</h3>
            <p className="text-xs text-earth-500">ID: {formula.id}</p>
          </div>
        </div>
        {formula.isFavorite && <Star className="w-5 h-5 text-warm-500 fill-warm-500" />}
      </div>
      <div className="mb-4">
        <p className="text-xs font-medium text-earth-600 mb-2">主要成分</p>
        <div className="flex flex-wrap gap-1.5">
          {formula.ingredients.slice(0, 4).map((ing) => (
            <span key={ing.name} className="px-2 py-0.5 text-xs rounded-full bg-earth-100 text-earth-700">
              {ing.name} {ing.percentage}%
            </span>
          ))}
          {formula.ingredients.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-cream-300 text-earth-600">+{formula.ingredients.length - 4}</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <NutritionBar value={formula.nutritionInfo.protein} colorKey="protein" />
        <NutritionBar value={formula.nutritionInfo.fat} colorKey="fat" />
        <NutritionBar value={formula.nutritionInfo.carbohydrate} colorKey="carbohydrate" />
        <NutritionBar value={formula.nutritionInfo.fiber} colorKey="fiber" />
      </div>
      <div className="flex items-center gap-1.5 pt-3 border-t border-cream-300">
        <Leaf className="w-3.5 h-3.5 text-forest-500" />
        <span className="text-xs text-earth-600">适用：</span>
        <span className="text-xs text-earth-800 font-medium">{formula.applicableSpecies.join('、')}</span>
      </div>
    </div>
  );
}

interface AttentionCardProps {
  animal: Animal;
  lastRecord?: { condition: string; date: string };
  plans: FeedingPlan[];
  onJump: () => void;
}

function AttentionCard({ animal, lastRecord, plans, onJump }: AttentionCardProps) {
  return (
    <div
      onClick={onJump}
      className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 mb-3">
        <img src={animal.imageUrl} alt={animal.name} className="w-12 h-12 rounded-lg object-cover border-2 border-warm-200" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-earth-900">{animal.name}</p>
            <StatusBadge status={animal.healthStatus as any} />
          </div>
          <p className="text-xs text-earth-500">{animal.speciesName} · {animal.enclosureName}</p>
        </div>
      </div>
      {lastRecord && (
        <div className="bg-warm-50 rounded-lg p-2.5 mb-2 border border-warm-100">
          <p className="text-xs text-warm-700 flex items-center gap-1">
            <Stethoscope className="w-3 h-3" />
            <span className="font-medium">{lastRecord.condition}</span>
            <span className="text-warm-500">· {lastRecord.date}</span>
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {plans.slice(0, 2).map((p) => (
            <span key={p.id} className="text-xs badge bg-cream-200 text-earth-600">{p.feedingTime} {p.formulaName}</span>
          ))}
        </div>
        <ArrowRight className="w-4 h-4 text-warm-500" />
      </div>
    </div>
  );
}

interface NewbornCardProps {
  animal: Animal;
  careLogs: CareLog[];
}

function NewbornCard({ animal, careLogs }: NewbornCardProps) {
  const { addCareLog } = useAppStore();
  const [feedingTimes, setFeedingTimes] = useState(0);
  const [weight, setWeight] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const recentLogs = careLogs.slice(0, 7);

  const fatherName = animal.pedigree?.fatherName;
  const motherName = animal.pedigree?.motherName;

  const handleSave = () => {
    setSaving(true);
    const today = new Date().toISOString().split('T')[0];
    addCareLog({
      animalId: animal.id,
      animalName: animal.name,
      date: today,
      feedingAmount: parseFloat(weight) || 0,
      feedingFrequency: feedingTimes,
      weight: parseFloat(weight) || 0,
      temperature: temperature ? parseFloat(temperature) : undefined,
      notes,
      recordedBy: '管理员',
    });
    setFeedingTimes(0);
    setWeight('');
    setTemperature('');
    setNotes('');
    setTimeout(() => setSaving(false), 500);
  };

  const getWeightTrend = (idx: number) => {
    if (idx >= recentLogs.length - 1) return 'stable';
    const curr = recentLogs[idx]?.weight || 0;
    const prev = recentLogs[idx + 1]?.weight || 0;
    if (curr > prev) return 'up';
    if (curr < prev) return 'down';
    return 'stable';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-300 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={animal.imageUrl}
          alt={animal.name}
          className="w-16 h-16 rounded-xl object-cover border-2 border-forest-200"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-earth-900 text-lg">{animal.name}</h3>
            <span className={`badge ${animal.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
              {animal.gender === 'male' ? '♂' : '♀'}
            </span>
          </div>
          <p className="text-sm text-earth-600">{animal.speciesName}</p>
          <p className="text-xs text-earth-500 mt-0.5">
            {animal.age}岁 · {motherName || '未知母'} × {fatherName || '未知父'}
          </p>
        </div>
      </div>

      <div className="bg-cream-50 rounded-xl p-4 mb-4 border border-cream-200">
        <h4 className="text-sm font-semibold text-earth-800 mb-3 flex items-center gap-2">
          <Baby className="w-4 h-4 text-forest-600" />今日打卡
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600 flex items-center gap-1">
              <span className="text-base">🍼</span>哺乳次数
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedingTimes(Math.max(0, feedingTimes - 1))}
                className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-earth-700 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                value={feedingTimes}
                onChange={(e) => setFeedingTimes(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-12 text-center text-sm font-medium bg-white border border-cream-300 rounded-md py-1 focus:outline-none focus:ring-1 focus:ring-forest-400"
              />
              <button
                onClick={() => setFeedingTimes(feedingTimes + 1)}
                className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-earth-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-earth-500 ml-1">次</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600 flex items-center gap-1">
              <span className="text-base">⚖️</span>称重
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={animal.weight.toString()}
                className="w-24 text-right text-sm bg-white border border-cream-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest-400"
              />
              <span className="text-xs text-earth-500">kg</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-earth-600 flex items-center gap-1">
              <span className="text-base">🌡️</span>体温
              <span className="text-xs text-earth-400">(可选)</span>
            </span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="—"
                className="w-24 text-right text-sm bg-white border border-cream-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-forest-400"
              />
              <span className="text-xs text-earth-500">°C</span>
            </div>
          </div>

          <div>
            <span className="text-sm text-earth-600 flex items-center gap-1 mb-1.5">
              <span className="text-base">📝</span>备注
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="记录今日观察..."
              rows={2}
              className="w-full text-sm bg-white border border-cream-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-forest-400 resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              'w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-all',
              saving
                ? 'bg-forest-400 text-white cursor-not-allowed'
                : 'bg-forest-600 text-white hover:bg-forest-700 active:bg-forest-800'
            )}
          >
            <Save className="w-4 h-4" />
            {saving ? '已保存 ✓' : '保存今日打卡'}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-earth-800 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-earth-500" />最近哺育记录
        </h4>
        {recentLogs.length === 0 ? (
          <div className="text-center py-4 text-xs text-earth-400 bg-cream-50 rounded-lg">
            暂无记录，开始今日打卡吧
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentLogs.map((log, idx) => {
              const trend = getWeightTrend(idx);
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-xs py-2 px-3 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors"
                >
                  <span className="text-earth-600 font-medium">{log.date.slice(5)}</span>
                  <div className="flex items-center gap-3 text-earth-500">
                    <span>🍼 {log.feedingFrequency}</span>
                    <span className="flex items-center gap-0.5">
                      ⚖️ {log.weight}
                      {trend === 'up' && <TrendingUp className="w-3 h-3 text-forest-600" />}
                      {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                      {trend === 'stable' && <MinusIcon className="w-3 h-3 text-earth-400" />}
                    </span>
                    {log.temperature !== undefined && log.temperature > 0 && (
                      <span>🌡️ {log.temperature}°</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Feeding() {
  const {
    feedFormulas, feedingPlans, feedingRecords, animals, healthRecords,
    addFeedingRecord, getNewbornAnimals, getAnimalCareLogs
  } = useAppStore();
  const [recordFormOpen, setRecordFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FeedingPlan | null>(null);

  const newbornAnimals = useMemo(() => getNewbornAnimals(), [getNewbornAnimals]);

  const abnormalAnimals = useMemo(() => {
    return animals.filter((a) => ['sick', 'quarantine', 'recovering'].includes(a.healthStatus));
  }, [animals]);

  const completedPlanIds = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return new Set(
      feedingRecords
        .filter((r) => r.feedingDateTime.startsWith(today) && r.status === 'completed')
        .map((r) => r.planId)
    );
  }, [feedingRecords]);

  const animalHealthMap = useMemo(() => {
    const map: Record<string, HealthStatus> = {};
    animals.forEach((a) => { map[a.id] = a.healthStatus; });
    return map;
  }, [animals]);

  const lastHealthMap = useMemo(() => {
    const map: Record<string, { condition: string; date: string }> = {};
    healthRecords.forEach((r) => {
      if (r.diagnoses.length > 0 && !map[r.animalId]) {
        map[r.animalId] = { condition: r.diagnoses[0].condition, date: r.checkupDate };
      }
    });
    return map;
  }, [healthRecords]);

  const animalPlanMap = useMemo(() => {
    const map: Record<string, FeedingPlan[]> = {};
    feedingPlans.forEach((p) => {
      if (!map[p.animalId]) map[p.animalId] = [];
      map[p.animalId].push(p);
    });
    return map;
  }, [feedingPlans]);

  const handleOpenRecord = (plan: FeedingPlan) => {
    setSelectedPlan(plan);
    setRecordFormOpen(true);
  };

  const handleSubmitRecord = (data: Omit<FeedingRecord, 'id'>) => {
    addFeedingRecord(data);
    setRecordFormOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900 flex items-center gap-2">
            <Cookie className="w-7 h-7 text-forest-600" />饲喂管理
          </h1>
          <p className="text-sm text-earth-500 mt-1">管理饲料配方、饲喂计划和投喂记录</p>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Baby className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">幼崽哺育任务</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700">
            {newbornAnimals.length} 只幼崽
          </span>
        </div>
        {newbornAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {newbornAnimals.map((animal) => (
              <NewbornCard
                key={animal.id}
                animal={animal}
                careLogs={getAnimalCareLogs(animal.id)}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-earth-500">
            <Baby className="w-10 h-10 text-forest-300 mx-auto mb-2" />
            <p>暂无新生幼崽需要哺育</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-warm-600" />
          <h2 className="text-lg font-semibold text-earth-800">今日关注</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700">
            {abnormalAnimals.length} 只异常
          </span>
        </div>
        {abnormalAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {abnormalAnimals.map((animal) => (
              <AttentionCard
                key={animal.id}
                animal={animal}
                lastRecord={lastHealthMap[animal.id]}
                plans={animalPlanMap[animal.id] || []}
                onJump={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-earth-500">
            <CheckCircle2 className="w-10 h-10 text-forest-400 mx-auto mb-2" />
            <p>今日无异常动物，所有动物状态良好</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">饲料配方库</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700">{feedFormulas.length} 个配方</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {feedFormulas.map((formula) => (<FormulaCard key={formula.id} formula={formula} />))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">饲喂计划列表</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-200/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">动物</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">健康状态</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">配方</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">数量</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">频次</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">状态</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-300">
                {feedingPlans.map((plan) => {
                  const healthStatus = animalHealthMap[plan.animalId];
                  const isAbnormal = healthStatus && ['sick', 'quarantine', 'recovering'].includes(healthStatus);
                  const isCompleted = completedPlanIds.has(plan.id);
                  return (
                    <tr
                      key={plan.id}
                      className={cn(
                        'hover:bg-cream-100/50 transition-colors',
                        isAbnormal && 'bg-warm-50/50'
                      )}
                      style={isAbnormal ? { boxShadow: 'inset 3px 0 0 #E8833A' } : {}}
                    >
                      <td className="px-4 py-3"><span className="font-medium text-earth-800">{plan.animalName}</span></td>
                      <td className="px-4 py-3">{healthStatus && <StatusBadge status={healthStatus as any} />}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-earth-700">
                          <Clock className="w-4 h-4 text-earth-500" />
                          <span>{plan.feedingTime}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-earth-700">{plan.formulaName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-earth-700">
                          <Scale className="w-4 h-4 text-earth-500" />
                          <span>{plan.quantity} {plan.unit}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="px-2.5 py-1 text-xs rounded-full bg-forest-100 text-forest-700">{plan.frequency}</span></td>
                      <td className="px-4 py-3">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-forest-100 text-forest-700 border border-forest-200">
                            <CheckCircle2 className="w-3 h-3" />已完成
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-cream-200 text-earth-600">待投喂</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleOpenRecord(plan)}
                          className="btn-warm text-xs py-1 px-3 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />录入投喂
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">今日投喂记录</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 p-5">
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-cream-300" />
            <div className="space-y-4">
              {feedingRecords.map((record) => {
                const StatusIcon = statusConfig[record.status].icon;
                const time = record.feedingDateTime.split(' ')[1];
                return (
                  <div key={record.id} className="relative flex gap-4 pl-12">
                    <div className="absolute left-3 w-4 h-4 rounded-full bg-cream-50 border-2 border-forest-400 top-1.5" />
                    <div className="flex-1 bg-white rounded-xl p-4 border border-cream-300 hover:border-forest-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-earth-900">{record.animalName}</span>
                            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border', statusConfig[record.status].className)}>
                              <StatusIcon className="w-3 h-3" />{statusConfig[record.status].label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-earth-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{time}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{record.feeder}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-earth-700"><span className="text-earth-500">计划：</span>{record.plannedQuantity}</div>
                        <div className="text-forest-700"><span className="text-earth-500">实际：</span>{record.actualQuantity}</div>
                        <div className="text-earth-500"><span>剩余：</span>{record.remainingAmount}</div>
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-xs text-earth-500 bg-cream-100 rounded-lg px-3 py-2">{record.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={recordFormOpen}
        onClose={() => { setRecordFormOpen(false); setSelectedPlan(null); }}
        title="录入投喂记录"
        size="md"
      >
        {selectedPlan && (
          <FeedingRecordForm
            plan={selectedPlan}
            onSubmit={handleSubmitRecord}
            onCancel={() => { setRecordFormOpen(false); setSelectedPlan(null); }}
          />
        )}
      </Modal>
    </div>
  );
}
