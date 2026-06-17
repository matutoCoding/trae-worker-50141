import { useAppStore } from '@/store';
import {
  Heart, Activity, Thermometer, Scale, Calendar, Syringe,
  Pill, Stethoscope, User, Shield, AlertTriangle, SmilePlus, RefreshCw,
} from 'lucide-react';

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

export default function Health() {
  const { animals, healthRecords } = useAppStore();

  const healthCounts = animals.reduce<Record<string, number>>((acc, a) => {
    acc[a.healthStatus] = (acc[a.healthStatus] || 0) + 1;
    return acc;
  }, {});

  const allDiagnoses = healthRecords.flatMap((r) =>
    r.diagnoses.map((d) => ({ ...d, animalName: r.animalName, veterinarian: r.veterinarian, checkupDate: r.checkupDate, recordId: r.id }))
  );
  const allVaccinations = healthRecords.flatMap((r) =>
    r.vaccinations.map((v) => ({ ...v, animalName: r.animalName, recordId: r.id }))
  );

  const statusBadgeClass = (s: string) =>
    s === '健康' ? 'bg-forest-100 text-forest-700' : s === '恢复中' ? 'bg-warm-100 text-warm-700' : 'bg-red-100 text-red-700';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-earth-900 flex items-center gap-2">
          <Heart className="w-7 h-7 text-forest-600" />健康监测
        </h1>
        <p className="text-sm text-earth-500 mt-1">动物健康状态、体检记录和疫苗接种管理</p>
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
    </div>
  );
}
