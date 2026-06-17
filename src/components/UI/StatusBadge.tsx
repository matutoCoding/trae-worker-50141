import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type StatusType =
  | 'healthy'
  | 'sick'
  | 'quarantine'
  | 'recovering'
  | 'normal'
  | 'warning'
  | 'alert'
  | 'completed'
  | 'partial'
  | 'missed'
  | 'mild'
  | 'moderate'
  | 'severe';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  healthy: { label: '健康', className: 'bg-forest-100 text-forest-700 border-forest-200' },
  sick: { label: '患病', className: 'bg-red-50 text-red-700 border-red-200' },
  quarantine: { label: '隔离', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  recovering: { label: '康复中', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  normal: { label: '正常', className: 'bg-cream-100 text-earth-700 border-cream-300' },
  warning: { label: '注意', className: 'bg-warm-100 text-warm-700 border-warm-200' },
  alert: { label: '警告', className: 'bg-red-100 text-red-700 border-red-300' },
  completed: { label: '已完成', className: 'bg-forest-100 text-forest-700 border-forest-200' },
  partial: { label: '部分完成', className: 'bg-earth-100 text-earth-700 border-earth-200' },
  missed: { label: '未完成', className: 'bg-red-50 text-red-600 border-red-200' },
  mild: { label: '轻微', className: 'bg-cream-100 text-earth-600 border-cream-300' },
  moderate: { label: '中等', className: 'bg-warm-100 text-warm-700 border-warm-200' },
  severe: { label: '严重', className: 'bg-red-100 text-red-700 border-red-300' },
};

interface StatusBadgeProps {
  status: StatusType;
  children?: ReactNode;
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.normal;
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className
      )}
    >
      {children || config.label}
    </span>
  );
}
