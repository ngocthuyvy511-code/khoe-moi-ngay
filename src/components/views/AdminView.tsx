import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Database,
  Activity,
  MessageSquare,
  BarChart3,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { FoodDatabaseItem, FeedbackReport } from '../../types';
import {
  getAllFoods,
  saveAdminCustomFood,
  deleteAdminCustomFood,
  getFeedbackReports,
} from '../../utils/storage';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

interface AdminViewProps {
  onBackToApp: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<'foods' | 'exercises' | 'feedback' | 'analytics'>('foods');

  // Foods
  const [foods, setFoods] = useState<FoodDatabaseItem[]>(getAllFoods());
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPortion, setNewFoodPortion] = useState('1 tô vừa (500g)');
  const [newFoodCategory, setNewFoodCategory] = useState<FoodDatabaseItem['category']>('family_dishes');
  const [newFoodCalories, setNewFoodCalories] = useState(380);
  const [newFoodProtein, setNewFoodProtein] = useState(20);
  const [newFoodCarbs, setNewFoodCarbs] = useState(50);
  const [newFoodFat, setNewFoodFat] = useState(10);
  const [newFoodFiber, setNewFoodFiber] = useState(3);
  const [newFoodSource, setNewFoodSource] = useState('Dữ liệu kiểm duyệt Admin');

  // Feedback
  const [feedbackList, setFeedbackList] = useState<FeedbackReport[]>(getFeedbackReports());

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;

    const categoryLabels: Record<string, string> = {
      noodles: 'Món sợi & nước dùng',
      rice: 'Cơm & Xôi',
      bread_rolls: 'Bánh mì & cuốn',
      family_dishes: 'Canh & món kho gia đình',
      dessert_drinks: 'Tráng miệng & Đồ uống',
      healthy_snacks: 'Ăn vặt & Trái cây',
    };

    const item: FoodDatabaseItem = {
      id: `admin-food-${Date.now()}`,
      name: newFoodName.trim(),
      category: newFoodCategory,
      categoryLabel: categoryLabels[newFoodCategory] || 'Món gia đình',
      standardPortion: newFoodPortion,
      calories: Number(newFoodCalories),
      protein: Number(newFoodProtein),
      carbs: Number(newFoodCarbs),
      fat: Number(newFoodFat),
      fiber: Number(newFoodFiber),
      source: newFoodSource,
      verified: true,
    };

    saveAdminCustomFood(item);
    setFoods(getAllFoods());
    setNewFoodName('');
  };

  const handleDeleteFood = (id: string) => {
    deleteAdminCustomFood(id);
    setFoods(getAllFoods());
  };

  return (
    <div className="space-y-4 pb-24 pt-1 max-w-4xl mx-auto">
      {/* Top Admin Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToApp}
            className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            title="Quay lại ứng dụng"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Cổng Quản Trị Hệ Thống (Admin Portal)
              </h2>
            </div>
            <span className="text-[10px] text-stone-400">
              Quản lý danh mục dinh dưỡng & Kiểm duyệt nội dung cộng đồng
            </span>
          </div>
        </div>

        <button
          onClick={onBackToApp}
          className="px-3 py-1.5 rounded-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold"
        >
          Về ứng dụng
        </button>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Quy chuẩn bảo vệ người dùng:</strong> Quản trị viên chỉ quản lý cơ sở dữ liệu chung (danh mục món ăn, bài tập, công thức kiểm duyệt, phản hồi vận hành). Tuyệt đối không hiển thị nhật ký cá nhân, số đo hay ảnh của người dùng trên cổng quản trị.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('foods')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'foods'
              ? 'bg-white dark:bg-stone-700 text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Kho món Việt ({foods.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'exercises'
              ? 'bg-white dark:bg-stone-700 text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Thư viện bài tập</span>
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-white dark:bg-stone-700 text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Phản hồi ({feedbackList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-white dark:bg-stone-700 text-rose-600 shadow-sm'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Thống kê</span>
        </button>
      </div>

      {/* TAB 1: FOOD DATABASE MANAGEMENT */}
      {activeTab === 'foods' && (
        <div className="space-y-4 text-xs">
          {/* Add Food Form */}
          <form
            onSubmit={handleAddFood}
            className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm space-y-3"
          >
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-500" />
              <span>Thêm món ăn mới vào kho dữ liệu chính thức</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Tên món ăn
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bún mắm miền Tây"
                  value={newFoodName}
                  onChange={(e) => setNewFoodName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Phân loại món
                </label>
                <select
                  value={newFoodCategory}
                  onChange={(e) => setNewFoodCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                >
                  <option value="noodles">Món sợi & nước dùng</option>
                  <option value="rice">Cơm & Xôi</option>
                  <option value="bread_rolls">Bánh mì & cuốn</option>
                  <option value="family_dishes">Canh & món kho gia đình</option>
                  <option value="dessert_drinks">Tráng miệng & Đồ uống</option>
                  <option value="healthy_snacks">Ăn vặt & Trái cây</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Khẩu phần chuẩn</label>
                <input
                  type="text"
                  value={newFoodPortion}
                  onChange={(e) => setNewFoodPortion(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Năng lượng (kcal)</label>
                <input
                  type="number"
                  value={newFoodCalories}
                  onChange={(e) => setNewFoodCalories(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 font-bold text-rose-600"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Nguồn xác thực</label>
                <input
                  type="text"
                  value={newFoodSource}
                  onChange={(e) => setNewFoodSource(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Đạm (g)</label>
                <input
                  type="number"
                  value={newFoodProtein}
                  onChange={(e) => setNewFoodProtein(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Carbs (g)</label>
                <input
                  type="number"
                  value={newFoodCarbs}
                  onChange={(e) => setNewFoodCarbs(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Béo (g)</label>
                <input
                  type="number"
                  value={newFoodFat}
                  onChange={(e) => setNewFoodFat(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 mb-0.5">Chất xơ (g)</label>
                <input
                  type="number"
                  value={newFoodFiber}
                  onChange={(e) => setNewFoodFiber(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors"
            >
              Lưu vào cơ sở dữ liệu
            </button>
          </form>

          {/* Existing Food List */}
          <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
            <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-2">
              Danh mục món ăn hiện hành ({foods.length} món)
            </h3>
            <div className="max-h-96 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-700/60">
              {foods.map((food) => (
                <div key={food.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                      {food.name}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      {food.standardPortion} · {food.categoryLabel} · Nguồn: {food.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-600 text-xs tabular-nums">
                      {food.calories} kcal
                    </span>
                    {food.id.startsWith('admin-food-') && (
                      <button
                        onClick={() => handleDeleteFood(food.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Xóa món custom"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISES */}
      {activeTab === 'exercises' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
          <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100">
            Danh mục bài tập đã kiểm duyệt ({EXERCISE_LIBRARY.length} bài)
          </h3>
          <div className="space-y-2">
            {EXERCISE_LIBRARY.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </span>
                  <span className="text-emerald-600 font-bold">{item.caloriesBurnPerMin} kcal/phút</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Dụng cụ: {item.equipment} · Đề xuất: {item.recommendedDurationMin} phút
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
          <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100">
            Hộp thư phản hồi & Đóng góp từ người dùng
          </h3>
          {feedbackList.length > 0 ? (
            <div className="space-y-2">
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-rose-600">{fb.userEmail}</span>
                    <span className="text-[10px] text-stone-400">{fb.createdAt.split('T')[0]}</span>
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{fb.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 py-6 text-center">Chưa có phản hồi mới nào cần xử lý.</p>
          )}
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
          <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100">
            Thống kê vận hành tổng hợp (Không định danh)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block">Tổng món ăn Việt</span>
              <span className="text-xl font-bold text-stone-900 dark:text-stone-100">{foods.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block">Bài tập vận động</span>
              <span className="text-xl font-bold text-emerald-600">{EXERCISE_LIBRARY.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block">Mô hình AI</span>
              <span className="text-xs font-bold text-rose-600 block mt-1">Gemini 3.8 Flash</span>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-700">
              <span className="text-[10px] text-stone-400 block">Bảo mật dữ liệu</span>
              <span className="text-xs font-bold text-sky-600 block mt-1">Phân quyền riêng tư</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
