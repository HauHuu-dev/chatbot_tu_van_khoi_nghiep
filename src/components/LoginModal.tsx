import { X } from 'lucide-react';
import { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: any) => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  const supabase = getSupabaseClient();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      if (mode === 'login') {
        handleLogin();
      } else {
        handleSignup();
      }
    }
  };

  const testDebugEndpoint = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/debug-env`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      console.log('Debug endpoint response:', data);
      setDebugInfo(data);
      setShowDebug(true);
    } catch (err) {
      console.error('Debug endpoint error:', err);
      setError('Không thể kết nối với máy chủ debug');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting login for email:', email);
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Login response:', { 
        hasSession: !!data.session,
        hasUser: !!data.user,
        error: authError 
      });

      if (authError) {
        console.error('Authentication error during login:', authError);
        setError('Email hoặc mật khẩu không đúng');
        return;
      }

      if (!data.session || !data.user) {
        console.error('No session or user in login response');
        setError('Không thể tạo phiên đăng nhập');
        return;
      }

      const token = data.session.access_token;
      console.log('Login successful, access token length:', token?.length);
      console.log('Token first 20 chars:', token?.substring(0, 20));
      console.log('Fetching profile...');

      // Fetch user profile to get role - Using POST method like test-token
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/get-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        }
      );

      console.log('Profile fetch response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Profile fetch failed:', response.status, errorText);
        
        // Debug: Test token verification
        console.log('🔍 Testing token verification...');
        const testResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/test-token`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: token }),
          }
        );
        const testResult = await testResponse.json();
        console.log('🔍 Token verification test result:', testResult);
        
        setError(`Không thể lấy thông tin tài khoản (${response.status})`);
        return;
      }

      const profile = await response.json();
      console.log('Profile fetched successfully:', profile);
      onSuccess(profile);
    } catch (err) {
      console.error('Login error:', err);
      setError('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting signup for email:', email);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/signup`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        }
      );

      console.log('Signup response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('Signup failed:', response.status, data);
        
        // If email already exists, suggest login
        if (response.status === 422) {
          setError(data.error || 'Email đã được đăng ký');
          // Auto-switch to login mode after 2 seconds
          setTimeout(() => {
            setMode('login');
            setError('');
          }, 2000);
          return;
        }
        
        setError(data.error || 'Có lỗi xảy ra khi đăng ký');
        return;
      }

      console.log('Signup successful, attempting auto-login...');

      // Auto login after signup
      const { data: loginData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Auto-login response:', { loginData, authError });

      if (authError) {
        console.error('Auto-login failed after signup:', authError);
        setError('Đăng ký thành công, vui lòng đăng nhập');
        setMode('login');
        return;
      }

      if (!loginData.session || !loginData.user) {
        console.error('No session after signup auto-login');
        setError('Đăng ký thành công, vui lòng đăng nhập');
        setMode('login');
        return;
      }

      console.log('Auto-login successful, fetching profile...');

      // Fetch user profile to get role - Using POST method like test-token
      const profileResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/get-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: loginData.session.access_token }),
        }
      );

      console.log('Profile fetch response status:', profileResponse.status);

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile fetch failed after signup:', profileResponse.status, errorText);
        setError('Đăng ký thành công nhưng không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại');
        setMode('login');
        return;
      }

      const profile = await profileResponse.json();
      console.log('Profile fetched successfully after signup:', profile);
      onSuccess(profile);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-900 rounded-xl mb-3">
              <span className="text-white text-xl font-bold">AI</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </h2>
            <p className="text-sm text-slate-600">
              {mode === 'login'
                ? 'Đăng nhập để lưu và quản lý các phiên chat'
                : 'Tạo tài khoản để bắt đầu sử dụng'}
            </p>
          </div>

          {/* Demo Accounts (Only show on Login) */}
          {mode === 'login' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">🎯 Tài khoản demo:</p>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="flex items-center justify-between">
                  <span>👤 User: <code className="bg-white px-2 py-0.5 rounded">user@demo.com</code></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>⭐ Expert: <code className="bg-white px-2 py-0.5 rounded">expert@demo.com</code></span>
                </div>
                <div className="flex items-center justify-between">
                  <span>👑 Admin: <code className="bg-white px-2 py-0.5 rounded">admin@demo.com</code></span>
                </div>
                <p className="text-blue-700 mt-2 pt-2 border-t border-blue-200">
                  Mật khẩu: <code className="bg-white px-2 py-0.5 rounded font-semibold">demo123456</code>
                </p>
              </div>
              
              {/* Debug Button */}
              <button
                onClick={async () => {
                  try {
                    setError('Đang khởi tạo demo users...');
                    const response = await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/debug-users`,
                      {
                        headers: {
                          'Authorization': `Bearer ${publicAnonKey}`,
                        },
                      }
                    );
                    const data = await response.json();
                    console.log('Demo users:', data);
                    setError(`✅ Có ${data.count} user trong hệ thống. Bạn có thể login ngay!`);
                  } catch (err) {
                    console.error('Debug error:', err);
                    setError('Không thể khởi tạo demo users');
                  }
                }}
                className="w-full mt-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🔧 Khởi tạo Demo Users
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Họ tên
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  onKeyPress={handleKeyPress}
                />
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-slate-500 mt-1">Tối thiểu 6 ký tự</p>
              )}
            </div>

            <button
              onClick={mode === 'login' ? handleLogin : handleSignup}
              disabled={loading}
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-sm text-blue-900 hover:text-blue-700 font-medium"
            >
              {mode === 'login'
                ? 'Chưa có tài khoản? Đăng ký ngay'
                : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}