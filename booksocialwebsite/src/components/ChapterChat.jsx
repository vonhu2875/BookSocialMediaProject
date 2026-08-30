import { useEffect, useRef, useState } from 'react';
import { chapterService } from '../services/apiServices';
import { Loader2, Send, Trash2 } from 'lucide-react';

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-slate-100">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function FormattedAnswer({ content }) {
  const lines = content.split(/\r?\n/);
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length === 0) return;

    elements.push(
      <ol key={`list-${elements.length}`} className="my-3 space-y-2 pl-5 marker:font-semibold marker:text-cyan-300">
        {listItems.map((item, index) => (
          <li key={index} className="pl-1">
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ol>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const numberedItem = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
    const bulletItem = trimmedLine.match(/^[-*]\s+(.+)$/);

    if (numberedItem) {
      listItems.push(numberedItem[1]);
      return;
    }

    flushList();

    if (bulletItem) {
      elements.push(
        <div key={`bullet-${index}`} className="my-1 flex gap-2 pl-1">
          <span className="text-cyan-300">•</span>
          <span>{renderInlineMarkdown(bulletItem[1])}</span>
        </div>,
      );
    } else if (trimmedLine) {
      elements.push(
        <p key={`paragraph-${index}`} className="mb-3 last:mb-0">
          {renderInlineMarkdown(trimmedLine)}
        </p>,
      );
    }
  });

  flushList();
  return <div>{elements}</div>;
}

function formatChatDate(createdDate) {
  if (!createdDate) return '';

  const date = new Date(createdDate);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function ChapterChat({ chapterId }) {
  const HISTORY_PAGE_SIZE = 2;
  const quickPrompts = [
    'Tóm tắt nội dung chính của chương này bằng 3 điểm',
    'Nhân vật nào được nhắc đến trong chương?',
    'Chương này nói về chủ đề gì?',
    'Nêu vài ý chính mà tôi nên chú ý khi đọc',
  ];
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isLoadingOlderRef = useRef(false);
  const preserveScrollRef = useRef(false);

  const mapHistoryToMessages = (history) => [...history]
    .sort((firstItem, secondItem) => {
      const firstDate = new Date(firstItem.createdDate || 0).getTime();
      const secondDate = new Date(secondItem.createdDate || 0).getTime();

      return firstDate - secondDate || Number(firstItem.id) - Number(secondItem.id);
    })
    .flatMap((item) => [
    {
      id: `${item.id}-question`,
      role: 'user',
      content: item.question || '',
      createdDate: item.createdDate,
    },
    {
      id: `${item.id}-answer`,
      role: 'assistant',
      content: item.answer || 'AI chưa có câu trả lời cho câu hỏi này.',
      sourceReference: item.sourceReference,
      createdDate: item.createdDate,
    },
    ]);

  useEffect(() => {
    let isCurrentChapter = true;

    const loadHistory = async () => {
      setMessages([]);
      setQuestion('');
      setLoadingHistory(true);
      setHistoryPage(0);
      setHasOlderMessages(false);

      try {
        const firstPageResponse = await chapterService.getChatHistory(chapterId, 0, HISTORY_PAGE_SIZE);
        const lastPage = Math.max((firstPageResponse?.totalPages || 1) - 1, 0);
        const response = lastPage === 0
          ? firstPageResponse
          : await chapterService.getChatHistory(chapterId, lastPage, HISTORY_PAGE_SIZE);
        const history = Array.isArray(response?.content) ? response.content : [];

        if (isCurrentChapter) {
          setMessages(mapHistoryToMessages(history));
          setHistoryPage(lastPage);
          setHasOlderMessages(lastPage > 0);
        }
      } catch (error) {
        console.error('Lỗi lấy lịch sử hỏi đáp:', error);
      } finally {
        if (isCurrentChapter) setLoadingHistory(false);
      }
    };

    if (chapterId) loadHistory();

    return () => {
      isCurrentChapter = false;
    };
  }, [chapterId]);

  const loadOlderMessages = async () => {
    if (!hasOlderMessages || loadingOlder || isLoadingOlderRef.current) return;

    const container = messagesContainerRef.current;
    const previousScrollHeight = container?.scrollHeight || 0;
    const previousScrollTop = container?.scrollTop || 0;
    const nextPage = historyPage - 1;

    isLoadingOlderRef.current = true;
    setLoadingOlder(true);

    try {
      const response = await chapterService.getChatHistory(chapterId, nextPage, HISTORY_PAGE_SIZE);
      const history = Array.isArray(response?.content) ? response.content : [];
      preserveScrollRef.current = true;
      setMessages((currentMessages) => [
        ...mapHistoryToMessages(history),
        ...currentMessages,
      ]);
      setHistoryPage(response?.number ?? nextPage);
      setHasOlderMessages(nextPage > 0);

      requestAnimationFrame(() => {
        if (container) {
          const preservedScrollTop = previousScrollTop + container.scrollHeight - previousScrollHeight;
          const bottomScrollTop = container.scrollHeight - container.clientHeight;

          container.scrollTop = Math.max(preservedScrollTop, bottomScrollTop);
        }
      });
    } catch (error) {
      console.error('Lỗi tải thêm lịch sử hỏi đáp:', error);
    } finally {
      isLoadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  };

  const handleMessagesScroll = (event) => {
    if (event.currentTarget.scrollTop <= 24) loadOlderMessages();
  };

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (
      !loadingHistory
      && hasOlderMessages
      && container
      && container.scrollHeight <= container.clientHeight
    ) {
      loadOlderMessages();
    }
  }, [loadingHistory, hasOlderMessages, messages.length]);

  useEffect(() => {
    if (preserveScrollRef.current) {
      preserveScrollRef.current = false;
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleDeleteChatHistory = async () => {
    if (!chapterId || deletingHistory) return;

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử hỏi đáp của chương này không?');
    if (!confirmed) return;

    setDeletingHistory(true);

    try {
      await chapterService.deleteChatHistory(chapterId);
      setMessages([]);
      setHistoryPage(0);
      setHasOlderMessages(false);
    } catch (error) {
      console.error('Lỗi xóa lịch sử hỏi đáp chương:', error);
    } finally {
      setDeletingHistory(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setQuestion(prompt);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || sending) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: `question-${Date.now()}`, role: 'user', content: trimmedQuestion },
    ]);
    setQuestion('');
    setSending(true);

    try {
      const response = await chapterService.chatChapter(chapterId, {
        question: trimmedQuestion,
      });
      const answer = response?.answer || response?.result?.answer;

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `answer-${Date.now()}`,
          role: 'assistant',
          content: answer || 'AI chưa tìm thấy câu trả lời phù hợp trong chương này.',
        },
      ]);
    } catch (error) {
      console.error('Lỗi hỏi đáp chương:', error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Không thể kết nối với trợ lý AI. Vui lòng thử lại.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <div className="flex-shrink-0 overflow-x-auto pb-1 scrollbar-chat">
        <div className="flex w-max min-w-full gap-2">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className="scrollbar-chat h-full space-y-3 overflow-y-auto pr-2"
        >
        {loadingHistory ? (
          <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
            Đang tải lịch sử trò chuyện...
          </div>
        ) : (
          <>
            {loadingOlder && (
              <div className="flex items-center justify-center gap-2 py-2 text-[10px] text-slate-500">
                <Loader2 className="h-3 w-3 animate-spin text-cyan-300" />
                Đang tải tin nhắn cũ hơn...
              </div>
            )}
            {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-5 text-center text-xs leading-relaxed text-slate-500">
            Đặt câu hỏi về nhân vật, sự kiện hoặc ý chính trong chương này.
          </div>
            )}

            {messages.map((message, index) => (
          <div
            key={message.id || `${message.role}-${index}`}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                message.role === 'user'
                  ? 'rounded-br-md bg-indigo-600 text-white'
                  : 'rounded-bl-md border border-slate-800 bg-slate-950/70 text-slate-300'
              }`}
            >
              {message.role === 'assistant' ? (
                <>
                  <FormattedAnswer content={message.content} />
                  {message.sourceReference && (
                    <div className="mt-2 border-t border-slate-800 pt-2 text-[10px] text-slate-500">
                      Nguồn: {message.sourceReference}
                    </div>
                  )}
                </>
              ) : (
                message.content
              )}
              {message.createdDate && (
                <div className={`mt-2 text-[10px] ${message.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {formatChatDate(message.createdDate)}
                </div>
              )}
            </div>
          </div>
          ))}

          {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md border border-slate-800 bg-slate-950/70 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
            </div>
          </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-800 pt-3">
        <button
          type="button"
          onClick={handleDeleteChatHistory}
          disabled={deletingHistory || loadingHistory}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400 transition hover:border-rose-500/50 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
          title="Xóa lịch sử hỏi đáp"
          aria-label="Xóa lịch sử hỏi đáp"
        >
          {deletingHistory ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
        <input
          ref={inputRef}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Bạn muốn biết điều gì?"
          disabled={sending}
          aria-label="Câu hỏi về nội dung chương"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !question.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          title="Gửi câu hỏi"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
