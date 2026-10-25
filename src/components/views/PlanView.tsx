import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ShoppingCart,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  Shuffle,
  Users,
  Utensils,
  Trash2,
} from 'lucide-react';
import { MealPlanDay, MealPlanRecipe, ShoppingItem, MealItem } from '../../types';
import {
  getMealPlans,
  saveMealPlanDay,
  getShoppingList,
  toggleShoppingItem,
  saveShoppingItem,
  deleteShoppingItem,
  saveMeal,
} from '../../utils/storage';
import { VIETNAMESE_FOODS_DATABASE } from '../../data/vietnameseFoods';

interface PlanViewProps {
  userId: string;
  selectedDate: string;
  onRefreshData: () => void;
  hideCalories?: boolean;
}

export const PlanView: React.FC<PlanViewProps> = ({
  userId,
  selectedDate,
  onRefreshData,
  hideCalories = false,
}) => {
  const [activeTab, setActiveTab] = useState<'meal_plan' | 'shopping_list'>('meal_plan');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  // New Shopping Item state
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('500g');
  const [newItemCategory, setNewItemCategory] = useState('Rau củ');

  // Confirmation modal for logging recipe to journal
  const [eatenConfirmationRecipe, setEatenConfirmationRecipe] = useState<MealPlanRecipe | null>(null);
  const [loggedSuccessMessage, setLoggedSuccessMessage] = useState('');

  // Plans & Shopping list from storage
  const plans = useMemo(() => getMealPlans(userId), [userId]);
  const currentPlanDay = plans[selectedDayIndex] || plans[0];

  const shoppingList = useMemo(() => getShoppingList(userId), [userId]);

  // Group shopping list by category
  const groupedShopping = useMemo(() => {
    const map = new Map<string, ShoppingItem[]>();
    shoppingList.forEach((item) => {
      const cat = item.category || 'Khác';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    });
    return map;
  }, [shoppingList]);

  // Handle Log Eaten Recipe to Journal
  const handleConfirmLogToJournal = () => {
    if (!eatenConfirmationRecipe) return;

    const mealItem: MealItem = {
      id: `meal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      date: selectedDate,
      mealType: eatenConfirmationRecipe.mealType,
      name: eatenConfirmationRecipe.title,
      portionQuantity: servingsMultiplier,
      portionUnit: `${servingsMultiplier} phần ăn`,
      calories: Math.round(eatenConfirmationRecipe.caloriesPerServing * servingsMultiplier),
      protein: Math.round(eatenConfirmationRecipe.macros.protein * servingsMultiplier),
      carbs: Math.round(eatenConfirmationRecipe.macros.carbs * servingsMultiplier),
      fat: Math.round(eatenConfirmationRecipe.macros.fat * servingsMultiplier),
      fiber: Math.round(eatenConfirmationRecipe.macros.fiber * servingsMultiplier),
      notes: `Chuyển từ Kế hoạch thực đơn (${eatenConfirmationRecipe.source})`,
      source: eatenConfirmationRecipe.source,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveMeal(mealItem);
    setLoggedSuccessMessage(`Đã ghi nhận "${eatenConfirmationRecipe.title}" vào Nhật ký ăn uống ngày ${selectedDate}!`);
    setEatenConfirmationRecipe(null);
    onRefreshData();

    setTimeout(() => {
      setLoggedSuccessMessage('');
    }, 4000);
  };

  // Swap dish with another Vietnamese dish from database
  const handleSwapDish = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const randomFood = VIETNAMESE_FOODS_DATABASE[Math.floor(Math.random() * VIETNAMESE_FOODS_DATABASE.length)];
    const updatedRecipe: MealPlanRecipe = {
      id: `swap-${Date.now()}`,
      title: randomFood.name,
      mealType,
      servings: 1,
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      caloriesPerServing: randomFood.calories,
      macros: {
        protein: randomFood.protein,
        carbs: randomFood.carbs,
        fat: randomFood.fat,
        fiber: randomFood.fiber || 0,
      },
      ingredients: [
        { name: randomFood.name, amount: randomFood.standardPortion, category: 'Thực phẩm chính' },
        { name: 'Rau thơm, gia vị nêm', amount: 'Vừa đủ', category: 'Rau củ' },
      ],
      instructions: [
        `Chuẩn bị nguyên liệu cho món ${randomFood.name}.`,
        'Thực hiện theo phong cách nấu gia đình thanh nhẹ, giảm muối và dầu mỡ.',
        'Thưởng thức cùng rau ghém thanh mát.',
      ],
      source: randomFood.source,
    };

    const updatedDay: MealPlanDay = {
      ...currentPlanDay,
      [mealType]: updatedRecipe,
    };

    saveMealPlanDay(updatedDay, userId);
    onRefreshData();
  };

  // Add custom grocery item
  const handleAddGroceryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const item: ShoppingItem = {
      id: `shop-${Date.now()}`,
      userId,
      name: newItemName.trim(),
      amount: newItemAmount.trim() || '1 phần',
      category: newItemCategory,
      isBought: false,
      createdAt: new Date().toISOString(),
    };

    saveShoppingItem(item);
    setNewItemName('');
    onRefreshData();
  };

  const handleToggleBought = (id: string) => {
    toggleShoppingItem(id, userId);
    onRefreshData();
  };

  const handleDeleteItem = (id: string) => {
    deleteShoppingItem(id, userId);
    onRefreshData();
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* Header and Sub Tabs */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            Kế hoạch ăn uống & Đi chợ
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Thực đơn món Việt cân bằng, thanh đạm và dễ chuẩn bị
          </span>
        </div>

        {/* View Switcher */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('meal_plan')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'meal_plan'
                ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-300 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Thực đơn</span>
          </button>
          <button
            onClick={() => setActiveTab('shopping_list')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'shopping_list'
                ? 'bg-white dark:bg-stone-700 text-rose-600 dark:text-rose-300 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Đi chợ ({shoppingList.filter((s) => !s.isBought).length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {loggedSuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{loggedSuccessMessage}</span>
        </div>
      )}

      {/* TAB 1: MEAL PLAN */}
      {activeTab === 'meal_plan' && (
        <div className="space-y-4">
          {/* Day of Week Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {plans.map((p, idx) => (
              <button
                key={p.dayOfWeek}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDayIndex === idx
                    ? 'border-rose-500 bg-rose-600 text-white shadow-sm'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                }`}
              >
                {p.dayOfWeek}
              </button>
            ))}
          </div>

          {/* Servings Adjuster */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                Điều chỉnh số người ăn:
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 4].map((serv) => (
                <button
                  key={serv}
                  onClick={() => setServingsMultiplier(serv)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                    servingsMultiplier === serv
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {serv} người
                </button>
              ))}
            </div>
          </div>

          {/* Meal Cards: Breakfast, Lunch, Dinner */}
          {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
            const recipe = currentPlanDay[mealType];
            if (!recipe) return null;

            const mealTitles = {
              breakfast: 'Bữa Sáng',
              lunch: 'Bữa Trưa',
              dinner: 'Bữa Tối',
            };

            return (
              <div
                key={mealType}
                className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      {mealTitles[mealType]}
                    </span>
                    <span className="text-[10px] text-stone-400">· {recipe.prepTimeMinutes + recipe.cookTimeMinutes} phút chuẩn bị</span>
                  </div>

                  <button
                    onClick={() => handleSwapDish(mealType)}
                    className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-300 text-xs flex items-center gap-1 transition-colors"
                    title="Đổi món ngẫu nhiên từ kho món Việt"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Đổi món khác</span>
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {recipe.title}
                  </h3>
                  {!hideCalories && (
                    <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                        {Math.round(recipe.caloriesPerServing * servingsMultiplier)} kcal
                      </span>
                      <span>Đạm: {(recipe.macros.protein * servingsMultiplier).toFixed(1)}g</span>
                      <span>Carbs: {(recipe.macros.carbs * servingsMultiplier).toFixed(1)}g</span>
                      <span>Béo: {(recipe.macros.fat * servingsMultiplier).toFixed(1)}g</span>
                    </div>
                  )}
                </div>

                {/* Ingredients snippet */}
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-700/60 text-xs">
                  <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1">
                    Nguyên liệu ({servingsMultiplier} phần):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-white dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                      >
                        {ing.name} ({ing.amount})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instructions Accordion / Summary */}
                <div className="text-[11px] text-stone-600 dark:text-stone-300 space-y-1">
                  {recipe.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="font-bold text-rose-500">{i + 1}.</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>

                {/* Action: Log to Journal after eating */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">Nguồn: {recipe.source}</span>
                  <button
                    onClick={() => setEatenConfirmationRecipe(recipe)}
                    className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã ăn món này · Ghi vào nhật ký</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CONSOLIDATED SHOPPING LIST */}
      {activeTab === 'shopping_list' && (
        <div className="space-y-4">
          {/* Add custom item form */}
          <form
            onSubmit={handleAddGroceryItem}
            className="p-3.5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-2 text-xs"
          >
            <span className="font-bold text-stone-900 dark:text-stone-100 block">
              Thêm đồ cần mua vào giỏ
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Tên nguyên liệu (ví dụ: bắp chuối, đậu hũ...)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
              <input
                type="text"
                placeholder="Số lượng (500g, 1 bó)"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-700 dark:text-stone-300"
              >
                <option value="Rau củ">Rau củ & Thảo mộc</option>
                <option value="Thịt & Hải sản">Thịt & Hải sản</option>
                <option value="Tinh bột">Gạo & Bún phở</option>
                <option value="Gia vị & Khô">Gia vị & Đồ khô</option>
                <option value="Trái cây">Trái cây</option>
              </select>

              <button
                type="submit"
                disabled={!newItemName.trim()}
                className="py-1.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-semibold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </form>

          {/* Grouped Shopping Items */}
          <div className="space-y-3">
            {Array.from(groupedShopping.entries()).map(([category, items]) => (
              <div
                key={category}
                className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-2"
              >
                <h4 className="font-bold text-xs text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  {category} ({items.filter((i) => !i.isBought).length} món cần mua)
                </h4>

                <div className="space-y-1.5 divide-y divide-stone-100 dark:divide-stone-700/60">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="pt-1.5 flex items-center justify-between group cursor-pointer"
                      onClick={() => handleToggleBought(item.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={item.isBought}
                          onChange={() => handleToggleBought(item.id)}
                          className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`text-xs ${
                            item.isBought
                              ? 'line-through text-stone-400 dark:text-stone-500'
                              : 'font-medium text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                          {item.amount}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(item.id);
                          }}
                          className="opacity-20 group-hover:opacity-100 hover:text-rose-600 p-1 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal: Log Recipe to Journal */}
      {eatenConfirmationRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800 space-y-3">
            <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Xác nhận đã ăn món này?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Bạn có muốn đưa món <strong>"{eatenConfirmationRecipe.title}"</strong> ({servingsMultiplier} phần) vào Nhật ký ăn uống ngày <strong>{selectedDate}</strong> không?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEatenConfirmationRecipe(null)}
                className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmLogToJournal}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 dark:shadow-none"
              >
                Xác nhận lưu vào nhật ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
