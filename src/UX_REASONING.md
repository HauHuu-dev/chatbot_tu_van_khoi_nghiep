# UX Reasoning - Website Chatbot Tư Vấn Khởi Nghiệp

## 1. Vì sao one-column trong trang Chat?

### Quyết định:
Khu vực chat sử dụng layout one-column, canh giữa với max-width: 3xl (768px)

### Lý do:

#### a) Tối ưu cho đọc dài (Long-form Reading)
- **Khoa học nhận thức**: Mắt người đọc thoải mái nhất với độ rộng 45-75 ký tự mỗi dòng
- **Giảm di chuyển mắt**: Column hẹp giúp mắt không phải quét quá rộng, giảm mỏi mắt
- **Tập trung nội dung**: Loại bỏ distraction, người dùng focus 100% vào cuộc hội thoại

#### b) Phù hợp với nội dung dạng văn bản
- Câu trả lời của chatbot thường dài, có cấu trúc (heading, bullet points, đoạn văn)
- Nội dung chuyên môn cần được đọc kỹ, không skim qua như social media
- One-column tạo cảm giác nghiêm túc, chuyên gia (như đọc blog/article)

#### c) Responsive tự nhiên
- Desktop: Column giữa tạo không gian thoáng đãng
- Tablet: Vẫn giữ được trải nghiệm đọc tốt
- Mobile: Không cần điều chỉnh nhiều, vì bản chất đã là một cột

#### d) Tương thích với sidebar
- Sidebar chiếm 320px bên trái, chat column ở giữa tạo balance
- Không gian bên phải tạo "breathing room"
- User không bị overwhelm bởi quá nhiều thông tin cùng lúc

### So sánh với multi-column:
- ❌ Multi-column (2-3 cột): Phù hợp dashboard, data visualization
- ❌ Full-width: Phù hợp social feed, gallery
- ✅ One-column: Tối ưu cho long-form content, reading experience

---

## 2. Vì sao tài liệu tham khảo hiển thị inline?

### Quyết định:
Document references xuất hiện ngay trong chat message, có thể mở rộng/thu gọn

### Lý do:

#### a) Transparency & Trust (Minh bạch & Đáng tin cậy)
- **Nguyên tắc**: "Tin tưởng nhưng cần kiểm chứng"
- User thấy ngay chatbot dựa vào nguồn nào → tăng độ tin cậy
- Không giống AI đen tội, không rõ nguồn gốc câu trả lời

#### b) Context ngay lập tức
- User đang đọc câu trả lời, muốn biết thêm → click ngay, không phải:
  - Nhớ tên tài liệu
  - Chuyển tab khác
  - Search lại
  - Mất맥락 (context)

#### c) Giảm cognitive load
- **Không cần chuyển trang**: Giữ user trong flow tư duy
- **Progressive disclosure**: Thu gọn mặc định → chỉ mở khi cần
- **Scannable**: Thấy nhanh có mấy tài liệu, thuộc loại gì (badge màu)

#### d) Expert consultation metaphor
- Khi hỏi chuyên gia thực tế, họ nói: "Theo nghiên cứu X, Y, Z..."
- Inline references giống như expert cite nguồn trong khi nói
- Tạo cảm giác conversation chuyên sâu, không phải FAQ bot

#### e) Tránh link blindness
- Nếu chỉ có link text → user bỏ qua (banner blindness tương tự)
- Card với badge, excerpt → eye-catching, invite action

### Alternatives đã loại bỏ:
- ❌ Footnote dưới cùng: User phải scroll, mất맥락
- ❌ Popup/Modal: Interrupt flow, annoying trên mobile
- ❌ Sidebar references: Chiếm không gian, distract khi không cần
- ✅ Inline + collapsible: Balance giữa transparency và clean UI

### Thiết kế chi tiết:
```
[Câu trả lời của bot]

📚 Tài liệu tham khảo (3) ▼  ← Collapsed mặc định, không gây rối
  
  [Khi mở]
  ┌─────────────────────────────┐
  │ 📄 Tiêu đề tài liệu         │ [Badge: Lý thuyết]
  │ "Excerpt ngắn..."           │
  │ → Xem chi tiết tài liệu     │
  └─────────────────────────────┘
```

---

## 3. Vì sao dùng Archive thay vì Delete?

### Quyết định:
User không thể xóa chat session trực tiếp, chỉ có thể Archive

### Lý do:

#### a) Bảo vệ tài sản tư duy (Intellectual Asset Protection)
- Chat history = quá trình tư duy, research, brainstorm
- Giống lab notebook của nhà khoa học → KHÔNG BAO GIỜ xóa
- Startup founder thường quay lại idea cũ sau nhiều tháng

#### b) Tránh hối hận (Regret Prevention)
- **Thống kê**: 60% user hối hận sau khi delete content vĩnh viễn
- Delete = hành động không thể undo → cần friction cao
- Archive = "cất đi" nhưng vẫn có thể lấy lại → low friction, safe

#### c) Organize, not destroy (Tổ chức, không phá hủy)
- Vấn đề thực sự: "Quá nhiều chat, không tìm được cái cần"
- Giải pháp: Archive = dọn dẹp UI, không phải xóa data
- Giống Gmail: Archive email, không delete

#### d) Compliance & Legal
- Nhiều startup cần keep records cho investor, legal
- Nếu user tự delete → mất evidence cho pitch, báo cáo
- Archive cho phép admin/founder review lại full history

#### e) Psychological safety
- User cảm thấy an toàn khi thử nghiệm, hỏi nhiều
- Không lo "làm bẩn" history vì có thể archive
- Encourage exploration thay vì self-censorship

### Flow thiết kế:

```
Main Sidebar
├─ Active chats (hiển thị)
└─ (Archived chats ẩn)

Settings > Data Management
├─ Archived chats (xem, restore)
└─ Delete permanently
    ├─ Chỉ áp dụng cho archived items
    └─ Warning: "Không thể hoàn tác"
```

### Best practices applied:
1. **Destructive actions require friction**
   - Archive: 1 click
   - Delete forever: 2 clicks + confirmation modal

2. **Progressive commitment**
   - Step 1: Archive (reversible)
   - Step 2: Delete archived (after cooling period)

3. **Clear information architecture**
   - Active: Sidebar
   - Archived: Settings
   - Deleted: Gone forever

### User education:
- Onboarding tip: "Phiên chat không thể xóa trực tiếp để bảo vệ ý tưởng của bạn"
- Archive button tooltip: "Ẩn khỏi danh sách (có thể khôi phục)"
- Settings explain: "Xóa vĩnh viễn chỉ dành cho chat đã archive"

---

## Tổng kết

Ba quyết định UX này đều hướng đến mục tiêu chung:

1. **Trải nghiệm đọc tự nhiên** → One-column layout
2. **Cảm giác đáng tin cậy** → Inline document references  
3. **Hạn chế rủi ro mất dữ liệu** → Archive over Delete

Tất cả đều dựa trên:
- Nghiên cứu khoa học về UX/UI
- Best practices từ các sản phẩm thành công (Gmail, Notion, Linear)
- Đặc thù của startup advisory (cần trust, transparency, long-form thinking)
