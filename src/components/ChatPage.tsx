import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { ChatMessage } from './ChatMessage';
import { WelcomeScreen } from './WelcomeScreen';
import { Menu, Send, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { User, ChatSession, Message } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Props = {
  user: User | null;
  onNavigateToDocument: (docId: string) => void;
  onNavigateToLibrary: () => void;
  onNavigateToUpload: () => void;
  onNavigateToAdmin?: () => void;
  onLogout: () => void;
  requireAuth: (action: () => void) => void;
};

export function ChatPage({
  user,
  onNavigateToDocument,
  onNavigateToLibrary,
  onNavigateToUpload,
  onNavigateToAdmin,
  onLogout,
  requireAuth,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    if (!user) {
      // Load demo session for non-logged users
      const demoSession: ChatSession = {
        id: 'demo',
        title: 'Phiên demo',
        updatedAt: new Date().toISOString(),
        archived: false,
        messages: [],
      };
      setSessions([demoSession]);
      setCurrentSessionId('demo');
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/sessions`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-User-Id': user.id,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        if (data.sessions?.length > 0 && !currentSessionId) {
          setCurrentSessionId(data.sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleNewChat = () => {
    requireAuth(() => {
      const newSession: ChatSession = {
        id: Date.now().toString(),
        title: 'Phiên chat mới',
        updatedAt: new Date().toISOString(),
        archived: false,
        messages: [], // Start with empty messages to show welcome screen
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
      saveSession(newSession);
    });
  };

  const saveSession = async (session: ChatSession) => {
    if (!user) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/sessions/${session.id}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'X-User-Id': user.id,
          },
          body: JSON.stringify(session),
        }
      );
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    setSessions(sessions.map(s =>
      s.id === sessionId ? { ...s, title: newTitle, updatedAt: new Date().toISOString() } : s
    ));
    const updatedSession = sessions.find(s => s.id === sessionId);
    if (updatedSession) {
      saveSession({ ...updatedSession, title: newTitle });
    }
  };

  const handleArchiveSession = (sessionId: string) => {
    setSessions(sessions.map(s =>
      s.id === sessionId ? { ...s, archived: true, updatedAt: new Date().toISOString() } : s
    ));
    const updatedSession = sessions.find(s => s.id === sessionId);
    if (updatedSession) {
      saveSession({ ...updatedSession, archived: true });
    }
    if (currentSessionId === sessionId) {
      const activeSession = sessions.find(s => s.id !== sessionId && !s.archived);
      setCurrentSessionId(activeSession?.id || null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    requireAuth(async () => {
      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (!currentSession) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...currentSession.messages, userMessage];
      setSessions(sessions.map(s =>
        s.id === currentSessionId
          ? { ...s, messages: updatedMessages, updatedAt: new Date().toISOString() }
          : s
      ));

      setInputMessage('');
      setIsTyping(true);

      // Call chatbot API
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/chat`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: inputMessage,
              sessionId: currentSessionId,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'bot',
            content: data.response,
            references: data.references,
            timestamp: new Date().toISOString(),
          };

          setSessions(sessions.map(s =>
            s.id === currentSessionId
              ? {
                  ...s,
                  messages: [...updatedMessages, botMessage],
                  title: s.messages.length === 1 ? inputMessage.slice(0, 50) : s.title,
                  updatedAt: new Date().toISOString(),
                }
              : s
          ));

          const finalSession = sessions.find(s => s.id === currentSessionId);
          if (finalSession) {
            saveSession({
              ...finalSession,
              messages: [...updatedMessages, botMessage],
            });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsTyping(false);
      }
    });
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const activeSessions = sessions.filter(s => !s.archived);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          sessions={activeSessions}
          currentSessionId={currentSessionId}
          onSelectSession={setCurrentSessionId}
          onNewChat={handleNewChat}
          onRenameSession={handleRenameSession}
          onArchiveSession={handleArchiveSession}
          onNavigateToLibrary={onNavigateToLibrary}
          onNavigateToUpload={user?.role === 'expert' || user?.role === 'admin' ? onNavigateToUpload : undefined}
        />
      </div>

      {/* Sidebar - Mobile/Tablet Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw]">
            <Sidebar
              sessions={activeSessions}
              currentSessionId={currentSessionId}
              onSelectSession={(id) => {
                setCurrentSessionId(id);
                setSidebarOpen(false);
              }}
              onNewChat={() => {
                handleNewChat();
                setSidebarOpen(false);
              }}
              onRenameSession={handleRenameSession}
              onArchiveSession={handleArchiveSession}
              onNavigateToLibrary={() => {
                onNavigateToLibrary();
                setSidebarOpen(false);
              }}
              onNavigateToUpload={
                user?.role === 'expert' || user?.role === 'admin'
                  ? () => {
                      onNavigateToUpload();
                      setSidebarOpen(false);
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">
              {currentSession?.title || 'Cố vấn khởi nghiệp AI'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToLibrary}
              className="p-2 hover:bg-slate-100 rounded-lg"
              title="Thư viện tài liệu"
            >
              <BookOpen className="w-5 h-5 text-slate-600" />
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-xs text-slate-600 rounded">
                        {user.role === 'admin' ? '⚙️ Admin' : user.role === 'expert' ? '👨‍💼 Expert' : '👤 User'}
                      </span>
                    </div>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onNavigateToAdmin) {
                            onNavigateToAdmin();
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        ⚙️ Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => requireAuth(() => {})}
                className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 text-sm font-medium"
              >
                <UserIcon className="w-4 h-4" />
                Đăng nhập
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {currentSession?.messages.length === 0 ? (
            <WelcomeScreen onSuggestedQuestion={(question) => setInputMessage(question)} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6">
              {currentSession?.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onNavigateToDocument={onNavigateToDocument}
                />
              ))}
              
              {isTyping && (
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">AI</span>
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}