import { useState } from 'react';
import { useAppStore } from '@/store';
import Modal from '@/components/UI/Modal';
import ConfirmDialog from '@/components/UI/ConfirmDialog';
import type { EducationSchedule, VisitorInteraction } from '@/types';
import {
  BookOpen, Calendar, User, Clock, MapPin, Users, Star, MessageSquare,
  Sparkles, Globe, Leaf, UtensilsCrossed, ShieldAlert, Info, Plus,
  Edit2, Trash2, List, LayoutGrid
} from 'lucide-react';

const scheduleCategories = ['食性科普', '保护教育', '行为科普', '迁徙科普', '进化科普'];

const categoryColors: Record<string, string> = {
  '食性科普': 'bg-forest-100 text-forest-700 border-forest-300',
  '保护教育': 'bg-warm-100 text-warm-700 border-warm-300',
  '行为科普': 'bg-earth-100 text-earth-700 border-earth-300',
  '迁徙科普': 'bg-sky-100 text-sky-700 border-sky-300',
  '进化科普': 'bg-purple-100 text-purple-700 border-purple-300',
};

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const conservationColors: Record<string, string> = {
  '濒危': 'bg-red-100 text-red-700',
  '易危': 'bg-warm-100 text-warm-700',
  '近危': 'bg-yellow-100 text-yellow-700',
  '无危': 'bg-forest-100 text-forest-700',
};

const todayStr = '2026-06-18';

function getWeekDates(baseDate: string) {
  const base = new Date(baseDate);
  const dayOfWeek = base.getDay() || 7;
  const monday = new Date(base);
  monday.setDate(base.getDate() - (dayOfWeek - 1));
  return weekDays.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function RatingStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= Math.floor(score) ? 'text-warm-500 fill-warm-500' : 'text-cream-300'} />
      ))}
      <span className="text-sm font-medium text-forest-700 ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

function ScheduleCard({ schedule, onEdit, onDelete }: {
  schedule: EducationSchedule;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`p-3 rounded-lg border ${categoryColors[schedule.category] || 'bg-cream-50 text-gray-700 border-cream-300'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="font-semibold text-sm">{schedule.topic}</p>
          <p className="text-xs opacity-75">{schedule.startTime}-{schedule.endTime} · {schedule.guideName}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1 rounded hover:bg-white/50 transition-colors">
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} className="p-1 rounded hover:bg-white/50 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <p className="text-xs opacity-75">{schedule.animalExhibit}</p>
    </div>
  );
}

export default function EducationPage() {
  const {
    educationSchedules, visitorInteractions, speciesList,
    addEducationSchedule, updateEducationSchedule, deleteEducationSchedule,
    addVisitorInteraction, updateVisitorInteraction, deleteVisitorInteraction,
  } = useAppStore();

  const [scheduleView, setScheduleView] = useState<'list' | 'week'>('list');
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; editing: EducationSchedule | null }>({ open: false, editing: null });
  const [interactionModal, setInteractionModal] = useState<{ open: boolean; editing: VisitorInteraction | null }>({ open: false, editing: null });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; type: 'schedule' | 'interaction'; id: string }>({ open: false, type: 'schedule', id: '' });

  const [scheduleForm, setScheduleForm] = useState<Partial<EducationSchedule>>({
    date: todayStr, guideName: '', guideAvatar: '', topic: '', animalExhibit: '',
    startTime: '09:00', endTime: '10:00', expectedVisitors: 30, category: '食性科普',
  });
  const [interactionForm, setInteractionForm] = useState<Partial<VisitorInteraction>>({
    date: todayStr, activityName: '', animalExhibit: '', participantCount: 10,
    duration: 30, feedbackScore: 4, notes: '',
  });

  const weekDates = getWeekDates(todayStr);

  const openScheduleModal = (editing?: EducationSchedule) => {
    if (editing) {
      setScheduleForm(editing);
      setScheduleModal({ open: true, editing });
    } else {
      setScheduleForm({ date: todayStr, guideName: '', guideAvatar: '', topic: '', animalExhibit: '', startTime: '09:00', endTime: '10:00', expectedVisitors: 30, category: '食性科普' });
      setScheduleModal({ open: true, editing: null });
    }
  };

  const openInteractionModal = (editing?: VisitorInteraction) => {
    if (editing) {
      setInteractionForm(editing);
      setInteractionModal({ open: true, editing });
    } else {
      setInteractionForm({ date: todayStr, activityName: '', animalExhibit: '', participantCount: 10, duration: 30, feedbackScore: 4, notes: '' });
      setInteractionModal({ open: true, editing: null });
    }
  };

  const saveSchedule = () => {
    const avatar = scheduleForm.guideName?.charAt(0) || '';
    const data = { ...scheduleForm, guideAvatar: avatar } as EducationSchedule;
    if (scheduleModal.editing) {
      updateEducationSchedule(scheduleModal.editing.id, data);
    } else {
      addEducationSchedule(data as Omit<EducationSchedule, 'id'>);
    }
    setScheduleModal({ open: false, editing: null });
  };

  const saveInteraction = () => {
    if (interactionModal.editing) {
      updateVisitorInteraction(interactionModal.editing.id, interactionForm as VisitorInteraction);
    } else {
      addVisitorInteraction(interactionForm as Omit<VisitorInteraction, 'id'>);
    }
    setInteractionModal({ open: false, editing: null });
  };

  const handleDeleteConfirm = () => {
    if (confirmDelete.type === 'schedule') {
      deleteEducationSchedule(confirmDelete.id);
    } else {
      deleteVisitorInteraction(confirmDelete.id);
    }
  };

  const groupedSchedules = educationSchedules.reduce<Record<string, EducationSchedule[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedSchedules).sort();

  return (
    <div className="space-y-6 p-6 bg-cream-50 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-earth-100 rounded-xl">
          <BookOpen className="w-6 h-6 text-earth-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-forest-900">科普展示</h1>
          <p className="text-sm text-gray-600">讲解员排班、互动活动与动物科普</p>
        </div>
      </div>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-forest-600" />
            <h2 className="text-lg font-semibold text-forest-800">讲解员排班</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg border border-cream-300 p-0.5">
              <button onClick={() => setScheduleView('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${scheduleView === 'list' ? 'bg-forest-600 text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
                <List size={16} /> 列表
              </button>
              <button onClick={() => setScheduleView('week')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors ${scheduleView === 'week' ? 'bg-forest-600 text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
                <LayoutGrid size={16} /> 周视图
              </button>
            </div>
            <button onClick={() => openScheduleModal()} className="btn-primary flex items-center gap-1">
              <Plus size={16} /> 新增讲解排班
            </button>
          </div>
        </div>

        {scheduleView === 'list' ? (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date} className="card overflow-hidden">
                <div className="px-5 py-3 bg-forest-50 border-b border-cream-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest-600" />
                    <span className="font-semibold text-forest-800">{date}</span>
                  </div>
                  <span className="badge badge-green">{groupedSchedules[date].length}场讲解</span>
                </div>
                <div className="divide-y divide-cream-200">
                  {groupedSchedules[date].map((schedule) => (
                    <div key={schedule.id} className="p-5 hover:bg-cream-50 transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`badge border ${categoryColors[schedule.category] || ''}`}>{schedule.category}</span>
                            <h3 className="font-semibold text-forest-900">{schedule.topic}</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-forest-500" />{schedule.guideName}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-forest-500" />{schedule.animalExhibit}</div>
                            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-forest-500" />{schedule.startTime} - {schedule.endTime}</div>
                            <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-forest-500" />
                              {schedule.actualVisitors ? (
                                <span><strong className="text-forest-700">{schedule.actualVisitors}</strong><span className="text-gray-400">/{schedule.expectedVisitors}人</span></span>
                              ) : <span>预计{schedule.expectedVisitors}人</span>}
                            </div>
                          </div>
                          {schedule.feedback && (
                            <div className="mt-3 flex items-start gap-1.5 p-3 bg-warm-50 rounded-lg">
                              <MessageSquare className="w-4 h-4 text-warm-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-600">{schedule.feedback}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openScheduleModal(schedule)} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1">
                            <Edit2 size={14} /> 编辑
                          </button>
                          <button onClick={() => setConfirmDelete({ open: true, type: 'schedule', id: schedule.id })} className="btn-warm px-3 py-1.5 text-sm flex items-center gap-1">
                            <Trash2 size={14} /> 删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-4 overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 min-w-[700px]">
              {weekDates.map((date, idx) => (
                <div key={date} className="flex flex-col">
                  <div className="text-center py-2 bg-forest-50 rounded-t-lg border-b border-cream-200">
                    <p className="text-xs text-gray-500">{weekDays[idx]}</p>
                    <p className="font-semibold text-forest-800 text-sm">{date.slice(5)}</p>
                  </div>
                  <div className="flex-1 bg-cream-50 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                    {(groupedSchedules[date] || []).map((s) => (
                      <ScheduleCard key={s.id} schedule={s} onEdit={() => openScheduleModal(s)} onDelete={() => setConfirmDelete({ open: true, type: 'schedule', id: s.id })} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-warm-600" />
            <h2 className="text-lg font-semibold text-forest-800">参观互动活动</h2>
          </div>
          <button onClick={() => openInteractionModal()} className="btn-primary flex items-center gap-1">
            <Plus size={16} /> 新增互动活动
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {visitorInteractions.map((interaction) => (
            <div key={interaction.id} className="card p-5 card-hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-warm-50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-warm-600" />
                </div>
                <span className="badge badge-green">{interaction.date}</span>
              </div>
              <h3 className="font-semibold text-forest-900 mb-2">{interaction.activityName}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-forest-500" />{interaction.animalExhibit}</div>
                <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-forest-500" />{interaction.participantCount}人参与</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-forest-500" />{interaction.duration}分钟</div>
              </div>
              <div className="pt-3 border-t border-cream-200 space-y-2">
                <RatingStars score={interaction.feedbackScore} />
                {interaction.notes && <p className="text-xs text-gray-500 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5 flex-shrink-0" />{interaction.notes}</p>}
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-cream-200">
                <button onClick={() => openInteractionModal(interaction)} className="btn-secondary flex-1 py-1.5 text-sm flex items-center justify-center gap-1">
                  <Edit2 size={14} /> 编辑
                </button>
                <button onClick={() => setConfirmDelete({ open: true, type: 'interaction', id: interaction.id })} className="btn-warm flex-1 py-1.5 text-sm flex items-center justify-center gap-1">
                  <Trash2 size={14} /> 删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-forest-800">动物科普信息</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {speciesList.map((species) => (
            <div key={species.id} className="card p-5 card-hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-forest-900 text-lg">{species.commonName}</h3>
                  <p className="text-xs text-gray-500 italic">{species.scientificName}</p>
                </div>
                <span className={`badge ${conservationColors[species.conservationStatus] || 'badge-gray'}`}>
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  {species.conservationStatus}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm"><Globe className="w-4 h-4 text-earth-600" /><span className="text-gray-600">栖息地:</span><span className="font-medium text-forest-800">{species.habitat}</span></div>
                <div className="flex items-center gap-2 text-sm"><UtensilsCrossed className="w-4 h-4 text-warm-600" /><span className="text-gray-600">食性:</span><span className="font-medium text-forest-800">{species.dietType}</span></div>
              </div>
              <div className="p-3 bg-cream-50 rounded-lg">
                <div className="flex items-start gap-1.5">
                  <Leaf className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{species.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal isOpen={scheduleModal.open} onClose={() => setScheduleModal({ open: false, editing: null })} title={scheduleModal.editing ? '编辑讲解排班' : '新增讲解排班'} size="lg"
        footer={
          <>
            <button onClick={() => setScheduleModal({ open: false, editing: null })} className="btn-secondary">取消</button>
            <button onClick={saveSchedule} className="btn-primary">保存</button>
          </>
        }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">日期</label><input type="date" value={scheduleForm.date || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">讲解员</label><input type="text" value={scheduleForm.guideName || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, guideName: e.target.value })} className="input-field" placeholder="请输入讲解员姓名" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">主题</label><input type="text" value={scheduleForm.topic || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, topic: e.target.value })} className="input-field" placeholder="请输入讲解主题" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">展区</label><input type="text" value={scheduleForm.animalExhibit || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, animalExhibit: e.target.value })} className="input-field" placeholder="请输入展区" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">类别</label><select value={scheduleForm.category || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, category: e.target.value })} className="input-field">{scheduleCategories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label><input type="time" value={scheduleForm.startTime || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label><input type="time" value={scheduleForm.endTime || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">预计参观人数</label><input type="number" value={scheduleForm.expectedVisitors || 0} onChange={(e) => setScheduleForm({ ...scheduleForm, expectedVisitors: Number(e.target.value) })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">实际参观人数（可选）</label><input type="number" value={scheduleForm.actualVisitors || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, actualVisitors: e.target.value ? Number(e.target.value) : undefined })} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">反馈（可选）</label><textarea value={scheduleForm.feedback || ''} onChange={(e) => setScheduleForm({ ...scheduleForm, feedback: e.target.value })} className="input-field" rows={2} placeholder="请输入反馈信息" /></div>
        </div>
      </Modal>

      <Modal isOpen={interactionModal.open} onClose={() => setInteractionModal({ open: false, editing: null })} title={interactionModal.editing ? '编辑互动活动' : '新增互动活动'}
        footer={
          <>
            <button onClick={() => setInteractionModal({ open: false, editing: null })} className="btn-secondary">取消</button>
            <button onClick={saveInteraction} className="btn-primary">保存</button>
          </>
        }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">日期</label><input type="date" value={interactionForm.date || ''} onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label><input type="text" value={interactionForm.activityName || ''} onChange={(e) => setInteractionForm({ ...interactionForm, activityName: e.target.value })} className="input-field" placeholder="请输入活动名称" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">展区</label><input type="text" value={interactionForm.animalExhibit || ''} onChange={(e) => setInteractionForm({ ...interactionForm, animalExhibit: e.target.value })} className="input-field" placeholder="请输入展区" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">参与人数</label><input type="number" value={interactionForm.participantCount || 0} onChange={(e) => setInteractionForm({ ...interactionForm, participantCount: Number(e.target.value) })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">时长（分钟）</label><input type="number" value={interactionForm.duration || 0} onChange={(e) => setInteractionForm({ ...interactionForm, duration: Number(e.target.value) })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">反馈评分（1-5）</label><input type="number" min={1} max={5} step={0.1} value={interactionForm.feedbackScore || 4} onChange={(e) => setInteractionForm({ ...interactionForm, feedbackScore: Number(e.target.value) })} className="input-field" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">备注</label><textarea value={interactionForm.notes || ''} onChange={(e) => setInteractionForm({ ...interactionForm, notes: e.target.value })} className="input-field" rows={2} placeholder="请输入备注信息" /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, type: 'schedule', id: '' })} onConfirm={handleDeleteConfirm} title="确认删除" message={`确定要删除这条${confirmDelete.type === 'schedule' ? '讲解排班' : '互动活动'}记录吗？此操作不可撤销。`} />
    </div>
  );
}
