import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { mockDocuments } from '../data/mockData';

const categoryLabels = {
  theory: 'Lý thuyết',
  market: 'Thị trường',
  policy: 'Chính sách',
};

const categoryColors = {
  theory: 'bg-purple-100 text-purple-700 border-purple-200',
  market: 'bg-green-100 text-green-700 border-green-200',
  policy: 'bg-blue-100 text-blue-700 border-blue-200',
};

const fileIcons: { [key: string]: string } = {
  pdf: '📄',
  docx: '📝',
  doc: '📝',
  xlsx: '📊',
  pptx: '📊',
};

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const document = mockDocuments.find((doc) => doc.id === id);

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy tài liệu</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-900 hover:text-blue-700 font-medium"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Article Header */}
        <article className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 mb-6">
          {/* Category Badge */}
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
                categoryColors[document.category]
              }`}
            >
              {categoryLabels[document.category]}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-4">{document.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-gray-600 pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm text-blue-900 font-medium">
                  {document.author.charAt(0)}
                </span>
              </div>
              <span>{document.author}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>{document.source}</span>
          </div>

          {/* Trust Signal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              📌 <strong>Tài liệu tin cậy:</strong> Tài liệu này được chatbot sử dụng để tư vấn
              và trả lời câu hỏi của bạn
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-sm lg:prose-base max-w-none">
            {document.content.split('\n').map((line, idx) => {
              // Headings
              if (line.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-gray-900 mt-8 mb-4 first:mt-0">
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-gray-900 mt-6 mb-3">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-gray-900 mt-4 mb-2">
                    {line.replace('### ', '')}
                  </h3>
                );
              }

              // Lists
              if (line.match(/^[\-\*] /)) {
                return (
                  <li key={idx} className="text-gray-700 ml-6">
                    {line.replace(/^[\-\*] /, '')}
                  </li>
                );
              }

              // Bold text
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={idx} className="text-gray-700 mb-3">
                    {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                  </p>
                );
              }

              // Regular paragraph
              if (line.trim()) {
                return (
                  <p key={idx} className="text-gray-700 mb-3">
                    {line}
                  </p>
                );
              }

              return <br key={idx} />;
            })}
          </div>
        </article>

        {/* Attachments */}
        {document.attachments && document.attachments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8">
            <h2 className="text-gray-900 mb-4 flex items-center gap-2">
              📎 Tài liệu gốc đính kèm
            </h2>
            <div className="space-y-3">
              {document.attachments.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url}
                  download
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{fileIcons[file.type] || '📎'}</div>
                    <div>
                      <p className="text-gray-900 font-medium group-hover:text-blue-900">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-blue-900" />
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
