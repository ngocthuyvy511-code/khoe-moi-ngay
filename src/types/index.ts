/**
 * Core type definitions for Khỏe Mỗi Ngày
 */

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface HealthScreening {
  under18: boolean;
  pregnantOrNursing: boolean;
  eatingDisorderHistory: boolean;
  medicalConditionOrSpecialDiet: boolean;
  details?: string;
}

export interface DisplayPreferences {
  hideCalories: boolean;
  hideWeight: boolean;
  fontSize: 'normal' | 'large';
  unitSystem: 'metric' | 'imperial';
}

export interface NotificationPreferences {
  mealReminder: boolean;
  waterReminder: boolean;
  exerciseReminder: boolean;
  sleepReminder: boolean;
  progressReminder: boolean;
  weeklySummary: boolean;
  quietHoursStart: string; // '22:00'
  quietHoursEnd: string;   // '07:00'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  birthDate?: string;
  biologicalSex?: 'female' | 'male' | 'unspecified';
  height: number; // Stored in cm
  currentWeight: number; // Stored in kg
  targetWeight?: number; // Stored in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  primaryGoal: 'manage_weight' | 'maintain_weight' | 'build_habits';
  workoutTimePerDay: number; // in minutes
  workoutLocation: 'home' | 'outdoor' | 'gym' | 'flexible';
  availableEquipment: string[];
  dietaryPreferences: string[];
  dislikedFoods: string[];
  allergies: string[];
  cookingTime: 'under_20' | '20_45' | 'over_45';
  budgetLevel: 'economic' | 'medium' | 'comfortable';
  wakeTime: string; // '06:30'
  bedTime: string;  // '23:00'
  healthScreening: HealthScreening;
  isHabitOnlyMode: boolean; // Auto-activated if health screening flags match
  displayPreferences: DisplayPreferences;
  notifications: NotificationPreferences;
  isAdmin?: boolean;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface FoodDatabaseItem extends NutritionInfo {
  id: string;
  name: string;
  category: 'noodles' | 'rice' | 'bread_rolls' | 'family_dishes' | 'dessert_drinks' | 'healthy_snacks';
  categoryLabel: string;
  standardPortion: string;
  servingGrams?: number;
  source: string;
  verified: boolean;
  allergyTags?: string[];
  ingredientsSummary?: string;
  description?: string;
}

export interface MealItem {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  name: string;
  portionQuantity: number;
  portionUnit: string;
  servingGrams?: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  notes?: string;
  photoUrl?: string;
  source: string;
  isAiEstimated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  time: string; // 'HH:mm'
  createdAt: string;
}

export interface SleepLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD (date of morning wake up)
  bedTime: string; // '23:30'
  wakeTime: string; // '06:45'
  durationMinutes: number;
  qualityRating: 1 | 2 | 3 | 4 | 5; // 1 = Rất mệt, 5 = Tràn đầy sinh lực
  feelings?: string;
  notes?: string;
  createdAt: string;
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'recovery';
  level: 'Dễ' | 'Trung bình' | 'Nâng cao';
  equipment: string;
  caloriesBurnPerMin: number;
  instructions: string[];
  safeStoppingSigns: string[];
  recommendedDurationMin: number;
  alternatives?: string[];
}

export interface ExerciseLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  activityType: 'walking' | 'running' | 'cycling' | 'swimming' | 'yoga' | 'strength' | 'custom';
  activityName: string;
  durationMinutes: number;
  intensity: 'light' | 'moderate' | 'vigorous';
  distanceKm?: number;
  estimatedCalories?: number;
  notes?: string;
  isDeviceSynced?: boolean;
  createdAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  hipCm?: number;
  mood?: 'great' | 'good' | 'neutral' | 'low' | 'stressed';
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  photoUrl?: string; // Strictly local private storage
  createdAt: string;
}

export interface HabitItem {
  id: string;
  userId: string;
  title: string;
  category: 'nutrition' | 'movement' | 'hydration' | 'mindfulness' | 'sleep';
  categoryLabel: string;
  iconName: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  reminderTime?: string;
  isPaused?: boolean;
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  timestamp: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  category: string;
  checked?: boolean;
}

export interface MealPlanDay {
  dayOfWeek: string; // 'Thứ Hai', 'Thứ Ba', ...
  date: string;
  breakfast: MealPlanRecipe;
  lunch: MealPlanRecipe;
  dinner: MealPlanRecipe;
  snack?: MealPlanRecipe;
}

export interface MealPlanRecipe {
  id: string;
  title: string;
  mealType: MealType;
  servings: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  caloriesPerServing: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients: RecipeIngredient[];
  instructions: string[];
  source: string;
  isFavorite?: boolean;
  eatenLogged?: boolean;
}

export interface ShoppingItem {
  id: string;
  userId: string;
  name: string;
  amount: string;
  category: string;
  isBought: boolean;
  planReference?: string;
  createdAt: string;
}

export interface FeedbackReport {
  id: string;
  userId: string;
  userEmail: string;
  type: 'bug' | 'feature' | 'food_request' | 'other';
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
