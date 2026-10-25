import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Camera,
  Plus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Utensils,
  Loader2,
  FileText,
  Clock,
} from 'lucide-react';
import { MealItem, MealType, FoodDatabaseItem } from '../../types';
import { getAllFoods, saveMeal } from '../../utils/storage';
import { removeVietnameseAccents } from '../../utils/nutrition';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  selectedDate: string;
  defaultMealType?: MealType;
  onMealAdded: (meal: MealItem) => void;
}

export const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  userId,
  selectedDate,
  defaultMealType = 'breakfast',
  onMealAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'ai_photo' | 'custom'>('database');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);

  // Database search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [customPortionNote, setCustomPortionNote] = useState('');

  // AI Photo state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [userPhotoNote, setUserPhotoNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState<{
    dishName: string;
    portionDescription: string;
    estimatedCalories: number;
    macros: { protein: number; carbs: number; fat: number; fiber: number };
    ingredients: Array<{ name: string; estimatedAmount: string }>;
    healthTip?: string;
    allergyWarnings?: string[];
    disclaimer?: string;
    isSimulated?: boolean;
  } | null>(null);

  // Custom Dish State
  const [customName, setCustomName] = useState('');
  const [customPortion, setCustomPortion] = useState('1 phần ăn');
  const [customCalories, setCustomCalories] = useState(350);
  const [customProtein, setCustomProtein] = useState(15);
  const [customCarbs, setCustomCarbs] = useState(45);
  const [customFat, setCustomFat] = useState(10);
  const [customFiber, setCustomFiber] = useState(3);
  const [customNotes, setCustomNotes] = useState('');

  const allFoods = useMemo(() => getAllFoods(), []);

  // Filter foods
  const filteredFoods = useMemo(() => {
    let list = allFoods;
    if (selectedCategory !== 'all') {
      list = list.filter((f) => f.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = removeVietnameseAccents(searchQuery);
      list = list.filter((f) => {
        const nameClean = removeVietnameseAccents(f.name);
        const ingClean = removeVietnameseAccents(f.ingredientsSummary || '');
        return nameClean.includes(q) || ingClean.includes(q);
      });
    }
    return list;
  }, [allFoods, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Handle Photo selection
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      setAiResult(null);
      setAiError('');
    };
    reader.readAsDataURL(file);
  };

  // Trigger AI Analysis
  const handleAnalyzePhoto = async () => {
    if (!photoBase64) return;
    setIsAnalyzing(true);
    setAiError('');

    try {
      const res = await fetch('/api/analyze-food-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64,
          mimeType: photoMimeType,
          userNotes: userPhotoNote,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Lỗi nhận diện');
      }

      setAiResult(data);
    } catch (err: any) {
      setAiError(err.message || 'Không thể kết nối dịch vụ nhận diện AI. Vui lòng thử lại.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save selected database food
  const handleSaveDatabaseFood = () => {
    if (!selectedFood) return;
    const item: MealItem = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date: selectedDate,
      mealType,
      name: selectedFood.name,
      portionQuantity: portionMultiplier,
      portionUnit: selectedFood.standardPortion,
      servingGrams: selectedFood.servingGrams ? Math.round(selectedFood.servingGrams * portionMultiplier) : undefined,
      calories: Math.round(selectedFood.calories * portionMultiplier),
      protein: parseFloat((selectedFood.protein * portionMultiplier).toFixed(1)),
      carbs: parseFloat((selectedFood.carbs * portionMultiplier).toFixed(1)),
      fat: parseFloat((selectedFood.fat * portionMultiplier).toFixed(1)),
      fiber: selectedFood.fiber ? parseFloat((selectedFood.fiber * portionMultiplier).toFixed(1)) : 0,
      notes: customPortionNote,
      source: selectedFood.source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMeal(item);
    onMealAdded(item);
    onClose();
  };

  // Save AI Recognized meal after confirmation
  const handleSaveAiMeal = () => {
    if (!aiResult) return;
    const item: MealItem = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date: selectedDate,
      mealType,
      name: aiResult.dishName,
      portionQuantity: 1,
      portionUnit: aiResult.portionDescription,
      calories: Math.round(aiResult.estimatedCalories),
      protein: aiResult.macros?.protein || 0,
      carbs: aiResult.macros?.carbs || 0,
      fat: aiResult.macros?.fat || 0,
      fiber: aiResult.macros?.fiber || 0,
      notes: `${aiResult.healthTip ? `Lời khuyên: ${aiResult.healthTip}` : ''} (Ảnh AI nhận diện)`,
      photoUrl: photoBase64 || undefined,
      source: 'Gemini AI Vision (Ước tính đã xác nhận)',
      isAiEstimated: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMeal(item);
    onMealAdded(item);
    onClose();
  };

  // Save Custom Meal
  const handleSaveCustomMeal = () => {
    if (!customName.trim()) return;
    const item: MealItem = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date: selectedDate,
      mealType,
      name: customName.trim(),
      portionQuantity: 1,
      portionUnit: customPortion,
      calories: Number(customCalories) || 0,
      protein: Number(customProtein) || 0,
      carbs: Number(customCarbs) || 0,
      fat: Number(customFat) || 0,
      fiber: Number(customFiber) || 0,
      notes: customNotes,
      source: 'Món ăn tự tạo cá nhân',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMeal(item);
    onMealAdded(item);
    onClose();
  };

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: 'Bữa Sáng',
    lunch: 'Bữa Trưa',
    dinner: 'Bữa Tối',
    snack: 'Bữa Phụ',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-rose-100 dark:border-stone-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-rose-500" />
              <span>Ghi nhận bữa ăn · {mealTypeLabels[mealType]}</span>
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Ngày ghi nhận: {selectedDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type Selector Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl my-3">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
            <button
              key={t}
              onClick={() => setMealType(t)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mealType === t
                  ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-300 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              {mealTypeLabels[t]}
            </button>
          ))}
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 mb-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex-1 py-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Món Việt có sẵn</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_photo')}
            className={`flex-1 py-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ai_photo'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            <span>Quét ảnh AI</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tự nhập món</span>
          </button>
        </div>

        {/* TAB 1: DATABASE SEARCH */}
        {activeTab === 'database' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm món Việt (phở, bún bò, cơm tấm, bánh mì, canh chua...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'noodles', label: 'Bún / Phở' },
                { id: 'rice', label: 'Cơm / Xôi' },
                { id: 'bread_rolls', label: 'Bánh mì / Cuốn' },
                { id: 'family_dishes', label: 'Món gia đình' },
                { id: 'dessert_drinks', label: 'Đồ uống' },
                { id: 'healthy_snacks', label: 'Trái cây & Ăn vặt' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-rose-600 text-white font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Selected Food Details Card (If user tapped a dish) */}
            {selectedFood && (
              <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2.5 animate-in fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {selectedFood.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      Khẩu phần chuẩn: {selectedFood.standardPortion}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedFood(null)}
                    className="text-stone-400 hover:text-stone-600 text-xs"
                  >
                    Bỏ chọn
                  </button>
                </div>

                {/* Multiplier */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Số lượng ăn:
                  </span>
                  <div className="flex items-center gap-1">
                    {[0.5, 1, 1.5, 2].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPortionMultiplier(num)}
                        className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                          portionMultiplier === num
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {num === 0.5 ? '1/2' : `${num}x`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="grid grid-cols-4 gap-2 text-center py-2 bg-white/80 dark:bg-stone-800/80 rounded-xl border border-rose-100 dark:border-stone-700/60">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Năng lượng</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                      {Math.round(selectedFood.calories * portionMultiplier)} kcal
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Đạm (P)</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {(selectedFood.protein * portionMultiplier).toFixed(1)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Đường bột (C)</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {(selectedFood.carbs * portionMultiplier).toFixed(1)}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Béo (F)</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {(selectedFood.fat * portionMultiplier).toFixed(1)}g
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Ghi chú thêm (ví dụ: ăn nhiều rau, không lấy nước béo...)"
                  value={customPortionNote}
                  onChange={(e) => setCustomPortionNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />

                <button
                  type="button"
                  onClick={handleSaveDatabaseFood}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận thêm vào {mealTypeLabels[mealType]}</span>
                </button>
              </div>
            )}

            {/* Food List */}
            <div className="space-y-1.5 divide-y divide-stone-100 dark:divide-stone-800">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setPortionMultiplier(1);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                    selectedFood?.id === food.id
                      ? 'bg-rose-50 dark:bg-rose-950/30'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{food.name}</span>
                      {food.verified && (
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded font-medium">
                          Chuẩn
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                      {food.standardPortion} · {food.categoryLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-600 dark:text-rose-400 block tabular-nums">
                      {food.calories} kcal
                    </span>
                    <span className="text-[10px] text-stone-400 block tabular-nums">
                      P: {food.protein}g · C: {food.carbs}g · F: {food.fat}g
                    </span>
                  </div>
                </div>
              ))}

              {filteredFoods.length === 0 && (
                <div className="py-8 text-center text-stone-400">
                  <p>Không tìm thấy món ăn phù hợp với từ khóa.</p>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className="text-xs text-rose-600 dark:text-rose-400 font-medium underline mt-1.5"
                  >
                    Tự nhập món ăn này ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AI PHOTO SCANNER */}
        {activeTab === 'ai_photo' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {/* Image Preview & Upload Container */}
            <div className="border-2 border-dashed border-rose-200 dark:border-stone-700 rounded-2xl p-4 text-center hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors relative">
              {photoBase64 ? (
                <div className="space-y-3">
                  <img
                    src={photoBase64}
                    alt="Ảnh món ăn"
                    className="max-h-52 mx-auto rounded-xl object-cover shadow-sm"
                  />
                  <div className="flex justify-center gap-2">
                    <label className="py-1 px-3 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 cursor-pointer font-medium text-xs">
                      Đổi ảnh khác
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block py-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center mb-2 shadow-sm">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm text-stone-800 dark:text-stone-200 block">
                    Chụp hoặc tải ảnh món ăn
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-1">
                    AI Gemini sẽ nhận diện món Việt và ước tính dinh dưỡng tham khảo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Note for AI */}
            {photoBase64 && !aiResult && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Thêm mô tả nếu cần (ví dụ: bún riêu cua 1 tô vừa, ít dầu mỡ...)"
                  value={userPhotoNote}
                  onChange={(e) => setUserPhotoNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                />

                <button
                  type="button"
                  onClick={handleAnalyzePhoto}
                  disabled={isAnalyzing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 dark:shadow-none transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang phân tích món ăn với Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-rose-200" />
                      <span>Bắt đầu phân tích hình ảnh</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {aiError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{aiError}</span>
              </div>
            )}

            {/* AI Result Card */}
            {aiResult && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-rose-200 dark:border-stone-700 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      Kết quả nhận diện tham khảo
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {aiResult.isSimulated ? 'Mẫu thử' : 'Gemini Vision'}
                  </span>
                </div>

                {/* Editable Fields */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Tên món ăn (Bạn có thể sửa nếu cần)
                  </label>
                  <input
                    type="text"
                    value={aiResult.dishName}
                    onChange={(e) => setAiResult({ ...aiResult, dishName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Khẩu phần ước tính
                    </label>
                    <input
                      type="text"
                      value={aiResult.portionDescription}
                      onChange={(e) =>
                        setAiResult({ ...aiResult, portionDescription: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Năng lượng ước tính (kcal)
                    </label>
                    <input
                      type="number"
                      value={aiResult.estimatedCalories}
                      onChange={(e) =>
                        setAiResult({
                          ...aiResult,
                          estimatedCalories: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 font-bold text-rose-600"
                    />
                  </div>
                </div>

                {/* Macro breakdown */}
                <div className="grid grid-cols-4 gap-1.5 text-center py-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Đạm</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {aiResult.macros?.protein || 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Carbs</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {aiResult.macros?.carbs || 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Chất béo</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {aiResult.macros?.fat || 0}g
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Chất xơ</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {aiResult.macros?.fiber || 0}g
                    </span>
                  </div>
                </div>

                {/* Tip & Allergy Notes */}
                {aiResult.healthTip && (
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/40">
                    💡 <strong>Gợi ý:</strong> {aiResult.healthTip}
                  </p>
                )}

                {/* Strict Disclaimer requirement */}
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-[10px] text-amber-900 dark:text-amber-200 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Lưu ý:</strong> Ảnh chụp không phản ánh chính xác lượng dầu mỡ, đường ẩn hay khối lượng tuyệt đối. Vui lòng xác nhận trước khi lưu vào nhật ký. Không dùng tính năng này để khẳng định an toàn dị ứng.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAiMeal}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận & Lưu vào {mealTypeLabels[mealType]}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CUSTOM MEAL */}
        {activeTab === 'custom' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tên món ăn hoặc bữa cơm
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Cơm nhà mẹ nấu (canh bầu, thịt luộc)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Khẩu phần
                </label>
                <input
                  type="text"
                  placeholder="1 phần / 1 bát vừa"
                  value={customPortion}
                  onChange={(e) => setCustomPortion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Năng lượng (kcal, tùy chọn)
                </label>
                <input
                  type="number"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold text-rose-600"
                />
              </div>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
              <span className="font-semibold block text-stone-700 dark:text-stone-300">
                Chỉ số dinh dưỡng đa lượng (gam)
              </span>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Đạm (P)</label>
                  <input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-center font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Carbs (C)</label>
                  <input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-center font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Béo (F)</label>
                  <input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-center font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">Xơ (Fiber)</label>
                  <input
                    type="number"
                    value={customFiber}
                    onChange={(e) => setCustomFiber(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-center font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Ghi chú cảm nhận hoặc nguyên liệu
              </label>
              <textarea
                rows={2}
                placeholder="Ăn no thoải mái, vị thanh nhẹ..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleSaveCustomMeal}
              disabled={!customName.trim()}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-rose-200 dark:shadow-none transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu món này vào {mealTypeLabels[mealType]}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
