# Website Chatbot Tư Vấn Khởi Nghiệp 🚀

Website chatbot chuyên nghiệp hỗ trợ tư vấn khởi nghiệp với giao diện đẹp, trải nghiệm đọc tự nhiên và minh bạch nguồn tài liệu.

## ✨ Tính năng chính

### 1️⃣ Trang Chat (Trang chính)
- **Layout responsive**: Sidebar + khu vực chat one-column canh giữa
- **Chat UI chuyên nghiệp**:
  - Tin nhắn user (bubble bên phải)
  - Tin nhắn bot với avatar "AI" (bubble bên trái)
  - Giọng văn chuyên gia, trung lập
  - Hỗ trợ format: heading, bullet points, đoạn văn
- **Tài liệu tham khảo inline**:
  - Thu gọn mặc định với CTA "Xem tài liệu tham khảo (n)"
  - Mở rộng hiển thị card với: tiêu đề, badge phân loại, excerpt
  - Click vào card để xem chi tiết tài liệu

### 2️⃣ Quản lý phiên chat
- **Archive thay vì Delete**: Bảo vệ dữ liệu tư duy người dùng
- **Menu ⋯ cho mỗi phiên**:
  - Rename: Đổi tên phiên chat
  - Archive: Ẩn khỏi sidebar (có thể khôi phục)
- **Không cho xóa trực tiếp**: Tránh mất dữ liệu quan trọng

### 3️⃣ Trang chi tiết tài liệu
- **Phong cách blog chuyên gia**: One-column, tối ưu đọc dài
- **Nội dung đầy đủ**:
  - Tiêu đề, tác giả, badge phân loại
  - Nội dung markdown với format đẹp
  - Trust note: "Tài liệu này được chatbot sử dụng để tư vấn"
- **File đính kèm**:
  - Hỗ trợ PDF, DOC, DOCX
  - Icon + tên file + dung lượng
  - Click để tải xuống (cần login)

### 4️⃣ Trang thư viện tài liệu
- **Grid responsive**: Hiển thị tốt trên mọi thiết bị
- **Filter theo danh mục**:
  - 🟣 Lý thuyết
  - 🟢 Thị trường
  - 🔵 Chính sách
- **Search**: Tìm kiếm theo tiêu đề và tác giả
- **Document card**: Tiêu đề, badge, mô tả ngắn, CTA

### 5️⃣ Trang Upload tài liệu (Expert/Admin)
- **Form đơn giản** với:
  - Tiêu đề
  - Danh mục
  - Tác giả
  - Markdown editor cho nội dung
  - Upload file đính kèm (PDF, Word)
- **Preview live**: Xem trước trước khi publish
- **Chỉ Expert/Admin mới truy cập được**

### 6️⃣ Authentication
- **Không ép login ngay**: User có thể dùng demo mode
- **Login khi cần**:
  - Lưu phiên chat
  - Xem tài liệu chi tiết
  - Tải file đính kèm
  - Tạo nhiều phiên chat
- **Flow mượt mà**:
  - Desktop: Modal đăng nhập
  - Mobile: Full screen
  - Sau login: Quay lại đúng hành động đang làm
- **Phân quyền**:
  - User: Chat, đọc tài liệu, tải file
  - Expert/Admin: Upload & quản lý tài liệu

## 🎨 Phong cách UI

- **Clean & Professional**: Giao diện sạch, chuyên nghiệp
- **Trustworthy**: Tạo cảm giác đáng tin cậy
- **Content-focused**: Nội dung là trung tâm
- **Màu sắc**:
  - Primary: Navy blue (#1e3a8a)
  - Background: Slate (#f8fafc)
  - Accent colors cho badges
- **Typography**: Sans-serif hiện đại, dễ đọc

## 📱 Responsive Design

### Desktop (≥1024px)
- Sidebar hiển thị cố định bên trái
- Chat area canh giữa với max-width 768px
- Breathing room hai bên

### Tablet (768px - 1023px)
- Sidebar thu gọn thành drawer
- Mở bằng nút menu
- Chat area full width (với padding)

### Mobile (<768px)
- Sidebar ẩn, mở bằng menu hamburger
- Chat area full width
- Login modal → full screen
- Optimized touch targets

## 🏗️ Cấu trúc Code

```
/
├── App.tsx                          # Main app với routing
├── components/
│   ├── ChatPage.tsx                 # Trang chat chính
│   ├── Sidebar.tsx                  # Sidebar component
│   ├── ChatMessage.tsx              # Component tin nhắn
│   ├── DocumentReferenceCard.tsx    # Card tài liệu tham khảo
│   ├── DocumentDetail.tsx           # Trang chi tiết tài liệu
│   ├── Library.tsx                  # Trang thư viện
│   ├── UploadDocument.tsx           # Trang upload
│   └── LoginModal.tsx               # Modal đăng nhập
├── supabase/functions/server/
│   └── index.tsx                    # Backend API server
├── styles/
│   └── globals.css                  # Global styles
├── UX_REASONING.md                  # Tài liệu UX reasoning
└── README.md                        # File này
```

## 🔧 Backend API

Backend được xây dựng với Hono.js và Supabase:

### Endpoints:
- `POST /make-server-5e6b6e45/signup` - Đăng ký user mới
- `GET /make-server-5e6b6e45/profile` - Lấy profile user
- `GET /make-server-5e6b6e45/sessions` - Lấy danh sách chat sessions
- `POST /make-server-5e6b6e45/sessions/:id` - Lưu chat session
- `POST /make-server-5e6b6e45/chat` - Gửi tin nhắn, nhận phản hồi
- `GET /make-server-5e6b6e45/documents` - Lấy danh sách tài liệu
- `GET /make-server-5e6b6e45/documents/:id` - Lấy chi tiết tài liệu
- `POST /make-server-5e6b6e45/documents` - Tạo tài liệu mới
- `POST /make-server-5e6b6e45/upload` - Upload file đính kèm

### Demo Data:
Backend đã tích hợp 3 tài liệu demo:
1. **Khung lập kế hoạch kinh doanh cho startup** (Lý thuyết)
2. **Phân tích thị trường F&B Việt Nam 2026** (Thị trường)
3. **Chính sách hỗ trợ khởi nghiệp Việt Nam 2026** (Chính sách)

## 📖 UX Reasoning

Xem file `UX_REASONING.md` để hiểu rõ các quyết định thiết kế:
- Vì sao one-column layout?
- Vì sao tài liệu hiển thị inline?
- Vì sao dùng Archive thay vì Delete?

## 🚀 Sử dụng

### Demo Mode (Không cần login)
1. Mở app, bạn sẽ thấy phiên chat demo
2. Nhập câu hỏi và nhận phản hồi từ AI
3. Click vào "Tài liệu tham khảo" để xem nguồn

### Đăng nhập
1. Click "Đăng nhập" ở góc trên phải
2. Chọn "Đăng ký" nếu chưa có tài khoản
3. Sau khi đăng nhập:
   - Chat sessions được lưu tự động
   - Có thể tạo nhiều phiên chat
   - Truy cập đầy đủ tài liệu và tải file

### Quản lý Chat
1. Click nút "+" để tạo phiên chat mới
2. Click vào phiên để chuyển đổi
3. Click menu "⋯" để:
   - Đổi tên phiên
   - Archive phiên (ẩn khỏi sidebar)

### Upload tài liệu (Expert/Admin)
1. Đăng nhập với tài khoản Expert/Admin
2. Vào "Thư viện tài liệu"
3. Click "Upload tài liệu"
4. Điền thông tin và nội dung
5. Upload file đính kèm (tùy chọn)
6. Preview trước khi publish

## 🎯 Mục tiêu UX

1. ✅ **Trải nghiệm đọc tự nhiên, mạch lạc**
   - One-column layout tối ưu cho long-form reading
   - Typography rõ ràng, line-height thoải mái

2. ✅ **Cảm giác đáng tin cậy như tư vấn chuyên gia**
   - Giọng văn chuyên nghiệp
   - Avatar "AI" tạo personality
   - Badge phân loại tài liệu

3. ✅ **Minh bạch tài liệu mà chatbot sử dụng**
   - Document references inline
   - Excerpt hiển thị đúng nội dung được sử dụng
   - Trust note trong trang chi tiết

4. ✅ **Responsive tốt trên desktop/tablet/mobile**
   - Sidebar adaptive: Fixed → Drawer → Hidden
   - Touch-friendly trên mobile
   - Optimized cho mọi màn hình

5. ✅ **Hạn chế rủi ro mất dữ liệu người dùng**
   - Archive thay vì Delete
   - Auto-save chat sessions
   - Confirmation cho các hành động quan trọng

## 🎨 Design Principles

1. **Progressive Disclosure**: Chỉ hiển thị thông tin khi cần
2. **Friction cho Destructive Actions**: Delete yêu cầu nhiều bước
3. **Context Preservation**: Giữ user trong flow, tránh context switching
4. **Trust & Transparency**: Luôn rõ ràng về nguồn gốc thông tin
5. **Content First**: UI phục vụ nội dung, không làm rối mắt

## 📝 Notes

- Chatbot AI hiện đang dùng mock responses (bạn có thể tích hợp OpenAI/Claude API)
- File upload hiện chưa tích hợp Supabase Storage thực (dùng mock URL)
- Demo documents được khởi tạo tự động lần đầu chạy server

---

**Designed with ❤️ for Vietnamese Startups**
