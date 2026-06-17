import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ColorVariant = 'green' | 'warm' | 'blue' | 'earth';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subText?: string;
  colorVariant?: ColorVariant;
}

const colorVariants: Record<ColorVariant, { bg: string; icon: string; accent: string }> = {
  green: {
    bg: 'bg-forest-50',
    icon: 'bg-forest-100 text-forest-600',
    accent: 'text-forest-700',
  },
  warm: {
    bg: 'bg-warm-50',
    icon: 'bg-warm-100 text-warm-600',
    accent: 'text-warm-700',
  },
  blue: {
    bg: 'bg-sky-50',
    icon: 'bg-sky-100 text-sky-600',
    accent: 'text-sky-700',
  },
  earth: {
    bg: 'bg-earth-50',
    icon: 'bg-earth-100 text-earth-600',
    accent: 'text-earth-700',
  },
};

export default function StatCard({
  icon,
  title,
  value,
  subText,
  colorVariant = 'green',
}: StatCardProps) {
  const colors = colorVariants[colorVariant];
  return (
    <div className={cn('rounded-xl p-5 shadow-card border border-cream-200', colors.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className={cn('text-3xl font-bold mt-2 font-serif', colors.accent)}>{value}</p>
          {subText && <p className="text-xs text-gray-500 mt-1">{subText}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colors.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
