import React from 'react';
import { Home, UtensilsCrossed, CalendarDays, LineChart, User } from 'lucide-react';

export type TabKey = 'home' | 'journal' | 'plan' | 'progress' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  isFramed?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  setActiveTab,
  isFramed,
}) => {
  const tabs = [
    { key: 'home' as TabKey, label: 'Trang chủ', icon: Home },
    { key: 'journal' as TabKey, label: 'Nhật ký', icon: UtensilsCrossed },
    { key: 'plan' as TabKey, label: 'Kế hoạch', icon: CalendarDays },
    { key: 'progress' as TabKey, label: 'Tiến trình', icon: LineChart },
    { key: 'profile' as TabKey, label: 'Cá nhân', icon: User },
  ];

  return (
    <nav
      className={`${
        isFramed ? 'absolute bottom-0 left-0 right-0' : 'fixed bottom-0 left-0 right-0'
      } z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-rose-100 dark:border-stone-800 transition-colors shadow-lg shadow-stone-200/50 dark:shadow-none`}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center py-1 transition-all group min-h-[44px] ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
              aria-label={tab.label}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-rose-50 dark:bg-rose-950/60 scale-105' : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
