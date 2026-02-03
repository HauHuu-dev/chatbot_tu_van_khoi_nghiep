import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-User-Id'],
}));

// Initialize Supabase clients
// Fallback values to ensure backend and frontend use the same Supabase instance
const FALLBACK_SUPABASE_URL = 'https://fcmmhyxjmomcdbniimxu.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjbW1oeXhqbW9tY2RibmlpbXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMzYzMTgsImV4cCI6MjA4NTYxMjMxOH0.BEB58h_rxNR-EyPqpgvAh-w5puyJS17XPMuO38KbyN4';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? FALLBACK_SUPABASE_URL;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? FALLBACK_ANON_KEY;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

console.log('=== Server Initialization ===');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('Using fallback URL:', !Deno.env.get('SUPABASE_URL'));
console.log('SUPABASE_ANON_KEY length:', supabaseAnonKey.length);
console.log('Using fallback anon key:', !Deno.env.get('SUPABASE_ANON_KEY'));
console.log('Has service role key:', !!supabaseServiceKey);
console.log('Service role key length:', supabaseServiceKey.length);

if (!supabaseServiceKey || supabaseServiceKey.length === 0) {
  console.error('❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY not found in environment variables!');
  console.error('Backend will not be able to create users or verify JWT tokens.');
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY in Supabase edge function secrets.');
}

// Service role client for admin operations (create users, bypass RLS, and verify JWT)
const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey, // Fallback to anon key if service key missing
);

// Public anon client for reference
const supabaseAuth = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// Demo documents for initial data
const demoDocuments = [
  {
    id: 'doc-1',
    title: 'Khung lập kế hoạch kinh doanh cho startup',
    category: 'theory',
    author: 'Nguyễn Văn A',
    status: 'approved',
    content: `# Khung lập kế hoạch kinh doanh cho startup

Kế hoạch kinh doanh là bản đồ dẫn đường cho startup của bạn. Dưới đây là các thành phần cốt lõi:

## 1. Tóm tắt điều hành (Executive Summary)

Đây là phần quan trọng nhất, nên viết cuối cùng. Bao gồm:
- Tầm nhìn và sứ mệnh
- Sản phẩm/dịch vụ cốt lõi
- Thị trường mục tiêu
- Lợi thế cạnh tranh
- Dự báo tài chính tóm tắt

## 2. Phân tích thị trường

Hiểu rõ thị trường là chìa khóa thành công:
- Quy mô thị trường (TAM, SAM, SOM)
- Xu hướng ngành
- Phân khúc khách hàng
- Phân tích đối thủ cạnh tranh

## 3. Mô hình kinh doanh

Làm thế nào để tạo ra doanh thu?
- Luồng doanh thu
- Cơ cấu chi phí
- Đơn vị kinh tế (unit economics)
- Chiến lược định giá

## 4. Kế hoạch vận hành

Chi tiết cách thức thực hiện:
- Quy trình sản xuất/phát triển
- Chuỗi cung ứng
- Đội ngũ và tổ chức
- Công nghệ và hạ tầng

## 5. Chiến lược marketing và bán hàng

Làm sao để tiếp cận khách hàng?
- Định vị thương hiệu
- Kênh marketing (online/offline)
- Chiến lược content
- Quy trình bán hàng

## 6. Dự báo tài chính

Số liệu cụ thể trong 3-5 năm:
- Dự báo doanh thu
- Chi phí vận hành
- Lợi nhuận/lỗ
- Dòng tiền (cash flow)
- Điểm hòa vốn (break-even)

## Lời khuyên quan trọng

• Hãy thực tế và dựa trên số liệu
• Cập nhật thường xuyn khi có thông tin mới
• Sử dụng kế hoạch như công cụ quản lý, không chỉ để gọi vốn
• Chuẩn bị cho nhiều kịch bản (best case, base case, worst case)`,
    attachments: [
      {
        id: 'att-1',
        name: 'Business_Plan_Template_2026.pdf',
        size: 2458000,
        type: 'pdf',
        url: 'https://example.com/business-plan-template.pdf',
      },
      {
        id: 'att-2',
        name: 'Financial_Model_Startup.xlsx',
        size: 1024000,
        type: 'docx',
        url: 'https://example.com/financial-model.xlsx',
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'doc-2',
    title: 'Phân tích thị trường F&B Việt Nam 2026',
    category: 'market',
    author: 'Trần Thị B',
    status: 'approved',
    content: `# Phân tích thị trường F&B Việt Nam 2026

Thị trường ẩm thực (F&B) tại Việt Nam đang có những biến động đáng chú ý.

## Tổng quan thị trường

Thị trường F&B Việt Nam năm 2026 ước đạt 45 tỷ USD, tăng trưởng 8-10% so với năm trước.

### Động lực tăng trưởng chính:

- Thu nhập bình quân tăng cao
- Tầng lớp trung lưu mở rộng
- Xu hướng ăn uống ngoài gia đình tăng
- Thế hệ Gen Z và Millennials chiếm tỷ trọng lớn

## Xu hướng tiêu dùng nổi bật

### 1. Healthy & Organic

Người tiêu dùng ngày càng quan tâm đến sức khỏe:
- Thực phẩm hữu cơ tăng 25% năm/năm
- Low-carb, plant-based phát triển mạnh
- Minh bạch nguồn gốc nguyên liệu

### 2. Convenience & Delivery

Dịch vụ giao hàng là must-have:
- 70% người dùng đặt đồ ăn online thường xuyên
- Dark kitchen, cloud kitchen phát triển
- Thời gian giao hàng rút ngắn xuống < 30 phút

### 3. Experience & Ambiance

Không chỉ ăn, mà còn trải nghiệm:
- Instagram-able space
- Câu chuyện thương hiệu độc đáo
- Tương tác với khách hàng qua social media

## Phân khúc thị trường

### Premium (20% thị trường)
- Fine dining, fusion cuisine
- Giá trung bình: 500k-2M/người
- Khách hàng: thu nhập cao, expat

### Mid-range (50% thị trường)
- Chuỗi nhà hàng, quán cafe
- Giá: 100k-500k/người
- Phân khúc cạnh tranh nhất

### Budget (30% thị trường)
- Quán ăn đường phố, food court
- Giá: < 100k/người
- Khối lượng lớn, margin thấp

## Thách thức cho startup F&B

• Cạnh tranh khốc liệt, tỷ lệ đóng cửa cao (40% trong 2 năm đầu)
• Chi phí mặt bằng và nhân sự tăng cao
• Khó duy trì chất lượng ổn định khi scale
• Quản lý dòng tiền phức tạp

## Cơ hội

• Niche markets chưa khai thác (dietary restrictions, local cuisine hiện đại)
• Công nghệ F&B tech (POS, CRM, inventory)
• Mô hình franchise, multi-brand
- Xuất khẩu văn hóa ẩm thực Việt`,
    attachments: [],
    createdAt: '2026-01-20T14:30:00Z',
  },
  {
    id: 'doc-3',
    title: 'Chính sách hỗ trợ khởi nghiệp Việt Nam 2026',
    category: 'policy',
    author: 'Lê Văn C',
    status: 'approved',
    content: `# Chính sách hỗ trợ khởi nghiệp Việt Nam 2026

Chính phủ Việt Nam đang có nhiều chương trình hỗ trợ cho startup và doanh nghiệp nhỏ.

## 1. Quỹ hỗ trợ khởi nghiệp quốc gia

### Thông tin chung:
- Tổng nguồn vốn: 5,000 tỷ VNĐ
- Hỗ trợ đến 70% vốn đầu tư
- Tối đa 3 tỷ VNĐ/dự án

### Điều kiện:
- Doanh nghiệp thành lập < 5 năm
- Có công nghệ sáng tạo hoặc giải pháp mới
- Đội ngũ sáng lập từ 2 người trở lên
- Business plan rõ ràng

### Quy trình:
1. Nộp hồ sơ online qua portal.gov.vn
2. Vòng sơ loại (15 ngày)
3. Thuyết trình trước hội đồng
4. Giải ngân theo từng milestone

## 2. Ưu đãi thuế cho startup

### Miễn thuế thu nhập doanh nghiệp:
- 4 năm đầu: 0% thuế
- 9 năm tiếp theo: 50% mức thuế suất

### Điều kiện áp dụng:
- Doanh thu < 50 tỷ VNĐ/năm
- Hoạt động trong lĩnh vực ưu tiên (tech, giáo dục, y tế, nông nghiệp công nghệ cao)

## 3. Không gian làm việc miễn phí

### Chương trình Co-working Space:
- 120+ không gian tại 63 tỉnh thành
- Miễn phí 12 tháng đầu
- Kết nối mentor, investor

### Tiện ích:
- Wifi tốc độ cao
- Phòng họp
- Sự kiện networking hàng tuần
- Tư vấn pháp lý, kế toán cơ bản

## 4. Chương trình đào tạo và mentorship

### Startup Academy:
- 16 tuần đào tạo chuyên sâu
- Mentor 1-1 từ founder thành công
- Demo Day với investor

### Nội dung:
- Business model & strategy
- Product development
- Marketing & growth hacking
- Fundraising & pitching

## 5. Hỗ trợ vốn từ các tổ chức

### Quỹ đầu tư khởi nghiệp sáng tạo:
- 500 Startups Vietnam
- Touchstone Partners
- Vietnam Silicon Valley

### Angel Investors Network:
- VBAN (Vietnam Business Angel Network)
- Kết nối startup với 200+ angel investors

## 6. Thủ tục hành chính đơn giản hóa

### Đăng ký doanh nghiệp online:
- 3 ngày làm việc
- Không cần công chứng hầu hết giấy tờ
- Hệ thống một cửa điện tử

### Chế độ báo cáo đơn giản:
- Startup < 3 tỷ doanh thu: báo cáo quý
- Không bắt buộc kiểm toán năm đầu

## Lưu ý quan trọng

• Cập nhật thông tin thường xuyên trên cổng khởi nghiệp quốc gia
• Tham gia cộng đồng startup để nhận thông tin sớm
• Chuẩn bị hồ sơ đầy đủ và kỹ lưỡng
• Tận dụng kết hợp nhiều chương trình hỗ trợ

## Liên hệ

Website: khoinghiep.gov.vn
Hotline: 1900-xxxx
Email: hotro@khoinghiep.gov.vn`,
    attachments: [],
    createdAt: '2026-02-01T09:00:00Z',
  },
];

// ==================== ROUTES ====================

// Health check
app.get('/make-server-5e6b6e45/health', (c) => {
  return c.json({ status: 'ok' });
});

// Debug endpoint to check environment
app.get('/make-server-5e6b6e45/debug-env', (c) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const hasServiceKey = !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const hasAnonKey = !!Deno.env.get('SUPABASE_ANON_KEY');
  const anonKeyLength = Deno.env.get('SUPABASE_ANON_KEY')?.length || 0;
  const serviceKeyLength = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.length || 0;
  
  // Check all available env vars that might be the anon key
  const envVars = Object.keys(Deno.env.toObject()).filter(key => 
    key.includes('SUPABASE') || key.includes('ANON')
  );
  
  return c.json({
    supabaseUrl,
    hasServiceKey,
    serviceKeyLength,
    hasAnonKey,
    anonKeyLength,
    availableSupabaseEnvVars: envVars,
    supabaseUrlMatch: supabaseUrl === 'https://fcmmhyxjmomcdbniimxu.supabase.co',
  });
});

// List all users for debugging
app.get('/make-server-5e6b6e45/debug-users', async (c) => {
  try {
    // First, initialize demo users
    console.log('🔧 Initializing demo users...');
    await initializeDemoUsers();
    
    // Then list all users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      return c.json({ error: error.message, errorDetails: error }, 500);
    }
    
    const users = data?.users?.map(u => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      confirmed_at: u.confirmed_at,
    })) || [];
    
    return c.json({ users, count: users.length });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// Test token verification endpoint
app.post('/make-server-5e6b6e45/test-token', async (c) => {
  try {
    const { token } = await c.req.json();
    
    console.log('Testing token verification...');
    console.log('Token length:', token?.length);
    console.log('Token first 50 chars:', token?.substring(0, 50));
    
    // Test with anon client
    console.log('Testing with anon client...');
    const { data: { user: anonUser }, error: anonError } = await supabaseAuth.auth.getUser(token);
    
    // Test with admin client
    console.log('Testing with admin client...');
    const { data: { user: adminUser }, error: adminError } = await supabaseAdmin.auth.getUser(token);
    
    return c.json({ 
      anonClient: {
        success: !anonError,
        error: anonError?.message,
        errorCode: anonError?.code,
        user: anonUser ? { id: anonUser.id, email: anonUser.email } : null,
      },
      adminClient: {
        success: !adminError,
        error: adminError?.message,
        errorCode: adminError?.code,
        user: adminUser ? { id: adminUser.id, email: adminUser.email } : null,
      },
      serviceKeyAvailable: !!supabaseServiceKey && supabaseServiceKey.length > 0,
      serviceKeyLength: supabaseServiceKey?.length || 0,
    });
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// Get profile using token (works like test-token but returns profile)
app.post('/make-server-5e6b6e45/get-profile', async (c) => {
  try {
    const { token } = await c.req.json();
    
    if (!token) {
      return c.json({ error: 'No token provided' }, 401);
    }
    
    // Use anon client to verify token (confirmed working)
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Invalid token', details: error?.message }, 401);
    }
    
    // Get profile from KV store
    let profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      // Create default profile
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
      };
      await kv.set(`user:${user.id}`, profile);
    }
    
    return c.json(profile);
  } catch (err) {
    return c.json({ error: String(err) }, 500);
  }
});

// ==================== AUTH ====================

// Sign up
app.post('/make-server-5e6b6e45/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return c.json({ error: 'Email không hợp lệ' }, 400);
    }

    if (!password || password.length < 6) {
      return c.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, 400);
    }

    if (!name || name.trim().length === 0) {
      return c.json({ error: 'Tên không được để trống' }, 400);
    }

    // Check if user already exists by trying to list users with this email
    const normalizedEmail = email.trim().toLowerCase();
    
    try {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const userExists = existingUsers?.users?.some(
        user => user.email?.toLowerCase() === normalizedEmail
      );
      
      if (userExists) {
        return c.json({ 
          error: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.' 
        }, 422);
      }
    } catch (listError) {
      // If we can't list users, continue with creation and handle error there
      console.log('Could not pre-check user existence:', listError);
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      user_metadata: { name: name.trim() },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle specific error cases
      const errorMessage = error.message || '';
      const errorCode = error.code || '';
      
      if (errorMessage.includes('already been registered') || errorCode === 'email_exists' || error.status === 422) {
        return c.json({ error: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.' }, 422);
      }
      
      return c.json({ error: errorMessage || 'Không thể tạo tài khoản' }, 400);
    }

    // Save user profile
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: normalizedEmail,
      name: name.trim(),
      role: 'user',
    });

    return c.json({ success: true, userId: data.user.id });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get user profile
app.get('/make-server-5e6b6e45/profile', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('=== PROFILE REQUEST ===');
    console.log('Authorization header present:', !!authHeader);
    
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      console.error('Profile fetch failed: No access token provided');
      return c.json({ error: 'Unauthorized - No token' }, 401);
    }

    console.log('Access token length:', accessToken.length);
    console.log('Token first 50 chars:', accessToken.substring(0, 50));
    
    console.log('Service role key available:', !!supabaseServiceKey && supabaseServiceKey.length > 0);
    
    let user = null;
    let verificationError = null;
    
    // IMPORTANT: Try with anon client first because the token was created using anon key
    console.log('Attempting verification with anon client (primary method)...');
    const { data: { user: anonUser }, error: anonError } = await supabaseAuth.auth.getUser(accessToken);
    
    console.log('Anon client result - user:', anonUser?.id, 'error:', anonError?.message);
    
    if (!anonError && anonUser) {
      console.log('✅ Token verified with anon client');
      user = anonUser;
    } else {
      console.log('⚠️  Anon client verification failed:', anonError?.message);
      verificationError = anonError;
      
      // Fallback to admin client if anon failed
      if (supabaseServiceKey && supabaseServiceKey.length > 0) {
        console.log('Attempting verification with admin client (fallback)...');
        const { data: { user: adminUser }, error: adminError } = await supabaseAdmin.auth.getUser(accessToken);
        
        console.log('Admin client result - user:', adminUser?.id, 'error:', adminError?.message);
        
        if (!adminError && adminUser) {
          console.log('✅ Token verified with admin client');
          user = adminUser;
        } else {
          console.log('❌ Admin client verification also failed:', adminError?.message);
          verificationError = adminError || verificationError;
        }
      }
    }
    
    console.log('Final verification result - has user:', !!user, 'user id:', user?.id);
    
    // If both failed, return error
    if (!user) {
      console.error('❌ Token verification failed');
      console.error('Final error:', verificationError);
      
      return c.json({ 
        code: verificationError?.status || 401,
        message: verificationError?.message || 'Invalid JWT',
        errorCode: verificationError?.code,
      }, verificationError?.status || 401);
    }

    console.log('✅ User verified successfully:', user.id);
    console.log('User email:', user.email);

    const profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      // Create default profile
      const defaultProfile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
      };
      console.log('Creating default profile for user:', user.id);
      await kv.set(`user:${user.id}`, defaultProfile);
      return c.json(defaultProfile);
    }

    console.log('✅ Profile found and returned');
    return c.json(profile);
  } catch (error) {
    console.error('❌ Profile fetch exception:', error);
    return c.json({ error: 'Failed to fetch profile', details: String(error) }, 500);
  }
});

// Get user profile V2 - Uses same logic as test-token endpoint (confirmed working)
app.get('/make-server-5e6b6e45/profile-v2', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No token provided' }, 401);
    }
    
    // Use anon client to verify token (same as test-token endpoint)
    const { data: { user }, error } = await supabaseAuth.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid token', details: error?.message }, 401);
    }
    
    // Get profile from KV store
    let profile = await kv.get(`user:${user.id}`);
    
    if (!profile) {
      // Create default profile
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
      };
      await kv.set(`user:${user.id}`, profile);
    }
    
    return c.json(profile);
  } catch (error) {
    return c.json({ error: 'Server error', details: String(error) }, 500);
  }
});

// ==================== CHAT ====================

// Get chat sessions
app.get('/make-server-5e6b6e45/sessions', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ sessions: [] });
    }

    const sessions = await kv.getByPrefix(`session:${userId}:`);
    const sortedSessions = sessions
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .filter(s => !s.archived);

    return c.json({ sessions: sortedSessions });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return c.json({ error: 'Failed to fetch sessions' }, 500);
  }
});

// Save chat session
app.post('/make-server-5e6b6e45/sessions/:sessionId', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionId = c.req.param('sessionId');
    const session = await c.req.json();

    await kv.set(`session:${userId}:${sessionId}`, session);
    return c.json({ success: true });
  } catch (error) {
    console.error('Session save error:', error);
    return c.json({ error: 'Failed to save session' }, 500);
  }
});

// Chat endpoint (mock AI response)
app.post('/make-server-5e6b6e45/chat', async (c) => {
  try {
    const { message } = await c.req.json();

    // Mock AI response with document references
    const responses = [
      {
        response: `Dựa trên câu hỏi của bạn về "${message.slice(0, 50)}...", tôi xin tư vấn như sau:

## Phân tích ban đầu

Để giải quyết vấn đề này hiệu quả, bạn cần chú ý đến các yếu tố sau:

• Xác định rõ mục tiêu cụ thể mà bạn muốn đạt được
• Phân tích nguồn lực hiện có (tài chính, con người, thời gian)
• Đánh giá rủi ro và lập kế hoạch dự phòng
• Thiết lập các chỉ số đo lường thành công (KPIs)

## Khuyến nghị cụ thể

1. **Giai đoạn đầu**: Tập trung xây dựng MVP (Minimum Viable Product) để test thị trường nhanh chóng

2. **Thu thập phản hồi**: Lắng nghe khách hàng và điều chỉnh sản phẩm/dịch vụ theo nhu cầu thực tế

3. **Tối ưu chi phí**: Ưu tiên các kênh marketing có ROI cao, tránh phân tán nguồn lực

Bạn có câu hỏi cụ thể nào khác không?`,
        references: [
          {
            id: 'doc-1',
            title: 'Khung lập kế hoạch kinh doanh cho startup',
            category: 'theory',
            excerpt: 'Kế hoạch kinh doanh là bản đồ dẫn đường cho startup của bạn. Bao gồm các thành phần: Tóm tắt điều hành, Phân tích thị trường, Mô hình kinh doanh...',
          },
        ],
      },
      {
        response: `Cảm ơn bạn đã đặt câu hỏi về "${message.slice(0, 50)}...". Đây là một vấn đề rất quan trọng trong khởi nghiệp.

## Tình hình thị trường

Thị trường Việt Nam hiện tại đang có nhiều cơ hội cho startup, đặc biệt trong các lĩnh vực:

• Công nghệ & Digital transformation
• F&B và retail experience
• EdTech & HealthTech
• Fintech & E-commerce

## Yếu tố thành công

Để thành công trong môi trường cạnh tranh cao, bạn cần:

1. **Hiểu rõ khách hàng**: Nghiên cứu sâu về customer persona, pain points và nhu cầu thực sự

2. **Tạo điểm khác biệt**: Không chỉ làm tốt, mà phải làm khác biệt so với đối thủ

3. **Xây dựng đội ngũ mạnh**: Con người là tài sản quan trọng nhất của startup

4. **Quản lý tài chính chặt chẽ**: Dòng tiền là mạch máu của doanh nghiệp

Bạn đang ở giai đoạn nào của quá trình khởi nghiệp?`,
        references: [
          {
            id: 'doc-2',
            title: 'Phân tích thị trường F&B Việt Nam 2026',
            category: 'market',
            excerpt: 'Thị trường F&B Việt Nam năm 2026 ước đạt 45 tỷ USD, tăng trưởng 8-10%. Xu hướng nổi bật: Healthy & Organic, Convenience & Delivery, Experience & Ambiance...',
          },
          {
            id: 'doc-3',
            title: 'Chính sách hỗ trợ khởi nghiệp Việt Nam 2026',
            category: 'policy',
            excerpt: 'Quỹ hỗ trợ khởi nghiệp quốc gia với tổng vốn 5,000 tỷ VNĐ, hỗ trợ đến 70% vốn đầu tư, tối đa 3 tỷ VNĐ/dự án. Miễn thuế 4 năm đầu cho startup...',
          },
        ],
      },
    ];

    // Return random response
    const response = responses[Math.floor(Math.random() * responses.length)];

    return c.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Failed to process chat' }, 500);
  }
});

// ==================== DOCUMENTS ====================

// Initialize demo documents if not exists
const initializeDemoDocuments = async () => {
  const existingDocs = await kv.getByPrefix('document:');
  if (existingDocs.length === 0) {
    for (const doc of demoDocuments) {
      await kv.set(`document:${doc.id}`, doc);
    }
    console.log('Initialized demo documents');
  }
};

// Initialize demo users
const initializeDemoUsers = async () => {
  const demoUsers = [
    {
      email: 'user@demo.com',
      password: 'demo123456',
      name: 'Người dùng Demo',
      role: 'user',
    },
    {
      email: 'expert@demo.com',
      password: 'demo123456',
      name: 'Chuyên gia Demo',
      role: 'expert',
    },
    {
      email: 'admin@demo.com',
      password: 'demo123456',
      name: 'Admin Demo',
      role: 'admin',
    },
  ];

  console.log('🔧 Starting demo users initialization...');

  for (const demoUser of demoUsers) {
    try {
      // Check if user already exists in our KV store
      const existingProfile = await kv.get(`user:email:${demoUser.email}`);
      
      if (existingProfile) {
        console.log(`✅ Demo user already exists: ${demoUser.email}`);
        continue;
      }

      // Try to create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: demoUser.email,
        password: demoUser.password,
        user_metadata: { name: demoUser.name },
        email_confirm: true,
      });

      if (error) {
        // Check if it's a "user already exists" error
        if (error.message.includes('already') || error.status === 422) {
          console.log(`ℹ️  User already exists in Supabase: ${demoUser.email}, fetching ID...`);
          
          // List users to find this one
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(
            u => u.email?.toLowerCase() === demoUser.email
          );
          
          if (existingUser) {
            // Save profile with existing user ID
            const profile = {
              id: existingUser.id,
              email: demoUser.email,
              name: demoUser.name,
              role: demoUser.role,
            };
            await kv.set(`user:${existingUser.id}`, profile);
            await kv.set(`user:email:${demoUser.email}`, profile);
            console.log(`✅ Saved profile for existing user: ${demoUser.email}`);
          }
        } else {
          console.error(`❌ Error creating demo user ${demoUser.email}:`, error.message);
        }
        continue;
      }

      if (data.user) {
        // Save user profile
        const profile = {
          id: data.user.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role,
        };
        await kv.set(`user:${data.user.id}`, profile);
        await kv.set(`user:email:${demoUser.email}`, profile);
        console.log(`✅ Created demo user: ${demoUser.email} (${demoUser.role})`);
      }
    } catch (err) {
      console.error(`❌ Exception creating demo user ${demoUser.email}:`, err);
    }
  }
  
  console.log('🎉 Demo users initialization complete!');
};

// Get all documents
app.get('/make-server-5e6b6e45/documents', async (c) => {
  try {
    await initializeDemoDocuments();
    await initializeDemoUsers(); // Also initialize demo users
    
    const userId = c.req.header('X-User-Id');
    let userRole = 'user'; // Default role
    
    if (userId) {
      const userProfile = await kv.get(`user:${userId}`);
      if (userProfile) {
        userRole = userProfile.role;
      }
    }
    
    const documents = await kv.getByPrefix('document:');
    
    // Filter documents based on user role
    let filteredDocs = documents;
    if (userRole === 'admin' || userRole === 'expert') {
      // Admin and expert can see all documents
      filteredDocs = documents;
    } else {
      // Regular users only see approved documents
      filteredDocs = documents.filter(doc => doc.status === 'approved');
    }
    
    const sortedDocs = filteredDocs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return c.json({ documents: sortedDocs });
  } catch (error) {
    console.error('Documents fetch error:', error);
    return c.json({ error: 'Failed to fetch documents' }, 500);
  }
});

// Get single document
app.get('/make-server-5e6b6e45/documents/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const document = await kv.get(`document:${id}`);
    
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    return c.json(document);
  } catch (error) {
    console.error('Document fetch error:', error);
    return c.json({ error: 'Failed to fetch document' }, 500);
  }
});

// Create document
app.post('/make-server-5e6b6e45/documents', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user profile to check role
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const { title, category, author, content, attachments } = await c.req.json();
    
    // Determine status based on user role
    // Admin: auto-approved
    // Expert: pending (needs approval)
    // User: should not be able to upload (but if they do, set to pending)
    let status: 'pending' | 'approved' | 'rejected' = 'pending';
    if (userProfile.role === 'admin') {
      status = 'approved';
    }
    
    const document = {
      id: `doc-${Date.now()}`,
      title,
      category,
      author,
      content,
      attachments: attachments || [],
      createdAt: new Date().toISOString(),
      status,
      uploadedBy: userId,
    };

    await kv.set(`document:${document.id}`, document);
    
    console.log(`Document created: ${document.id}, status: ${status}, by user: ${userProfile.role}`);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Document create error:', error);
    return c.json({ error: 'Failed to create document' }, 500);
  }
});

// Approve or reject document (Admin only)
app.post('/make-server-5e6b6e45/documents/:id/review', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile || userProfile.role !== 'admin') {
      return c.json({ error: 'Only admins can review documents' }, 403);
    }

    const docId = c.req.param('id');
    const { status } = await c.req.json(); // 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid status. Must be approved or rejected' }, 400);
    }

    const document = await kv.get(`document:${docId}`);
    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    document.status = status;
    document.reviewedAt = new Date().toISOString();
    document.reviewedBy = userId;

    await kv.set(`document:${docId}`, document);
    
    console.log(`Document ${docId} ${status} by admin ${userId}`);
    
    return c.json({ success: true, document });
  } catch (error) {
    console.error('Document review error:', error);
    return c.json({ error: 'Failed to review document' }, 500);
  }
});

// Upload file (mock - returns a placeholder URL)
app.post('/make-server-5e6b6e45/upload', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // In a real implementation, you would upload to Supabase Storage
    // For now, return a mock URL
    const mockUrl = `https://example.com/files/${Date.now()}.pdf`;
    
    return c.json({ success: true, url: mockUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get admin statistics (Admin only)
app.get('/make-server-5e6b6e45/admin/stats', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is admin
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile || userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    // Get all users
    const allUsers = await kv.getByPrefix('user:');
    const usersByEmail = allUsers.filter(u => u.email); // Filter out duplicates
    const uniqueUsers = Array.from(new Map(usersByEmail.map(u => [u.email, u])).values());
    
    const userStats = {
      total: uniqueUsers.length,
      byRole: {
        user: uniqueUsers.filter(u => u.role === 'user').length,
        expert: uniqueUsers.filter(u => u.role === 'expert').length,
        admin: uniqueUsers.filter(u => u.role === 'admin').length,
      },
    };

    // Get all documents
    const allDocuments = await kv.getByPrefix('document:');
    const documentStats = {
      total: allDocuments.length,
      byStatus: {
        approved: allDocuments.filter(d => d.status === 'approved').length,
        pending: allDocuments.filter(d => d.status === 'pending').length,
        rejected: allDocuments.filter(d => d.status === 'rejected').length,
      },
      byCategory: {
        theory: allDocuments.filter(d => d.category === 'theory').length,
        market: allDocuments.filter(d => d.category === 'market').length,
        policy: allDocuments.filter(d => d.category === 'policy').length,
      },
    };

    // Get all sessions
    const allSessions = await kv.getByPrefix('session:');
    const sessionStats = {
      total: allSessions.length,
      active: allSessions.filter(s => !s.archived).length,
      archived: allSessions.filter(s => s.archived).length,
    };

    // Get all messages and calculate stats
    let totalUserMessages = 0;
    let totalBotMessages = 0;
    const messagesByDate: Record<string, { user: number; bot: number }> = {};
    const activeUsersByDate: Record<string, Set<string>> = {}; // Track unique users per day
    
    allSessions.forEach(session => {
      if (session.messages && Array.isArray(session.messages)) {
        session.messages.forEach((msg: any) => {
          if (msg.type === 'user') {
            totalUserMessages++;
          } else if (msg.type === 'bot') {
            totalBotMessages++;
          }
          
          // Group by date
          const date = new Date(msg.timestamp).toISOString().split('T')[0];
          if (!messagesByDate[date]) {
            messagesByDate[date] = { user: 0, bot: 0 };
          }
          if (msg.type === 'user') {
            messagesByDate[date].user++;
            
            // Track active users (users who sent messages)
            if (!activeUsersByDate[date]) {
              activeUsersByDate[date] = new Set();
            }
            // Extract userId from session key (format: session:userId:sessionId)
            const sessionKey = Object.keys(session).length > 0 ? '' : '';
            // We'll use a simpler approach: track by session owner
            // Since we're iterating sessions, we can extract userId from the iteration context
          } else if (msg.type === 'bot') {
            messagesByDate[date].bot++;
          }
        });
      }
    });

    // Better approach: track active users from sessions
    const activeUsersByDateCorrected: Record<string, Set<string>> = {};
    allSessions.forEach(session => {
      // Extract userId from session (sessions are stored with user info)
      if (session.messages && Array.isArray(session.messages) && session.messages.length > 0) {
        session.messages.forEach((msg: any) => {
          if (msg.type === 'user') {
            const date = new Date(msg.timestamp).toISOString().split('T')[0];
            if (!activeUsersByDateCorrected[date]) {
              activeUsersByDateCorrected[date] = new Set();
            }
            // We need to get userId from somewhere. Let's check session structure
            // Sessions are stored as session:userId:sessionId, we can parse the key
          }
        });
      }
    });

    // Since we can't easily extract userId from current structure, let's use a proxy metric:
    // Number of active sessions per day (sessions with messages on that day)
    const activeSessionsByDate: Record<string, number> = {};
    allSessions.forEach(session => {
      if (session.messages && Array.isArray(session.messages)) {
        const sessionDates = new Set<string>();
        session.messages.forEach((msg: any) => {
          if (msg.type === 'user') {
            const date = new Date(msg.timestamp).toISOString().split('T')[0];
            sessionDates.add(date);
          }
        });
        sessionDates.forEach(date => {
          activeSessionsByDate[date] = (activeSessionsByDate[date] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by date (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push({
        date: dateStr,
        activeUsers: activeSessionsByDate[dateStr] || 0,
        questions: messagesByDate[dateStr]?.user || 0,
      });
    }

    const messageStats = {
      total: totalUserMessages + totalBotMessages,
      userMessages: totalUserMessages,
      botMessages: totalBotMessages,
      byDate: last7Days,
    };

    // Get pending documents for review
    const pendingDocuments = allDocuments
      .filter(d => d.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      users: userStats,
      documents: documentStats,
      sessions: sessionStats,
      messages: messageStats,
      pendingDocuments,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return c.json({ error: 'Failed to fetch admin stats' }, 500);
  }
});

// Start server
Deno.serve(app.fetch);