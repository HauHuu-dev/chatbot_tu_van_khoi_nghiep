import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, Download } from 'lucide-react';
import { Document } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Props = {
  documentId: string;
  onBack: () => void;
  onNavigateToLibrary: () => void;
  requireAuth: (action: () => void) => void;
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

const fileIcons = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
};

export function DocumentDetail({ documentId, onBack, onNavigateToLibrary, requireAuth }: Props) {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/documents/${documentId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (attachmentUrl: string, fileName: string) => {
    requireAuth(() => {
      window.open(attachmentUrl, '_blank');
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Đang tải...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Không tìm thấy tài liệu</p>
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Chi tiết tài liệu</h1>
          </div>

          <button
            onClick={onNavigateToLibrary}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Thư viện
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {document.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                categoryColors[document.category]
              }`}
            >
              {categoryLabels[document.category]}
            </span>
            <div className="text-sm text-slate-600">
              <span className="font-medium">Tác giả:</span> {document.author}
            </div>
            <div className="text-sm text-slate-500">
              {new Date(document.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Trust Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900 flex items-start gap-2">
              <span className="text-lg">📌</span>
              <span>Tài liệu này được chatbot sử dụng để tư vấn</span>
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none mb-8">
            {document.content.split('\n').map((paragraph, index) => {
              if (!paragraph.trim()) return <br key={`br-${index}`} />;
              
              // Simple heading detection
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={`h1-${index}`} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
                    {paragraph.substring(2)}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={`h2-${index}`} className="text-xl font-bold text-slate-900 mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={`h3-${index}`} className="text-lg font-semibold text-slate-900 mt-4 mb-2">
                    {paragraph.substring(4)}
                  </h3>
                );
              }
              
              // Bullet points
              if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('• ')) {
                return (
                  <div key={`bullet-${index}`} className="flex gap-3 mb-2">
                    <span className="text-blue-900 font-bold">•</span>
                    <p className="flex-1 text-slate-700 leading-relaxed">
                      {paragraph.trim().substring(2)}
                    </p>
                  </div>
                );
              }
              
              // Regular paragraph
              return (
                <p key={`p-${index}`} className="mb-4 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Attachments */}
          {document.attachments && document.attachments.length > 0 && (
            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>📎</span>
                Tài liệu gốc đính kèm
              </h2>
              <div className="space-y-3">
                {document.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-2xl flex-shrink-0">
                        {fileIcons[attachment.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatFileSize(attachment.size)} • {attachment.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(attachment.url, attachment.name)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium flex-shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      Tải xuống
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}