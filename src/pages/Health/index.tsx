import { useMemo, useState } from 'react';
import { useAppStore } from '@/store';
import {
  Heart, Activity, Thermometer, Scale, Calendar, Syringe,
  Pill, Stethoscope, User, Shield, AlertTriangle, SmilePlus, RefreshCw, Plus, Utensils, Cookie, Baby, Check
} from 'lucide-react';
import type { Animal, HealthRecord, HealthTodo } from '@/types';
import StatusBadge from '@/components/UI/StatusBadge';
import Modal from '@/components/UI/Modal';
import HealthRecordForm from './HealthRecordForm';

const healthStatusConfig = {
  healthy: { label: '健康', icon: SmilePlus, bg: 'bg-forest-50', border: 'border-forest-200', text: 'text-forest-700', iconBg: 'bg-forest-100', iconText: 'text-forest-600' },
  sick: { label: '生病', icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconBg: 'bg-red-100', iconText: 'text-red-600' },
  recovering: { label: '恢复中', icon: RefreshCw, bg: 'bg-warm-50', border: 'border-warm-200', text: 'text-warm-700', iconBg: 'bg-warm-100', iconText: 'text-warm-600' },
  quarantine: { label: '隔离', icon: Shield, bg: 'bg-earth-50', border: 'border-earth-300', text: 'text-earth-700', iconBg: 'bg-earth-100', iconText: 'text-earth-600' },
};

type HealthStatusKey = keyof typeof healthStatusConfig;

function StatusCard({ status, count }: { status: HealthStatusKey; count: number }) {
  const c = healthStatusConfig[status];
  const Icon = c.icon;
  return (
    <div className={`${c.bg} rounded-2xl p-5 border ${c.border} shadow-card hover:shadow-card-hover transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${c.iconText}`} />
        </div>
        <span className={`text-3xl font-bold ${c.text}`}>{count}</span>
      </div>
      <p className={`text-sm font-medium ${c.text}`}>{c.label}动物</p>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">{children}</th>;
}

interface AbnormalCardProps {
  animal: Animal;
  lastDiagnosis?: HealthRecord['diagnoses'][0];
  lastRecordDate?: string;
  followUpDate?: string;
  hasFeedingPlan?: boolean;
  feedingPlanTime?: string;
}

function AbnormalCard({ animal, lastDiagnosis, lastRecordDate, followUpDate, hasFeedingPlan, feedingPlanTime }: AbnormalCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <img src={animal.imageUrl} alt={animal.name} className="w-14 h-14 rounded-lg object-cover border-2 border-warm-200" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-earth-900">{animal.name}</p>
            <StatusBadge status={animal.healthStatus as any} />
          </div>
          <p className="text-xs text-earth-500">{animal.speciesName} · {animal.enclosureName}</p>
        </div>
      </div>
      {lastDiagnosis && (
        <div className="bg-warm-50 rounded-lg p-2.5 mb-2 border border-warm-100">
          <p className="text-xs text-warm-700 font-medium mb-1">最近诊断：{lastDiagnosis.condition}</p>
          <p className="text-xs text-warm-600">治疗：{lastDiagnosis.treatment}</p>
          {lastRecordDate && <p className="text-xs text-warm-500 mt-1">记录日期：{lastRecordDate}</p>}
        </div>
      )}
      <div className="space-y-1.5">
        {followUpDate && (
          <div className="flex items-center gap-1.5 text-xs text-red-600">
            <Calendar className="w-3.5 h-3.5" />
            <span>复诊日期：<span className="font-medium">{followUpDate}</span></span>
          </div>
        )}
        {hasFeedingPlan && (
          <div className="flex items-center gap-1.5 text-xs text-forest-600 bg-forest-50 rounded-md px-2 py-1">
            <Cookie className="w-3.5 h-3.5" />
            <span>饲喂计划提醒：{feedingPlanTime || '今日待关注'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface FeedingTipProps {
  record: HealthRecord;
}

function FeedingTip({ record }: FeedingTipProps) {
  if (record.overallStatus === '健康' && record.diagnoses.length === 0) return null;

  const hasDigestiveIssue = record.diagnoses.some((d) =>
    d.condition.includes('消化') || d.condition.includes('肠胃')
  );
  const hasRespiratoryIssue = record.diagnoses.some((d) =>
    d.condition.includes('呼吸') || d.condition.includes('呼吸道')
  );
  const isSick = record.diagnoses.length > 0;

  let tip = '';
  if (hasDigestiveIssue) {
    tip = '建议调整为易消化饲料，减少粗纤维摄入，少量多餐，注意观察进食情况。';
  } else if (hasRespiratoryIssue) {
    tip = '建议增加维生素补充，保持环境温度稳定，确保充足饮水。';
  } else if (isSick) {
    tip = '建议适当调整饲喂量，密切观察食欲和饮水情况，如有异常及时联系兽医。';
  } else if (record.overallStatus === '恢复中') {
    tip = '恢复期间建议循序渐进恢复正常饲喂量，可适当增加营养补充。';
  }

  if (!tip) return null;

  return (
    <div className="mt-3 bg-warm-50 rounded-lg p-3 border border-warm-200">
      <div className="flex items-start gap-2">
        <Utensils className="w-4 h-4 text-warm-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-warm-700 mb-0.5">饲喂联动提示</p>
          <p className="text-xs text-warm-600">{tip}</p>
        </div>
      </div>
    </div>
  );
}

interface NewbornCardProps {
  animal: Animal;
  todos: HealthTodo[];
  onToggleTodo: (id: string) => void;
}

function NewbornCard({ animal, todos, onToggleTodo }: NewbornCardProps) {
  const fatherName = animal.pedigree?.fatherName;
  const motherName = animal.pedigree?.motherName;

  const formatAge = (age: number) => {
    if (age < 0.1) {
      const days = Math.max(1, Math.round(age * 365));
      return `${days}天`;
    }
    if (age < 1) {
      const months = Math.round(age * 12);
      return `${months}个月`;
    }
    return `${age}岁`;
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-warm-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <img src={animal.imageUrl} alt={animal.name} className="w-14 h-14 rounded-lg object-cover border-2 border-warm-200" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-earth-900">{animal.name}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700">新生幼崽</span>
          </div>
          <p className="text-xs text-earth-500">{animal.speciesName} · {formatAge(animal.age)}</p>
          {(fatherName || motherName) && (
            <p className="text-xs text-earth-400 mt-0.5">
              {motherName && `母亲：${motherName}`}
              {motherName && fatherName && ' · '}
              {fatherName && `父亲：${fatherName}`}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => {
          const isCompleted = todo.status === 'completed';
          return (
            <div
              key={todo.id}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors ${
                isCompleted
                  ? 'bg-cream-50 border-cream-200'
                  : 'bg-warm-50 border-warm-100 hover:border-warm-200'
              }`}
            >
              <button
                onClick={() => onToggleTodo(todo.id)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-forest-500 border-forest-500'
                    : 'border-earth-300 hover:border-forest-400 bg-white'
                }`}
              >
                {isCompleted && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isCompleted ? 'text-earth-400 line-through' : 'text-earth-800'}`}>
                  {todo.title}
                </p>
                <p className={`text-xs mt-0.5 ${isCompleted ? 'text-earth-300 line-through' : 'text-earth-500'}`}>
                  {todo.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className={`w-3 h-3 ${isCompleted ? 'text-earth-300' : 'text-warm-500'}`} />
                  <span className={`text-xs ${isCompleted ? 'text-earth-300' : 'text-earth-500'}`}>
                    到期：{todo.dueDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {todos.length === 0 && (
          <div className="text-xs text-earth-400 text-center py-2">暂无待办事项</div>
        )}
      </div>
    </div>
  );
}

export default function Health() {
  const {
    animals,
    healthRecords,
    feedingPlans,
    addHealthRecord,
    getNewbornAnimals,
    getAnimalHealthTodos,
    toggleHealthTodo,
  } = useAppStore();
  const [recordFormOpen, setRecordFormOpen] = useState(false);

  const healthCounts = animals.reduce<Record<string, number>>((acc, a) => {
    acc[a.healthStatus] = (acc[a.healthStatus] || 0) + 1;
    return acc;
  }, {});

  const abnormalAnimals = useMemo(() => {
    return animals.filter((a) => ['sick', 'recovering', 'quarantine'].includes(a.healthStatus));
  }, [animals]);

  const animalDiagnosisMap = useMemo(() => {
    const map: Record<string, { diagnosis: HealthRecord['diagnoses'][0]; date: string; followUp: string }> = {};
    for (const r of healthRecords) {
      if (r.diagnoses.length > 0 && !map[r.animalId]) {
        map[r.animalId] = {
          diagnosis: r.diagnoses[0],
          date: r.checkupDate,
          followUp: r.diagnoses[0].followUpDate || '',
        };
      }
    }
    return map;
  }, [healthRecords]);

  const animalFeedingMap = useMemo(() => {
    const map: Record<string, string> = {};
    feedingPlans.forEach((p) => {
      if (!map[p.animalId]) map[p.animalId] = p.feedingTime;
    });
    return map;
  }, [feedingPlans]);

  const newbornAnimals = useMemo(() => {
    return getNewbornAnimals();
  }, [getNewbornAnimals, animals]);

  const newbornTodosMap = useMemo(() => {
    const map: Record<string, HealthTodo[]> = {};
    newbornAnimals.forEach((animal) => {
      map[animal.id] = getAnimalHealthTodos(animal.id);
    });
    return map;
  }, [newbornAnimals, getAnimalHealthTodos]);

  const handleToggleTodo = (todoId: string) => {
    toggleHealthTodo(todoId, '管理员');
  };

  const allDiagnoses = healthRecords.flatMap((r) =>
    r.diagnoses.map((d) => ({ ...d, animalName: r.animalName, veterinarian: r.veterinarian, checkupDate: r.checkupDate, recordId: r.id, overallStatus: r.overallStatus, diagnoses: r.diagnoses }))
  );
  const allVaccinations = healthRecords.flatMap((r) =>
    r.vaccinations.map((v) => ({ ...v, animalName: r.animalName, recordId: r.id }))
  );

  const statusBadgeClass = (s: string) =>
    s === '健康' ? 'bg-forest-100 text-forest-700' : s === '恢复中' ? 'bg-warm-100 text-warm-700' : 'bg-red-100 text-red-700';

  const handleSubmitRecord = (data: Omit<HealthRecord, 'id'>) => {
    addHealthRecord(data);
    setRecordFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-forest-600" />健康监测
          </h1>
          <p className="text-sm text-earth-500 mt-1">动物健康状态、体检记录和疫苗接种管理</p>
        </div>
        <button
          onClick={() => setRecordFormOpen(true)}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />新增体检/诊疗
        </button>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">健康状态概览</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(healthStatusConfig) as HealthStatusKey[]).map((s) => (
            <StatusCard key={s} status={s} count={healthCounts[s] || 0} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warm-600" />
          <h2 className="text-lg font-semibold text-earth-800">异常动物快捷区</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700">{abnormalAnimals.length} 只需关注</span>
        </div>
        {abnormalAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {abnormalAnimals.map((animal) => (
              <AbnormalCard
                key={animal.id}
                animal={animal}
                lastDiagnosis={animalDiagnosisMap[animal.id]?.diagnosis}
                lastRecordDate={animalDiagnosisMap[animal.id]?.date}
                followUpDate={animalDiagnosisMap[animal.id]?.followUp}
                hasFeedingPlan={!!animalFeedingMap[animal.id]}
                feedingPlanTime={animalFeedingMap[animal.id]}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-earth-500">
            <SmilePlus className="w-10 h-10 text-forest-400 mx-auto mb-2" />
            <p>所有动物状态良好，无异常情况</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Baby className="w-5 h-5 text-warm-600" />
          <h2 className="text-lg font-semibold text-earth-800">新生幼崽关注区</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-warm-100 text-warm-700">{newbornAnimals.length} 只幼崽</span>
        </div>
        {newbornAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {newbornAnimals.map((animal) => (
              <NewbornCard
                key={animal.id}
                animal={animal}
                todos={newbornTodosMap[animal.id] || []}
                onToggleTodo={handleToggleTodo}
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-earth-500">
            <Baby className="w-10 h-10 text-warm-400 mx-auto mb-2" />
            <p>暂无新生幼崽，期待新生命的到来</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">体检记录</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-200/60">
                <tr>
                  <TableHeader>日期</TableHeader>
                  <TableHeader>动物</TableHeader>
                  <TableHeader>兽医</TableHeader>
                  <TableHeader>体重</TableHeader>
                  <TableHeader>体温</TableHeader>
                  <TableHeader>心率</TableHeader>
                  <TableHeader>综合状态</TableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-300">
                {healthRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-cream-100/50 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><Calendar className="w-4 h-4 text-earth-500" />{r.checkupDate}</div></td>
                    <td className="px-4 py-3 font-medium text-earth-800">{r.animalName}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><User className="w-4 h-4 text-earth-500" />{r.veterinarian}</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><Scale className="w-4 h-4 text-earth-500" />{r.weight} kg</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><Thermometer className="w-4 h-4 text-earth-500" />{r.temperature}°C</div></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><Activity className="w-4 h-4 text-earth-500" />{r.heartRate} 次/分</div></td>
                    <td className="px-4 py-3"><span className={`px-2.5 py-1 text-xs rounded-full font-medium ${statusBadgeClass(r.overallStatus)}`}>{r.overallStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">诊疗记录时间线</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 p-5">
          {allDiagnoses.length === 0 ? (
            <div className="text-center py-8 text-earth-500">暂无诊疗记录</div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-cream-300" />
              <div className="space-y-4">
                {allDiagnoses.map((d, i) => (
                  <div key={`${d.recordId}-${i}`} className="relative flex gap-4 pl-12">
                    <div className="absolute left-3 w-4 h-4 rounded-full bg-cream-50 border-2 border-warm-400 top-1.5" />
                    <div className="flex-1 bg-white rounded-xl p-4 border border-cream-300 hover:border-warm-300 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-4 h-4 text-warm-600" />
                        <span className="font-semibold text-earth-900">{d.condition}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-earth-500 mb-3">
                        <span>{d.animalName}</span><span>•</span><span>{d.checkupDate}</span><span>•</span><span>{d.veterinarian}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-cream-100 rounded-lg p-3">
                          <p className="text-xs text-earth-500 mb-1">治疗方案</p>
                          <p className="text-sm text-earth-800">{d.treatment}</p>
                        </div>
                        <div className="bg-cream-100 rounded-lg p-3">
                          <p className="text-xs text-earth-500 mb-1 flex items-center gap-1"><Pill className="w-3 h-3" />用药</p>
                          <p className="text-sm text-earth-800">{d.medication}</p>
                        </div>
                        <div className="bg-warm-50 rounded-lg p-3 border border-warm-200">
                          <p className="text-xs text-warm-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />复诊日期</p>
                          <p className="text-sm font-medium text-warm-800">{d.followUpDate || '待定'}</p>
                        </div>
                      </div>
                      <FeedingTip record={d as any} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Syringe className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">疫苗接种记录</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-200/60">
                <tr><TableHeader>疫苗名称</TableHeader><TableHeader>动物</TableHeader><TableHeader>接种日期</TableHeader><TableHeader>下次到期</TableHeader></tr>
              </thead>
              <tbody className="divide-y divide-cream-300">
                {allVaccinations.map((v, i) => (
                  <tr key={`${v.recordId}-${i}`} className="hover:bg-cream-100/50 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5"><Syringe className="w-4 h-4 text-forest-500" /><span className="font-medium text-earth-800">{v.vaccineName}</span></div></td>
                    <td className="px-4 py-3 text-earth-700">{v.animalName}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5 text-earth-700"><Calendar className="w-4 h-4 text-earth-500" />{v.date}</div></td>
                    <td className="px-4 py-3"><span className="px-2.5 py-1 text-xs rounded-full bg-forest-100 text-forest-700">{v.nextDue}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        open={recordFormOpen}
        onClose={() => setRecordFormOpen(false)}
        title="新增体检/诊疗记录"
        size="xl"
      >
        <HealthRecordForm
          onSubmit={handleSubmitRecord}
          onCancel={() => setRecordFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
