import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
};

interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | string;
}

export default function Modal({
  isOpen,
  open,
  title,
  onClose,
  children,
  footer,
  className,
  size = 'md',
}: ModalProps) {
  const visible = isOpen ?? open ?? false;

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-forest-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-h-[90vh] bg-cream-50 rounded-2xl shadow-card-hover border border-cream-300 flex flex-col overflow-hidden animate-fade-in-up',
          sizeClasses[size] || 'max-w-2xl',
          className
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300 bg-white/60">
          <h3 className="text-xl font-serif font-bold text-forest-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-forest-700 hover:bg-forest-50 transition-all duration-200"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-cream-300 bg-white/60 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
