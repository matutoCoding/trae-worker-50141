import { useState } from 'react';
import { useAppStore } from '@/store';
import type { BehaviorType, Severity } from '@/types';
import { Leaf, Calendar, Star, User, Clock, Activity, AlertTriangle, HeartPulse, TrendingUp, TrendingDown, Sparkles, Plus, X, Minus } from 'lucide-react';

const bt: Record<BehaviorType, { l: string; c: string; b: string }> = { normal: { l: '正常', c: 'text-forest-700', b: 'bg-forest-500' }, stereotypic: { l: '刻板', c: 'text-warm-700', b: 'bg-warm-500' }, aggressive: { l: '攻击', c: 'text-red-700', b: 'bg-red-500' }, social: { l: '社交', c: 'text-blue-700', b: 'bg-blue-500' } };
const sv: Record<Severity, { l: string; c: string }> = { mild: { l: '轻度', c: 'bg-yellow-100 text-yellow-700' }, moderate: { l: '中度', c: 'bg-warm-100 text-warm-700' }, severe: { l: '重度', c: 'bg-red-100 text-red-700' } };
const lv: Record<string, any> = { high: { l: '高风险', b: 'bg-red-50', bd: 'border-red-200', t: 'text-red-700', d: 'bg-red-500' }, medium: { l: '中风险', b: 'bg-warm-50', bd: 'border-warm-200', t: 'text-warm-700', d: 'bg-warm-500' }, normal: { l: '正常', b: 'bg-forest-50', bd: 'border-forest-200', t: 'text-forest-700', d: 'bg-forest-500' } };
const d7 = (() => { const d = []; const t = new Date('2026-06-18'); for (let i = 6; i >= 0; i--) d.push(new Date(t.getTime() - i * 86400000).toISOString().slice(5, 10)); return d; })();

interface MP { open: boolean; onClose: () => void; title: string; children: React.ReactNode; }
function Modal({ open, onClose, title, children }: MP) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="bg-cream-50 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-cream-200"><h3 className="text-lg font-semibold text-forest-800">{title}</h3><button onClick={onClose} className="p-1.5 rounded-lg hover:bg-cream-200 text-earth-500"><X size={18} /></button></div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) { return <div className="mb-4"><label className="block text-sm font-medium text-forest-700 mb-1.5">{label}</label>{children}</div>; }
const ic = 'w-full px-3 py-2 rounded-lg border border-cream-300 bg-white text-sm text-forest-800 focus:outline-none focus:border-forest-400';
const bc = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';

export default function Behavior() {
  const { enrichmentActivities, behaviorRecords, animals, getWarnings, addBehaviorRecord, addEnrichmentActivity } = useAppStore();
  const aw = getWarnings();
  const bw = aw.filter(w => w.type === 'stereotypic_high').map(w => {
    const c7 = behaviorRecords.filter(r => r.animalId === w.relatedId && r.behaviorType === 'stereotypic').reduce((s, r) => s + r.frequency, 0);
    return { id: w.relatedId || '', name: w.relatedName || '', level: c7 >= 15 ? 'high' : c7 >= 8 ? 'medium' : 'normal', c7, trend: 'flat' as 'up' | 'down' | 'flat', msg: w.message };
  });
  const [mt, setMt] = useState<string | null>(null);
  const [fd, setFd] = useState<any>({});

  function om(t: string) {
    setMt(t);
    setFd({ animalId: animals[0]?.id || '', observationDate: '2026-06-18', observer: '', behaviorType: 'normal' as BehaviorType, behaviorName: '', frequency: 1, durationMinutes: 10, severity: '' as Severity | '', enrichmentActivity: '', notes: '', activityName: '', activityType: '食物丰容', targetSpecies: '', description: '' });
  }
  function sr() { const a = animals.find(x => x.id === fd.animalId); if (!a) return; addBehaviorRecord({ animalId: fd.animalId, animalName: a.name, observationDate: fd.observationDate, observer: fd.observer, behaviorType: fd.behaviorType, behaviorName: fd.behaviorName, frequency: Number(fd.frequency), durationMinutes: Number(fd.durationMinutes), severity: fd.severity || undefined, enrichmentActivity: fd.enrichmentActivity || undefined, notes: fd.notes || '' }); setMt(null); }
  function se() {
    if (!fd.activityName?.trim()) return;
    const targetSpecies = fd.targetSpecies ? fd.targetSpecies.split(/[,，、]/).map((s: string) => s.trim()).filter(Boolean) : [];
    addEnrichmentActivity({
      name: fd.activityName.trim(),
      type: fd.activityType || '食物丰容',
      targetSpecies,
      description: fd.description || '',
      lastUsed: new Date().toISOString().slice(0, 10),
      effectiveness: 70,
    });
    setMt(null);
  }
  function t7(aid: string) { const m: Record<string, number> = {}; d7.forEach(d => m[d] = 0); behaviorRecords.filter(r => r.animalId === aid && r.behaviorType === 'stereotypic').forEach(r => { const d = r.observationDate.slice(5); if (m[d] !== undefined) m[d] += r.frequency; }); return d7.map(d => m[d]); }

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-forest-800">行为观察</h1><p className="text-sm text-earth-600 mt-1">丰容设施管理与动物行为监测</p></div>

    <div className="bg-gradient-to-r from-red-50 via-warm-50 to-cream-50 border border-warm-200 rounded-2xl p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4"><AlertTriangle className="text-warm-600" size={20} /><h2 className="text-lg font-semibold text-forest-800">刻板行为预警</h2><div className="flex-1" /><button onClick={() => om('rec')} className={`${bc} bg-forest-500 text-white`}><Plus size={14} className="inline mr-1" />添加观察记录</button><button onClick={() => om('enr')} className={`${bc} bg-warm-500 text-white`}><Plus size={14} className="inline mr-1" />丰容活动记录</button></div>
      {bw.length === 0 ? <p className="text-sm text-earth-500 py-4 text-center">暂无刻板行为预警</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bw.map(w => { const g = lv[w.level]; const td = t7(w.id); const mx = Math.max(1, ...td); return <div key={w.id} className={`${g.b} border ${g.bd} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full ${g.d} flex items-center justify-center text-white font-bold text-xs`}>{w.c7}</div><div><p className="font-semibold text-forest-800">{w.name}</p><span className={`text-xs ${g.t} font-medium`}>{g.l}</span></div></div>
            <div className="flex items-center gap-1">{w.trend === 'up' ? <TrendingUp size={14} className="text-red-500" /> : w.trend === 'down' ? <TrendingDown size={14} className="text-forest-500" /> : <Minus size={14} className="text-earth-400" />}<span className={`text-xs ${w.trend === 'up' ? 'text-red-600' : w.trend === 'down' ? 'text-forest-600' : 'text-earth-500'}`}>{w.trend === 'up' ? '上升' : w.trend === 'down' ? '下降' : '持平'}</span></div>
          </div>
          <div className="flex items-end gap-1 h-12 mb-2 mt-3">{td.map((v, i) => <div key={i} className="flex-1 flex flex-col items-center gap-1"><div className={`w-full rounded-t ${g.d} opacity-80`} style={{ height: `${(v / mx) * 100}%`, minHeight: v > 0 ? '4px' : '2px' }} /><span className="text-[10px] text-earth-400">{d7[i].slice(3)}</span></div>)}</div>
          <p className="text-xs text-earth-600 mt-1 leading-relaxed">建议：{w.msg}</p>
        </div>; })}
      </div>}
    </div>

    <section>
      <div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-warm-600" /><h2 className="text-lg font-semibold text-forest-800">丰容设施</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {enrichmentActivities.map(a => { const col = a.effectiveness >= 90 ? 'bg-forest-500' : a.effectiveness >= 70 ? 'bg-warm-500' : 'bg-red-500'; const st = Math.round((a.effectiveness / 100) * 5); return <div key={a.id} className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2"><div className="p-2 bg-forest-50 rounded-lg"><Leaf className="w-4 h-4 text-forest-600" /></div><div><h3 className="font-semibold text-forest-900">{a.name}</h3><span className="text-xs text-warm-700 bg-warm-100 px-2 py-0.5 rounded-full">{a.type}</span></div></div>
            <div className="flex items-center gap-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className={i <= st ? 'text-warm-500 fill-warm-500' : 'text-cream-300'} />)}</div>
          </div>
          <p className="text-sm text-earth-600 mb-3 line-clamp-2">{a.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">{a.targetSpecies.map(s => <span key={s} className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">{s}</span>)}</div>
          <div className="space-y-2 pt-3 border-t border-cream-200">
            <div className="flex items-center gap-2 text-xs text-earth-500"><Calendar className="w-3.5 h-3.5" />最近使用: {a.lastUsed}</div>
            <div className="flex items-center gap-2"><div className="flex-1 h-2 bg-cream-200 rounded-full overflow-hidden"><div className={`h-full ${col} rounded-full`} style={{ width: `${a.effectiveness}%` }} /></div><span className="text-sm font-medium text-forest-800 w-10 text-right">{a.effectiveness}%</span></div>
          </div>
        </div>; })}
      </div>
    </section>

    <section>
      <div className="flex items-center gap-2 mb-4"><Activity className="w-5 h-5 text-forest-600" /><h2 className="text-lg font-semibold text-forest-800">行为观察记录</h2></div>
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-1 shadow-card">
        <div className="relative pl-8 pr-4 py-4">
          <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-cream-300" />
          {behaviorRecords.map(r => { const ti = bt[r.behaviorType]; return <div key={r.id} className="relative mb-5 last:mb-0">
            <div className={`absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 border-white ${ti.b}`} />
            <div className="p-4 bg-white rounded-xl border border-cream-200">
              <div className="flex flex-wrap items-center gap-2 mb-2"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-forest-100 ${ti.c} border-forest-200`}><Activity className="w-3 h-3 mr-1" />{ti.l}</span><span className="font-medium text-forest-800">{r.behaviorName}</span>{r.severity && <span className={`text-xs px-2 py-0.5 rounded-full ${sv[r.severity].c}`}>{sv[r.severity].l}</span>}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm"><div className="flex items-center gap-1.5 text-earth-600"><Calendar className="w-3.5 h-3.5 text-forest-500" />{r.observationDate}</div><div className="flex items-center gap-1.5 text-earth-600"><HeartPulse className="w-3.5 h-3.5 text-forest-500" />{r.animalName}</div><div className="flex items-center gap-1.5 text-earth-600"><User className="w-3.5 h-3.5 text-forest-500" />{r.observer}</div><div className="flex items-center gap-1.5 text-earth-600"><Clock className="w-3.5 h-3.5 text-forest-500" />{r.durationMinutes}分钟</div></div>
              <div className="mt-2 pt-2 border-t border-cream-200 flex flex-wrap items-center gap-4 text-xs text-earth-500"><span>发生频率: <strong className="text-forest-700">{r.frequency}次</strong></span>{r.enrichmentActivity && <span>丰容干预: <strong className="text-warm-700">{r.enrichmentActivity}</strong></span>}{r.notes && <span>备注: {r.notes}</span>}</div>
            </div>
          </div>; })}
        </div>
      </div>
    </section>

    <Modal open={!!mt} onClose={() => setMt(null)} title={mt === 'rec' ? '添加观察记录' : '丰容活动登记'}>
      {mt === 'rec' && <>
        <F label="动物"><select value={fd.animalId || ''} onChange={e => setFd({ ...fd, animalId: e.target.value })} className={ic}>{animals.map(a => <option key={a.id} value={a.id}>{a.name}（{a.speciesName}）</option>)}</select></F>
        <div className="grid grid-cols-2 gap-3"><F label="观察日期"><input type="date" value={fd.observationDate || ''} onChange={e => setFd({ ...fd, observationDate: e.target.value })} className={ic} /></F><F label="观察员"><input placeholder="姓名" value={fd.observer || ''} onChange={e => setFd({ ...fd, observer: e.target.value })} className={ic} /></F></div>
        <div className="grid grid-cols-2 gap-3"><F label="行为类型"><select value={fd.behaviorType || 'normal'} onChange={e => setFd({ ...fd, behaviorType: e.target.value as BehaviorType })} className={ic}><option value="normal">正常行为</option><option value="stereotypic">刻板行为</option><option value="aggressive">攻击行为</option><option value="social">社交行为</option></select></F><F label="行为名称"><input placeholder="如：来回踱步" value={fd.behaviorName || ''} onChange={e => setFd({ ...fd, behaviorName: e.target.value })} className={ic} /></F></div>
        <div className="grid grid-cols-3 gap-3"><F label="发生次数"><input type="number" value={fd.frequency || 1} onChange={e => setFd({ ...fd, frequency: e.target.value })} className={ic} /></F><F label="持续时长(分)"><input type="number" value={fd.durationMinutes || 10} onChange={e => setFd({ ...fd, durationMinutes: e.target.value })} className={ic} /></F><F label="严重程度(可选)"><select value={fd.severity || ''} onChange={e => setFd({ ...fd, severity: e.target.value as Severity | '' })} className={ic}><option value="">无</option><option value="mild">轻度</option><option value="moderate">中度</option><option value="severe">重度</option></select></F></div>
        <F label="丰容活动(可选)"><input placeholder="已实施的丰容措施" value={fd.enrichmentActivity || ''} onChange={e => setFd({ ...fd, enrichmentActivity: e.target.value })} className={ic} /></F>
      </>}
      {mt === 'enr' && <>
        <F label="活动名称"><input placeholder="如：新觅食玩具投放" value={fd.activityName || ''} onChange={e => setFd({ ...fd, activityName: e.target.value })} className={ic} /></F>
        <div className="grid grid-cols-2 gap-3"><F label="活动类型"><select value={fd.activityType || ''} onChange={e => setFd({ ...fd, activityType: e.target.value })} className={ic}><option value="食物丰容">食物丰容</option><option value="感知丰容">感知丰容</option><option value="环境丰容">环境丰容</option><option value="社交丰容">社交丰容</option></select></F><F label="目标物种"><input placeholder="如：大熊猫" value={fd.targetSpecies || ''} onChange={e => setFd({ ...fd, targetSpecies: e.target.value })} className={ic} /></F></div>
        <F label="活动描述"><textarea rows={3} placeholder="描述丰容活动的具体实施方式..." value={fd.description || ''} onChange={e => setFd({ ...fd, description: e.target.value })} className={ic} /></F>
      </>}
      <F label="备注"><textarea rows={2} value={fd.notes || ''} onChange={e => setFd({ ...fd, notes: e.target.value })} className={ic} /></F>
      <button onClick={() => { if (mt === 'rec') sr(); else se(); }} className={`${bc} bg-forest-500 text-white w-full`}>确认{mt === 'rec' ? '添加' : '登记'}</button>
    </Modal>
  </div>;
}
