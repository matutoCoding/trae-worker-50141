import { useAppStore } from '@/store';
import {
  BookOpen,
  Calendar,
  User,
  Clock,
  MapPin,
  Users,
  Star,
  MessageSquare,
  Sparkles,
  Globe,
  Leaf,
  UtensilsCrossed,
  ShieldAlert,
  Info,
} from 'lucide-react';

function RatingStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.floor(score) ? 'text-warm-500 fill-warm-500' : 'text-cream-300'}
        />
      ))}
      <span className="text-sm font-medium text-forest-700 ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

const conservationColors: Record<string, string> = {
  '濒危': 'bg-red-100 text-red-700',
  '易危': 'bg-warm-100 text-warm-700',
  '近危': 'bg-yellow-100 text-yellow-700',
  '无危': 'bg-forest-100 text-forest-700',
};

export default function EducationPage() {
  const { educationSchedules, visitorInteractions, speciesList } = useAppStore();

  const groupedSchedules = educationSchedules.reduce<Record<string, typeof educationSchedules>>(
    (acc, schedule) => {
      if (!acc[schedule.date]) acc[schedule.date] = [];
      acc[schedule.date].push(schedule);
      return acc;
    },
    {}
  );

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
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-forest-800">讲解员排班</h2>
        </div>
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
                          <span className="badge bg-earth-100 text-earth-700">{schedule.category}</span>
                          <h3 className="font-semibold text-forest-900">{schedule.topic}</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-forest-500" />
                            {schedule.guideName}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-forest-500" />
                            {schedule.animalExhibit}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-forest-500" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-forest-500" />
                            {schedule.actualVisitors ? (
                              <span>
                                <strong className="text-forest-700">{schedule.actualVisitors}</strong>
                                <span className="text-gray-400">/{schedule.expectedVisitors}人</span>
                              </span>
                            ) : (
                              <span>预计{schedule.expectedVisitors}人</span>
                            )}
                          </div>
                        </div>
                        {schedule.feedback && (
                          <div className="mt-3 flex items-start gap-1.5 p-3 bg-warm-50 rounded-lg">
                            <MessageSquare className="w-4 h-4 text-warm-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{schedule.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-warm-600" />
          <h2 className="text-lg font-semibold text-forest-800">参观互动活动</h2>
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
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest-500" />
                  {interaction.animalExhibit}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-forest-500" />
                  {interaction.participantCount}人参与
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-forest-500" />
                  {interaction.duration}分钟
                </div>
              </div>
              <div className="pt-3 border-t border-cream-200 space-y-2">
                <RatingStars score={interaction.feedbackScore} />
                {interaction.notes && (
                  <p className="text-xs text-gray-500 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {interaction.notes}
                  </p>
                )}
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
                <span
                  className={`badge ${conservationColors[species.conservationStatus] || 'badge-gray'}`}
                >
                  <ShieldAlert className="w-3 h-3 mr-1" />
                  {species.conservationStatus}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-earth-600" />
                  <span className="text-gray-600">栖息地:</span>
                  <span className="font-medium text-forest-800">{species.habitat}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UtensilsCrossed className="w-4 h-4 text-warm-600" />
                  <span className="text-gray-600">食性:</span>
                  <span className="font-medium text-forest-800">{species.dietType}</span>
                </div>
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
    </div>
  );
}
