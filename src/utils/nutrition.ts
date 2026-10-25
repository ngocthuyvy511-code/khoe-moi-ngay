import { UserProfile } from '../types';

/**
 * Remove Vietnamese accents for fast fuzzy search
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
    .toLowerCase();
}

/**
 * BMR Calculation using scientific Mifflin-St Jeor equation
 * Returns estimated base energy expenditure and explicit metadata/assumptions
 */
export function calculateMifflinStJeor(profile: Partial<UserProfile>): {
  bmr: number;
  tdee: number;
  targetCalories: number | null;
  assumptionNote: string;
  isSafeMode: boolean;
} {
  const weight = profile.currentWeight || 60;
  const height = profile.height || 165;
  const age = profile.age || 28;
  const sex = profile.biologicalSex || 'unspecified';

  // Base BMR Calculation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (sex === 'male') {
    bmr += 5;
  } else if (sex === 'female') {
    bmr -= 161;
  } else {
    // Median approximation if biological sex is opted out
    bmr -= 78;
  }
  bmr = Math.round(bmr);

  // Activity multipliers
  const multipliers: Record<string, number> = {
    sedentary: 1.2,       // Ít vận động, ngồi văn phòng
    light: 1.375,         // Vận động nhẹ 1-3 ngày/tuần
    moderate: 1.55,       // Vận động vừa phải 3-5 ngày/tuần
    very_active: 1.725,   // Vận động nhiều 6-7 ngày/tuần
    extra_active: 1.9,    // Cường độ thể thao chuyên nghiệp / lao động nặng
  };

  const mult = multipliers[profile.activityLevel || 'light'] || 1.375;
  const tdee = Math.round(bmr * mult);

  // Check health screening & habit mode
  const screening = profile.healthScreening;
  const isExcluded = Boolean(
    profile.isHabitOnlyMode ||
    screening?.under18 ||
    screening?.pregnantOrNursing ||
    screening?.eatingDisorderHistory ||
    screening?.medicalConditionOrSpecialDiet
  );

  let targetCalories: number | null = null;
  let assumptionNote = 'Ước tính theo công thức Mifflin-St Jeor (chuẩn viện dinh dưỡng y khoa).';

  if (isExcluded) {
    targetCalories = tdee;
    assumptionNote = 'Đang bật Chế độ Thói quen An toàn: Năng lượng tham khảo là mức duy trì tự nhiên, không áp dụng thâm hụt calo.';
  } else if (profile.primaryGoal === 'manage_weight') {
    // Healthy, gentle calorie deficit (300 kcal, floor 1300 for female / 1500 for male)
    const floor = sex === 'female' ? 1250 : 1500;
    targetCalories = Math.max(floor, tdee - 300);
    assumptionNote = 'Mục tiêu tham khảo tạo mức thâm hụt nhẹ nhàng ~300 kcal/ngày, ưu tiên no đủ và tràn đầy năng lượng.';
  } else {
    targetCalories = tdee;
    assumptionNote = 'Mục tiêu giữ cân và duy trì lối sống lành mạnh.';
  }

  return {
    bmr,
    tdee,
    targetCalories,
    assumptionNote,
    isSafeMode: isExcluded,
  };
}

/**
 * Asian-Pacific BMI calculation with limitations
 */
export function calculateAsianBmi(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  badgeColor: string;
  disclaimer: string;
} {
  if (!weightKg || !heightCm) {
    return {
      bmi: 0,
      category: 'Chưa đủ dữ liệu',
      badgeColor: 'text-stone-500 bg-stone-100',
      disclaimer: 'Vui lòng cập nhật chiều cao và cân nặng để xem chỉ số.',
    };
  }

  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Bình thường';
  let badgeColor = 'text-emerald-700 bg-emerald-50';

  if (bmi < 18.5) {
    category = 'Thể trạng nhẹ cân';
    badgeColor = 'text-amber-700 bg-amber-50';
  } else if (bmi <= 22.9) {
    category = 'Thể trạng cân đối (Chuẩn Châu Á)';
    badgeColor = 'text-emerald-700 bg-emerald-50';
  } else if (bmi <= 24.9) {
    category = 'Tiền thừa cân nhẹ';
    badgeColor = 'text-orange-700 bg-orange-50';
  } else {
    category = 'Cần chú ý điều chỉnh thói quen';
    badgeColor = 'text-rose-700 bg-rose-50';
  }

  const disclaimer =
    'Chỉ số BMI chỉ phản ánh tương quan giữa chiều cao và cân nặng tổng thể. BMI không phân biệt được tỷ lệ cơ bắp, khối lượng xương hay mỡ nội tạng. Đừng để một con số định nghĩa sức khỏe của bạn.';

  return { bmi, category, badgeColor, disclaimer };
}

/**
 * Calculate Sleep Duration spanning across midnight correctly
 */
export function calculateSleepDurationMinutes(bedTime: string, wakeTime: string): number {
  if (!bedTime || !wakeTime) return 0;
  const [bHours, bMins] = bedTime.split(':').map((n) => parseInt(n, 10));
  const [wHours, wMins] = wakeTime.split(':').map((n) => parseInt(n, 10));

  const bedTotalMins = bHours * 60 + bMins;
  const wakeTotalMins = wHours * 60 + wMins;

  if (wakeTotalMins >= bedTotalMins) {
    return wakeTotalMins - bedTotalMins;
  }
  // Cross midnight (e.g. 23:00 to 06:30)
  return 24 * 60 - bedTotalMins + wakeTotalMins;
}

/**
 * Format minutes into "7h 15p"
 */
export function formatDurationHoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h}h ${m}p`;
}

/**
 * Unit conversions
 */
export function displayWeight(kg: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    return `${(kg * 2.20462).toFixed(1)} lb`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function displayHeight(cm: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}ft ${inches}in`;
  }
  return `${Math.round(cm)} cm`;
}

export function displayWater(ml: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    return `${(ml / 29.5735).toFixed(0)} fl oz`;
  }
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)} L`;
  }
  return `${ml} ml`;
}
