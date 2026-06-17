import { ReactNode } from 'react';

interface SectionTitleProps {
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}

export default function SectionTitle({ icon, title, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-forest-100 flex items-center justify-center text-forest-600">
          {icon}
        </div>
        <h3 className="text-lg font-serif font-bold text-forest-800">{title}</h3>
      </div>
      {action}
    </div>
  );
}
