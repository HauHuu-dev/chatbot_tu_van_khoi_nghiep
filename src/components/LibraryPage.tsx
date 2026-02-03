import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { mockDocuments, Document } from '../data/mockData';
import DocumentCard from './DocumentCard';

const categoryLabels = {
  theory: 'Lý thuyết',
  market: 'Thị trường',
  policy: 'Chính sách',
  all: 'Tất cả',
};

type CategoryFilter = 'all' | 'theory' | 'market' | 'policy';

export default function LibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại chat</span>
            </button>
            <h1 className="text-gray-900">Thư viện tài liệu</h1>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden px-4 py-2 border rounded-lg transition-colors ${
                showFilters
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-4 lg:hidden">
              <div className="flex flex-wrap gap-2">
                {(['all', 'theory', 'market', 'policy'] as CategoryFilter[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h3 className="text-gray-900 font-medium mb-4">Lọc theo danh mục</h3>
              <div className="space-y-2">
                {(['all', 'theory', 'market', 'policy'] as CategoryFilter[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Documents Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Tìm thấy <strong>{filteredDocuments.length}</strong> tài liệu
              </p>
            </div>

            {/* Documents List */}
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-600">Không tìm thấy tài liệu phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
