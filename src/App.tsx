import { useState, useEffect } from 'react';
import { ChatPage } from './components/ChatPage';
import { DocumentDetail } from './components/DocumentDetail';
import { Library } from './components/Library';
import { UploadDocument } from './components/UploadDocument';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { getSupabaseClient } from './utils/supabase/client';
import { projectId } from './utils/supabase/info';

const supabase = getSupabaseClient();

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'expert' | 'admin';
};

export type ChatSession = {
  id: string;
  title: string;
  updatedAt: string;
  archived: boolean;
  messages: Message[];
};

export type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  references?: DocumentReference[];
  timestamp: string;
};

export type DocumentReference = {
  id: string;
  title: string;
  category: 'theory' | 'market' | 'policy';
  excerpt: string;
};

export type Document = {
  id: string;
  title: string;
  category: 'theory' | 'market' | 'policy';
  author: string;
  content: string;
  attachments?: Attachment[];
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type Attachment = {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'doc' | 'docx';
  url: string;
};

type Page = 'chat' | 'document' | 'library' | 'upload' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('chat');
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Get user profile from backend
      fetchUserProfile(session.access_token);
    }
  };

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/profile`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const profile = await response.json();
        setUser(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const requireAuth = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLogin(true);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowLogin(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('chat');
  };

  const navigateToDocument = (docId: string) => {
    setSelectedDocumentId(docId);
    setCurrentPage('document');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {currentPage === 'chat' && (
        <ChatPage
          user={user}
          onNavigateToDocument={navigateToDocument}
          onNavigateToLibrary={() => setCurrentPage('library')}
          onNavigateToUpload={() => {
            if (user?.role === 'expert' || user?.role === 'admin') {
              setCurrentPage('upload');
            }
          }}
          onNavigateToAdmin={() => {
            if (user?.role === 'admin') {
              setCurrentPage('admin');
            }
          }}
          onLogout={handleLogout}
          requireAuth={requireAuth}
        />
      )}
      
      {currentPage === 'document' && selectedDocumentId && (
        <DocumentDetail
          documentId={selectedDocumentId}
          onBack={() => setCurrentPage('chat')}
          onNavigateToLibrary={() => setCurrentPage('library')}
          requireAuth={requireAuth}
        />
      )}
      
      {currentPage === 'library' && (
        <Library
          onNavigateToDocument={navigateToDocument}
          onBack={() => setCurrentPage('chat')}
          onNavigateToUpload={() => {
            if (user?.role === 'expert' || user?.role === 'admin') {
              setCurrentPage('upload');
            }
          }}
          user={user}
        />
      )}
      
      {currentPage === 'upload' && (user?.role === 'expert' || user?.role === 'admin') && (
        <UploadDocument
          onBack={() => setCurrentPage('library')}
          user={user!}
        />
      )}

      {currentPage === 'admin' && user?.role === 'admin' && (
        <AdminDashboard
          onBack={() => setCurrentPage('chat')}
          onNavigateToDocument={navigateToDocument}
          user={user!}
        />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false);
            setPendingAction(null);
          }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;