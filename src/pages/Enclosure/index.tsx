import { useAppStore } from '@/store';
import {
  Thermometer, Droplets, Users, Ruler, Sparkles,
  AlertTriangle, CheckCircle, Clock, Shield, User
} from 'lucide-react';

const statusConfig = {
  normal: { label: '正常', bg: 'bg-forest-100', text: 'text-forest-700', border: 'border-forest-300' },
  warning: { label: '警告', bg: 'bg-warm-100', text: 'text-warm-700', border: 'border-warm-300' },
  alert: { label: '告警', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
};

function isInRange(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

function getProgressPercent(value: number, min: number, max: number) {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export default function Enclosure() {
  const { enclosures } = useAppStore();

  const allCleaningRecords = enclosures.flatMap(e =>
    e.cleaningRecords.map(r => ({ ...r, enclosureName: e.name }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const allSafetyChecks = enclosures.flatMap(e =>
    e.safetyChecks.map(c => ({ ...c, enclosureName: e.name }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-forest-800">笼舍环境</h1>
        <p className="text-sm text-earth-600 mt-1">监控笼舍环境参数，管理清洁与安全巡检</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-forest-800 mb-4">笼舍状态</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enclosures.map((enc) => {
            const tempOk = isInRange(enc.temperature, enc.tempRange.min, enc.tempRange.max);
            const humidOk = isInRange(enc.humidity, enc.humidityRange.min, enc.humidityRange.max);
            const status = statusConfig[enc.status];

            return (
              <div
                key={enc.id}
                className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-forest-800">{enc.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-earth-500">
                      <Ruler size={12} />
                      <span>{enc.area}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-earth-600">
                      <Users size={14} />
                      <span>容量</span>
                    </div>
                    <span className="font-medium text-forest-700">
                      {enc.currentOccupancy} / {enc.capacity}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Thermometer size={14} className={tempOk ? 'text-forest-500' : 'text-warm-600'} />
                        <span className={tempOk ? 'text-earth-600' : 'text-warm-700 font-medium'}>温度</span>
                      </div>
                      <span className={`font-medium ${tempOk ? 'text-forest-700' : 'text-warm-700'}`}>
                        {enc.temperature}°C
                      </span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all ${tempOk ? 'bg-forest-500' : 'bg-warm-500'}`}
                        style={{ width: `${getProgressPercent(enc.temperature, enc.tempRange.min, enc.tempRange.max)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-earth-400 mt-0.5">
                      <span>{enc.tempRange.min}°C</span>
                      <span>{enc.tempRange.max}°C</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Droplets size={14} className={humidOk ? 'text-forest-500' : 'text-warm-600'} />
                        <span className={humidOk ? 'text-earth-600' : 'text-warm-700 font-medium'}>湿度</span>
                      </div>
                      <span className={`font-medium ${humidOk ? 'text-forest-700' : 'text-warm-700'}`}>
                        {enc.humidity}%
                      </span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all ${humidOk ? 'bg-forest-500' : 'bg-warm-500'}`}
                        style={{ width: `${getProgressPercent(enc.humidity, enc.humidityRange.min, enc.humidityRange.max)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-earth-400 mt-0.5">
                      <span>{enc.humidityRange.min}%</span>
                      <span>{enc.humidityRange.max}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-cream-200 flex items-center gap-1.5 text-xs text-earth-500">
                  <Sparkles size={12} />
                  <span>最后清洁：{enc.lastCleaned}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-forest-800 mb-4">清洁记录</h2>
          {allCleaningRecords.length === 0 ? (
            <div className="text-center py-8 text-earth-500 text-sm">暂无清洁记录</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-cream-200">
                    <th className="pb-3 font-medium text-earth-600">日期</th>
                    <th className="pb-3 font-medium text-earth-600">笼舍</th>
                    <th className="pb-3 font-medium text-earth-600">清洁人员</th>
                    <th className="pb-3 font-medium text-earth-600">清洁方式</th>
                  </tr>
                </thead>
                <tbody>
                  {allCleaningRecords.map((rec, idx) => (
                    <tr key={idx} className="border-b border-cream-100 last:border-0">
                      <td className="py-3 text-earth-700">
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-earth-400" />
                          {rec.date}
                        </div>
                      </td>
                      <td className="py-3 font-medium text-forest-700">{rec.enclosureName}</td>
                      <td className="py-3 text-earth-700">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-earth-400" />
                          {rec.staff}
                        </div>
                      </td>
                      <td className="py-3 text-earth-600">{rec.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-forest-800 mb-4">安全检查</h2>
          {allSafetyChecks.length === 0 ? (
            <div className="text-center py-8 text-earth-500 text-sm">暂无安全检查记录</div>
          ) : (
            <div className="space-y-3">
              {allSafetyChecks.map((check, idx) => {
                const hasIssues = check.issues.length > 0;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl p-4 border ${
                      hasIssues
                        ? 'bg-warm-50 border-warm-200'
                        : 'bg-white border-cream-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="font-medium text-forest-700">{check.enclosureName}</div>
                        <div className="flex items-center gap-1.5 text-xs text-earth-500 mt-0.5">
                          <Shield size={12} />
                          <span>{check.inspector}</span>
                          <span className="mx-1">·</span>
                          <span>{check.date}</span>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                        hasIssues
                          ? 'bg-warm-100 text-warm-700'
                          : 'bg-forest-100 text-forest-700'
                      }`}>
                        {hasIssues ? (
                          <><AlertTriangle size={12} /> {check.status}</>
                        ) : (
                          <><CheckCircle size={12} /> {check.status}</>
                        )}
                      </span>
                    </div>
                    {hasIssues && (
                      <ul className="mt-2 space-y-1">
                        {check.issues.map((issue, i) => (
                          <li key={i} className="text-sm text-warm-700 flex items-start gap-1.5">
                            <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
