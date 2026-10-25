import React, { useState } from 'react';
import { X, Droplets, Plus, Check } from 'lucide-react';
import { addWaterLog } from '../../utils/storage';
import { WaterLog } from '../../types';

interface AddWaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  selectedDate: string;
  onWaterAdded: (log: WaterLog) => void;
}

export const AddWaterModal: React.FC<AddWaterModalProps> = ({
  isOpen,
  onClose,
  userId,
  selectedDate,
  onWaterAdded,
}) => {
  const [amountMl, setAmountMl] = useState(250);

  if (!isOpen) return null;

  const presets = [
    { label: 'Tách trà / cà phê', amount: 150 },
    { label: 'Ly nước lọc tiêu chuẩn', amount: 250 },
    { label: 'Cốc lớn', amount: 350 },
    { label: 'Bình nước 500ml', amount: 500 },
  ];

  const handleAdd = () => {
    if (amountMl <= 0) return;
    const item = addWaterLog(userId, selectedDate, amountMl);
    onWaterAdded(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Droplets className="w-5 h-5" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Ghi nhận nước uống
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
          Uống nước từng ngụm nhỏ và rải đều trong ngày giúp cơ thể hấp thu nước tốt nhất.
        </p>

        {/* Amount presets */}
        <div className="grid grid-cols-2 gap-2 my-4">
          {presets.map((p) => (
            <button
              key={p.amount}
              type="button"
              onClick={() => setAmountMl(p.amount)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                amountMl === p.amount
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                  : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 text-stone-700 dark:text-stone-300'
              }`}
            >
              <span className="font-bold text-sm block">+{p.amount} ml</span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                {p.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Hoặc nhập dung tích tùy chỉnh (ml)
          </label>
          <div className="relative">
            <input
              type="number"
              step="50"
              value={amountMl}
              onChange={(e) => setAmountMl(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
            />
            <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-medium">ml</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs shadow-md shadow-sky-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Lưu {amountMl} ml vào nhật ký hôm nay</span>
        </button>
      </div>
    </div>
  );
};
