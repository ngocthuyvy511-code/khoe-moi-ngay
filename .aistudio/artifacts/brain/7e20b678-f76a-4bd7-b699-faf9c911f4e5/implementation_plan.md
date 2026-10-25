# Khỏe Mỗi Ngày — Nền Tảng Quản Lý Cân Nặng & Thói Quen Lành Mạnh

Ứng dụng web tiến bộ (PWA/Responsive) dành cho người Việt để theo dõi cân nặng, dinh dưỡng món Việt, nước uống, vận động và giấc ngủ một cách khoa học, nhân văn — kiên quyết không cổ vũ giảm cân cấp tốc, không tạo áp lực ngoại hình, và tôn trọng sức khỏe thể chất lẫn tinh thần.

---

## Quyết Định Đã Xác Nhận Từ Người Dùng (Phase 1)

> [!IMPORTANT]
> - **Cơ sở dữ liệu & Đồng bộ:** Tích hợp Firebase Firestore cho lưu trữ đám mây trực tuyến, hỗ trợ tài khoản cá nhân độc lập và chế độ tài khoản mẫu (Demo Mode) tách biệt.
> - **Hiển thị máy tính:** Khung mô phỏng điện thoại di động thông minh (Mobile Viewport Frame 390px) đặt trên nền Canvas thoáng đãng, đồng thời có nút bấm chuyển đổi linh hoạt sang Chế độ Trải Rộng Toàn Màn Hình (Full-width Desktop Dashboard) bất kỳ lúc nào.
> - **Trợ lý AI & Nhận diện món ăn:** Tích hợp đầy đủ cả Phân tích ảnh món ăn Việt Nam (ước tính khẩu phần, calo, macro với cảnh báo và xác nhận người dùng) và Trợ lý Sức khỏe Thói quen Gemini (động viên, gợi ý công thức từ nguyên liệu, không kê đơn/chẩn đoán).

---

## 1. Tổng Quan & Triết Lý Sản Phẩm

- **Tên ứng dụng:** Khỏe Mỗi Ngày
- **Đối tượng người dùng:** Người trưởng thành Việt Nam muốn cải thiện thể trạng, quản lý cân nặng bền vững, xây dựng lối sống năng động hoặc duy trì vóc dáng mà không bị ám ảnh bởi calo hay tiêu chuẩn ngoại hình phi thực tế.
- **Giá trị cốt lõi:**
  1. *Đậm chất Việt Nam:* Cơ sở dữ liệu món ăn Việt thực tế (Phở bò, bún riêu, cơm tấm sườn trứng, bánh mì pate chả, canh chua, cá kho, gỏi cuốn...) với khẩu phần chuẩn văn hóa ẩm thực Việt.
  2. *Nhân văn & An toàn (Anti-Diet Culture):* Sàng lọc điều kiện an toàn (dưới 18 tuổi, phụ nữ mang thai/cho con bú, tiền sử rối loạn ăn uống, bệnh lý nền) để chuyển sang chế độ thuần thói quen (Habit Mode), tuyệt đối không áp đặt thâm hụt calo cực đoan.
  3. *Tự do cá nhân hóa:* Có tùy chọn ẩn hoàn toàn calo và chỉ số cân nặng nếu người dùng cảm thấy căng thẳng; tập trung vào số bước, giấc ngủ, ly nước và cảm xúc.

---

## 2. Trải Nghiệm Người Dùng (UX) & Thiết Kế Giao Diện (UI)

### Bảng màu & Phong cách (60-30-10 Rule)
- **Màu nền chủ đạo (60%):** Nền trắng kem ấm áp (`#FDFBF7` / Dark: `#181516`), dịu mắt, thân thiện.
- **Bề mặt cấu trúc (30%):** Thẻ thông tin bo tròn mềm mại (`rounded-2xl` - `rounded-3xl`), đường viền siêu mảnh hairline (`border-rose-100` / `border-stone-800`), không lạm dụng bóng đổ nặng nề.
- **Điểm nhấn hành động (10%):** Màu hồng hoa hồng thanh nhã (`#E11D48` / `#F43F5E` - Rose/Blush) kết hợp điểm xuyết xanh dương êm dịu (`#0284C7` - Sky Blue) cho nước uống và số liệu phân tích.
- **Chế độ hiển thị:** Hỗ trợ Chế độ Sáng (Light) & Tối (Dark), tùy chọn cỡ chữ (Tiêu chuẩn / Lớn).

### Điều hướng cốt lõi (5 Tab Bar Ergonomics)
Thanh điều hướng dưới đáy (Fixed Bottom Tab Bar) tối ưu hóa vùng ngón cái:
1. **Trang chủ (Home):** Lời chào cá nhân hóa, vòng tròn năng lượng/thói quen ngày, thanh tiến độ nước, giấc ngủ, 4 nút tác vụ nhanh (Ăn uống, Uống nước, Cân nặng, Vận động), gợi ý hành động tiếp theo.
2. **Nhật ký (Log):** Phân chia Sáng – Trưa – Tối – Phụ. Tìm kiếm món ăn tiếng Việt không dấu, xem món yêu thích, quét ảnh AI, sao chép bữa ăn giữa các ngày, hoàn tác thao tác xóa.
3. **Kế hoạch (Plan):** Lập thực đơn dinh dưỡng theo tuần/ngày, gợi ý món Việt cân bằng, danh sách đi chợ tự động gộp nguyên liệu có nút tích chọn đã mua, chuyển món đã ăn sang nhật ký sau khi người dùng xác nhận.
4. **Tiến trình (Progress):** Biểu đồ cân nặng & xu hướng dài hạn, số đo vòng eo/hông, nhật ký tâm trạng & mức năng lượng, báo cáo dinh dưỡng tuần trung tính (không phán xét), phân biệt rõ ngày không nhập dữ liệu với giá trị 0.
5. **Cá nhân (Profile & Admin):** Hồ sơ mục tiêu, tùy biến đơn vị đo (kg/lb, cm/ft, ml/oz), bật/tắt nhắc nhở, quyền riêng tư dữ liệu, xuất/xóa dữ liệu minh bạch, và cổng Quản trị viên (Admin Portal) quản lý thư viện món ăn/bài tập.

---

## 3. Kiến Trúc Kỹ Thuật & Luồng Dữ Liệu

### Sơ đồ Hệ thống (ASCII Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            KHỎE MỖI NGÀY CLIENT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Top Bar Context] · Chuyển đổi Thiết bị (Mobile Phone / Desktop) / Dark Mode│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   Auth & User Store   │  │   Health & Log Store │  │ UI & Modal Store │  │
│  │ (Firebase Auth / Demo)│  │ (Meals, Water, Sleep)│  │ (Sheets, Dialogs)│  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └─────────┬────────┘  │
│              │                         │                        │           │
│              ▼                         ▼                        ▼           │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        Interactive Views (Tabs)                       │  │
│  │  1. Trang Chủ    2. Nhật Ký    3. Kế Hoạch    4. Tiến Trình  5. Cá Nhân│  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
  ┌──────────────────────────────┐              ┌───────────────────────────┐
  │   Firebase Backend Service   │              │     Node Server Proxy     │
  │  - Firebase Auth             │              │  POST /api/gemini-food-ai │
  │  - Firestore Persistence     │              │  (Gemini 3.8 Flash Vision │
  │  - User Isolated Collections │              │   & Habit Assistant)      │
  └──────────────────────────────┘              └───────────────────────────┘
```

### Các Module & Mô hình Dữ liệu Chính

1. **User Profile & Safety Screening (`users/{uid}`):**
   - Tên hiển thị, tuổi, giới tính sinh học (tùy chọn với giải thích), chiều cao, cân nặng hiện tại, cân nặng mục tiêu.
   - Sàng lọc điều kiện: Dưới 18 tuổi, mang thai/nuôi con nhỏ, tiền sử rối loạn ăn uống, bệnh mãn tính -> Kích hoạt chế độ "Thói quen an toàn".
   - Tùy chọn ẩn calo và số cân nặng.

2. **Food Database & Meal Logs (`meals/{mealId}`):**
   - Món Việt Nam chuẩn bị sẵn: Phở bò tái nạm, bún bò Huế, cơm tấm sườn bì chả, gỏi cuốn tôm thịt, bánh mì thịt nướng, canh chua cá lóc, chè bưởi...
   - Macro: Calo, Đạm (Protein), Đường bột (Carbs), Chất béo (Fat), Chất xơ (Fiber).
   - Nguồn dữ liệu dinh dưỡng minh bạch, hiển thị rõ số liệu tham khảo.

3. **AI Vision & Habit Companion (`/api/gemini-food-ai`):**
   - Phân tích ảnh món ăn: Nhận diện tên món Việt, ước lượng thành phần nguyên liệu và khẩu phần, kèm ghi chú rõ ràng "Chỉ là ước tính tham khảo, vui lòng kiểm tra và chỉnh sửa trước khi lưu".
   - Trợ lý Thói quen: Tư vấn thực đơn theo nguyên liệu sẵn trong tủ lạnh, giải thích báo cáo tuần, nhắc nhở dịu dàng.

4. **Kế hoạch & Danh sách mua sắm:**
   - Thực đơn 7 ngày món ăn gia đình Việt Nam.
   - Danh sách mua sắm tự động tổng hợp (thịt, cá, rau củ, gia vị) với tính năng tích chọn tiện lợi.

5. **Trang Quản trị (Admin Portal):**
   - Chế độ riêng biệt cho Quản trị viên để duyệt món mới, cập nhật bảng dinh dưỡng, quản lý bài tập thể dục mà không truy cập nhật ký cá nhân của người dùng.

---

## 4. Kế Hoạch Triển Khai Chi Tiết

- **Bước 1: Cấu hình Khung Giao diện & Thư viện Mẫu**
  - Thiết lập Typography tiếng Việt, CSS Variables cho bảng màu Hồng Đào - Trắng Kem - Xanh Biển.
  - Xây dựng Layout Switcher: Chuyển đổi mượt mà giữa khung giả lập điện thoại iPhone/Android hiện đại và giao diện toàn màn hình máy tính.
- **Bước 2: Hệ Thống Dữ Liệu Món Ăn Việt & Quản Lý Trạng Thái (State Engine)**
  - Cơ sở dữ liệu hơn 35 món ăn Việt quen thuộc kèm khẩu phần chi tiết.
  - Quản lý nhật ký Sáng/Trưa/Tối/Phụ, nước uống, giấc ngủ qua đêm, thói quen hằng ngày.
  - Tích hợp tính toán BMR/TDEE dựa trên công thức Mifflin-St Jeor chuẩn y khoa, có cơ chế bỏ qua an toàn.
- **Bước 3: Tích Hợp Firebase & Xác Thực**
  - Cấu hình Firebase Auth & Firestore rules đảm bảo người dùng chỉ xem và sửa dữ liệu của chính mình.
  - Chế độ Dùng Thử (Demo Mode) với dữ liệu mẫu trực quan cho người dùng trải nghiệm ngay mà không bắt buộc tạo tài khoản.
- **Bước 4: Tích Hợp AI Gemini & Nhận Diện Món Ăn**
  - Tạo route proxy `/api/gemini-food-ai` bảo mật API key ở phía server.
  - Giao diện tải ảnh món ăn, phân tích với Gemini 3.8 Flash, cho phép chỉnh sửa từng dòng nguyên liệu/calo trước khi bấm "Lưu vào nhật ký".
  - Trợ lý thói quen giải đáp và tạo thực đơn từ nguyên liệu trong tủ lạnh.
- **Bước 5: Hoàn Thiện Các Màn Hình Chi Tiết & Kiểm Thử**
  - Kế hoạch ăn uống, danh sách đi chợ, bài tập có bấm giờ thực tế (Start / Pause / Reset), biểu đồ tiến trình SVG mượt mà.
  - Màn hình Quản trị viên (Admin) và Cài đặt bảo mật (Xuất JSON, Xóa tài khoản).
  - Kiểm tra toàn bộ mã nguồn với TypeScript và `compile_applet`.
