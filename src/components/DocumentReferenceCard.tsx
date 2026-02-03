import { DocumentReference } from '../App';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Props = {
  reference: DocumentReference;
  onViewDetail: () => void;
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

export function DocumentReferenceCard({ reference, onViewDetail }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors">
      {/* Clickable Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between gap-3 text-left hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          )}
          <h4 className="font-medium text-slate-900 text-sm truncate">{reference.title}</h4>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
            categoryColors[reference.category]
          }`}
        >
          {categoryLabels[reference.category]}
        </span>
      </button>
      
      {/* Expanded Content - Only show when expanded */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">{reference.excerpt}</p>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail();
            }}
            className="text-sm text-blue-900 hover:text-blue-700 font-medium hover:underline"
          >
            Xem chi tiết tài liệu →
          </button>
        </div>
      )}
    </div>
  );
}