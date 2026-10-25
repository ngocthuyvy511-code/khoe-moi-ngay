import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Download,
  Trash2,
  Shield,
  HelpCircle,
  Eye,
  EyeOff,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  Lock,
} from 'lucide-react';
import { UserProfile, FeedbackReport } from '../../types';
import {
  saveUserProfile,
  exportAllUserData,
  resetOrDeleteUserData,
  saveFeedbackReport,
} from '../../utils/storage';

interface ProfileViewProps {
  user: UserProfile;
  onUserUpdated: (user: UserProfile) => void;
  onOpenOnboarding: () => void;
  onOpenAuthModal: () => void;
  onNavigateToAdmin: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUserUpdated,
  onOpenOnboarding,
  onOpenAuthModal,
  onNavigateToAdmin,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Toggle Units
  const handleToggleUnit = (unit: 'metric' | 'imperial') => {
    const updated: UserProfile = {
      ...user,
      displayPreferences: {
        ...user.displayPreferences,
        unitSystem: unit,
      },
    };
    saveUserProfile(updated);
    onUserUpdated(updated);
  };

  // Toggle Hide Calories
  const handleToggleHideCalories = (val: boolean) => {
    const updated: UserProfile = {
      ...user,
      displayPreferences: {
        ...user.displayPreferences,
        hideCalories: val,
      },
    };
    saveUserProfile(updated);
    onUserUpdated(updated);
  };

  // Toggle Hide Weight
  const handleToggleHideWeight = (val: boolean) => {
    const updated: UserProfile = {
      ...user,
      displayPreferences: {
        ...user.displayPreferences,
        hideWeight: val,
      },
    };
    saveUserProfile(updated);
    onUserUpdated(updated);
  };

  // Toggle Notification
  const handleToggleNotification = (key: keyof UserProfile['notifications']) => {
    const updated: UserProfile = {
      ...user,
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    };
    saveUserProfile(updated);
    onUserUpdated(updated);
  };

  // Export JSON
  const handleExportData = () => {
    const dataStr = exportAllUserData(user.id);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khoe_moi_ngay_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Delete Data
  const handleConfirmDelete = () => {
    resetOrDeleteUserData(user.id);
    window.location.reload();
  };

  // Submit Feedback
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const report: FeedbackReport = {
      id: `fb-${Date.now()}`,
      userId: user.id,
      userEmail: user.email,
      type: 'feature',
      message: feedbackText.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    saveFeedbackReport(report);
    setFeedbackText('');
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="space-y-4 pb-24 pt-1">
      {/* 1. Profile Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-rose-200 dark:shadow-none">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {user.name}
              </h2>
              {user.isDemo && (
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.2 rounded-full font-semibold">
                  Tài khoản mẫu
                </span>
              )}
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400 block">{user.email}</span>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium block mt-0.5">
              Mục tiêu: {user.primaryGoal === 'manage_weight' ? 'Quản lý cân nặng nhẹ nhàng' : 'Xây dựng lối sống lành mạnh'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-750 text-xs font-semibold transition-colors"
        >
          Sửa hồ sơ
        </button>
      </div>

      {/* 2. Display & Unit Preferences */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3.5 text-xs">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Settings className="w-4 h-4 text-rose-500" />
          <span>Tùy chọn hiển thị & Đơn vị đo</span>
        </h3>

        {/* Unit Selector */}
        <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
          <div>
            <span className="font-semibold text-stone-800 dark:text-stone-200 block">
              Hệ thống đơn vị
            </span>
            <span className="text-[11px] text-stone-400">
              {user.displayPreferences?.unitSystem === 'imperial'
                ? 'Hệ Anh-Mỹ (Pound, Feet, Oz)'
                : 'Hệ Mét tiêu chuẩn (kg, cm, ml)'}
            </span>
          </div>
          <div className="flex bg-stone-100 dark:bg-stone-700 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => handleToggleUnit('metric')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                user.displayPreferences?.unitSystem !== 'imperial'
                  ? 'bg-white dark:bg-stone-800 text-rose-600 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              kg / cm
            </button>
            <button
              onClick={() => handleToggleUnit('imperial')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                user.displayPreferences?.unitSystem === 'imperial'
                  ? 'bg-white dark:bg-stone-800 text-rose-600 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              lb / ft
            </button>
          </div>
        </div>

        {/* Hide Calories Toggle */}
        <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-700/60">
          <div>
            <span className="font-semibold text-stone-800 dark:text-stone-200 block">
              Ẩn thông tin Calo (Chế độ thuần thói quen)
            </span>
            <span className="text-[11px] text-stone-400">
              Giúp bạn ăn uống tự nhiên, lắng nghe cảm giác no đói của cơ thể
            </span>
          </div>
          <input
            type="checkbox"
            checked={user.displayPreferences?.hideCalories || false}
            onChange={(e) => handleToggleHideCalories(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {/* Hide Weight Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <span className="font-semibold text-stone-800 dark:text-stone-200 block">
              Ẩn số đo cân nặng trên trang chủ
            </span>
            <span className="text-[11px] text-stone-400">
              Tránh áp lực con số cân nặng hàng ngày
            </span>
          </div>
          <input
            type="checkbox"
            checked={user.displayPreferences?.hideWeight || false}
            onChange={(e) => handleToggleHideWeight(e.target.checked)}
            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Notifications Governance */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-500" />
          <span>Quản lý thông báo trong ứng dụng</span>
        </h3>

        <div className="space-y-2">
          {[
            { key: 'mealReminder' as const, label: 'Nhắc nhở bữa ăn đúng giờ' },
            { key: 'waterReminder' as const, label: 'Nhắc uống nước từng ngụm rải đều' },
            { key: 'exerciseReminder' as const, label: 'Nhắc vận động cơ thể nhẹ nhàng' },
            { key: 'sleepReminder' as const, label: 'Nhắc giờ ngủ và buông thư điện thoại' },
            { key: 'weeklySummary' as const, label: 'Báo cáo tổng kết tuần tích cực' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-stone-700 dark:text-stone-300 font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={user.notifications?.[item.key] || false}
                onChange={() => handleToggleNotification(item.key)}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
            </label>
          ))}
        </div>

        <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 text-[11px] text-stone-400">
          Khung giờ yên tĩnh mặc định: {user.notifications?.quietHoursStart || '22:30'} đến {user.notifications?.quietHoursEnd || '06:30'} (không gửi bất kỳ thông báo nào).
        </div>
      </div>

      {/* 4. Privacy & Data Ownership */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Quyền riêng tư & Làm chủ dữ liệu</span>
        </h3>

        <p className="text-[11px] text-stone-500 leading-relaxed">
          Tất cả nhật ký ăn uống, số đo và ảnh món ăn hoàn toàn thuộc quyền sở hữu của bạn. Chúng tôi cam kết không chia sẻ dữ liệu sức khỏe cá nhân cho bất kỳ bên thứ ba nào.
        </p>

        <div className="pt-1 flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportData}
            className="flex-1 py-2 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-rose-500" />
            <span>Xuất toàn bộ dữ liệu (JSON)</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa tài khoản & Đặt lại</span>
          </button>
        </div>
      </div>

      {/* 5. Feedback Form */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-sky-500" />
          <span>Gửi ý kiến đóng góp & Yêu cầu món ăn</span>
        </h3>

        {feedbackSent ? (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cảm ơn bạn! Ý kiến đã được ghi nhận vào hàng đợi xử lý.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-2">
            <textarea
              rows={2}
              placeholder="Bạn muốn bổ sung thêm món ăn Việt nào hoặc góp ý tính năng gì..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs"
            ></textarea>
            <button
              type="submit"
              disabled={!feedbackText.trim()}
              className="py-1.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40 ml-auto"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi phản hồi</span>
            </button>
          </form>
        )}
      </div>

      {/* 6. Admin Portal Entry */}
      <div className="p-4 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-stone-900 dark:text-stone-100 block">
            Khu vực Quản trị viên (Admin Portal)
          </span>
          <span className="text-[11px] text-stone-500">
            Quản lý kho dữ liệu món Việt, duyệt công thức và xem phản hồi người dùng
          </span>
        </div>
        <button
          onClick={onNavigateToAdmin}
          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold flex items-center gap-1"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Vào Admin</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 dark:border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 dark:text-stone-100 text-center">
              Xác nhận xóa tài khoản?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed text-center">
              Hành động này sẽ xóa vĩnh viễn toàn bộ nhật ký ăn uống, cân nặng, giấc ngủ và thói quen đã lưu trên thiết bị. Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-200 dark:shadow-none"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
