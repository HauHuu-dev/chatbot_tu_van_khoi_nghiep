export interface Document {
  id: string;
  title: string;
  category: 'theory' | 'market' | 'policy';
  excerpt: string;
  content: string;
  author: string;
  source: string;
  attachments?: {
    name: string;
    type: string;
    size: string;
    url: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdate: string;
  messages: Message[];
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
  references?: Document[];
}

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Xây dựng Business Model Canvas cho startup công nghệ',
    category: 'theory',
    excerpt: 'Business Model Canvas là công cụ chiến lược quan trọng giúp startup hình dung tổng thể mô hình kinh doanh. Gồm 9 khối cơ bản: Phân khúc khách hàng, Giá trị cung cấp, Kênh phân phối...',
    content: `# Xây dựng Business Model Canvas cho startup công nghệ

## Giới thiệu

Business Model Canvas (BMC) là một công cụ quản lý chiến lược giúp các startup hình dung, thiết kế và đổi mới mô hình kinh doanh của mình một cách có hệ thống.

## 9 Khối xây dựng cơ bản

### 1. Phân khúc khách hàng (Customer Segments)
Xác định rõ nhóm khách hàng mục tiêu mà startup muốn phục vụ. Đối với startup công nghệ, có thể là:
- Doanh nghiệp vừa và nhỏ (SMEs)
- Người tiêu dùng cá nhân (B2C)
- Doanh nghiệp lớn (Enterprise)

### 2. Giá trị cung cấp (Value Propositions)
Sản phẩm/dịch vụ giải quyết vấn đề gì của khách hàng? Lợi ích cốt lõi là gì?

### 3. Kênh phân phối (Channels)
Làm thế nào để tiếp cận khách hàng? Website, app, đại lý, mạng xã hội...

### 4. Mối quan hệ khách hàng (Customer Relationships)
Xây dựng và duy trì mối quan hệ như thế nào? Hỗ trợ tự động, cộng đồng, tư vấn cá nhân...

### 5. Nguồn doanh thu (Revenue Streams)
Từ đâu startup kiếm tiền? Subscription, freemium, quảng cáo, phí giao dịch...

### 6. Tài nguyên chính (Key Resources)
Tài sản cần thiết: đội ngũ, công nghệ, vốn, tài sản trí tuệ...

### 7. Hoạt động chính (Key Activities)
Những hoạt động quan trọng nhất: phát triển sản phẩm, marketing, vận hành nền tảng...

### 8. Đối tác chính (Key Partnerships)
Ai là đối tác chiến lược? Nhà cung cấp, đối tác công nghệ, kênh phân phối...

### 9. Cơ cấu chi phí (Cost Structure)
Chi phí chính là gì? Phát triển, marketing, nhân sự, hạ tầng...

## Ứng dụng thực tế

BMC giúp startup:
- Hình dung tổng thể mô hình kinh doanh trên 1 trang
- Dễ dàng thảo luận và điều chỉnh
- Xác định giả thuyết cần kiểm nghiệm
- Tối ưu hóa mô hình theo thời gian`,
    author: 'TS. Nguyễn Văn An',
    source: 'Trung tâm Hỗ trợ Khởi nghiệp Quốc gia',
    attachments: [
      {
        name: 'business-model-canvas-template.pdf',
        type: 'pdf',
        size: '2.3 MB',
        url: '#',
      },
      {
        name: 'bmc-examples.docx',
        type: 'docx',
        size: '1.5 MB',
        url: '#',
      },
    ],
  },
  {
    id: '2',
    title: 'Nghiên cứu thị trường startup Việt Nam 2024',
    category: 'market',
    excerpt: 'Báo cáo phân tích xu hướng thị trường startup Việt Nam với 1,200+ startup hoạt động. Các ngành hot: Fintech, EdTech, HealthTech. Tổng vốn đầu tư đạt $1.2B trong năm 2023...',
    content: `# Nghiên cứu thị trường startup Việt Nam 2024

## Tổng quan thị trường

Thị trường startup Việt Nam đang có sự tăng trưởng ấn tượng với hơn 1,200 startup đang hoạt động tích cực.

## Các ngành nổi bật

### 1. Fintech (Công nghệ tài chính)
- Chiếm 25% tổng số startup
- Giải quyết bài toán thanh toán, cho vay, quản lý tài chính
- Thu hút vốn đầu tư lớn nhất

### 2. EdTech (Công nghệ giáo dục)
- Tăng trưởng mạnh sau đại dịch
- Giải pháp học trực tuyến, quản lý giáo dục

### 3. HealthTech (Công nghệ y tế)
- Xu hướng chăm sóc sức khỏe từ xa
- Kết nối bệnh nhân - bác sĩ

### 4. E-commerce & Logistics
- Thị trường trưởng thành
- Cạnh tranh cao

## Nguồn vốn đầu tư

- Tổng vốn đầu tư 2023: $1.2 tỷ USD
- Giai đoạn Series A và Seed chiếm đa số
- Nhà đầu tư nước ngoài chiếm 60%

## Thách thức

- Thiếu nguồn nhân lực chất lượng cao
- Khó tiếp cận vốn giai đoạn đầu
- Cạnh tranh từ các tập đoàn lớn
- Thủ tục hành chính phức tạp

## Cơ hội

- Thị trường 100 triệu dân
- Tỷ lệ sử dụng internet và smartphone cao
- Chính phủ hỗ trợ khởi nghiệp sáng tạo
- Hội nhập quốc tế`,
    author: 'Hiệp hội Khởi nghiệp Việt Nam',
    source: 'Vietnam Startup Report 2024',
    attachments: [
      {
        name: 'vietnam-startup-report-2024.pdf',
        type: 'pdf',
        size: '5.8 MB',
        url: '#',
      },
    ],
  },
  {
    id: '3',
    title: 'Chính sách hỗ trợ khởi nghiệp sáng tạo - Nghị định 38/2018',
    category: 'policy',
    excerpt: 'Nghị định 38/2018/NĐ-CP quy định chi tiết hỗ trợ doanh nghiệp khởi nghiệp sáng tạo. Bao gồm: Hỗ trợ tài chính, không gian làm việc, tư vấn, đào tạo, kết nối...',
    content: `# Chính sách hỗ trợ khởi nghiệp sáng tạo - Nghị định 38/2018

## Tổng quan

Nghị định 38/2018/NĐ-CP của Chính phủ về hỗ trợ doanh nghiệp khởi nghiệp sáng tạo, ban hành ngày 11/03/2018.

## Đối tượng áp dụng

### Doanh nghiệp khởi nghiệp sáng tạo cần đáp ứng:

1. **Thời gian hoạt động**: Không quá 5 năm kể từ ngày cấp Giấy chứng nhận đăng ký doanh nghiệp
2. **Nguồn nhân lực**: Tối thiểu 15% lao động có trình độ đại học trở lên trong lĩnh vực khoa học, công nghệ
3. **Chi phí R&D**: Chi cho nghiên cứu và phát triển ≥ 15% tổng chi phí
4. **Doanh thu**: < 15 tỷ đồng/năm trong 2 năm liên tiếp trước đó

## Các hình thức hỗ trợ

### 1. Hỗ trợ tài chính
- **Hỗ trợ không hoàn lại**: Tối đa 500 triệu đồng cho hoạt động R&D
- **Bảo lãnh tín dụng**: Đến 85% giá trị khoản vay, tối đa 2 tỷ đồng
- **Hỗ trợ lãi suất vay**: Không quá 4%/năm

### 2. Không gian làm việc
- Hỗ trợ 50-100% chi phí thuê mặt bằng tại khu làm việc chung, vườn ươm
- Thời gian: Tối đa 12 tháng

### 3. Tư vấn và đào tạo
- Tư vấn về pháp lý, tài chính, thị trường
- Đào tạo kỹ năng quản lý, marketing
- Hỗ trợ đến 100% chi phí

### 4. Kết nối
- Kết nối với nhà đầu tư
- Kết nối với đối tác công nghệ, khách hàng
- Tham gia sự kiện, triển lãm trong và ngoài nước

## Thủ tục đăng ký

1. Nộp hồ sơ đến Sở Khoa học và Công nghệ
2. Thẩm định trong vòng 30 ngày
3. Cấp Giấy chứng nhận doanh nghiệp khởi nghiệp sáng tạo

## Quyền lợi khi được công nhận

- Được hưởng các chính sách ưu đãi nêu trên
- Được ưu tiên trong các chương trình hỗ trợ của Nhà nước
- Được tham gia mạng lưới khởi nghiệp quốc gia

## Lưu ý quan trọng

- Doanh nghiệp cần chủ động cập nhật thông tin, chính sách thay đổi
- Cần chuẩn bị hồ sơ chứng minh đầy đủ
- Chính sách có thể thay đổi theo từng địa phương`,
    author: 'Bộ Khoa học và Công nghệ',
    source: 'Chính phủ Việt Nam',
    attachments: [
      {
        name: 'nghi-dinh-38-2018-full.pdf',
        type: 'pdf',
        size: '3.2 MB',
        url: '#',
      },
      {
        name: 'huong-dan-dang-ky.docx',
        type: 'docx',
        size: '890 KB',
        url: '#',
      },
    ],
  },
];

export const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Xây dựng Business Model Canvas',
    lastUpdate: '2 giờ trước',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Tôi muốn xây dựng Business Model Canvas cho startup công nghệ của mình. Bạn có thể hướng dẫn tôi không?',
        timestamp: '14:30',
      },
      {
        id: '2',
        type: 'bot',
        content: `Tôi rất vui được hỗ trợ bạn xây dựng Business Model Canvas (BMC) cho startup công nghệ. BMC là công cụ chiến lược giúp bạn hình dung tổng thể mô hình kinh doanh một cách có hệ thống.

**9 khối xây dựng cơ bản của BMC:**

1. **Phân khúc khách hàng** - Xác định rõ nhóm khách hàng mục tiêu (SMEs, B2C, Enterprise)
2. **Giá trị cung cấp** - Sản phẩm/dịch vụ giải quyết vấn đề gì của khách hàng
3. **Kênh phân phối** - Cách tiếp cận khách hàng (website, app, mạng xã hội)
4. **Mối quan hệ khách hàng** - Cách xây dựng và duy trì quan hệ
5. **Nguồn doanh thu** - Mô hình kiếm tiền (subscription, freemium, quảng cáo)
6. **Tài nguyên chính** - Tài sản cần thiết (đội ngũ, công nghệ, vốn)
7. **Hoạt động chính** - Các hoạt động quan trọng nhất
8. **Đối tác chính** - Đối tác chiến lược cần thiết
9. **Cơ cấu chi phí** - Các khoản chi phí chính

**Lợi ích của BMC:**
- Hình dung toàn bộ mô hình trên 1 trang
- Dễ dàng thảo luận và điều chỉnh với đội ngũ
- Xác định giả thuyết cần kiểm nghiệm
- Tối ưu hóa mô hình theo thời gian

Bạn muốn tôi giải thích chi tiết khối nào trước?`,
        timestamp: '14:31',
        references: [mockDocuments[0]],
      },
    ],
  },
  {
    id: '2',
    title: 'Thị trường startup Việt Nam',
    lastUpdate: 'Hôm qua',
    messages: [],
  },
  {
    id: '3',
    title: 'Chính sách hỗ trợ khởi nghiệp',
    lastUpdate: '3 ngày trước',
    messages: [],
  },
];
