import { useAppStore } from '@/store';
import {
  PawPrint, Leaf, AlertTriangle, UtensilsCrossed, Baby, Home, GraduationCap, Users,
  Heart, Thermometer, Clock, User, MapPin
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, subValue, color }: { icon: any; label: string; value: string | number; subValue?: string; color: string }) {
  return (
    <div className="card card-hover-lift p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-forest-800 font-serif">{value}</p>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function HealthBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sick: 'badge-red',
    quarantine: 'badge-yellow',
    recovering: 'badge-warm',
    healthy: 'badge-green',
  };
  const labels: Record<string, string> = {
    sick: '生病',
    quarantine: '隔离中',
    recovering: '恢复中',
    healthy: '健康',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

function FeedingStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'badge-green',
    partial: 'badge-warm',
    missed: 'badge-red',
  };
  const labels: Record<string, string> = {
    completed: '已完成',
    partial: '部分完成',
    missed: '未完成',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

function EnclosureStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    normal: 'badge-green',
    warning: 'badge-yellow',
    alert: 'badge-red',
  };
  const labels: Record<string, string> = {
    normal: '正常',
    warning: '警告',
    alert: '异常',
  };
  return <span className={styles[status] || 'badge-gray'}>{labels[status] || status}</span>;
}

export default function Dashboard() {
  const {
    dashboardStats, animals, feedingRecords, educationSchedules, enclosures, healthRecords,
  } = useAppStore();

  const healthWarnings = animals.filter(
    (a) => a.healthStatus === 'sick' || a.healthStatus === 'quarantine'
  );

  const todayEducation = educationSchedules.filter(
    (e) => e.date === '2026-06-18' || e.date.includes('2026-06-18')
  );

  const feedingCompletion = dashboardStats.todayFeedings > 0
    ? Math.round((dashboardStats.todayFeedingsCompleted / dashboardStats.todayFeedings) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={PawPrint} label="动物总数" value={dashboardStats.totalAnimals} subValue={`${dashboardStats.healthyCount} 健康`} color="bg-forest-100 text-forest-600" />
        <StatCard icon={Leaf} label="物种数量" value={dashboardStats.speciesCount} subValue={`${dashboardStats.endangeredCount} 濒危物种`} color="bg-earth-100 text-earth-600" />
        <StatCard icon={AlertTriangle} label="濒危物种" value={dashboardStats.endangeredCount} subValue="重点保护" color="bg-warm-100 text-warm-600" />
        <StatCard icon={UtensilsCrossed} label="今日饲喂完成率" value={`${feedingCompletion}%`} subValue={`${dashboardStats.todayFeedingsCompleted}/${dashboardStats.todayFeedings} 已完成`} color="bg-forest-100 text-forest-600" />
        <StatCard icon={Baby} label="活跃繁育项目" value={dashboardStats.activeBreedingPrograms} subValue="进行中" color="bg-warm-100 text-warm-600" />
        <StatCard icon={Home} label="笼舍状态" value={`${dashboardStats.enclosuresNormal}/${dashboardStats.enclosuresTotal}`} subValue={`${dashboardStats.enclosuresWarning} 警告 · ${dashboardStats.enclosuresAlert} 异常`} color="bg-earth-100 text-earth-600" />
        <StatCard icon={GraduationCap} label="今日科普讲解" value={dashboardStats.todayEducationalPrograms} subValue="场活动" color="bg-forest-100 text-forest-600" />
        <StatCard icon={Users} label="今日游客数" value={dashboardStats.todayVisitors.toLocaleString()} subValue="人次" color="bg-warm-100 text-warm-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div key={animal.id} className="flex items-center gap-3 p-3 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                  <img src={animal.imageUrl} alt={animal.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{animal.name}</p>
                      <HealthBadge status={animal.healthStatus} />
                    </div>
                    <p className="text-xs text-gray-500">{animal.speciesName} · {animal.enclosureName}</p>
                    {healthRecord && healthRecord.diagnoses.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{healthRecord.diagnoses[0].condition}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {healthWarnings.length === 0 && (
                <div className="text-center py-8 text-gray-400">暂无健康预警</div>
              )}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-earth-600" />
              <h3 className="text-lg font-bold text-forest-800 font-serif">最近饲喂记录</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>动物</th>
                  <th>饲料配方</th>
                  <th>时间</th>
                  <th>饲喂员</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {feedingRecords.slice(0, 5).map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.animalName}</td>
                    <td className="text-gray-600">{record.formulaName}</td>
                    <td className="text-gray-500 text-xs">{record.feedingDateTime.split(' ')[1]}</td>
                    <td className="text-gray-600">{record.feeder}</td>
                    <td><FeedingStatusBadge status={record.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <p className="font-semibold text-gray-800 text-sm">{enc.name}</p>
                  <EnclosureStatusBadge status={enc.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{enc.temperature}°C</span>
                  <span>湿度 {enc.humidity}%</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {enc.currentOccupancy}/{enc.capacity} 只</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
