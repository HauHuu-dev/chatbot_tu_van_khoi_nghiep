import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Upload, Filter } from 'lucide-react';
import { Document, User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Props = {
  onNavigateToDocument: (docId: string) => void;
  onBack: () => void;
  onNavigateToUpload: () => void;
  user: User | null;
};

const categoryLabels = {
  theory: 'Lý thuyết',
  market: 'Thị trường',
  policy: 'Chính sách',
  all: 'Tất cả',
};

const categoryColors = {
  theory: 'bg-purple-100 text-purple-800',
  market: 'bg-green-100 text-green-800',
  policy: 'bg-blue-100 text-blue-800',
};

type Category = 'all' | 'theory' | 'market' | 'policy';

export function Library({ onNavigateToDocument, onBack, onNavigateToUpload, user }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/documents`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-900">Thư viện tài liệu</h1>
            </div>

            {(user?.role === 'expert' || user?.role === 'admin') && (
              <button
                onClick={onNavigateToUpload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium"
              >
                <Upload className="w-4 h-4" />
                Upload tài liệu
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-5 h-5 text-slate-600" />
          <div className="flex gap-2 flex-wrap">
            {(['all', 'theory', 'market', 'policy'] as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-600">Đang tải...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-2">Không tìm thấy tài liệu</p>
            <p className="text-sm text-slate-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigateToDocument(doc.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      categoryColors[doc.category]
                    }`}
                  >
                    {categoryLabels[doc.category]}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                  {doc.content.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{doc.author}</span>
                  <button className="text-blue-900 hover:text-blue-700 font-medium">
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
