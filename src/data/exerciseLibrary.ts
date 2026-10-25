import { ExerciseLibraryItem } from '../types';

export const EXERCISE_LIBRARY: ExerciseLibraryItem[] = [
  {
    id: 'ex-walk-brisk',
    name: 'Đi bộ nhanh ngoài trời / công viên',
    category: 'cardio',
    level: 'Dễ',
    equipment: 'Giày thể thao êm chân',
    caloriesBurnPerMin: 5.2,
    recommendedDurationMin: 30,
    instructions: [
      'Khởi động xoay nhẹ khớp cổ chân, đầu gối và hông trong 2-3 phút.',
      'Giữ lưng thẳng, mắt nhìn về phía trước khoảng 5-6 mét, vai thả lỏng tự nhiên.',
      'Đánh tay nhịp nhàng theo sải chân, tiếp đất từ gót chân rồi cuộn mượt mà lên mũi chân.',
      'Duy trì tốc độ sao cho bạn vẫn có thể trò chuyện được thành câu ngắn (Talk Test).'
    ],
    safeStoppingSigns: [
      'Cảm thấy chóng mặt, hoa mắt, choáng váng hoặc mất thăng bằng.',
      'Khó thở dồn dập không kịp lấy hơi, đau nhói ở ngực hoặc khớp gối.',
      'Thời tiết quá nắng gắt gây cảm giác buồn nôn hoặc say nắng.'
    ],
    alternatives: ['Đi bộ thong thả tại chỗ trong nhà', 'Đạp xe nhẹ nhàng']
  },
  {
    id: 'ex-run-easy',
    name: 'Chạy bộ nhịp tim nhẹ nhàng (Zone 2)',
    category: 'cardio',
    level: 'Trung bình',
    equipment: 'Giày chạy bộ chuyên dụng',
    caloriesBurnPerMin: 8.5,
    recommendedDurationMin: 25,
    instructions: [
      'Chạy với sải chân ngắn, guồng chân đều khoảng 160-170 nhịp/phút.',
      'Tiếp đất êm ái bằng nửa bàn chân trước hoặc giữa bàn chân, tránh dộng mạnh gót.',
      'Hít thở sâu bằng cả mũi và miệng theo nhịp 2 bước hít vào - 2 bước thở ra.',
      'Tập trung vào cảm giác cơ thể thoải mái, không cần cố đuổi theo tốc độ của người khác.'
    ],
    safeStoppingSigns: [
      'Đau buốt nhói ở cẳng chân (hội chứng shin splints) hoặc khớp cổ chân.',
      'Cảm giác thắt nghẹt lồng ngực hoặc nhịp tim đập loạn nhịp bất thường.',
      'Cơ thể kiệt sức, đầu óc quay cuồng.'
    ],
    alternatives: ['Đi bộ leo dốc thoai thoải', 'Tập máy đạp xe elip']
  },
  {
    id: 'ex-cycling',
    name: 'Đạp xe thư giãn ngoài trời / máy tập',
    category: 'cardio',
    level: 'Dễ',
    equipment: 'Xe đạp & nón bảo hiểm (hoặc máy đạp xe tại nhà)',
    caloriesBurnPerMin: 6.8,
    recommendedDurationMin: 35,
    instructions: [
      'Điều chỉnh độ cao yên xe sao cho khi chân ở điểm thấp nhất, đầu gối hơi chùng nhẹ khoảng 15-20 độ.',
      'Đạp tròn đều với lực phân bố cả vòng quay, giữ lưng và cổ thư giãn.',
      'Uống từng ngụm nước nhỏ sau mỗi 10-15 phút đạp.'
    ],
    safeStoppingSigns: [
      'Đau mỏi dữ dội ở khớp gối hoặc thắt lưng.',
      'Cảm thấy lạnh toát mồ hôi hoặc tụt huyết áp.',
      'Dừng ngay xe vào lề an toàn nếu thấy choáng.'
    ],
    alternatives: ['Đi bộ ngoài trời', 'Bơi lội']
  },
  {
    id: 'ex-bodyweight-strength',
    name: 'Rèn luyện sức mạnh cơ bản tại nhà (Bodyweight)',
    category: 'strength',
    level: 'Trung bình',
    equipment: 'Không cần dụng cụ (thảm tập nếu có)',
    caloriesBurnPerMin: 6.0,
    recommendedDurationMin: 20,
    instructions: [
      'Hiệp 1: Squat ngồi xổm 10-12 lần (chú ý gối mở theo hướng mũi chân, lưng thẳng).',
      'Hiệp 2: Hít đất nghiêng trên bàn/tường hoặc hít đất gối 8-10 lần.',
      'Hiệp 3: Glute bridge (nâng hông trên thảm) 12-15 lần kích hoạt cơ mông.',
      'Hiệp 4: Plank giữ thân mình 20-30 giây, thở đều, siết nhẹ cơ bụng.',
      'Nghỉ giữa mỗi bài từ 45-60 giây.'
    ],
    safeStoppingSigns: [
      'Đau nhói ở cột sống thắt lưng hoặc khớp cổ tay.',
      'Đầu gối kêu răng rắc kèm theo cảm giác nhói buốt.',
      'Nín thở dẫn đến choáng váng đầu.'
    ],
    alternatives: ['Tập với dây kháng lực nhẹ', 'Pilates phục hồi']
  },
  {
    id: 'ex-yoga-relax',
    name: 'Yoga phục hồi & dãn cơ trước giờ ngủ',
    category: 'flexibility',
    level: 'Dễ',
    equipment: 'Thảm yoga (hoặc mặt nệm êm)',
    caloriesBurnPerMin: 3.2,
    recommendedDurationMin: 20,
    instructions: [
      'Tư thế em bé (Child’s Pose): Quỳ gối mở rộng, vươn dài hai tay về trước, trán chạm thảm, hít thở sâu 5 nhịp.',
      'Tư thế Mèo - Bò (Cat-Cow): Chống 4 điểm, uốn cong và võng lưng nhịp nhàng theo hơi thở.',
      'Tư thế gác chân lên tường (Viparita Karani): Nằm ngửa, gác hai chân thẳng lên tường thư giãn 5 phút để máu tuần hoàn tốt hơn.',
      'Kết thúc bằng tư thế xác chết (Savasana), nhắm mắt buông thư toàn bộ cơ thể.'
    ],
    safeStoppingSigns: [
      'Cảm giác căng rách cơ quá mức (vượt qua ngưỡng dễ chịu).',
      'Chèn ép dây thần kinh gây tê buốt lan xuống bàn chân.',
      'Đau đốt sống cổ.'
    ],
    alternatives: ['Ngồi thiền thở sâu 10 phút', 'Tắm nước ấm thư giãn']
  },
  {
    id: 'ex-desk-mobility',
    name: 'Giải tỏa đau mỏi vai gáy cho dân văn phòng',
    category: 'recovery',
    level: 'Dễ',
    equipment: 'Ghế ngồi làm việc',
    caloriesBurnPerMin: 2.8,
    recommendedDurationMin: 10,
    instructions: [
      'Xoay tròn khớp vai ra sau 10 vòng chậm rãi.',
      'Nghiêng đầu nhẹ sang phải, dùng tay phải đặt nhẹ lên thái dương kéo căng 15 giây, sau đó đổi bên.',
      'Đan hai tay ra sau lưng, mở rộng lồng ngực và ngước nhẹ cằm lên trần nhà.',
      'Đứng dậy vươn vai và đi lại lấy nước sau mỗi 60 phút ngồi máy tính.'
    ],
    safeStoppingSigns: [
      'Choáng váng khi xoay cổ đột ngột.',
      'Tê bì lan dọc xuống các ngón tay.'
    ],
    alternatives: ['Đứng vươn thở nhẹ nhàng bên cửa sổ']
  }
];
