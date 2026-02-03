import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../data/mockData';
import { FileText } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  compact?: boolean;
}

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

export default function DocumentCard({ document, compact = false }: DocumentCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-gray-900 font-medium line-clamp-2">{document.title}</h4>
            <span
              className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium border ${
                categoryColors[document.category]
              }`}
            >
              {categoryLabels[document.category]}
            </span>
          </div>
          
          {!compact && (
            <>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.excerpt}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span>{document.author}</span>
                <span>•</span>
                <span>{document.source}</span>
              </div>
            </>
          )}

          {compact && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{document.excerpt}</p>
          )}

          <button
            onClick={() => navigate(`/document/${document.id}`)}
            className="text-sm text-blue-900 font-medium hover:text-blue-700 transition-colors"
          >
            Xem chi tiết tài liệu →
          </button>
        </div>
      </div>
    </div>
  );
}
