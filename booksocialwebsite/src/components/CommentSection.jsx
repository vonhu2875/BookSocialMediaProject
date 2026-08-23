import React, { useState, useEffect } from 'react';
import { chapterService, authService } from '../services/apiServices';
import CommentItem from './CommentItem';
import {
  MessageSquare,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function CommentSection({ chapterId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 5;

  const fetchComments = async (page = currentPage) => {
    setLoading(true);

    try {
      const [commentsRes, myInfoRes] = await Promise.all([
        chapterService.getComments(chapterId, page, pageSize),
        authService.getMyInfo().catch(() => null),
      ]);

      /*
       * Backend trả về Spring Page:
       *
       * {
       *   content: [...],
       *   totalPages: 3,
       *   totalElements: 25,
       *   number: 0,
       *   size: 10
       * }
       */

      const pageData =
        commentsRes?.data?.result ||
        commentsRes?.data ||
        commentsRes?.result ||
        commentsRes;

      const rawList = pageData?.content || [];

      const myInfo =
        myInfoRes?.data?.result ||
        myInfoRes?.result ||
        myInfoRes ||
        null;

      setComments(Array.isArray(rawList) ? rawList : []);

      setTotalPages(pageData?.totalPages || 0);

      if (myInfo?.id) {
        setCurrentUserId(myInfo.id);
      }
    } catch (error) {
      console.error('Lỗi lấy bình luận:', error);
      setComments([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chapterId) {
      setCurrentPage(0);
      fetchComments(0);
    }
  }, [chapterId]);

  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      await chapterService.addComment(chapterId, {
        content: newComment,
      });

      setNewComment('');

      // Sau khi thêm comment thì quay về trang đầu
      setCurrentPage(0);
      await fetchComments(0);

    } catch (error) {
      console.error('Lỗi gửi bình luận:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Chuyển trang
  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);
    fetchComments(page);
  };

  // Chỉ lọc các bình luận GỐC
  const rootComments = comments.filter(
    (comment) => !comment.parentCommentId
  );

  return (
    <div className="space-y-6 pt-8 border-t border-slate-800">

      {/* Tiêu đề */}
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-400" />

        BÌNH LUẬN CHƯƠNG
        {totalPages > 0 && (
          <span className="text-slate-500 font-normal">
            ({totalPages * pageSize})
          </span>
        )}
      </h3>

      {/* Form tạo bình luận */}
      <form onSubmit={handleCreateComment} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Chia sẻ suy nghĩ của bạn về chương này..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition"
        />

        <button
          type="submit"
          disabled={submitting || !newComment.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 disabled:opacity-40 transition shrink-0"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}

          Gửi
        </button>
      </form>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-6 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>

      ) : rootComments.length === 0 ? (

        <p className="text-xs text-slate-500 text-center py-6">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>

      ) : (

        <>
          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {rootComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                allComments={comments}
                currentUserId={currentUserId}
                onRefresh={() => fetchComments(currentPage)}
              />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">

              {/* Trang trước */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Các số trang */}
              {Array.from(
                { length: totalPages },
                (_, index) => index
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              {/* Trang sau */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages - 1 || loading
                }
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}
        </>
      )}
    </div>
  );
}