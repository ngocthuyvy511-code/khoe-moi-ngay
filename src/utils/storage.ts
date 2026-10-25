import {
  UserProfile,
  MealItem,
  WaterLog,
  SleepLog,
  ExerciseLog,
  WeightLog,
  HabitItem,
  HabitCompletion,
  MealPlanDay,
  ShoppingItem,
  FoodDatabaseItem,
  FeedbackReport,
} from '../types';
import { SAMPLE_MEAL_PLAN, buildShoppingListFromPlans } from '../data/sampleMealPlans';
import { VIETNAMESE_FOODS_DATABASE } from '../data/vietnameseFoods';

const ACTIVE_USER_KEY = 'khoemoingay_active_user_id';
const DEMO_USER_ID = 'demo-user-khoemoingay';

// Initial Demo Profile
export const DEMO_PROFILE: UserProfile = {
  id: DEMO_USER_ID,
  name: 'Minh Thư (Tài khoản mẫu)',
  email: 'minhthu.demo@khoemoingay.vn',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  age: 27,
  birthDate: '1999-05-18',
  biologicalSex: 'female',
  height: 162,
  currentWeight: 57.5,
  targetWeight: 54.0,
  activityLevel: 'light',
  primaryGoal: 'manage_weight',
  workoutTimePerDay: 30,
  workoutLocation: 'home',
  availableEquipment: ['Thảm tập yoga', 'Giày đi bộ'],
  dietaryPreferences: ['Cơm gia đình', 'Ít ngọt'],
  dislikedFoods: ['Khổ qua đắng'],
  allergies: [],
  cookingTime: '20_45',
  budgetLevel: 'medium',
  wakeTime: '06:30',
  bedTime: '23:00',
  healthScreening: {
    under18: false,
    pregnantOrNursing: false,
    eatingDisorderHistory: false,
    medicalConditionOrSpecialDiet: false,
  },
  isHabitOnlyMode: false,
  displayPreferences: {
    hideCalories: false,
    hideWeight: false,
    fontSize: 'normal',
    unitSystem: 'metric',
  },
  notifications: {
    mealReminder: true,
    waterReminder: true,
    exerciseReminder: true,
    sleepReminder: true,
    progressReminder: true,
    weeklySummary: true,
    quietHoursStart: '22:30',
    quietHoursEnd: '06:30',
  },
  isAdmin: false,
  isDemo: true,
  createdAt: '2026-10-10T08:00:00.000Z',
  updatedAt: '2026-10-25T08:00:00.000Z',
};

// Default Real User template for new signups
export function createDefaultRealUserProfile(email: string, name: string): UserProfile {
  return {
    id: `user-${Date.now()}`,
    name: name || 'Bạn mới',
    email,
    age: 26,
    biologicalSex: 'female',
    height: 165,
    currentWeight: 60,
    targetWeight: 58,
    activityLevel: 'light',
    primaryGoal: 'manage_weight',
    workoutTimePerDay: 25,
    workoutLocation: 'home',
    availableEquipment: ['Thảm yoga'],
    dietaryPreferences: ['Món Việt truyền thống'],
    dislikedFoods: [],
    allergies: [],
    cookingTime: '20_45',
    budgetLevel: 'medium',
    wakeTime: '06:30',
    bedTime: '23:00',
    healthScreening: {
      under18: false,
      pregnantOrNursing: false,
      eatingDisorderHistory: false,
      medicalConditionOrSpecialDiet: false,
    },
    isHabitOnlyMode: false,
    displayPreferences: {
      hideCalories: false,
      hideWeight: false,
      fontSize: 'normal',
      unitSystem: 'metric',
    },
    notifications: {
      mealReminder: true,
      waterReminder: true,
      exerciseReminder: false,
      sleepReminder: true,
      progressReminder: true,
      weeklySummary: true,
      quietHoursStart: '22:30',
      quietHoursEnd: '06:30',
    },
    isAdmin: false,
    isDemo: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// -------------------------------------------------------------
// Seeder for rich Demo Data
// -------------------------------------------------------------
function seedDemoDataIfEmpty() {
  const seededKey = 'khoemoingay_demo_seeded_v1';
  if (localStorage.getItem(seededKey)) return;

  const todayStr = '2026-10-25';
  const yesterdayStr = '2026-10-24';
  const twoDaysAgoStr = '2026-10-23';

  // Seed Profile
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_profile`, JSON.stringify(DEMO_PROFILE));

  // Seed Meals
  const demoMeals: MealItem[] = [
    {
      id: 'demo-meal-1',
      userId: DEMO_USER_ID,
      date: todayStr,
      mealType: 'breakfast',
      name: 'Phở gà xé thanh đạm',
      portionQuantity: 1,
      portionUnit: 'tô vừa',
      servingGrams: 500,
      calories: 410,
      protein: 28,
      carbs: 58,
      fat: 7.5,
      fiber: 2.8,
      source: 'Viện Dinh Dưỡng Quốc Gia',
      createdAt: '2026-10-25T07:15:00.000Z',
      updatedAt: '2026-10-25T07:15:00.000Z',
    },
    {
      id: 'demo-meal-2',
      userId: DEMO_USER_ID,
      date: todayStr,
      mealType: 'lunch',
      name: 'Cơm gạo lứt, cá lóc kho tộ & canh cải',
      portionQuantity: 1,
      portionUnit: 'phần',
      servingGrams: 450,
      calories: 480,
      protein: 28,
      carbs: 60,
      fat: 11,
      fiber: 5.2,
      source: 'Thực đơn chuẩn hóa gia đình',
      createdAt: '2026-10-25T12:30:00.000Z',
      updatedAt: '2026-10-25T12:30:00.000Z',
    },
    {
      id: 'demo-meal-3',
      userId: DEMO_USER_ID,
      date: todayStr,
      mealType: 'snack',
      name: 'Ổi lê giòn rụm & trà sen đá',
      portionQuantity: 1,
      portionUnit: 'quả vừa',
      servingGrams: 160,
      calories: 70,
      protein: 2.2,
      carbs: 15,
      fat: 0.5,
      fiber: 5.4,
      source: 'Viện Dinh Dưỡng',
      createdAt: '2026-10-25T16:00:00.000Z',
      updatedAt: '2026-10-25T16:00:00.000Z',
    },
    {
      id: 'demo-meal-4',
      userId: DEMO_USER_ID,
      date: yesterdayStr,
      mealType: 'breakfast',
      name: 'Bánh mì ốp la 2 trứng & dưa leo',
      portionQuantity: 1,
      portionUnit: 'ổ',
      servingGrams: 200,
      calories: 390,
      protein: 17,
      carbs: 48,
      fat: 14,
      fiber: 2.2,
      source: 'Viện Dinh Dưỡng',
      createdAt: '2026-10-24T07:30:00.000Z',
      updatedAt: '2026-10-24T07:30:00.000Z',
    },
    {
      id: 'demo-meal-5',
      userId: DEMO_USER_ID,
      date: yesterdayStr,
      mealType: 'lunch',
      name: 'Bún chả Hà Nội nướng ít dầu',
      portionQuantity: 1,
      portionUnit: 'suất vừa',
      servingGrams: 420,
      calories: 490,
      protein: 26,
      carbs: 60,
      fat: 14,
      fiber: 4.0,
      source: 'Thực phẩm truyền thống',
      createdAt: '2026-10-24T12:15:00.000Z',
      updatedAt: '2026-10-24T12:15:00.000Z',
    },
    {
      id: 'demo-meal-6',
      userId: DEMO_USER_ID,
      date: yesterdayStr,
      mealType: 'dinner',
      name: 'Đậu hũ sốt cà chua, canh rau ngót thịt băm & 1/2 chén cơm',
      portionQuantity: 1,
      portionUnit: 'mâm cơm nhỏ',
      servingGrams: 380,
      calories: 390,
      protein: 24,
      carbs: 38,
      fat: 13,
      fiber: 5.0,
      source: 'Mâm cơm gia đình',
      createdAt: '2026-10-24T19:00:00.000Z',
      updatedAt: '2026-10-24T19:00:00.000Z',
    },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_meals`, JSON.stringify(demoMeals));

  // Seed Water
  const demoWaters: WaterLog[] = [
    { id: 'w1', userId: DEMO_USER_ID, date: todayStr, amountMl: 300, time: '06:45', createdAt: '2026-10-25T06:45:00.000Z' },
    { id: 'w2', userId: DEMO_USER_ID, date: todayStr, amountMl: 350, time: '09:30', createdAt: '2026-10-25T09:30:00.000Z' },
    { id: 'w3', userId: DEMO_USER_ID, date: todayStr, amountMl: 400, time: '11:45', createdAt: '2026-10-25T11:45:00.000Z' },
    { id: 'w4', userId: DEMO_USER_ID, date: todayStr, amountMl: 300, time: '14:20', createdAt: '2026-10-25T14:20:00.000Z' },
    { id: 'w5', userId: DEMO_USER_ID, date: yesterdayStr, amountMl: 1950, time: '21:00', createdAt: '2026-10-24T21:00:00.000Z' },
    { id: 'w6', userId: DEMO_USER_ID, date: twoDaysAgoStr, amountMl: 1800, time: '21:00', createdAt: '2026-10-23T21:00:00.000Z' },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_waters`, JSON.stringify(demoWaters));

  // Seed Sleep
  const demoSleeps: SleepLog[] = [
    {
      id: 's1',
      userId: DEMO_USER_ID,
      date: todayStr,
      bedTime: '23:15',
      wakeTime: '06:30',
      durationMinutes: 435, // 7h 15m (cross-midnight)
      qualityRating: 4,
      feelings: 'Tỉnh táo, thức dậy nhẹ nhàng không bị mệt mỏi.',
      notes: 'Uống trà hoa cúc trước khi ngủ 45 phút rất êm dịu.',
      createdAt: '2026-10-25T06:35:00.000Z',
    },
    {
      id: 's2',
      userId: DEMO_USER_ID,
      date: yesterdayStr,
      bedTime: '23:30',
      wakeTime: '06:45',
      durationMinutes: 435,
      qualityRating: 4,
      feelings: 'Giấc ngủ sâu, ít bị giật mình.',
      createdAt: '2026-10-24T06:50:00.000Z',
    },
    {
      id: 's3',
      userId: DEMO_USER_ID,
      date: twoDaysAgoStr,
      bedTime: '00:00',
      wakeTime: '06:40',
      durationMinutes: 400,
      qualityRating: 3,
      feelings: 'Hơi mỏi mắt do tối làm việc máy tính muộn.',
      createdAt: '2026-10-23T06:45:00.000Z',
    },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_sleeps`, JSON.stringify(demoSleeps));

  // Seed Exercises
  const demoExercises: ExerciseLog[] = [
    {
      id: 'ex1',
      userId: DEMO_USER_ID,
      date: todayStr,
      activityType: 'walking',
      activityName: 'Đi bộ công viên buổi sáng',
      durationMinutes: 30,
      intensity: 'light',
      distanceKm: 2.4,
      estimatedCalories: 140,
      notes: 'Thời tiết mát mẻ, tinh thần rất sảng khoái.',
      isDeviceSynced: false,
      createdAt: '2026-10-25T07:00:00.000Z',
    },
    {
      id: 'ex2',
      userId: DEMO_USER_ID,
      date: yesterdayStr,
      activityType: 'yoga',
      activityName: 'Yoga dãn cơ và mở khớp háng',
      durationMinutes: 25,
      intensity: 'light',
      estimatedCalories: 85,
      notes: 'Thả lỏng toàn thân, hết mỏi vai gáy.',
      isDeviceSynced: false,
      createdAt: '2026-10-24T20:30:00.000Z',
    },
    {
      id: 'ex3',
      userId: DEMO_USER_ID,
      date: twoDaysAgoStr,
      activityType: 'cycling',
      activityName: 'Đạp xe quanh hồ',
      durationMinutes: 35,
      intensity: 'moderate',
      distanceKm: 7.5,
      estimatedCalories: 220,
      notes: 'Nhịp tim duy trì đều, ra mồ hôi sảng khoái.',
      isDeviceSynced: false,
      createdAt: '2026-10-23T17:30:00.000Z',
    },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_exercises`, JSON.stringify(demoExercises));

  // Seed Weights (14 days progress)
  const demoWeights: WeightLog[] = [
    { id: 'w-1', userId: DEMO_USER_ID, date: '2026-10-12', weightKg: 58.8, waistCm: 70, mood: 'neutral', energyLevel: 3, notes: 'Bắt đầu hành trình', createdAt: '2026-10-12T07:00:00.000Z' },
    { id: 'w-2', userId: DEMO_USER_ID, date: '2026-10-15', weightKg: 58.5, waistCm: 69.5, mood: 'good', energyLevel: 4, notes: 'Uống đủ nước người nhẹ nhõm hơn', createdAt: '2026-10-15T07:00:00.000Z' },
    { id: 'w-3', userId: DEMO_USER_ID, date: '2026-10-18', weightKg: 58.1, waistCm: 69, mood: 'great', energyLevel: 4, notes: 'Ngủ đủ giấc thấy rất có năng lượng', createdAt: '2026-10-18T07:00:00.000Z' },
    { id: 'w-4', userId: DEMO_USER_ID, date: '2026-10-21', weightKg: 57.8, waistCm: 68.5, mood: 'good', energyLevel: 4, notes: 'Bụng phẳng hơn, quần áo mặc thoải mái', createdAt: '2026-10-21T07:00:00.000Z' },
    { id: 'w-5', userId: DEMO_USER_ID, date: todayStr, weightKg: 57.5, waistCm: 68, mood: 'great', energyLevel: 5, notes: 'Cảm giác cơ thể săn chắc và dẻo dai', createdAt: '2026-10-25T07:00:00.000Z' },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_weights`, JSON.stringify(demoWeights));

  // Seed Habits
  const demoHabits: HabitItem[] = [
    { id: 'h1', userId: DEMO_USER_ID, title: 'Uống 1 ly nước ấm khi thức dậy', category: 'hydration', categoryLabel: 'Nước uống', iconName: 'Droplets', frequency: 'daily', reminderTime: '06:35', createdAt: '2026-10-10T00:00:00.000Z' },
    { id: 'h2', userId: DEMO_USER_ID, title: 'Ăn thêm 1 phần rau xanh vào bữa trưa', category: 'nutrition', categoryLabel: 'Ăn uống', iconName: 'Salad', frequency: 'daily', reminderTime: '11:45', createdAt: '2026-10-10T00:00:00.000Z' },
    { id: 'h3', userId: DEMO_USER_ID, title: 'Vận động thể chất ít nhất 20 phút', category: 'movement', categoryLabel: 'Vận động', iconName: 'Activity', frequency: 'daily', reminderTime: '17:00', createdAt: '2026-10-10T00:00:00.000Z' },
    { id: 'h4', userId: DEMO_USER_ID, title: 'Tắt màn hình điện thoại trước 23h', category: 'sleep', categoryLabel: 'Giấc ngủ', iconName: 'Moon', frequency: 'daily', reminderTime: '22:45', createdAt: '2026-10-10T00:00:00.000Z' },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_habits`, JSON.stringify(demoHabits));

  // Seed Habit Completions for today
  const demoCompletions: HabitCompletion[] = [
    { id: 'c1', habitId: 'h1', userId: DEMO_USER_ID, date: todayStr, completed: true, timestamp: '2026-10-25T06:45:00.000Z' },
    { id: 'c2', habitId: 'h2', userId: DEMO_USER_ID, date: todayStr, completed: true, timestamp: '2026-10-25T12:35:00.000Z' },
    { id: 'c3', habitId: 'h3', userId: DEMO_USER_ID, date: todayStr, completed: true, timestamp: '2026-10-25T07:30:00.000Z' },
  ];
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_habit_logs`, JSON.stringify(demoCompletions));

  // Seed Meal Plans and Shopping List
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_meal_plans`, JSON.stringify(SAMPLE_MEAL_PLAN));
  const shopping = buildShoppingListFromPlans(SAMPLE_MEAL_PLAN, DEMO_USER_ID);
  localStorage.setItem(`khoemoingay_user_${DEMO_USER_ID}_shopping_list`, JSON.stringify(shopping));

  localStorage.setItem(seededKey, 'true');
}

// Ensure seed check is called on import in browser
if (typeof window !== 'undefined') {
  seedDemoDataIfEmpty();
}

// -------------------------------------------------------------
// Authentication & User State
// -------------------------------------------------------------
export function getActiveUser(): UserProfile {
  if (typeof window === 'undefined') return DEMO_PROFILE;
  seedDemoDataIfEmpty();

  const activeId = localStorage.getItem(ACTIVE_USER_KEY) || DEMO_USER_ID;
  const userJson = localStorage.getItem(`khoemoingay_user_${activeId}_profile`);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      // fallback
    }
  }
  return DEMO_PROFILE;
}

export function setActiveUser(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_USER_KEY, profile.id);
  localStorage.setItem(`khoemoingay_user_${profile.id}_profile`, JSON.stringify(profile));
}

export function switchAccount(toDemo: boolean): UserProfile {
  if (toDemo) {
    localStorage.setItem(ACTIVE_USER_KEY, DEMO_USER_ID);
    return DEMO_PROFILE;
  }
  // Try finding a real user account
  const realKey = Object.keys(localStorage).find(
    (k) => k.startsWith('khoemoingay_user_user-') && k.endsWith('_profile')
  );
  if (realKey) {
    const raw = localStorage.getItem(realKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      localStorage.setItem(ACTIVE_USER_KEY, parsed.id);
      return parsed;
    }
  }
  // Create a fresh real account
  const newProfile = createDefaultRealUserProfile('ban.moi@khoemoingay.vn', 'Người dùng mới');
  setActiveUser(newProfile);
  return newProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  profile.updatedAt = new Date().toISOString();
  setActiveUser(profile);
}

// -------------------------------------------------------------
// Meal Journal
// -------------------------------------------------------------
export function getMeals(userId: string, date?: string): MealItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_meals`);
  let list: MealItem[] = raw ? JSON.parse(raw) : [];
  if (date) {
    list = list.filter((m) => m.date === date);
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveMeal(meal: MealItem): void {
  if (typeof window === 'undefined') return;
  const meals = getMeals(meal.userId);
  const index = meals.findIndex((m) => m.id === meal.id);
  if (index >= 0) {
    meals[index] = meal;
  } else {
    meals.unshift(meal);
  }
  localStorage.setItem(`khoemoingay_user_${meal.userId}_meals`, JSON.stringify(meals));
}

export function deleteMeal(mealId: string, userId: string): MealItem | null {
  if (typeof window === 'undefined') return null;
  const meals = getMeals(userId);
  const found = meals.find((m) => m.id === mealId);
  if (!found) return null;
  const filtered = meals.filter((m) => m.id !== mealId);
  localStorage.setItem(`khoemoingay_user_${userId}_meals`, JSON.stringify(filtered));
  return found;
}

export function copyMealsToDate(sourceDate: string, targetDate: string, userId: string): number {
  if (typeof window === 'undefined') return 0;
  const meals = getMeals(userId, sourceDate);
  if (meals.length === 0) return 0;

  const currentAll = getMeals(userId);
  const copies: MealItem[] = meals.map((m) => ({
    ...m,
    id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: targetDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const updated = [...copies, ...currentAll];
  localStorage.setItem(`khoemoingay_user_${userId}_meals`, JSON.stringify(updated));
  return copies.length;
}

// -------------------------------------------------------------
// Water Tracking
// -------------------------------------------------------------
export function getWaterLogs(userId: string, date: string): WaterLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_waters`);
  const list: WaterLog[] = raw ? JSON.parse(raw) : [];
  return list.filter((w) => w.date === date).sort((a, b) => a.time.localeCompare(b.time));
}

export function addWaterLog(userId: string, date: string, amountMl: number): WaterLog {
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_waters`);
  const list: WaterLog[] = raw ? JSON.parse(raw) : [];
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const item: WaterLog = {
    id: `water-${Date.now()}`,
    userId,
    date,
    amountMl,
    time,
    createdAt: now.toISOString(),
  };
  list.push(item);
  localStorage.setItem(`khoemoingay_user_${userId}_waters`, JSON.stringify(list));
  return item;
}

export function deleteWaterLog(id: string, userId: string): void {
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_waters`);
  if (!raw) return;
  const list: WaterLog[] = JSON.parse(raw);
  const filtered = list.filter((w) => w.id !== id);
  localStorage.setItem(`khoemoingay_user_${userId}_waters`, JSON.stringify(filtered));
}

// -------------------------------------------------------------
// Sleep Tracking
// -------------------------------------------------------------
export function getSleepLogs(userId: string): SleepLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_sleeps`);
  const list: SleepLog[] = raw ? JSON.parse(raw) : [];
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export function saveSleepLog(sleep: SleepLog): void {
  if (typeof window === 'undefined') return;
  const logs = getSleepLogs(sleep.userId);
  const idx = logs.findIndex((s) => s.id === sleep.id || s.date === sleep.date);
  if (idx >= 0) {
    logs[idx] = sleep;
  } else {
    logs.unshift(sleep);
  }
  localStorage.setItem(`khoemoingay_user_${sleep.userId}_sleeps`, JSON.stringify(logs));
}

// -------------------------------------------------------------
// Exercise & Workouts
// -------------------------------------------------------------
export function getExerciseLogs(userId: string, date?: string): ExerciseLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_exercises`);
  let list: ExerciseLog[] = raw ? JSON.parse(raw) : [];
  if (date) {
    list = list.filter((e) => e.date === date);
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveExerciseLog(log: ExerciseLog): void {
  if (typeof window === 'undefined') return;
  const logs = getExerciseLogs(log.userId);
  const idx = logs.findIndex((e) => e.id === log.id);
  if (idx >= 0) {
    logs[idx] = log;
  } else {
    logs.unshift(log);
  }
  localStorage.setItem(`khoemoingay_user_${log.userId}_exercises`, JSON.stringify(logs));
}

export function deleteExerciseLog(id: string, userId: string): void {
  if (typeof window === 'undefined') return;
  const logs = getExerciseLogs(userId);
  const filtered = logs.filter((e) => e.id !== id);
  localStorage.setItem(`khoemoingay_user_${userId}_exercises`, JSON.stringify(filtered));
}

// -------------------------------------------------------------
// Weight & Measurements Tracking
// -------------------------------------------------------------
export function getWeightLogs(userId: string): WeightLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_weights`);
  const list: WeightLog[] = raw ? JSON.parse(raw) : [];
  return list.sort((a, b) => a.date.localeCompare(b.date));
}

export function saveWeightLog(log: WeightLog): void {
  if (typeof window === 'undefined') return;
  const logs = getWeightLogs(log.userId);
  const idx = logs.findIndex((w) => w.id === log.id || w.date === log.date);
  if (idx >= 0) {
    logs[idx] = log;
  } else {
    logs.push(log);
  }
  logs.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(`khoemoingay_user_${log.userId}_weights`, JSON.stringify(logs));

  // Also update user's current weight in profile
  const profile = getActiveUser();
  if (profile.id === log.userId) {
    profile.currentWeight = log.weightKg;
    saveUserProfile(profile);
  }
}

// -------------------------------------------------------------
// Habits & Daily Checklists
// -------------------------------------------------------------
export function getHabits(userId: string): HabitItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_habits`);
  return raw ? JSON.parse(raw) : [];
}

export function saveHabit(habit: HabitItem): void {
  if (typeof window === 'undefined') return;
  const habits = getHabits(habit.userId);
  const idx = habits.findIndex((h) => h.id === habit.id);
  if (idx >= 0) {
    habits[idx] = habit;
  } else {
    habits.push(habit);
  }
  localStorage.setItem(`khoemoingay_user_${habit.userId}_habits`, JSON.stringify(habits));
}

export function getHabitCompletions(userId: string, date: string): HabitCompletion[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_habit_logs`);
  const list: HabitCompletion[] = raw ? JSON.parse(raw) : [];
  return list.filter((c) => c.date === date);
}

export function toggleHabitCompletion(userId: string, habitId: string, date: string): boolean {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_habit_logs`);
  const list: HabitCompletion[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex((c) => c.habitId === habitId && c.date === date);

  let newState = true;
  if (idx >= 0) {
    list[idx].completed = !list[idx].completed;
    newState = list[idx].completed;
  } else {
    list.push({
      id: `comp-${Date.now()}`,
      habitId,
      userId,
      date,
      completed: true,
      timestamp: new Date().toISOString(),
    });
    newState = true;
  }
  localStorage.setItem(`khoemoingay_user_${userId}_habit_logs`, JSON.stringify(list));
  return newState;
}

// -------------------------------------------------------------
// Meal Planning & Shopping List
// -------------------------------------------------------------
export function getMealPlans(userId: string): MealPlanDay[] {
  if (typeof window === 'undefined') return SAMPLE_MEAL_PLAN;
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_meal_plans`);
  if (!raw) {
    return SAMPLE_MEAL_PLAN;
  }
  return JSON.parse(raw);
}

export function saveMealPlanDay(day: MealPlanDay, userId: string): void {
  if (typeof window === 'undefined') return;
  const plans = getMealPlans(userId);
  const idx = plans.findIndex((p) => p.dayOfWeek === day.dayOfWeek);
  if (idx >= 0) {
    plans[idx] = day;
  } else {
    plans.push(day);
  }
  localStorage.setItem(`khoemoingay_user_${userId}_meal_plans`, JSON.stringify(plans));
}

export function getShoppingList(userId: string): ShoppingItem[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`khoemoingay_user_${userId}_shopping_list`);
  if (!raw) {
    const defaultList = buildShoppingListFromPlans(getMealPlans(userId), userId);
    localStorage.setItem(`khoemoingay_user_${userId}_shopping_list`, JSON.stringify(defaultList));
    return defaultList;
  }
  return JSON.parse(raw);
}

export function saveShoppingItem(item: ShoppingItem): void {
  if (typeof window === 'undefined') return;
  const list = getShoppingList(item.userId);
  const idx = list.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  localStorage.setItem(`khoemoingay_user_${item.userId}_shopping_list`, JSON.stringify(list));
}

export function toggleShoppingItem(id: string, userId: string): void {
  if (typeof window === 'undefined') return;
  const list = getShoppingList(userId);
  const item = list.find((i) => i.id === id);
  if (item) {
    item.isBought = !item.isBought;
    localStorage.setItem(`khoemoingay_user_${userId}_shopping_list`, JSON.stringify(list));
  }
}

export function deleteShoppingItem(id: string, userId: string): void {
  if (typeof window === 'undefined') return;
  const list = getShoppingList(userId);
  const filtered = list.filter((i) => i.id !== id);
  localStorage.setItem(`khoemoingay_user_${userId}_shopping_list`, JSON.stringify(filtered));
}

// -------------------------------------------------------------
// Admin & Custom Foods
// -------------------------------------------------------------
export function getAllFoods(): FoodDatabaseItem[] {
  if (typeof window === 'undefined') return VIETNAMESE_FOODS_DATABASE;
  const customRaw = localStorage.getItem('khoemoingay_admin_custom_foods');
  const customList: FoodDatabaseItem[] = customRaw ? JSON.parse(customRaw) : [];
  return [...customList, ...VIETNAMESE_FOODS_DATABASE];
}

export function saveAdminCustomFood(item: FoodDatabaseItem): void {
  if (typeof window === 'undefined') return;
  const customRaw = localStorage.getItem('khoemoingay_admin_custom_foods');
  const list: FoodDatabaseItem[] = customRaw ? JSON.parse(customRaw) : [];
  const idx = list.findIndex((f) => f.id === item.id);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  localStorage.setItem('khoemoingay_admin_custom_foods', JSON.stringify(list));
}

export function deleteAdminCustomFood(id: string): void {
  if (typeof window === 'undefined') return;
  const customRaw = localStorage.getItem('khoemoingay_admin_custom_foods');
  if (!customRaw) return;
  const list: FoodDatabaseItem[] = JSON.parse(customRaw);
  const filtered = list.filter((f) => f.id !== id);
  localStorage.setItem('khoemoingay_admin_custom_foods', JSON.stringify(filtered));
}

// -------------------------------------------------------------
// Feedback Reports
// -------------------------------------------------------------
export function saveFeedbackReport(report: FeedbackReport): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('khoemoingay_feedback_reports');
  const list: FeedbackReport[] = raw ? JSON.parse(raw) : [];
  list.unshift(report);
  localStorage.setItem('khoemoingay_feedback_reports', JSON.stringify(list));
}

export function getFeedbackReports(): FeedbackReport[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('khoemoingay_feedback_reports');
  return raw ? JSON.parse(raw) : [];
}

// -------------------------------------------------------------
// Export & Account Reset
// -------------------------------------------------------------
export function exportAllUserData(userId: string): string {
  const profile = getActiveUser();
  const meals = getMeals(userId);
  const waters = getWaterLogs(userId, new Date().toISOString().split('T')[0]);
  const sleeps = getSleepLogs(userId);
  const exercises = getExerciseLogs(userId);
  const weights = getWeightLogs(userId);
  const habits = getHabits(userId);
  const plans = getMealPlans(userId);

  const payload = {
    appName: 'Khỏe Mỗi Ngày',
    exportedAt: new Date().toISOString(),
    profile,
    data: {
      meals,
      waters,
      sleeps,
      exercises,
      weights,
      habits,
      plans,
    },
    privacyStatement: 'Dữ liệu này hoàn toàn thuộc quyền sở hữu của bạn, được trích xuất minh bạch.',
  };

  return JSON.stringify(payload, null, 2);
}

export function resetOrDeleteUserData(userId: string): void {
  if (typeof window === 'undefined') return;
  const keysToRemove = [
    `khoemoingay_user_${userId}_profile`,
    `khoemoingay_user_${userId}_meals`,
    `khoemoingay_user_${userId}_waters`,
    `khoemoingay_user_${userId}_sleeps`,
    `khoemoingay_user_${userId}_exercises`,
    `khoemoingay_user_${userId}_weights`,
    `khoemoingay_user_${userId}_habits`,
    `khoemoingay_user_${userId}_habit_logs`,
    `khoemoingay_user_${userId}_meal_plans`,
    `khoemoingay_user_${userId}_shopping_list`,
  ];
  keysToRemove.forEach((k) => localStorage.removeItem(k));

  // Reset to Demo User
  localStorage.setItem(ACTIVE_USER_KEY, DEMO_USER_ID);
}
