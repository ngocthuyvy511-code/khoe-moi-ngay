import React, { useState, useEffect, useCallback } from 'react';
import { TopHeader } from './components/layout/TopHeader';
import { BottomTabBar, TabKey } from './components/layout/BottomTabBar';
import { HomeView } from './components/views/HomeView';
import { JournalView } from './components/views/JournalView';
import { PlanView } from './components/views/PlanView';
import { ProgressView } from './components/views/ProgressView';
import { ProfileView } from './components/views/ProfileView';
import { ExerciseView } from './components/views/ExerciseView';
import { AiCoachView } from './components/views/AiCoachView';
import { AdminView } from './components/views/AdminView';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { AddMealModal } from './components/modals/AddMealModal';
import { AddWaterModal } from './components/modals/AddWaterModal';
import { LogWeightModal } from './components/modals/LogWeightModal';
import { LogSleepModal } from './components/modals/LogSleepModal';
import { LogExerciseModal } from './components/modals/LogExerciseModal';
import { CopyMealsModal } from './components/modals/CopyMealsModal';

// Types & Storage
import {
  UserProfile,
  MealItem,
  WaterLog,
  SleepLog,
  ExerciseLog,
  WeightLog,
  HabitItem,
  HabitCompletion,
  MealType,
} from './types';
import {
  getActiveUser,
  getMeals,
  getWaterLogs,
  getSleepLogs,
  getExerciseLogs,
  getWeightLogs,
  getHabits,
  getHabitCompletions,
} from './utils/storage';

export default function App() {
  const todayStr = new Date().toISOString().split('T')[0];

  // App & Device State
  const [user, setUser] = useState<UserProfile>(getActiveUser);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [isDesktopFramed, setIsDesktopFramed] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabKey | 'admin' | 'ai_coach'>('home');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [isAddMealModalOpen, setIsAddMealModalOpen] = useState(false);
  const [isAddWaterModalOpen, setIsAddWaterModalOpen] = useState(false);
  const [isLogWeightModalOpen, setIsLogWeightModalOpen] = useState(false);
  const [isLogSleepModalOpen, setIsLogSleepModalOpen] = useState(false);
  const [isLogExerciseModalOpen, setIsLogExerciseModalOpen] = useState(false);
  const [isCopyMealsModalOpen, setIsCopyMealsModalOpen] = useState(false);
  const [activeMealTypeForAdd, setActiveMealTypeForAdd] = useState<MealType>('breakfast');

  // Storage Data State
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [waters, setWaters] = useState<WaterLog[]>([]);
  const [sleeps, setSleeps] = useState<SleepLog[]>([]);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<HabitCompletion[]>([]);

  // Reload all user data
  const refreshUserData = useCallback(() => {
    if (!user) return;
    setMeals(getMeals(user.id));
    setWaters(getWaterLogs(user.id, selectedDate));
    setSleeps(getSleepLogs(user.id));
    setExercises(getExerciseLogs(user.id));
    setWeights(getWeightLogs(user.id));
    setHabits(getHabits(user.id));
    setHabitCompletions(getHabitCompletions(user.id, selectedDate));
  }, [user, selectedDate]);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  // Dark Mode Class Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleOpenAddMeal = (mealType: MealType = 'breakfast') => {
    setActiveMealTypeForAdd(mealType);
    setIsAddMealModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-[#F9F7F4] text-stone-900'
      }`}
    >
      {/* Outer Shell for Desktop Viewport Frame */}
      <div
        className={`${
          isDesktopFramed
            ? 'py-4 sm:py-8 px-2 flex flex-col items-center justify-center min-h-screen'
            : 'w-full'
        }`}
      >
        {/* If framed on desktop, show helper frame switch banner */}
        {isDesktopFramed && (
          <div className="hidden md:flex items-center gap-3 mb-3 text-xs text-stone-500 dark:text-stone-400">
            <span>Đang hiển thị ở chế độ: <strong>Khung mô phỏng điện thoại di động</strong></span>
            <button
              onClick={() => setIsDesktopFramed(false)}
              className="text-rose-600 dark:text-rose-400 font-semibold underline hover:text-rose-700"
            >
              Chuyển sang Toàn màn hình máy tính
            </button>
          </div>
        )}

        {/* Device Container */}
        <div
          className={`${
            isDesktopFramed
              ? 'w-full max-w-[420px] h-[870px] rounded-[48px] shadow-2xl border-[9px] border-stone-850 dark:border-stone-800 bg-[#FAF8F5] dark:bg-stone-900 overflow-hidden relative flex flex-col'
              : 'w-full max-w-4xl mx-auto min-h-screen bg-[#FAF8F5] dark:bg-stone-900 flex flex-col relative shadow-sm'
          }`}
        >
          {/* Simulated Speaker Notch for Phone Frame */}
          {isDesktopFramed && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-800 dark:bg-stone-700 rounded-full z-50 pointer-events-none flex items-center justify-center">
              <div className="w-10 h-1 bg-stone-700 dark:bg-stone-600 rounded-full"></div>
            </div>
          )}

          {/* Top Header */}
          <TopHeader
            user={user}
            isDesktopFramed={isDesktopFramed}
            setIsDesktopFramed={setIsDesktopFramed}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenAiAssistant={() => setActiveTab('ai_coach')}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-3 sm:px-4 pt-3 scroll-smooth">
            {activeTab === 'home' && (
              <HomeView
                user={user}
                selectedDate={selectedDate}
                meals={meals}
                waters={waters}
                sleeps={sleeps}
                exercises={exercises}
                weights={weights}
                habits={habits}
                habitCompletions={habitCompletions}
                onOpenAddMeal={handleOpenAddMeal}
                onOpenAddWater={() => setIsAddWaterModalOpen(true)}
                onOpenLogWeight={() => setIsLogWeightModalOpen(true)}
                onOpenLogExercise={() => setIsLogExerciseModalOpen(true)}
                onOpenLogSleep={() => setIsLogSleepModalOpen(true)}
                onOpenAiAssistant={() => setActiveTab('ai_coach')}
                onRefreshData={refreshUserData}
                onNavigateToTab={(tab: any) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'journal' && (
              <JournalView
                selectedDate={selectedDate}
                meals={meals}
                userId={user.id}
                onOpenAddMeal={handleOpenAddMeal}
                onOpenCopyModal={() => setIsCopyMealsModalOpen(true)}
                onRefreshData={refreshUserData}
                hideCalories={user.displayPreferences?.hideCalories}
              />
            )}

            {activeTab === 'plan' && (
              <PlanView
                userId={user.id}
                selectedDate={selectedDate}
                onRefreshData={refreshUserData}
                hideCalories={user.displayPreferences?.hideCalories}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView
                user={user}
                weights={weights}
                meals={meals}
                waters={waters}
                sleeps={sleeps}
                exercises={exercises}
                onOpenLogWeight={() => setIsLogWeightModalOpen(true)}
                hideWeight={user.displayPreferences?.hideWeight}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUserUpdated={(updated) => {
                  setUser(updated);
                  refreshUserData();
                }}
                onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
                onNavigateToAdmin={() => setActiveTab('admin')}
              />
            )}

            {activeTab === 'ai_coach' && (
              <AiCoachView
                user={user}
                meals={meals}
                waters={waters}
                sleeps={sleeps}
              />
            )}

            {activeTab === 'admin' && (
              <AdminView onBackToApp={() => setActiveTab('profile')} />
            )}
          </main>

          {/* Bottom Tab Bar (Only shown on primary 5 tabs) */}
          {activeTab !== 'admin' && (
            <BottomTabBar
              activeTab={activeTab === 'ai_coach' ? 'home' : (activeTab as TabKey)}
              setActiveTab={(tab) => setActiveTab(tab)}
              isFramed={isDesktopFramed}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onUserChanged={(newUser) => {
          setUser(newUser);
          refreshUserData();
        }}
        onOpenOnboarding={() => setIsOnboardingModalOpen(true)}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        user={user}
        onUserUpdated={(updated) => {
          setUser(updated);
          refreshUserData();
        }}
      />

      <AddMealModal
        isOpen={isAddMealModalOpen}
        onClose={() => setIsAddMealModalOpen(false)}
        userId={user.id}
        selectedDate={selectedDate}
        defaultMealType={activeMealTypeForAdd}
        onMealAdded={() => refreshUserData()}
      />

      <AddWaterModal
        isOpen={isAddWaterModalOpen}
        onClose={() => setIsAddWaterModalOpen(false)}
        userId={user.id}
        selectedDate={selectedDate}
        onWaterAdded={() => refreshUserData()}
      />

      <LogWeightModal
        isOpen={isLogWeightModalOpen}
        onClose={() => setIsLogWeightModalOpen(false)}
        userId={user.id}
        selectedDate={selectedDate}
        currentWeight={user.currentWeight}
        onWeightLogged={() => refreshUserData()}
      />

      <LogSleepModal
        isOpen={isLogSleepModalOpen}
        onClose={() => setIsLogSleepModalOpen(false)}
        userId={user.id}
        selectedDate={selectedDate}
        onSleepLogged={() => refreshUserData()}
      />

      <LogExerciseModal
        isOpen={isLogExerciseModalOpen}
        onClose={() => setIsLogExerciseModalOpen(false)}
        userId={user.id}
        selectedDate={selectedDate}
        onExerciseLogged={() => refreshUserData()}
      />

      <CopyMealsModal
        isOpen={isCopyMealsModalOpen}
        onClose={() => setIsCopyMealsModalOpen(false)}
        userId={user.id}
        sourceDate={selectedDate}
        onCopied={() => refreshUserData()}
      />
    </div>
  );
}
