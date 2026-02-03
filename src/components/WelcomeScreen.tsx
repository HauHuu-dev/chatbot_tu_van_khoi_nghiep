import { Lightbulb, TrendingUp, FileText, Rocket, MessageSquare, BookOpen } from 'lucide-react';

type Props = {
  onSuggestedQuestion: (question: string) => void;
};

export function WelcomeScreen({ onSuggestedQuestion }: Props) {
  const suggestedQuestions = [
    {
      icon: Lightbulb,
      text: 'Làm thế nào để lập kế hoạch kinh doanh hiệu quả?',
      category: 'Lý thuyết',
    },
    {
      icon: TrendingUp,
      text: 'Xu hướng thị trường F&B tại Việt Nam hiện nay?',
      category: 'Thị trường',
    },
    {
      icon: FileText,
      text: 'Có những chính sách hỗ trợ startup nào từ chính phủ?',
      category: 'Chính sách',
    },
    {
      icon: Rocket,
      text: 'Cách xây dựng MVP và thu hút khách hàng đầu tiên?',
      category: 'Lý thuyết',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Chào mừng đến với Cố vấn khởi nghiệp AI
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trợ lý thông minh giúp bạn giải đáp mọi thắc mắc về khởi nghiệp, từ lập kế hoạch kinh doanh 
            đến phân tích thị trường và chính sách hỗ trợ
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Tư vấn chuyên sâu</h3>
            <p className="text-sm text-slate-600">
              Kiến thức lý thuyết vững chắc từ các chuyên gia và tài liệu uy tín
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Phân tích thị trường</h3>
            <p className="text-sm text-slate-600">
              Thông tin cập nhật về xu hướng và cơ hội kinh doanh tại Việt Nam
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Nguồn minh bạch</h3>
            <p className="text-sm text-slate-600">
              Mọi câu trả lời đều kèm tài liệu tham khảo để bạn kiểm chứng
            </p>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Gợi ý câu hỏi
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => onSuggestedQuestion(question.text)}
                className="group bg-white border border-slate-200 rounded-xl p-4 text-left hover:border-blue-900 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <question.icon className="w-4 h-4 text-slate-600 group-hover:text-blue-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">
                      {question.text}
                    </p>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-xs text-slate-600 rounded">
                      {question.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            💡 <strong>Mẹo:</strong> Hãy đặt câu hỏi cụ thể để nhận được tư vấn chi tiết và chính xác hơn
          </p>
        </div>
      </div>
    </div>
  );
}
