import { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, MessageSquare, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Document } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Props = {
  user: User;
  onBack: () => void;
  onNavigateToDocument: (docId: string) => void;
};

type AdminStats = {
  users: {
    total: number;
    byRole: {
      user: number;
      expert: number;
      admin: number;
    };
  };
  documents: {
    total: number;
    byStatus: {
      approved: number;
      pending: number;
      rejected: number;
    };
    byCategory: {
      theory: number;
      market: number;
      policy: number;
    };
  };
  sessions: {
    total: number;
    active: number;
    archived: number;
  };
  messages: {
    total: number;
    userMessages: number;
    botMessages: number;
    byDate: Array<{
      date: string;
      activeUsers: number;
      questions: number;
    }>;
  };
  pendingDocuments: Document[];
};

const categoryLabels = {
  theory: 'Lý thuyết',
  market: 'Thị trường',
  policy: 'Chính sách',
};

const categoryColors = {
  theory: 'bg-purple-100 text-purple-800',
  market: 'bg-green-100 text-green-800',
  policy: 'bg-blue-100 text-blue-800',
};

export function AdminDashboard({ user, onBack, onNavigateToDocument }: Props) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewingDoc, setReviewingDoc] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/admin/stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Id': user.id,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to load stats:', response.status);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewDocument = async (docId: string, status: 'approved' | 'rejected') => {
    setReviewingDoc(docId);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/documents/${docId}/review`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'X-User-Id': user.id,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        // Reload stats to reflect changes
        await loadStats();
      } else {
        console.error('Failed to review document:', response.status);
        alert('Không thể cập nhật trạng thái tài liệu');
      }
    } catch (error) {
      console.error('Error reviewing document:', error);
      alert('Lỗi khi cập nhật trạng thái tài liệu');
    } finally {
      setReviewingDoc(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Đang tải...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Không thể tải dữ liệu</p>
          <button
            onClick={onBack}
            className="text-blue-900 hover:text-blue-700 font-medium"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Quản lý và thống kê hệ thống</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {/* Users Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Người dùng</p>
                <p className="text-2xl font-bold text-slate-900">{stats.users.total}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">👤 User:</span>
                <span className="font-medium text-slate-900">{stats.users.byRole.user}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">👨‍💼 Expert:</span>
                <span className="font-medium text-slate-900">{stats.users.byRole.expert}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">⚙️ Admin:</span>
                <span className="font-medium text-slate-900">{stats.users.byRole.admin}</span>
              </div>
            </div>
          </div>

          {/* Documents Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Tài liệu</p>
                <p className="text-2xl font-bold text-slate-900">{stats.documents.total}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">✅ Đã duyệt:</span>
                <span className="font-medium text-green-600">{stats.documents.byStatus.approved}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">⏳ Chờ duyệt:</span>
                <span className="font-medium text-orange-600">{stats.documents.byStatus.pending}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">❌ Từ chối:</span>
                <span className="font-medium text-red-600">{stats.documents.byStatus.rejected}</span>
              </div>
            </div>
          </div>

          {/* Sessions Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-900" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Phiên chat</p>
                <p className="text-2xl font-bold text-slate-900">{stats.sessions.total}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">🟢 Đang hoạt động:</span>
                <span className="font-medium text-slate-900">{stats.sessions.active}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">📦 Đã lưu trữ:</span>
                <span className="font-medium text-slate-900">{stats.sessions.archived}</span>
              </div>
            </div>
          </div>

          {/* Messages Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-orange-900" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Tin nhắn</p>
                <p className="text-2xl font-bold text-slate-900">{stats.messages.total}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">💬 Câu hỏi:</span>
                <span className="font-medium text-blue-600">{stats.messages.userMessages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">🤖 Trả lời:</span>
                <span className="font-medium text-green-600">{stats.messages.botMessages}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Phân loại tài liệu
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 mb-1">Lý thuyết</p>
                <p className="text-2xl font-bold text-purple-900">{stats.documents.byCategory.theory}</p>
              </div>
              <div className="text-3xl">📚</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 mb-1">Thị trường</p>
                <p className="text-2xl font-bold text-green-900">{stats.documents.byCategory.market}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600 mb-1">Chính sách</p>
                <p className="text-2xl font-bold text-blue-900">{stats.documents.byCategory.policy}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>
        </div>

        {/* Messages Activity Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Hoạt động người dùng (7 ngày gần nhất)
          </h2>
          {stats.messages.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.messages.byDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('vi-VN');
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Số người dùng"
                  dot={{ fill: '#8b5cf6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Câu hỏi từ user"
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-slate-600">Chưa có dữ liệu hoạt động chat</p>
            </div>
          )}
        </div>

        {/* Pending Documents */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Tài liệu chờ duyệt ({stats.pendingDocuments.length})
          </h2>

          {stats.pendingDocuments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-slate-600">Không có tài liệu nào cần duyệt</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.pendingDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryColors[doc.category]}`}>
                          {categoryLabels[doc.category]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">
                        Tác giả: {doc.author} • {new Date(doc.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {doc.content.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => onNavigateToDocument(doc.id)}
                        className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleReviewDocument(doc.id, 'approved')}
                        disabled={reviewingDoc === doc.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReviewDocument(doc.id, 'rejected')}
                        disabled={reviewingDoc === doc.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}