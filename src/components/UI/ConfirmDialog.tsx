import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认删除',
  cancelText = '取消',
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-secondary">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn-warm"
          >
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-warm-100 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-warm-600" />
        </div>
        <div>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
