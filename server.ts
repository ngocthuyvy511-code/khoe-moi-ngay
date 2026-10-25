import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support large image payloads for meal analysis
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Helper to get GoogleGenAI instance safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({});
}

// -------------------------------------------------------------
// API: Analyze Food Photo
// -------------------------------------------------------------
app.post('/api/analyze-food-photo', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, userNotes } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'Thiếu dữ liệu hình ảnh (imageBase64).' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      // Mock fallback if API key is not configured, with realistic Vietnamese dish estimation
      res.json({
        success: true,
        isSimulated: true,
        dishName: 'Phở bò tái chín (Ước tính mẫu)',
        confidenceNote: 'Chưa có cấu hình GEMINI_API_KEY, hiển thị dữ liệu ước lượng mẫu để thử nghiệm.',
        portionDescription: '1 tô vừa (khoảng 550g - 600g bánh và nước dùng)',
        estimatedCalories: 480,
        macros: {
          protein: 26,
          carbs: 65,
          fat: 12,
          fiber: 3,
        },
        ingredients: [
          { name: 'Bánh phở tươi', estimatedAmount: '180g' },
          { name: 'Thịt bò (tái & chín)', estimatedAmount: '90g' },
          { name: 'Nước dùng phở ninh xương', estimatedAmount: '350ml' },
          { name: 'Hành hoa, ngò gai, giá đỗ', estimatedAmount: '40g' }
        ],
        healthTip: 'Món ăn giàu đạm và năng lượng phục hồi. Để giảm bớt lượng muối (natri) và mỡ màng, bạn có thể hạn chế húp hết phần nước béo.',
        allergyWarnings: ['Thịt bò'],
        disclaimer: 'Đây là ước tính dựa trên nhận diện thị giác. Khối lượng và gia vị thực tế có thể khác nhau tùy quán ăn hoặc cách nấu gia đình. Vui lòng kiểm tra và sửa đổi trước khi lưu vào nhật ký.'
      });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const actualMime = mimeType || 'image/jpeg';

    const prompt = `Bạn là chuyên gia dinh dưỡng và ẩm thực Việt Nam trong ứng dụng "Khỏe Mỗi Ngày".
Hãy quan sát hình ảnh món ăn này và phân tích theo văn hóa ẩm thực Việt:
1. Xác định tên món ăn Việt Nam gần đúng nhất (hoặc món phổ biến tại Việt Nam).
2. Ước tính khẩu phần tiêu chuẩn cho 1 người ăn (ví dụ: 1 tô vừa, 1 đĩa tiêu chuẩn, 1 ổ bánh mì, v.v.).
3. Ước tính thành phần nguyên liệu chính có trong ảnh.
4. Ước tính năng lượng (calo) và các chỉ số dinh dưỡng (protein, carbs, fat, fiber tính bằng gram) dựa trên khẩu phần ước tính.
5. Cảnh báo các chất có khả năng gây dị ứng thường gặp (hải sản, đậu phộng, trứng, gluten...).
6. Gợi ý thưởng thức lành mạnh một cách tích cực, không phán xét, không cấm đoán.

LƯU Ý CỐT LÕI:
- Nhận thức rõ rằng hình ảnh KHÔNG THỂ đo lường chính xác lượng dầu mỡ, đường ẩn hoặc trọng lượng chính xác. Hãy luôn nhấn mạnh tính chất ước lượng tham khảo.
${userNotes ? `Ghi chú của người dùng: "${userNotes}"` : ''}

Trả về DUY NHẤT một đối tượng JSON hợp lệ (không kèm markdown ngoài JSON):
{
  "dishName": "Tên món ăn tiếng Việt rõ ràng",
  "portionDescription": "Mô tả khẩu phần",
  "estimatedCalories": 450,
  "macros": {
    "protein": 24,
    "carbs": 60,
    "fat": 11,
    "fiber": 3
  },
  "ingredients": [
    { "name": "Tên nguyên liệu", "estimatedAmount": "khối lượng ước tính" }
  ],
  "healthTip": "Lời khuyên tích cực nhẹ nhàng",
  "allergyWarnings": ["chất gây dị ứng nếu có"],
  "disclaimer": "Ước tính từ thị giác AI. Khối lượng và cách nêm nếm thực tế có thể thay đổi. Vui lòng xác nhận trước khi lưu."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: actualMime,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsedData = JSON.parse(match[0]);
      } else {
        throw new Error('Không thể phân tích dữ liệu trả về từ Gemini');
      }
    }

    res.json({
      success: true,
      isSimulated: false,
      ...parsedData,
    });
  } catch (error: any) {
    console.error('Lỗi phân tích ảnh món ăn:', error);
    res.status(500).json({
      error: 'Không thể phân tích hình ảnh vào lúc này. Vui lòng nhập thủ công hoặc thử lại sau.',
      details: error?.message || String(error),
    });
  }
});

// -------------------------------------------------------------
// API: AI Habit & Health Companion (Gemini 3.8 Flash)
// -------------------------------------------------------------
app.post('/api/ai-coach', async (req: Request, res: Response) => {
  try {
    const { message, history, userContext } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Nội dung tin nhắn không được để trống.' });
      return;
    }

    const ai = getGenAIClient();
    if (!ai) {
      res.json({
        success: true,
        reply: `Chào bạn! Tôi là Trợ lý Thói Quen Khỏe Mỗi Ngày. 
Hiện tại hệ sinh thái đang dùng chế độ trả lời cục bộ. 

Lời khuyên hôm nay cho bạn: Hãy duy trì việc uống đủ nước và lắng nghe cảm giác no - đói tự nhiên của cơ thể. Một bữa ăn cân bằng món Việt luôn nên có đủ rau xanh, nguồn đạm lành mạnh và một lượng tinh bột vừa đủ để cung cấp năng lượng làm việc vui tươi cả ngày!`,
        suggestedActions: [
          'Gợi ý thực đơn món Việt từ trứng và rau củ',
          'Cách cải thiện giấc ngủ sau 23h',
          'Làm thế nào để duy trì thói quen đi bộ 30 phút'
        ]
      });
      return;
    }

    const systemInstruction = `Bạn là Trợ lý Sức Khỏe & Thói Quen Lành Mạnh trong ứng dụng "Khỏe Mỗi Ngày".
Ngôn ngữ: Tiếng Việt, thân thiện, nhẹ nhàng, tôn trọng, đồng cảm, tạo cảm giác thư giãn và tích cực.

NGUYÊN TẮC BẤT DI BẤT DỊCH:
1. KHÔNG cổ vũ giảm cân cấp tốc, nhịn ăn cực đoan, kiêng khem độc hại, hoặc tập luyện như hình phạt cho việc ăn uống.
2. KHÔNG chẩn đoán bệnh tật, KHÔNG kê đơn thuốc hoặc khuyến nghị thực phẩm chức năng giảm cân.
3. KHÔNG phán xét thức ăn là "xấu", "tội lỗi" hay "bẩn". Mọi món ăn truyền thống Việt Nam đều có giá trị văn hóa và vị trí trong đời sống khi thưởng thức có chừng mực và lắng nghe cơ thể.
4. Tôn trọng dữ liệu sức khỏe: Khi người dùng hỏi thực đơn từ nguyên liệu sẵn có, ưu tiên các món dân dã Việt Nam (canh chua, đậu hũ sốt cà, thịt luộc rau luộc, cá kho thơm...).
5. Luôn nhắc nhở người dùng tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng khi có vấn đề bệnh lý hoặc tình trạng sức khỏe đặc biệt (mang thai, dạ dày, tiểu đường...).

Thông tin ngữ cảnh người dùng:
${JSON.stringify(userContext || {})}
`;

    const chatContents = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.role === 'user' || item.role === 'assistant') {
          chatContents.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: item.content || '' }]
          });
        }
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      success: true,
      reply: response.text || 'Khỏe Mỗi Ngày rất vui được đồng hành cùng bạn trên hành trình chăm sóc sức khỏe.',
    });
  } catch (error: any) {
    console.error('Lỗi Gemini AI Coach:', error);
    res.status(500).json({
      error: 'Không thể kết nối trợ lý AI lúc này. Vui lòng thử lại sau ít phút.',
      details: error?.message || String(error),
    });
  }
});

// -------------------------------------------------------------
// Server Setup (Vite Middleware in dev / Static files in prod)
// -------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ứng dụng Khỏe Mỗi Ngày đang chạy tại http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Lỗi khởi động máy chủ:', err);
});
