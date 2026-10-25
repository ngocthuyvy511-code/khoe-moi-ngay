import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { UserProfile } from '../../types';
import { switchAccount, createDefaultRealUserProfile, setActiveUser } from '../../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChanged: (user: UserProfile) => void;
  onOpenOnboarding: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onOpenOnboarding,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Vui lòng nhập định dạng email hợp lệ (ví dụ: ban@domain.com).');
      return;
    }

    if (mode === 'forgot') {
      setSuccessMsg(`Liên kết hướng dẫn đặt lại mật khẩu đã được mô phỏng gửi đến ${email}. Hãy kiểm tra hộp thư.`);
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Mật khẩu cần có tối thiểu 6 ký tự để bảo đảm an toàn.');
      return;
    }

    if (mode === 'register') {
      const newUser = createDefaultRealUserProfile(email, name || email.split('@')[0]);
      setActiveUser(newUser);
      onUserChanged(newUser);
      onClose();
      onOpenOnboarding();
    } else {
      // Login simulation
      const user = switchAccount(false);
      user.email = email;
      if (name) user.name = name;
      setActiveUser(user);
      onUserChanged(user);
      onClose();
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'apple' | 'facebook') => {
    setErrorMsg('');
    const providerNames = { google: 'Google', apple: 'Apple ID', facebook: 'Facebook' };
    const fakeEmail = `user.${provider}@example.com`;
    const user = createDefaultRealUserProfile(fakeEmail, `Người dùng ${providerNames[provider]}`);
    setActiveUser(user);
    onUserChanged(user);
    onClose();
  };

  const handleSwitchToDemo = () => {
    const demo = switchAccount(true);
    onUserChanged(demo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 dark:border-stone-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Current Account Status Tag */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Đang sử dụng: {currentUser.isDemo ? 'Chế độ Dùng Thử Mẫu' : currentUser.name}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          {mode === 'login' && 'Đăng nhập tài khoản'}
          {mode === 'register' && 'Đăng ký tài khoản mới'}
          {mode === 'forgot' && 'Khôi phục mật khẩu'}
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-5">
          {mode === 'forgot'
            ? 'Nhập email đã đăng ký để nhận liên kết xác thực an toàn.'
            : 'Đồng bộ thói quen và nhật ký dinh dưỡng an toàn, bảo mật tuyệt đối.'}
        </p>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tên hiển thị
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Anh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="tenban@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-medium text-sm transition-all shadow-md shadow-rose-200 dark:shadow-none mt-2"
          >
            {mode === 'login' && 'Đăng nhập'}
            {mode === 'register' && 'Đăng ký & Bắt đầu khảo sát'}
            {mode === 'forgot' && 'Gửi liên kết khôi phục'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-stone-600 dark:text-stone-400">
          {mode === 'login' ? (
            <span>
              Chưa có tài khoản?{' '}
              <button
                onClick={() => setMode('register')}
                className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Đăng ký ngay
              </button>
            </span>
          ) : (
            <span>
              Đã có tài khoản?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Đăng nhập
              </button>
            </span>
          )}
        </div>

        {/* Social Logins */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
            <span className="bg-white dark:bg-stone-900 px-3 text-stone-400 font-medium">
              Hoặc tiếp tục với
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="font-bold text-red-500">G</span> Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('apple')}
            className="py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span></span> Apple
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            className="py-2 px-3 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="font-bold text-blue-600">f</span> Facebook
          </button>
        </div>

        {/* Demo Mode Button */}
        {!currentUser.isDemo && (
          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              onClick={handleSwitchToDemo}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-medium transition-colors"
            >
              Chuyển sang Chế độ Dùng Thử Mẫu (Minh Thư)
            </button>
          </div>
        )}

        {/* Security Statement */}
        <div className="mt-4 flex items-center gap-1.5 justify-center text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Bảo mật an toàn: Mật khẩu không bao giờ lưu trữ thô.</span>
        </div>
      </div>
    </div>
  );
};
