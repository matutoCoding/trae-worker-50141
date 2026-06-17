import { useState } from 'react';
import { useAppStore } from '@/store';
import { Thermometer, Droplets, Users, Ruler, Sparkles, AlertTriangle, Clock, Shield, Plus, X } from 'lucide-react';

const sc = { normal: { l: '正常', b: 'bg-forest-100', t: 'text-forest-700', bd: 'border-forest-300' }, warning: { l: '警告', b: 'bg-warm-100', t: 'text-warm-700', bd: 'border-warm-300' }, alert: { l: '告警', b: 'bg-red-100', t: 'text-red-700', bd: 'border-red-300' } };
function ir(v: number, mn: number, mx: number) { return v >= mn && v <= mx; }
function gp(v: number, mn: number, mx: number) { return ((Math.max(mn, Math.min(mx, v)) - mn) / (mx - mn)) * 100; }

interface MP { open: boolean; onClose: () => void; title: string; children: React.ReactNode; }
function Modal({ open, onClose, title, children }: MP) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="bg-cream-50 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-cream-200">
        <h3 className="text-lg font-semibold text-forest-800">{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-200 text-earth-500"><X size={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) { return <div className="mb-4"><label className="block text-sm font-medium text-forest-700 mb-1.5">{label}</label>{children}</div>; }
const ic = 'w-full px-3 py-2 rounded-lg border border-cream-300 bg-white text-sm text-forest-800 focus:outline-none focus:border-forest-400';
const bc = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';

export default function Enclosure() {
  const { enclosures, getWarnings, updateEnclosureEnvironment, addEnclosureCleaningRecord, addEnclosureSafetyCheck } = useAppStore();
  const aw = getWarnings();
  const ew = aw.filter(w => ['temperature', 'humidity', 'cleaning_overdue'].includes(w.type));
  const [mt, setMt] = useState<string | null>(null);
  const [se, setSe] = useState<string>(enclosures[0]?.id || '');
  const [fd, setFd] = useState<any>({});
  const [issues, setIssues] = useState<string[]>(['']);
  const now = new Date();

  const tw = aw.filter(w => w.type === 'temperature' || w.type === 'humidity').map(w => {
    const enc = enclosures.find(e => e.id === w.relatedId); const it = w.type === 'temperature';
    return { type: w.type, level: w.severity, name: w.relatedName || '', val: it ? enc?.temperature : enc?.humidity, range: it ? enc?.tempRange : enc?.humidityRange };
  });
  const cw = aw.filter(w => w.type === 'cleaning_overdue').map(w => {
    const enc = enclosures.find(e => e.id === w.relatedId); const lc = new Date(enc?.lastCleaned || now);
    return { level: w.severity, name: w.relatedName || '', oh: Math.floor((now.getTime() - lc.getTime()) / 3600000), last: enc?.lastCleaned || '' };
  });
  const sw = enclosures.filter(e => e.safetyChecks.length > 0 && e.safetyChecks[0].status === '需整改').map(e => ({ name: e.name, issues: e.safetyChecks[0].issues }));

  function om(t: string) {
    setMt(t); const enc = enclosures.find(e => e.id === se);
    setFd({ temperature: enc?.temperature || 22, humidity: enc?.humidity || 60, staff: '', method: '日常清洁', inspector: '', status: '合格' });
    setIssues(['']);
  }
  function sEnv() { updateEnclosureEnvironment(se, Number(fd.temperature), Number(fd.humidity)); setMt(null); }
  function sClean() { const d = new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5); addEnclosureCleaningRecord(se, { date: d, staff: fd.staff, method: fd.method }); setMt(null); }
  function sSafe() { const vi = issues.filter(i => i.trim()); const d = new Date().toISOString().slice(0, 10); addEnclosureSafetyCheck(se, { date: d, inspector: fd.inspector, issues: vi, status: vi.length > 0 ? '需整改' : '合格' }); setMt(null); }

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-forest-800">笼舍环境</h1><p className="text-sm text-earth-600 mt-1">监控笼舍环境参数，管理清洁与安全巡检</p></div>

    <div className="bg-gradient-to-r from-red-50 via-warm-50 to-cream-50 border border-warm-200 rounded-2xl p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4"><AlertTriangle className="text-warm-600" size={20} /><h2 className="text-lg font-semibold text-forest-800">实时预警</h2><span className="ml-auto text-xs text-earth-500">共 {ew.length} 条预警</span></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-warm-200">
          <div className="flex items-center gap-2 mb-3"><div className="p-1.5 bg-red-100 rounded-lg"><Thermometer size={14} className="text-red-600" /></div><h3 className="font-semibold text-sm text-forest-800">温湿度预警</h3></div>
          {tw.length === 0 ? <p className="text-xs text-earth-400">无异常</p> : <div className="space-y-2">{tw.map((w, i) => <div key={i} className={`p-2.5 rounded-lg ${w.level === 'alert' ? 'bg-red-50 border border-red-200' : 'bg-warm-50 border border-warm-200'}`}>
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-forest-700">{w.name}</span><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${w.level === 'alert' ? 'bg-red-100 text-red-700' : 'bg-warm-100 text-warm-700'}`}>{w.type === 'temperature' ? `${w.val}°C` : `${w.val}%`}</span></div>
            <p className="text-xs text-earth-500 mt-1">正常范围：{w.range?.min}-{w.range?.max}{w.type === 'temperature' ? '°C' : '%'}</p>
          </div>)}</div>}
        </div>
        <div className="bg-white rounded-xl p-4 border border-warm-200">
          <div className="flex items-center gap-2 mb-3"><div className="p-1.5 bg-warm-100 rounded-lg"><Clock size={14} className="text-warm-600" /></div><h3 className="font-semibold text-sm text-forest-800">清洁超时</h3></div>
          {cw.length === 0 ? <p className="text-xs text-earth-400">无异常</p> : <div className="space-y-2">{cw.map((w, i) => <div key={i} className={`p-2.5 rounded-lg ${w.level === 'alert' ? 'bg-red-50 border border-red-200' : 'bg-warm-50 border border-warm-200'}`}>
            <div className="flex items-center justify-between"><span className="text-sm font-medium text-forest-700">{w.name}</span><span className="text-xs text-warm-600">超时 {w.oh}h</span></div>
            <p className="text-xs text-earth-500 mt-1">上次清洁：{w.last}</p>
          </div>)}</div>}
        </div>
        <div className="bg-white rounded-xl p-4 border border-warm-200">
          <div className="flex items-center gap-2 mb-3"><div className="p-1.5 bg-warm-100 rounded-lg"><Shield size={14} className="text-warm-600" /></div><h3 className="font-semibold text-sm text-forest-800">设施安全</h3></div>
          {sw.length === 0 ? <p className="text-xs text-earth-400">无异常</p> : <div className="space-y-2">{sw.map((w, i) => <div key={i} className="p-2.5 rounded-lg bg-warm-50 border border-warm-200">
            <p className="text-sm font-medium text-forest-700">{w.name}</p>
            <ul className="mt-1 space-y-0.5">{w.issues?.slice(0, 2).map((iss, j) => <li key={j} className="text-xs text-warm-600 flex items-start gap-1"><AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />{iss}</li>)}</ul>
          </div>)}</div>}
        </div>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-earth-600">操作笼舍：</span>
      <select value={se} onChange={e => setSe(e.target.value)} className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm">{enclosures.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
      <div className="flex-1" />
      <button onClick={() => om('env')} className={`${bc} bg-forest-500 text-white hover:bg-forest-600`}><Plus size={14} /> 更新温湿度</button>
      <button onClick={() => om('clean')} className={`${bc} bg-blue-500 text-white hover:bg-blue-600`}><Plus size={14} /> 登记清洁</button>
      <button onClick={() => om('safety')} className={`${bc} bg-warm-500 text-white hover:bg-warm-600`}><Plus size={14} /> 登记安全检查</button>
    </div>

    <div>
      <h2 className="text-lg font-semibold text-forest-800 mb-4">笼舍状态</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enclosures.map(enc => {
          const tOk = ir(enc.temperature, enc.tempRange.min, enc.tempRange.max);
          const hOk = ir(enc.humidity, enc.humidityRange.min, enc.humidityRange.max);
          const s = sc[enc.status];
          return <div key={enc.id} className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between mb-4">
              <div><h3 className="font-semibold text-forest-800">{enc.name}</h3><div className="flex items-center gap-1.5 mt-1 text-xs text-earth-500"><Ruler size={12} /><span>{enc.area}</span></div></div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.b} ${s.t} ${s.bd}`}>{s.l}</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm"><div className="flex items-center gap-1.5 text-earth-600"><Users size={14} /><span>容量</span></div><span className="font-medium text-forest-700">{enc.currentOccupancy} / {enc.capacity}</span></div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5"><div className="flex items-center gap-1.5"><Thermometer size={14} className={tOk ? 'text-forest-500' : 'text-warm-600'} /><span className={tOk ? 'text-earth-600' : 'text-warm-700 font-medium'}>温度</span></div><span className={`font-medium ${tOk ? 'text-forest-700' : 'text-warm-700'}`}>{enc.temperature}°C</span></div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${tOk ? 'bg-forest-500' : 'bg-warm-500'}`} style={{ width: `${gp(enc.temperature, enc.tempRange.min, enc.tempRange.max)}%` }} /></div>
                <div className="flex justify-between text-xs text-earth-400 mt-0.5"><span>{enc.tempRange.min}°C</span><span>{enc.tempRange.max}°C</span></div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5"><div className="flex items-center gap-1.5"><Droplets size={14} className={hOk ? 'text-forest-500' : 'text-warm-600'} /><span className={hOk ? 'text-earth-600' : 'text-warm-700 font-medium'}>湿度</span></div><span className={`font-medium ${hOk ? 'text-forest-700' : 'text-warm-700'}`}>{enc.humidity}%</span></div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${hOk ? 'bg-forest-500' : 'bg-warm-500'}`} style={{ width: `${gp(enc.humidity, enc.humidityRange.min, enc.humidityRange.max)}%` }} /></div>
                <div className="flex justify-between text-xs text-earth-400 mt-0.5"><span>{enc.humidityRange.min}%</span><span>{enc.humidityRange.max}%</span></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-cream-200 flex items-center gap-1.5 text-xs text-earth-500"><Sparkles size={12} /><span>最后清洁：{enc.lastCleaned}</span></div>
          </div>;
        })}
      </div>
    </div>

    <Modal open={mt === 'env'} onClose={() => setMt(null)} title="更新温湿度">
      <F label="温度 (°C)"><input type="number" value={fd.temperature} onChange={e => setFd({ ...fd, temperature: e.target.value })} className={ic} /></F>
      <F label="湿度 (%)"><input type="number" value={fd.humidity} onChange={e => setFd({ ...fd, humidity: e.target.value })} className={ic} /></F>
      <button onClick={sEnv} className={`${bc} bg-forest-500 text-white hover:bg-forest-600 w-full`}>确认更新</button>
    </Modal>
    <Modal open={mt === 'clean'} onClose={() => setMt(null)} title="登记清洁">
      <F label="清洁人员"><input placeholder="请输入清洁人员姓名" value={fd.staff} onChange={e => setFd({ ...fd, staff: e.target.value })} className={ic} /></F>
      <F label="清洁方式"><select value={fd.method} onChange={e => setFd({ ...fd, method: e.target.value })} className={ic}><option value="日常清洁">日常清洁</option><option value="全面清洁消毒">全面清洁消毒</option><option value="深度清洁">深度清洁</option></select></F>
      <button onClick={sClean} className={`${bc} bg-forest-500 text-white hover:bg-forest-600 w-full`}>确认登记</button>
    </Modal>
    <Modal open={mt === 'safety'} onClose={() => setMt(null)} title="登记安全检查">
      <F label="检查人员"><input placeholder="请输入检查人员姓名" value={fd.inspector} onChange={e => setFd({ ...fd, inspector: e.target.value })} className={ic} /></F>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-forest-700">问题列表</label><button onClick={() => setIssues([...issues, ''])} className="text-xs text-forest-600 hover:text-forest-700">+ 添加问题</button></div>
        {issues.map((iss, i) => <div key={i} className="flex gap-2 mb-2">
          <input placeholder={`问题 ${i + 1}（无问题留空）`} value={iss} onChange={e => { const ni = [...issues]; ni[i] = e.target.value; setIssues(ni); }} className={ic} />
          {issues.length > 1 && <button onClick={() => setIssues(issues.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><X size={16} /></button>}
        </div>)}
      </div>
      <F label="状态"><select value={fd.status} onChange={e => setFd({ ...fd, status: e.target.value })} className={ic}><option value="合格">合格</option><option value="需整改">需整改</option></select></F>
      <button onClick={sSafe} className={`${bc} bg-forest-500 text-white hover:bg-forest-600 w-full`}>确认登记</button>
    </Modal>
  </div>;
}
