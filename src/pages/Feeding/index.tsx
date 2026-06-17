import { useAppStore } from '@/store';
import {
  Cookie,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Scale,
  Leaf,
  ChefHat,
  Calendar,
  Utensils,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FeedFormula } from '@/types';

const statusConfig = {
  completed: {
    label: '完成',
    icon: CheckCircle2,
    className: 'bg-forest-100 text-forest-700 border-forest-200',
  },
  partial: {
    label: '部分',
    icon: AlertCircle,
    className: 'bg-warm-100 text-warm-700 border-warm-200',
  },
  missed: {
    label: '错过',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

const nutritionColors = {
  protein: 'bg-forest-500',
  fat: 'bg-warm-500',
  carbohydrate: 'bg-earth-500',
  fiber: 'bg-forest-400',
};

const nutritionLabels: Record<string, string> = {
  protein: '蛋白质',
  fat: '脂肪',
  carbohydrate: '碳水',
  fiber: '纤维',
};

function NutritionBar({ value, colorKey }: { value: number; colorKey: keyof typeof nutritionColors }) {
  const percentage = Math.min((value / 60) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-earth-700">
        <span>{nutritionLabels[colorKey]}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', nutritionColors[colorKey])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function FormulaCard({ formula }: { formula: FeedFormula }) {
  return (
    <div className="bg-cream-50 rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all border border-cream-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h3 className="font-semibold text-earth-900">{formula.name}</h3>
            <p className="text-xs text-earth-500">ID: {formula.id}</p>
          </div>
        </div>
        {formula.isFavorite && (
          <Star className="w-5 h-5 text-warm-500 fill-warm-500" />
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-earth-600 mb-2">主要成分</p>
        <div className="flex flex-wrap gap-1.5">
          {formula.ingredients.slice(0, 4).map((ing) => (
            <span
              key={ing.name}
              className="px-2 py-0.5 text-xs rounded-full bg-earth-100 text-earth-700"
            >
              {ing.name} {ing.percentage}%
            </span>
          ))}
          {formula.ingredients.length > 4 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-cream-300 text-earth-600">
              +{formula.ingredients.length - 4}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <NutritionBar value={formula.nutritionInfo.protein} colorKey="protein" />
        <NutritionBar value={formula.nutritionInfo.fat} colorKey="fat" />
        <NutritionBar value={formula.nutritionInfo.carbohydrate} colorKey="carbohydrate" />
        <NutritionBar value={formula.nutritionInfo.fiber} colorKey="fiber" />
      </div>

      <div className="flex items-center gap-1.5 pt-3 border-t border-cream-300">
        <Leaf className="w-3.5 h-3.5 text-forest-500" />
        <span className="text-xs text-earth-600">适用：</span>
        <span className="text-xs text-earth-800 font-medium">
          {formula.applicableSpecies.join('、')}
        </span>
      </div>
    </div>
  );
}

export default function Feeding() {
  const { feedFormulas, feedingPlans, feedingRecords } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-earth-900 flex items-center gap-2">
            <Cookie className="w-7 h-7 text-forest-600" />
            饲喂管理
          </h1>
          <p className="text-sm text-earth-500 mt-1">管理饲料配方、饲喂计划和投喂记录</p>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">饲料配方库</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-forest-100 text-forest-700">
            {feedFormulas.length} 个配方
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {feedFormulas.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">饲喂计划列表</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-200/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">动物</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">时间</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">配方</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">数量</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-earth-700">频次</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-300">
                {feedingPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-cream-100/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-earth-800">{plan.animalName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-earth-700">
                        <Clock className="w-4 h-4 text-earth-500" />
                        <span>{plan.feedingTime}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-earth-700">{plan.formulaName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-earth-700">
                        <Scale className="w-4 h-4 text-earth-500" />
                        <span>{plan.quantity} {plan.unit}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-forest-100 text-forest-700">
                        {plan.frequency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-forest-600" />
          <h2 className="text-lg font-semibold text-earth-800">今日投喂记录</h2>
        </div>
        <div className="bg-cream-50 rounded-2xl shadow-card border border-cream-300 p-5">
          <div className="relative">
            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-cream-300" />
            <div className="space-y-4">
              {feedingRecords.map((record) => {
                const StatusIcon = statusConfig[record.status].icon;
                const time = record.feedingDateTime.split(' ')[1];
                return (
                  <div key={record.id} className="relative flex gap-4 pl-12">
                    <div className="absolute left-3 w-4 h-4 rounded-full bg-cream-50 border-2 border-forest-400 top-1.5" />
                    <div className="flex-1 bg-white rounded-xl p-4 border border-cream-300 hover:border-forest-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-earth-900">{record.animalName}</span>
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border',
                                statusConfig[record.status].className
                              )}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[record.status].label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-earth-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {time}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {record.feeder}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-earth-700">
                          <span className="text-earth-500">计划：</span>
                          {record.plannedQuantity}
                        </div>
                        <div className="text-forest-700">
                          <span className="text-earth-500">实际：</span>
                          {record.actualQuantity}
                        </div>
                        <div className="text-earth-500">
                          <span>剩余：</span>
                          {record.remainingAmount}
                        </div>
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-xs text-earth-500 bg-cream-100 rounded-lg px-3 py-2">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
