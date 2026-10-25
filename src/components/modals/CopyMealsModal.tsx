import React, { useState } from 'react';
import { X, Copy, Calendar, CheckCircle2 } from 'lucide-react';
import { copyMealsToDate } from '../../utils/storage';

interface CopyMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  sourceDate: string;
  onCopied: (count: number) => void;
}

export const CopyMealsModal: React.FC<CopyMealsModalProps> = ({
  isOpen,
  onClose,
  userId,
  sourceDate,
  onCopied,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [targetDate, setTargetDate] = useState(tomorrowStr);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    const count = copyMealsToDate(sourceDate, targetDate, userId);
    setSuccessCount(count);
    setTimeout(() => {
      onCopied(count);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Copy className="w-5 h-5" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Sao chép thực đơn
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 my-3">
          Sao chép toàn bộ các bữa ăn từ ngày <strong>{sourceDate}</strong> sang một ngày khác tiện lợi cho việc lên kế hoạch trước.
        </p>

        {successCount !== null ? (
          <div className="py-6 text-center text-emerald-600 dark:text-emerald-400 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
            <p className="font-bold text-sm">Đã sao chép thành công {successCount} món ăn!</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Chọn ngày đích đến
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Tiến hành sao chép sang ngày đã chọn</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
