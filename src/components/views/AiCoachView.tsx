import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  Utensils,
  Lightbulb,
} from 'lucide-react';
import { UserProfile, MealItem, WaterLog, SleepLog } from '../../types';

interface AiCoachViewProps {
  user: UserProfile;
  meals: MealItem[];
  waters: WaterLog[];
  sleeps: SleepLog[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiCoachView: React.FC<AiCoachViewProps> = ({ user, meals, waters, sleeps }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Xin chào ${user.name}! 🌸 Tôi là Trợ lý Thói Quen Khỏe Mỗi Ngày. 
Tôi ở đây để đồng hành cùng bạn xây dựng lối sống lành mạnh, gợi ý thực đơn món Việt từ nguyên liệu sẵn có, và động viên bạn lắng nghe cơ thể mà không có bất kỳ áp lực tiêu cực nào.

Hôm nay bạn muốn chia sẻ hay cần gợi ý gì?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const promptSuggestions = [
    'Tủ lạnh còn trứng, cà chua và đậu hũ, nấu món gì thanh nhẹ?',
    'Cách giảm cảm giác thèm trà sữa / đồ ngọt lúc 15h chiều?',
    'Giải thích chỉ số BMR và cách ăn no lành mạnh?',
    'Tôi đi bộ 30 phút mỗi ngày thì sức khỏe cải thiện thế nào?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMsg;
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const userContext = {
        name: user.name,
        goal: user.primaryGoal,
        isHabitOnlyMode: user.isHabitOnlyMode,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        recentMealsCount: meals.length,
      };

      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          userContext,
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        'Rất vui được trò chuyện cùng bạn. Hãy tiếp tục duy trì những thói quen tốt nhé!';

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Hiện tại kết nối mạng đang gián đoạn. Bạn hãy yên tâm nghỉ ngơi hoặc thử lại sau ít phút nhé.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[780px] pb-4">
      {/* Header bar */}
      <div className="px-1 pb-3 flex items-center justify-between border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Trợ lý Thói Quen Khỏe Mỗi Ngày
            </h2>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              Đồng hành nhân văn · Không phán xét · Tư vấn món Việt
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Bảo vệ quyền riêng tư</span>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="my-2 p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-[10px] text-stone-600 dark:text-stone-300 flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span>
          Trợ lý AI hỗ trợ gợi ý lối sống và công thức nấu nướng, không thay thế chẩn đoán y khoa hay đơn thuốc chuyên gia.
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs py-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                m.role === 'user'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] sm:max-w-[75%] p-3.5 rounded-2xl shadow-sm ${
                m.role === 'user'
                  ? 'bg-rose-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 rounded-tl-none leading-relaxed'
              }`}
            >
              <p className="whitespace-pre-line text-xs">{m.content}</p>
              <span
                className={`text-[9px] mt-1 block text-right ${
                  m.role === 'user' ? 'text-rose-200' : 'text-stone-400'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            <span>Trợ lý đang suy nghĩ câu trả lời phù hợp nhất cho bạn...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none text-[11px]">
        {promptSuggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(suggestion)}
            className="px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-rose-50 hover:text-rose-600 whitespace-nowrap transition-colors border border-stone-200/60 dark:border-stone-700"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="pt-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Nhập câu hỏi hoặc chia sẻ cảm nhận của bạn..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2.5 text-xs rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputMsg.trim() || isLoading}
          className="p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white shadow-md shadow-rose-200 dark:shadow-none transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
