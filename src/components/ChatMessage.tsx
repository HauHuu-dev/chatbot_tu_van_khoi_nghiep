import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Message } from "../App";
import { DocumentReferenceCard } from "./DocumentReferenceCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  message: Message;
  onNavigateToDocument: (docId: string) => void;
};

export function ChatMessage({ message, onNavigateToDocument }: Props) {
  const [showReferences, setShowReferences] = useState(false);

  if (message.type === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[80%] bg-blue-900 text-white rounded-lg px-4 py-3">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-medium">AI</span>
      </div>

      {/* Message Content */}
      <div className="flex-1 max-w-[calc(100%-3rem)]">
        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Document References Section */}
        {message.references && message.references.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowReferences(!showReferences)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium mb-2"
            >
              <span className="text-base">📚</span>
              Tài liệu tham khảo ({message.references.length})
              {showReferences ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showReferences && (
              <div className="space-y-2">
                {message.references.map((ref) => (
                  <DocumentReferenceCard
                    key={ref.id}
                    reference={ref}
                    onViewDetail={() => onNavigateToDocument(ref.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
