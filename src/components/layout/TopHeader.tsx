import React from 'react';
import {
  Smartphone,
  Monitor,
  Moon,
  Sun,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface TopHeaderProps {
  user: UserProfile;
  isDesktopFramed: boolean;
  setIsDesktopFramed: (framed: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;
  onOpenAuthModal: () => void;
  onOpenAiAssistant: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  isDesktopFramed,
  setIsDesktopFramed,
  isDarkMode,
  setIsDarkMode,
  selectedDate,
  setSelectedDate,
  onOpenAuthModal,
  onOpenAiAssistant,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formattedDate = React.useMemo(() => {
    if (selectedDate === todayStr) {
      return 'Hôm nay';
    }
    const [y, m, d] = selectedDate.split('-');
    return `${d}/${m}/${y}`;
  }, [selectedDate, todayStr]);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-rose-100 dark:border-stone-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-rose-200 dark:shadow-none">
            🌱
          </div>
          <div>
            <span className="font-bold text-base md:text-lg text-stone-900 dark:text-stone-100 tracking-tight block leading-tight">
              Khỏe Mỗi Ngày
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 block -mt-0.5 font-medium">
              Sống khỏe & Thư thái
            </span>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5 text-xs text-stone-700 dark:text-stone-200">
          <button
            onClick={handlePrevDay}
            className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-md transition-colors text-stone-600 dark:text-stone-300"
            title="Ngày trước"
            aria-label="Ngày trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="px-2 py-1 font-medium flex items-center gap-1.5 select-none">
            <Calendar className="w-3 h-3 text-rose-500" />
            <span>{formattedDate}</span>
          </div>
          <button
            onClick={handleNextDay}
            className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-md transition-colors text-stone-600 dark:text-stone-300"
            title="Ngày sau"
            aria-label="Ngày sau"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Habit Assistant Trigger */}
          <button
            onClick={onOpenAiAssistant}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-medium flex items-center gap-1 transition-all border border-rose-200/50 dark:border-rose-900/40"
            title="Hỏi Trợ lý AI Khỏe Mỗi Ngày"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="hidden sm:inline">Trợ lý AI</span>
          </button>

          {/* Device Frame Viewport Switcher */}
          <button
            onClick={() => setIsDesktopFramed(!isDesktopFramed)}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors hidden md:flex items-center"
            title={isDesktopFramed ? 'Chuyển sang Toàn màn hình máy tính' : 'Chuyển sang Khung mô phỏng điện thoại'}
            aria-label="Chuyển chế độ xem thiết bị"
          >
            {isDesktopFramed ? (
              <Monitor className="w-4 h-4 text-stone-700 dark:text-stone-200" />
            ) : (
              <Smartphone className="w-4 h-4 text-rose-600" />
            )}
          </button>

          {/* Dark/Light mode */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDarkMode ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
            aria-label="Đổi giao diện sáng tối"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account Button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-medium text-stone-800 dark:text-stone-200 transition-colors"
            title="Quản lý tài khoản"
          >
            <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
            </div>
            <span className="max-w-[70px] sm:max-w-[110px] truncate">
              {user.isDemo ? 'Dùng thử' : user.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
