import { useState } from 'react';
import { useAppStore } from '@/store';
import { Heart, Baby, Users, Stethoscope, Clock, ChevronRight, Mars, Venus, Plus, Check, X, ArrowRight, TreePine, Home } from 'lucide-react';
import type { BreedingType, Gender } from '@/types';

const stages: { key: BreedingType | 'nursing'; label: string; icon: typeof Heart; dot: string }[] = [
  { key: 'estrus', label: '发情监测', icon: Heart, dot: 'bg-warm-500 border-warm-500 text-warm-500' },
  { key: 'mating', label: '配种登记', icon: Users, dot: 'bg-forest-500 border-forest-500 text-forest-500' },
  { key: 'pregnancy', label: '妊娠管理', icon: Stethoscope, dot: 'bg-blue-500 border-blue-500 text-blue-500' },
  { key: 'birth', label: '幼崽出生', icon: Baby, dot: 'bg-purple-500 border-purple-500 text-purple-500' },
  { key: 'nursing', label: '幼崽哺育', icon: Users, dot: 'bg-earth-500 border-earth-500 text-earth-500' },
];
const stageOrder = ['estrus', 'mating', 'pregnancy', 'birth', 'nursing'];
const btnColors: Record<string, string> = { estrus: 'bg-warm-500', mating: 'bg-forest-500', pregnancy: 'bg-blue-500', birth: 'bg-purple-500', nursing: 'bg-earth-500' };
const statsIcons = [Heart, Users, Stethoscope, Baby];
const statsLabels = ['发情期动物', '已配种', '妊娠中', '已出生幼崽'];
const statsBgs = ['bg-warm-400/20 text-warm-600', 'bg-forest-400/20 text-forest-600', 'bg-blue-400/20 text-blue-600', 'bg-purple-300 text-purple-600'];
const typeLabels: Record<string, string> = { estrus: '发情', mating: '配种', pregnancy: '妊娠', birth: '出生', nursing: '哺育' };

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

export default function Breeding() {
  const { breedingRecords, animals, addBreedingRecord, updateBreedingRecord } = useAppStore();
  const [tab, setTab] = useState<'flow' | 'pedigree'>('flow');
  const [mt, setMt] = useState<string | null>(null);
  const [selA, setSelA] = useState<string | null>(animals[0]?.id || null);
  const [bc_, setBc] = useState<{ id: string; name: string; role?: string }[]>([]);
  const [dtl, setDtl] = useState<string | null>(null);
  const [fd, setFd] = useState<any>({});
  const [cubs, setCubs] = useState<{ name: string; gender: Gender; birthDate: string; status: string }[]>([{ name: '', gender: 'male', birthDate: '2026-06-18', status: '健康' }]);

  const counts = [
    breedingRecords.filter(r => r.breedingType === 'estrus').length,
    breedingRecords.filter(r => r.breedingType === 'mating').length,
    breedingRecords.filter(r => r.breedingType === 'pregnancy').length,
    breedingRecords.reduce((acc, r) => acc + (r.offspring?.length || 0), 0),
  ];
  const brAnimals = [...new Set(breedingRecords.map(r => r.animalId))];

  function getStage(aid: string) {
    const rs = breedingRecords.filter(r => r.animalId === aid);
    const ts = rs.map(r => r.breedingType);
    if (rs.some(r => r.breedingType === 'birth' && r.offspring?.length)) return 'nursing';
    if (ts.includes('pregnancy')) return 'pregnancy';
    if (ts.includes('mating')) return 'mating';
    if (ts.includes('estrus')) return 'estrus';
    return null;
  }
  function openM(t: string) {
    setMt(t);
    setFd({ animalId: selA || animals[0]?.id, eventDate: '2026-06-18', notes: '', motherId: selA || animals[0]?.id, fatherId: '', dueDate: '' });
    setCubs([{ name: '', gender: 'male', birthDate: '2026-06-18', status: '健康' }]);
  }
  function submit() {
    if (!mt) return;
    const aid = mt === 'birth' ? fd.motherId : fd.animalId;
    const a = animals.find(x => x.id === aid); if (!a) return;
    const base = { notes: fd.notes || '' };
    if (mt === 'estrus') addBreedingRecord({ ...base, animalId: aid, animalName: a.name, breedingType: 'estrus', eventDate: fd.eventDate, status: '发情期' });
    else if (mt === 'mating') { const p = animals.find(x => x.id === fd.partnerId); addBreedingRecord({ ...base, animalId: aid, animalName: a.name, partnerId: fd.partnerId, partnerName: p?.name, breedingType: 'mating', eventDate: fd.eventDate, status: '配种完成，观察中' }); }
    else if (mt === 'pregnancy') addBreedingRecord({ ...base, animalId: aid, animalName: a.name, breedingType: 'pregnancy', eventDate: fd.eventDate, status: `预产期 ${fd.dueDate || '待确认'}` });
    else if (mt === 'birth') { const f = animals.find(x => x.id === fd.fatherId); const v = cubs.filter(c => c.name.trim()); if (!v.length) return; addBreedingRecord({ ...base, animalId: aid, animalName: a.name, partnerId: fd.fatherId, partnerName: f?.name, breedingType: 'birth', eventDate: v[0].birthDate, status: '已成功分娩', offspring: v.map((c, i) => ({ id: `c${Date.now()}${i}`, name: c.name, birthDate: c.birthDate, gender: c.gender, status: c.status })) }); }
    else if (mt === 'nursing' && fd.recordId) updateBreedingRecord(fd.recordId, { notes: fd.notes });
    setMt(null);
  }
  function openDtl(aid: string, role?: string) {
    const a = animals.find(x => x.id === aid); if (!a) return;
    setBc(bc_.length === 0 ? [{ id: a.id, name: a.name }] : [...bc_, { id: a.id, name: a.name, role }]);
    setDtl(a.id);
  }
  const dtlA = dtl ? animals.find(a => a.id === dtl) : null;

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-semibold text-forest-800">繁育记录</h1><p className="text-sm text-earth-600 mt-1">管理动物繁育全过程，监测繁育状态</p></div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsLabels.map((l, i) => { const I = statsIcons[i]; return <div key={l} className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div><p className="text-sm text-earth-600">{l}</p><p className="text-3xl font-bold text-forest-700 mt-1">{counts[i]}</p></div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statsBgs[i]}`}><I size={24} /></div>
        </div>
      </div>; })}
    </div>

    <div className="flex gap-2 border-b border-cream-200">
      <button onClick={() => setTab('flow')} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${tab === 'flow' ? 'border-forest-500 text-forest-700' : 'border-transparent text-earth-500'}`}>繁育流程跟踪</button>
      <button onClick={() => { setTab('pedigree'); setDtl(animals[0]?.id || null); setBc(animals[0] ? [{ id: animals[0].id, name: animals[0].name }] : []); }} className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px flex items-center gap-1.5 ${tab === 'pedigree' ? 'border-forest-500 text-forest-700' : 'border-transparent text-earth-500'}`}><TreePine size={15} />谱系血缘</button>
    </div>

    {tab === 'flow' && <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-earth-600">选择动物：</span>
        <select value={selA || ''} onChange={e => setSelA(e.target.value)} className="px-3 py-1.5 rounded-lg border border-cream-300 bg-white text-sm">{animals.map(a => <option key={a.id} value={a.id}>{a.name}（{a.speciesName}）</option>)}</select>
        <div className="flex-1" />
        {['estrus', 'mating', 'pregnancy', 'birth', 'nursing'].map(t => <button key={t} onClick={() => openM(t)} className={`${bc} ${btnColors[t]} text-white hover:opacity-90`}><Plus size={14} className="inline mr-1" />登记{typeLabels[t]}</button>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {brAnimals.map(aid => {
          const a = animals.find(x => x.id === aid); if (!a) return null;
          const cs = getStage(aid); const cIdx = cs ? stageOrder.indexOf(cs) : -1;
          const rs = breedingRecords.filter(r => r.animalId === aid);
          return <div key={aid} className="bg-cream-50 border border-cream-200 rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center">{a.gender === 'male' ? <Mars size={18} className="text-warm-600" /> : <Venus size={18} className="text-earth-500" />}</div>
              <div><p className="font-semibold text-forest-800">{a.name}</p><p className="text-xs text-earth-500">{a.speciesName}</p></div>
            </div>
            <div className="flex items-center justify-between relative">
              {stages.map((s, i) => { const SI = s.icon; const done = i < cIdx || (i === cIdx && i === stages.length - 1); const cur = i === cIdx; return <div key={s.key} className="flex flex-col items-center flex-1 relative z-10">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${done ? 'bg-forest-500 border-forest-500 text-white' : cur ? `bg-white border-2 ${s.dot}` : 'bg-cream-100 border-cream-300 text-earth-400'}`}>{done ? <Check size={16} /> : <SI size={16} />}</div>
                <p className={`text-xs mt-1.5 text-center ${cur ? 'font-semibold text-forest-700' : done ? 'text-earth-600' : 'text-earth-400'}`}>{s.label}</p>
              </div>; })}
              <div className="absolute left-4 right-4 top-4 h-0.5 bg-cream-300 -z-0" />
            </div>
            {rs.length > 0 && <div className="mt-4 pt-4 border-t border-cream-200 space-y-2">{rs.slice(-3).map(r => <div key={r.id} className="text-xs text-earth-600 flex items-center gap-2"><Clock size={11} className="text-earth-400" />{r.eventDate} · {r.status}</div>)}</div>}
          </div>;
        })}
      </div>
    </div>}

    {tab === 'pedigree' && dtlA && <div className="space-y-4">
      {bc_.length > 0 && <div className="flex items-center gap-2 text-sm flex-wrap">
        <button onClick={() => { setBc([]); setDtl(animals[0]?.id || null); }} className="p-1.5 rounded-lg hover:bg-cream-200 text-earth-500"><Home size={14} /></button>
        {bc_.map((b, i) => <div key={i} className="flex items-center gap-2">
          <ChevronRight size={12} className="text-earth-400" />
          <button onClick={() => { const nb = bc_.slice(0, i + 1); setBc(nb); setDtl(nb[nb.length - 1].id); }} className={`px-2 py-1 rounded-md ${i === bc_.length - 1 ? 'bg-forest-100 text-forest-700 font-medium' : 'hover:bg-cream-200 text-earth-600'}`}>{b.role ? `${b.role}：` : ''}{b.name}</button>
        </div>)}
      </div>}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center">{dtlA.gender === 'male' ? <Mars size={28} className="text-warm-600" /> : <Venus size={28} className="text-earth-500" />}</div>
          <div><h3 className="text-xl font-bold text-forest-800">{dtlA.name}</h3><p className="text-sm text-earth-600">{dtlA.speciesName} · {dtlA.gender === 'male' ? '雄性' : '雌性'} · {dtlA.age}岁</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-cream-200">
            <h4 className="font-semibold text-forest-700 mb-3 text-sm">直系父母</h4>
            <div className="space-y-2">{['father', 'mother'].map(r => {
              const rid = r === 'father' ? dtlA.pedigree?.fatherId : dtlA.pedigree?.motherId;
              const rn = r === 'father' ? dtlA.pedigree?.fatherName : dtlA.pedigree?.motherName;
              const rl = r === 'father' ? '父亲' : '母亲';
              return rid ? <button key={r} onClick={() => openDtl(rid!, rl)} className="w-full text-left p-3 rounded-lg bg-cream-50 hover:bg-cream-100 flex items-center justify-between"><span className="text-sm"><span className="text-earth-500">{rl}：</span><span className="font-medium text-forest-700">{rn}</span></span><ArrowRight size={14} className="text-earth-400" /></button> : <p key={r} className="text-xs text-earth-400 p-2">{rl}信息未录入</p>;
            })}</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-cream-200">
            <h4 className="font-semibold text-forest-700 mb-3 text-sm">子女列表</h4>
            <div className="space-y-2">{dtlA.pedigree?.childrenIds?.length ? dtlA.pedigree.childrenIds.map(cid => {
              const c = animals.find(a => a.id === cid); if (!c) return null;
              return <button key={cid} onClick={() => openDtl(cid, '子女')} className="w-full text-left p-3 rounded-lg bg-cream-50 hover:bg-cream-100 flex items-center justify-between">
                <div className="flex items-center gap-2">{c.gender === 'male' ? <Mars size={13} className="text-warm-500" /> : <Venus size={13} className="text-earth-500" />}<span className="text-sm font-medium text-forest-700">{c.name}</span><span className="text-xs text-earth-500">{c.speciesName}</span></div>
                <ArrowRight size={14} className="text-earth-400" />
              </button>;
            }) : <p className="text-xs text-earth-400 p-2">暂无子女记录</p>}</div>
          </div>
        </div>
      </div>
    </div>}

    <Modal open={!!mt} onClose={() => setMt(null)} title={mt ? (mt === 'birth' ? '登记幼崽出生' : `登记${typeLabels[mt] || ''}`) : ''}>
      {(['estrus', 'mating', 'pregnancy'] as const).includes(mt as any) && <F label={mt === 'mating' ? '母本' : '动物'}>
        <select value={fd.animalId || ''} onChange={e => setFd({ ...fd, animalId: e.target.value })} className={ic}>{animals.filter(a => a.gender === 'female').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
      </F>}
      {mt === 'birth' && <F label="母亲"><select value={fd.motherId || ''} onChange={e => setFd({ ...fd, motherId: e.target.value })} className={ic}>{animals.filter(a => a.gender === 'female').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></F>}
      {(mt === 'mating' || mt === 'birth') && <F label={mt === 'mating' ? '父本' : '父亲'}>
        <select value={mt === 'mating' ? fd.partnerId || '' : fd.fatherId || ''} onChange={e => setFd({ ...fd, [mt === 'mating' ? 'partnerId' : 'fatherId']: e.target.value })} className={ic}><option value="">请选择</option>{animals.filter(a => a.gender === 'male').map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
      </F>}
      {mt === 'nursing' && <F label="选择出生记录"><select value={fd.recordId || ''} onChange={e => setFd({ ...fd, recordId: e.target.value })} className={ic}><option value="">请选择</option>{breedingRecords.filter(r => r.breedingType === 'birth' && r.offspring?.length).map(r => <option key={r.id} value={r.id}>{r.animalName} - {r.eventDate}</option>)}</select></F>}
      {(['estrus', 'mating', 'pregnancy'] as const).includes(mt as any) && <F label={mt === 'pregnancy' ? '确诊日期' : '日期'}><input type="date" value={fd.eventDate || ''} onChange={e => setFd({ ...fd, eventDate: e.target.value })} className={ic} /></F>}
      {mt === 'pregnancy' && <F label="预产期"><input type="date" value={fd.dueDate || ''} onChange={e => setFd({ ...fd, dueDate: e.target.value })} className={ic} /></F>}
      {mt === 'birth' && <div className="mb-4">
        <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-forest-700">幼崽信息</label><button onClick={() => setCubs([...cubs, { name: '', gender: 'male', birthDate: '2026-06-18', status: '健康' }])} className="text-xs text-forest-600">+ 添加</button></div>
        {cubs.map((c, i) => <div key={i} className="grid grid-cols-4 gap-2 mb-2">
          <input placeholder="名字" value={c.name} onChange={e => { const nc = [...cubs]; nc[i].name = e.target.value; setCubs(nc); }} className={`${ic} text-xs`} />
          <select value={c.gender} onChange={e => { const nc = [...cubs]; nc[i].gender = e.target.value as Gender; setCubs(nc); }} className={`${ic} text-xs`}><option value="male">雄</option><option value="female">雌</option></select>
          <input type="date" value={c.birthDate} onChange={e => { const nc = [...cubs]; nc[i].birthDate = e.target.value; setCubs(nc); }} className={`${ic} text-xs`} />
          <div className="flex gap-1"><input placeholder="状态" value={c.status} onChange={e => { const nc = [...cubs]; nc[i].status = e.target.value; setCubs(nc); }} className={`${ic} text-xs flex-1`} />{cubs.length > 1 && <button onClick={() => setCubs(cubs.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-red-500"><X size={14} /></button>}</div>
        </div>)}
      </div>}
      <F label={mt === 'nursing' ? '状态更新' : '备注'}><textarea rows={mt === 'nursing' ? 3 : 2} value={fd.notes || ''} onChange={e => setFd({ ...fd, notes: e.target.value })} className={ic} /></F>
      <button onClick={submit} className={`${bc} bg-forest-500 text-white w-full`}>确认{mt === 'nursing' ? '更新' : '登记'}</button>
    </Modal>
  </div>;
}
