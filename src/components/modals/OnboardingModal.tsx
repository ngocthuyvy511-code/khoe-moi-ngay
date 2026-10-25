import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Heart,
  Scale,
  Sparkles,
} from 'lucide-react';
import { UserProfile, HealthScreening } from '../../types';
import { saveUserProfile } from '../../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form states initialized with current user
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.age || 26);
  const [biologicalSex, setBiologicalSex] = useState<'female' | 'male' | 'unspecified'>(
    user.biologicalSex || 'unspecified'
  );
  const [height, setHeight] = useState(user.height || 165);
  const [currentWeight, setCurrentWeight] = useState(user.currentWeight || 60);
  const [targetWeight, setTargetWeight] = useState(user.targetWeight || 58);

  // Safety screening
  const [healthScreening, setHealthScreening] = useState<HealthScreening>({
    under18: user.healthScreening?.under18 || false,
    pregnantOrNursing: user.healthScreening?.pregnantOrNursing || false,
    eatingDisorderHistory: user.healthScreening?.eatingDisorderHistory || false,
    medicalConditionOrSpecialDiet: user.healthScreening?.medicalConditionOrSpecialDiet || false,
    details: user.healthScreening?.details || '',
  });

  // Lifestyle & Exercise
  const [activityLevel, setActivityLevel] = useState(user.activityLevel || 'light');
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal || 'manage_weight');
  const [workoutTime, setWorkoutTime] = useState(user.workoutTimePerDay || 25);
  const [workoutLocation, setWorkoutLocation] = useState(user.workoutLocation || 'home');
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(
    user.availableEquipment || ['Thảm tập yoga']
  );

  // Diet & Food
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>(
    user.dietaryPreferences || ['Cơm gia đình Việt']
  );
  const [dislikedFoods, setDislikedFoods] = useState(user.dislikedFoods?.join(', ') || '');
  const [allergies, setAllergies] = useState<string[]>(user.allergies || []);
  const [cookingTime, setCookingTime] = useState(user.cookingTime || '20_45');
  const [budgetLevel, setBudgetLevel] = useState(user.budgetLevel || 'medium');

  // Schedule & Display
  const [wakeTime, setWakeTime] = useState(user.wakeTime || '06:30');
  const [bedTime, setBedTime] = useState(user.bedTime || '23:00');
  const [hideCalories, setHideCalories] = useState(user.displayPreferences?.hideCalories || false);
  const [hideWeight, setHideWeight] = useState(user.displayPreferences?.hideWeight || false);

  if (!isOpen) return null;

  // Determine if safety exclusion applies
  const hasSafetyExclusion =
    healthScreening.under18 ||
    healthScreening.pregnantOrNursing ||
    healthScreening.eatingDisorderHistory ||
    healthScreening.medicalConditionOrSpecialDiet;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleEquipment = (item: string) => {
    if (availableEquipment.includes(item)) {
      setAvailableEquipment(availableEquipment.filter((e) => e !== item));
    } else {
      setAvailableEquipment([...availableEquipment, item]);
    }
  };

  const toggleAllergy = (item: string) => {
    if (allergies.includes(item)) {
      setAllergies(allergies.filter((a) => a !== item));
    } else {
      setAllergies([...allergies, item]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...user,
      name,
      age: Number(age),
      biologicalSex,
      height: Number(height),
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      healthScreening,
      isHabitOnlyMode: hasSafetyExclusion || hideCalories,
      activityLevel,
      primaryGoal: hasSafetyExclusion ? 'build_habits' : primaryGoal,
      workoutTimePerDay: Number(workoutTime),
      workoutLocation,
      availableEquipment,
      dietaryPreferences,
      dislikedFoods: dislikedFoods.split(',').map((s) => s.trim()).filter(Boolean),
      allergies,
      cookingTime,
      budgetLevel,
      wakeTime,
      bedTime,
      displayPreferences: {
        ...user.displayPreferences,
        hideCalories: hideCalories || hasSafetyExclusion,
        hideWeight,
      },
    };

    saveUserProfile(updated);
    onUserUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800 flex flex-col max-h-[90vh]">
        {/* Header with Step Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Khảo sát cá nhân hóa · Bước {step}/{totalSteps}
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              {step === 1 && 'Thông tin cơ bản'}
              {step === 2 && 'Sàng lọc an toàn sức khỏe'}
              {step === 3 && 'Vận động & Mục tiêu'}
              {step === 4 && 'Ăn uống & Bếp núc'}
              {step === 5 && 'Sinh hoạt & Tùy chọn hiển thị'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden my-3">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4 text-xs">
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Tên hiển thị hoặc biệt danh thân thương
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder="Ví dụ: Minh Thư"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Tuổi hiện tại
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Cân nặng hiện tại (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Cân nặng mong muốn (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Biological Sex (Optional with scientific explanation) */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70">
                <div className="flex items-start gap-2 mb-2">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    <strong>Giới tính sinh học (Tùy chọn):</strong> Chỉ dùng cho công thức ước tính chuyển hóa cơ bản (BMR). Bạn hoàn toàn có thể chọn bỏ qua mà không ảnh hưởng đến trải nghiệm.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'female', label: 'Nữ' },
                    { id: 'male', label: 'Nam' },
                    { id: 'unspecified', label: 'Bỏ qua / Không tiết lộ' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBiologicalSex(s.id as any)}
                      className={`flex-1 py-1.5 px-2 rounded-xl border text-center font-medium transition-all ${
                        biologicalSex === s.id
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SAFETY SCREENING */}
          {step === 2 && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs mb-0.5">Cam kết an toàn sức khỏe</h4>
                    <p className="text-[11px] leading-relaxed">
                      "Khỏe Mỗi Ngày" tôn trọng cơ thể bạn. Nếu bạn thuộc các trường hợp dưới đây, ứng dụng sẽ <strong>không tự tạo kế hoạch thâm hụt calo</strong> mà chuyển sang theo dõi thói quen nhẹ nhàng để bảo vệ thể trạng.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    key: 'under18',
                    label: 'Người dưới 18 tuổi',
                    desc: 'Cơ thể đang trong giai đoạn phát triển thể chất tự nhiên.',
                  },
                  {
                    key: 'pregnantOrNursing',
                    label: 'Đang mang thai hoặc cho con bú',
                    desc: 'Cần dinh dưỡng đầy đủ và tối ưu cho cả mẹ và bé.',
                  },
                  {
                    key: 'eatingDisorderHistory',
                    label: 'Có tiền sử rối loạn ăn uống',
                    desc: 'Cần tránh việc đếm calo hay kiểm soát số đo gây căng thẳng tâm lý.',
                  },
                  {
                    key: 'medicalConditionOrSpecialDiet',
                    label: 'Có bệnh lý mạn tính hoặc đang theo chế độ điều trị của bác sĩ',
                    desc: 'Cần tuân thủ chỉ định của chuyên gia y tế riêng.',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(healthScreening as any)[item.key]}
                      onChange={(e) =>
                        setHealthScreening({
                          ...healthScreening,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                    />
                    <div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                        {item.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              {hasSafetyExclusion && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 text-[11px] leading-relaxed flex items-start gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    Hệ thống sẽ bật <strong>Chế độ Thói Quen An Toàn</strong> cho bạn: Ẩn mục tiêu thâm hụt năng lượng, tập trung vào giấc ngủ, uống đủ nước, vận động thư thái và thưởng thức món ăn đầy đủ.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: MOVEMENT & GOAL */}
          {step === 3 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Mục tiêu chính của bạn
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'manage_weight', label: 'Quản lý cân nặng', sub: 'Thâm hụt nhẹ nhàng' },
                    { id: 'maintain_weight', label: 'Duy trì cân nặng', sub: 'Cân bằng & khỏe đẹp' },
                    { id: 'build_habits', label: 'Xây dựng thói quen', sub: 'Lối sống năng động' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPrimaryGoal(g.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        primaryGoal === g.id
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <span className="font-bold block text-xs">{g.label}</span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                        {g.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Mức độ vận động hiện tại
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'sedentary', label: 'Ít vận động', desc: 'Ngồi làm việc văn phòng, ít đi lại' },
                    { id: 'light', label: 'Vận động nhẹ', desc: 'Đi bộ, làm việc nhà, tập 1-3 buổi/tuần' },
                    { id: 'moderate', label: 'Vừa phải', desc: 'Tập thể thao đều 3-5 buổi/tuần' },
                    { id: 'very_active', label: 'Năng động', desc: 'Tập cường độ cao 6-7 buổi/tuần' },
                  ].map((act) => (
                    <label
                      key={act.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        activityLevel === act.id
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                          : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      <div>
                        <span className="font-semibold block">{act.label}</span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">
                          {act.desc}
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="actLevel"
                        checked={activityLevel === act.id}
                        onChange={() => setActivityLevel(act.id as any)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Thời gian có thể tập (phút/ngày)
                  </label>
                  <select
                    value={workoutTime}
                    onChange={(e) => setWorkoutTime(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value={15}>15 phút</option>
                    <option value={25}>25 - 30 phút</option>
                    <option value={45}>45 phút</option>
                    <option value={60}>60 phút</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Địa điểm tập ưa thích
                  </label>
                  <select
                    value={workoutLocation}
                    onChange={(e) => setWorkoutLocation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="home">Tại nhà</option>
                    <option value="outdoor">Ngoài trời / Công viên</option>
                    <option value="gym">Phòng gym</option>
                    <option value="flexible">Linh hoạt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Dụng cụ tập hiện có
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Không cần dụng cụ', 'Thảm tập yoga', 'Tạ tay nhỏ', 'Dây kháng lực', 'Xe đạp'].map(
                    (eq) => {
                      const active = availableEquipment.includes(eq);
                      return (
                        <button
                          key={eq}
                          type="button"
                          onClick={() => toggleEquipment(eq)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            active
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {eq}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DIET & COOKING */}
          {step === 4 && (
            <div className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Sở thích ẩm thực
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Cơm gia đình Việt', 'Món nước / bún phở', 'Ít dầu mỡ', 'Nhiều rau xanh', 'Ăn chay / Bán chay'].map(
                    (pref) => {
                      const active = dietaryPreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            if (active) {
                              setDietaryPreferences(dietaryPreferences.filter((p) => p !== pref));
                            } else {
                              setDietaryPreferences([...dietaryPreferences, pref]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            active
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Dị ứng thực phẩm (nếu có)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Hải sản / Tôm cua', 'Đậu phộng (lạc)', 'Trứng', 'Đậu nành', 'Sữa bò', 'Thịt bò'].map(
                    (all) => {
                      const active = allergies.includes(all);
                      return (
                        <button
                          key={all}
                          type="button"
                          onClick={() => toggleAllergy(all)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                            active
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {all}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Món ăn không thích hoặc muốn tránh
                </label>
                <input
                  type="text"
                  value={dislikedFoods}
                  onChange={(e) => setDislikedFoods(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder="Ví dụ: Khổ qua, lòng mề, rau mùi..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Thời gian chuẩn bị nấu
                  </label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="under_20">Nhanh gọn dưới 20 phút</option>
                    <option value="20_45">20 - 45 phút vừa phải</option>
                    <option value="over_45">Thong thả trên 45 phút</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Ngân sách đi chợ
                  </label>
                  <select
                    value={budgetLevel}
                    onChange={(e) => setBudgetLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="economic">Tiết kiệm, bình dân</option>
                    <option value="medium">Vừa phải, đa dạng</option>
                    <option value="comfortable">Thoải mái</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SCHEDULE & DISPLAY SETTINGS */}
          {step === 5 && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Giờ thức dậy quen thuộc
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Giờ đi ngủ dự kiến
                  </label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Tùy chọn trải nghiệm thư thái</span>
                </h4>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideCalories}
                    onChange={(e) => setHideCalories(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      Ẩn chỉ số Calo (Chế độ thuần thói quen)
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      Thích hợp nếu bạn muốn giảm áp lực con số, tập trung vào việc ăn no lành mạnh và đủ chất.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideWeight}
                    onChange={(e) => setHideWeight(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      Ẩn số đo cân nặng trên trang chủ
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      Giúp bạn không bị ám ảnh bởi sự dao động nước tự nhiên trong ngày của cơ thể.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="py-2 px-3.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-200 dark:shadow-none transition-all ml-auto"
          >
            <span>{step === totalSteps ? 'Hoàn tất & Bắt đầu' : 'Tiếp theo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
