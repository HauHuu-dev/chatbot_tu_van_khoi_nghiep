import { Plus, MoreVertical, BookOpen, Upload, MessageSquare } from 'lucide-react';
import { ChatSession } from '../App';
import { useState } from 'react';

type Props = {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onArchiveSession: (id: string) => void;
  onNavigateToLibrary: () => void;
  onNavigateToUpload?: () => void;
};

export function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onArchiveSession,
  onNavigateToLibrary,
  onNavigateToUpload,
}: Props) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showMenuId, setShowMenuId] = useState<string | null>(null);

  const handleStartRename = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
    setShowMenuId(null);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Cố vấn</h2>
            <p className="text-xs text-slate-500">Khởi nghiệp AI</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium"
        >
          <Plus className="w-5 h-5" />
          Phiên chat mới
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto px-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Các phiên chat
        </h3>
        <div className="space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative rounded-lg ${
                session.id === currentSessionId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              {editingSessionId === session.id ? (
                <div className="p-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveRename(session.id)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRename(session.id);
                      }
                    }}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="w-full text-left p-3 pr-10"
                >
                  <div className="text-sm font-medium text-slate-900 truncate mb-1">
                    {session.title}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(session.updatedAt)}
                  </div>
                </button>
              )}

              {/* Menu Button */}
              <div className="absolute right-2 top-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenuId(showMenuId === session.id ? null : session.id);
                  }}
                  className="p-1.5 rounded hover:bg-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </button>

                {/* Dropdown Menu */}
                {showMenuId === session.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <button
                      onClick={() => handleStartRename(session)}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Đổi tên
                    </button>
                    <button
                      onClick={() => {
                        onArchiveSession(session.id);
                        setShowMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Lưu trữ
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={onNavigateToLibrary}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
        >
          <BookOpen className="w-5 h-5" />
          Thư viện tài liệu
        </button>
        
        {onNavigateToUpload && (
          <button
            onClick={onNavigateToUpload}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
          >
            <Upload className="w-5 h-5" />
            Upload tài liệu
          </button>
        )}
      </div>
    </div>
  );
}
