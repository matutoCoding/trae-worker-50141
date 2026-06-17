import { useNavigate } from 'react-router-dom';
import { useAppStore, Warning } from '@/store';
import StatCard from '@/components/UI/StatCard';
import {
  PawPrint, Leaf, AlertTriangle, UtensilsCrossed, Baby, Home, GraduationCap, Users,
  Heart, Thermometer, Clock, User, MapPin, Bell, Eye, Stethoscope,
  PlusCircle, ChevronRight, AlertCircle, Activity, TrendingUp
} from 'lucide-react';

const todayStr = '2026-06-18';

function HealthBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sick: 'badge-red', quarantine: 'badge-yellow', recovering: 'badge-warm', healthy: 'badge-green',
  };
  const labels: Record<string, string> = {
    sick: '生病', quarantine: '隔离中', recovering: '恢复中', healthy: '健康',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

function FeedingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'badge-green', partial: 'badge-warm', missed: 'badge-red',
  };
  const labels: Record<string, string> = {
    completed: '已完成', partial: '部分完成', missed: '未完成',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

function EnclosureStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    normal: 'badge-green', warning: 'badge-yellow', alert: 'badge-red',
  };
  const labels: Record<string, string> = {
    normal: '正常', warning: '警告', alert: '异常',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

function ProgressRing({ percent, size = 120 }: { percent: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8D6AF" strokeWidth="10" />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#3d8a33" strokeWidth="10"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  );
}

function WarningCard({ warning, onClick, onViewFeeding, onViewHealth }: {
  warning: Warning;
  onClick: () => void;
  onViewFeeding?: () => void;
  onViewHealth?: () => void;
}) {
  const isEnv = warning.type === 'temperature' || warning.type === 'humidity' || warning.type === 'cleaning_overdue';
  const isAnimal = warning.type === 'animal_abnormal';
  const bgColor = warning.severity === 'alert' ? 'bg-red-50 border-red-200' : 'bg-warm-50 border-warm-200';
  const iconColor = warning.severity === 'alert' ? 'text-red-600' : 'text-warm-600';

  return (
    <div onClick={onClick} className={`p-3 rounded-lg border ${bgColor} cursor-pointer hover:shadow-md transition-all`}>
      <div className="flex items-start gap-2">
        <AlertCircle className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-800">{warning.title}</p>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{warning.message}</p>
          {isAnimal && warning.relatedId && (
            <div className="flex gap-1.5 mt-2">
              <button onClick={(e) => { e.stopPropagation(); onViewFeeding?.(); }} className="text-xs px-2 py-1 bg-forest-600 text-white rounded hover:bg-forest-700 transition-colors">
                <UtensilsCrossed className="w-3 h-3 inline mr-1" />查看饲喂
              </button>
              <button onClick={(e) => { e.stopPropagation(); onViewHealth?.(); }} className="text-xs px-2 py-1 bg-warm-500 text-white rounded hover:bg-warm-600 transition-colors">
                <Stethoscope className="w-3 h-3 inline mr-1" />查看诊疗
              </button>
            </div>
          )}
          {isEnv && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />点击前往笼舍环境
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    dashboardStats, animals, feedingRecords, educationSchedules, enclosures, healthRecords,
    breedingRecords, behaviorRecords, feedingPlans, getWarnings,
  } = useAppStore();

  const warnings = getWarnings();
  const healthWarnings = animals.filter((a) => a.healthStatus === 'sick' || a.healthStatus === 'quarantine');
  const recoveringAnimals = animals.filter((a) => a.healthStatus === 'recovering');
  const todayEducation = educationSchedules.filter((e) => e.date === todayStr);

  const envWarnings = warnings.filter((w) => ['temperature', 'humidity', 'cleaning_overdue'].includes(w.type));
  const animalWarnings = warnings.filter((w) => w.type === 'animal_abnormal');
  const behaviorWarnings = warnings.filter((w) => w.type === 'stereotypic_high');
  const breedingReminders = breedingRecords.filter((b) =>
    ['estrus', 'mating'].includes(b.breedingType) && b.status.includes('观察') || b.status.includes('活跃') || b.status.includes('准备')
  );

  const feedingCompletion = dashboardStats.todayFeedings > 0
    ? Math.round((dashboardStats.todayFeedingsCompleted / dashboardStats.todayFeedings) * 100)
    : 0;

  const completedFeedingIds = new Set(feedingRecords.map((r) => r.planId));
  const pendingFeedings = feedingPlans.filter((p) => !completedFeedingIds.has(p.id));

  const weekStart = new Date(todayStr);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  const weekBreedingEvents = breedingRecords.filter((b) => new Date(b.eventDate) >= weekStart).length;
  const weekEducationSessions = educationSchedules.filter((e) => new Date(e.date) >= weekStart).length;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<PawPrint className="w-6 h-6" />} title="动物总数" value={dashboardStats.totalAnimals} subText={`${dashboardStats.healthyCount} 健康`} colorVariant="green" />
        <StatCard icon={<Leaf className="w-6 h-6" />} title="物种数量" value={dashboardStats.speciesCount} subText={`${dashboardStats.endangeredCount} 濒危物种`} colorVariant="earth" />
        <StatCard icon={<AlertTriangle className="w-6 h-6" />} title="濒危物种" value={dashboardStats.endangeredCount} subText="重点保护" colorVariant="warm" />
        <StatCard icon={<Bell className="w-6 h-6" />} title="活跃预警" value={warnings.length} subText={`${warnings.filter((w) => w.severity === 'alert').length} 项紧急`} colorVariant="warm" />
        <StatCard icon={<Baby className="w-6 h-6" />} title="活跃繁育项目" value={dashboardStats.activeBreedingPrograms} subText={`本周${weekBreedingEvents}起事件`} colorVariant="warm" />
        <StatCard icon={<Home className="w-6 h-6" />} title="笼舍状态" value={`${dashboardStats.enclosuresNormal}/${dashboardStats.enclosuresTotal}`} subText={`${dashboardStats.enclosuresWarning}警告·${dashboardStats.enclosuresAlert}异常`} colorVariant="earth" />
        <StatCard icon={<GraduationCap className="w-6 h-6" />} title="今日科普讲解" value={dashboardStats.todayEducationalPrograms} subText={`本周${weekEducationSessions}场`} colorVariant="green" />
        <StatCard icon={<Users className="w-6 h-6" />} title="今日游客数" value={dashboardStats.todayVisitors.toLocaleString()} subText="人次" colorVariant="warm" />
        <StatCard icon={<Activity className="w-6 h-6" />} title="今日饲喂完成率" value={`${feedingCompletion}%`} subText={`${dashboardStats.todayFeedingsCompleted}/${dashboardStats.todayFeedings} 已完成`} colorVariant="green" />
        <StatCard icon={<TrendingUp className="w-6 h-6" />} title="本周繁育事件" value={weekBreedingEvents} subText="发情/配种/分娩" colorVariant="earth" />
        <StatCard icon={<GraduationCap className="w-6 h-6" />} title="本周科普场次" value={weekEducationSessions} subText="含今日讲解" colorVariant="green" />
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-forest-800 font-serif">今日预警中心</h3>
          </div>
          <span className={`badge ${warnings.length > 0 ? 'badge-red' : 'badge-green'}`}>共 {warnings.length} 项预警</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => navigate('/enclosure')} className="p-4 bg-cream-50 rounded-xl cursor-pointer hover:bg-cream-100 transition-colors border border-cream-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-warm-100 rounded-lg"><Thermometer className="w-5 h-5 text-warm-600" /></div>
              <div>
                <p className="text-sm text-gray-500">环境预警</p>
                <p className="text-2xl font-bold text-forest-800 font-serif">{envWarnings.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">温湿度异常 {warnings.filter((w) => w.type === 'temperature' || w.type === 'humidity').length} · 清洁超时 {warnings.filter((w) => w.type === 'cleaning_overdue').length}</p>
          </div>

          <div onClick={() => navigate('/health')} className="p-4 bg-cream-50 rounded-xl cursor-pointer hover:bg-cream-100 transition-colors border border-cream-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-red-100 rounded-lg"><Heart className="w-5 h-5 text-red-500" /></div>
              <div>
                <p className="text-sm text-gray-500">动物预警</p>
                <p className="text-2xl font-bold text-forest-800 font-serif">{animalWarnings.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">生病 {healthWarnings.filter((a) => a.healthStatus === 'sick').length} · 隔离 {healthWarnings.filter((a) => a.healthStatus === 'quarantine').length} · 恢复中 {recoveringAnimals.length}</p>
          </div>

          <div onClick={() => navigate('/behavior')} className="p-4 bg-cream-50 rounded-xl cursor-pointer hover:bg-cream-100 transition-colors border border-cream-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-earth-100 rounded-lg"><Eye className="w-5 h-5 text-earth-600" /></div>
              <div>
                <p className="text-sm text-gray-500">行为预警</p>
                <p className="text-2xl font-bold text-forest-800 font-serif">{behaviorWarnings.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">刻板行为高风险动物，建议增加丰容</p>
          </div>

          <div onClick={() => navigate('/breeding')} className="p-4 bg-cream-50 rounded-xl cursor-pointer hover:bg-cream-100 transition-colors border border-cream-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-warm-100 rounded-lg"><Baby className="w-5 h-5 text-warm-600" /></div>
              <div>
                <p className="text-sm text-gray-500">繁育提醒</p>
                <p className="text-2xl font-bold text-forest-800 font-serif">{breedingReminders.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">待监测发情 · 待确认配种</p>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {warnings.slice(0, 9).map((w) => (
              <WarningCard key={w.id} warning={w}
                onClick={() => {
                  if (['temperature', 'humidity', 'cleaning_overdue'].includes(w.type)) navigate('/enclosure');
                  else if (w.type === 'animal_abnormal') navigate('/health');
                  else if (w.type === 'stereotypic_high') navigate('/behavior');
                }}
                onViewFeeding={() => navigate('/feeding')}
                onViewHealth={() => navigate('/health')}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-forest-600" />
              <h3 className="text-lg font-bold text-forest-800 font-serif">今日饲喂进度</h3>
            </div>
            <button onClick={() => navigate('/feeding')} className="text-xs text-forest-600 hover:text-forest-800 flex items-center gap-1">
              详情 <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center justify-center mb-4 relative">
            <ProgressRing percent={feedingCompletion} />
            <div className="absolute text-center">
              <p className="text-3xl font-bold text-forest-800 font-serif">{feedingCompletion}%</p>
              <p className="text-xs text-gray-500">完成率</p>
            </div>
          </div>
          <div className="w-full bg-cream-200 rounded-full h-3 mb-3">
            <div className="bg-forest-500 h-3 rounded-full transition-all duration-500" style={{ width: `${feedingCompletion}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>已完成 {dashboardStats.todayFeedingsCompleted}</span>
            <span>总计 {dashboardStats.todayFeedings}</span>
          </div>
          {pendingFeedings.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">未完成饲喂计划：</p>
              {pendingFeedings.slice(0, 5).map((plan) => {
                const animal = animals.find((a) => a.id === plan.animalId);
                const isAbnormal = animal && ['sick', 'quarantine', 'recovering'].includes(animal.healthStatus);
                return (
                  <div key={plan.id} className={`flex items-center justify-between p-2 rounded-lg text-sm ${isAbnormal ? 'bg-warm-50 border border-warm-200' : 'bg-cream-50'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {isAbnormal && <AlertTriangle className="w-4 h-4 text-warm-600 flex-shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{plan.animalName}</p>
                        <p className="text-xs text-gray-500">{plan.formulaName}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-forest-700">{plan.feedingTime}</p>
                      <p className="text-xs text-gray-500">{plan.quantity}{plan.unit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-bold text-forest-800 font-serif">最近健康预警</h3>
            </div>
            <span className="badge-red">{healthWarnings.length} 项</span>
          </div>
          <div className="space-y-3">
            {healthWarnings.map((animal) => {
              const healthRecord = healthRecords.find((h) => h.animalId === animal.id);
              return (
                <div key={animal.id} onClick={() => navigate('/health')} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors cursor-pointer">
                  <img src={animal.imageUrl} alt={animal.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">{animal.name}</p>
                      <HealthBadge status={animal.healthStatus} />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{animal.speciesName} · {animal.enclosureName}</p>
                    {healthRecord && healthRecord.diagnoses.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{healthRecord.diagnoses[0].condition}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); navigate('/feeding'); }} className="text-xs px-2 py-1 bg-forest-600 text-white rounded hover:bg-forest-700 transition-colors">
                      <UtensilsCrossed className="w-3 h-3 inline mr-1" />饲喂
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); navigate('/health'); }} className="text-xs px-2 py-1 bg-warm-500 text-white rounded hover:bg-warm-600 transition-colors">
                      <Stethoscope className="w-3 h-3 inline mr-1" />诊疗
                    </button>
                  </div>
                </div>
              );
            })}
            {healthWarnings.length === 0 && <div className="text-center py-8 text-gray-400">暂无健康预警</div>}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-forest-600" />
              <h3 className="text-lg font-bold text-forest-800 font-serif">快捷录入</h3>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={() => navigate('/feeding')} className="w-full flex items-center gap-3 p-4 bg-forest-50 rounded-xl hover:bg-forest-100 transition-colors text-left border border-forest-200">
              <div className="p-2 bg-forest-600 rounded-lg"><UtensilsCrossed className="w-5 h-5 text-white" /></div>
              <div className="flex-1">
                <p className="font-semibold text-forest-800">快速录入投喂</p>
                <p className="text-xs text-gray-500">记录今日饲喂情况</p>
              </div>
              <ChevronRight className="w-5 h-5 text-forest-600" />
            </button>
            <button onClick={() => navigate('/behavior')} className="w-full flex items-center gap-3 p-4 bg-earth-50 rounded-xl hover:bg-earth-100 transition-colors text-left border border-earth-200">
              <div className="p-2 bg-earth-600 rounded-lg"><Eye className="w-5 h-5 text-white" /></div>
              <div className="flex-1">
                <p className="font-semibold text-earth-800">快速记录观察</p>
                <p className="text-xs text-gray-500">记录动物行为观察</p>
              </div>
              <ChevronRight className="w-5 h-5 text-earth-600" />
            </button>
            <button onClick={() => navigate('/education')} className="w-full flex items-center gap-3 p-4 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors text-left border border-warm-200">
              <div className="p-2 bg-warm-500 rounded-lg"><GraduationCap className="w-5 h-5 text-white" /></div>
              <div className="flex-1">
                <p className="font-semibold text-warm-800">快速登记讲解</p>
                <p className="text-xs text-gray-500">登记科普讲解排班</p>
              </div>
              <ChevronRight className="w-5 h-5 text-warm-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-forest-600" />
            <h3 className="text-lg font-bold text-forest-800 font-serif">今日科普讲解排班</h3>
          </div>
          <div className="space-y-3">
            {todayEducation.map((schedule) => (
              <div key={schedule.id} className="flex items-start gap-3 p-3 bg-cream-50 rounded-lg">
                <div className="flex-shrink-0 w-16 text-center">
                  <p className="text-sm font-bold text-forest-700">{schedule.startTime}</p>
                  <p className="text-xs text-gray-400">{schedule.endTime}</p>
                </div>
                <div className="w-px bg-cream-300 self-stretch" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800">{schedule.topic}</p>
                    <span className="badge-green">{schedule.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{schedule.guideName}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{schedule.animalExhibit}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{schedule.expectedVisitors}人</span>
                  </div>
                </div>
              </div>
            ))}
            {todayEducation.length === 0 && <div className="text-center py-8 text-gray-400">今日暂无讲解排班</div>}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="w-5 h-5 text-warm-600" />
            <h3 className="text-lg font-bold text-forest-800 font-serif">笼舍环境状态</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {enclosures.map((enc) => (
              <div key={enc.id} className="p-3 bg-cream-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-800 text-sm truncate">{enc.name}</p>
                  <EnclosureStatusBadge status={enc.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{enc.temperature}°C</span>
                  <span>湿度 {enc.humidity}%</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{enc.currentOccupancy}/{enc.capacity} 只</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
