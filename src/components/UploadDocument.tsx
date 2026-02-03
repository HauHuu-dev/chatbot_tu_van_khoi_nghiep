import { useState } from 'react';
import { ArrowLeft, Upload as UploadIcon, X, FileText, Eye } from 'lucide-react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type Props = {
  onBack: () => void;
  user: User;
};

type Category = 'theory' | 'market' | 'policy';

const categoryLabels = {
  theory: 'Lý thuyết',
  market: 'Thị trường',
  policy: 'Chính sách',
};

export function UploadDocument({ onBack, user }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('theory');
  const [author, setAuthor] = useState(user.name);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) =>
          file.type === 'application/pdf' ||
          file.type === 'application/msword' ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    setUploading(true);
    try {
      console.log('Starting document upload...');
      
      // Upload files first if any
      const attachments = [];
      for (const file of files) {
        console.log('Uploading file:', file.name);
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/upload`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'X-User-Id': user.id,
            },
            body: formData,
          }
        );

        console.log('Upload response status:', uploadResponse.status);

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('Upload successful:', uploadData);
          attachments.push({
            name: file.name,
            size: file.size,
            type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'doc',
            url: uploadData.url,
          });
        } else {
          const errorText = await uploadResponse.text();
          console.error('Upload failed:', errorText);
          alert(`Lỗi khi upload file ${file.name}: ${errorText}`);
          setUploading(false);
          return;
        }
      }

      // Create document
      console.log('Creating document...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5e6b6e45/documents`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
            'X-User-Id': user.id,
          },
          body: JSON.stringify({
            title,
            category,
            author,
            content,
            attachments,
          }),
        }
      );

      console.log('Create document response status:', response.status);

      if (response.ok) {
        console.log('Document created successfully');
        setSuccess(true);
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Create document failed:', errorText);
        alert(`Có lỗi xảy ra khi tạo tài liệu: ${errorText}`);
        setUploading(false);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert(`Có lỗi xảy ra: ${error instanceof Error ? error.message : String(error)}`);
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Upload thành công!</h2>
          <p className="text-slate-600">Đang chuyển về thư viện...</p>
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
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Upload tài liệu mới</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Ẩn preview' : 'Preview'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadIcon className="w-4 h-4" />
              {uploading ? 'Đang upload...' : 'Publish'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className={showPreview ? 'grid grid-cols-2 gap-6' : ''}>
          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Thông tin tài liệu</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề tài liệu"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tác giả
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Tên tác giả"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung tài liệu (hỗ trợ Markdown)&#10;&#10;Ví dụ:&#10;# Tiêu đề lớn&#10;## Tiêu đề nhỏ&#10;- Bullet point&#10;&#10;Đoạn văn bản..."
                rows={12}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tài liệu đính kèm (PDF, Word)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Chọn file
                </label>
                <p className="text-xs text-slate-500 mt-2">
                  Hỗ trợ PDF, DOC, DOCX
                </p>
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Preview</h2>
              
              <div className="border border-slate-200 rounded-lg p-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                  {title || 'Tiêu đề tài liệu'}
                </h1>

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                    {categoryLabels[category]}
                  </span>
                  <span className="text-sm text-slate-600">
                    {author || 'Tác giả'}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none">
                  {content ? (
                    content.split('\n').map((line, index) => {
                      if (!line.trim()) return <br key={index} />;
                      
                      if (line.startsWith('# ')) {
                        return (
                          <h1 key={index} className="text-xl font-bold text-slate-900 mt-4 mb-2">
                            {line.substring(2)}
                          </h1>
                        );
                      }
                      if (line.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-lg font-bold text-slate-900 mt-3 mb-2">
                            {line.substring(3)}
                          </h2>
                        );
                      }
                      if (line.trim().startsWith('- ')) {
                        return (
                          <div key={index} className="flex gap-2 mb-1">
                            <span>•</span>
                            <span>{line.trim().substring(2)}</span>
                          </div>
                        );
                      }
                      
                      return (
                        <p key={index} className="mb-2 text-slate-700">
                          {line}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-slate-400 italic">Nội dung sẽ hiển thị tại đây...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}