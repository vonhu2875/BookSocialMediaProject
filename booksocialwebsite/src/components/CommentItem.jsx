import { useState } from 'react';
import { commentService } from '../services/apiServices';
import { User, Edit3, Trash2, Reply, Send, Loader2, Check } from 'lucide-react';

export default function CommentItem({ comment, allComments, currentUserId, onRefresh }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);

  const isMyComment = currentUserId && comment.userId === currentUserId;

  // Lọc tất cả các reply trực tiếp của comment HIỆN TẠI (Tự đệ quy)
  const childReplies = allComments.filter((c) => c.parentCommentId === comment.id);

  // Trả lời bình luận
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await commentService.replyComment(comment.id, { content: replyText });
      setReplyText('');
      setIsReplying(false);
      onRefresh();
    } catch (error) {
      console.error('Lỗi phản hồi bình luận:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Sửa bình luận
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    setSubmitting(true);
    try {
      await commentService.updateComment(comment.id, { content: editText });
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Lỗi sửa bình luận:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Xóa bình luận
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    try {
      await commentService.deleteComment(comment.id);
      onRefresh();
    } catch (error) {
      console.error('Lỗi xóa bình luận:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Khung nội dung comment */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {comment.avatar ? (
              <img src={comment.avatar} alt={comment.username} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-200">
              {comment.username} {isMyComment && <span className="text-[10px] text-indigo-400 font-normal">(Bạn)</span>}
            </span>
            <span className="text-[10px] text-slate-500">
              {comment.createdDate ? new Date(comment.createdDate).toLocaleDateString('vi-VN') : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsReplying(!isReplying); setIsEditing(false); }}
              className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <Reply className="w-3.5 h-3.5" /> Trả lời
            </button>

            {isMyComment && (
              <>
                <button
                  onClick={() => { setIsEditing(!isEditing); setIsReplying(false); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition p-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="text-xs text-rose-400 hover:text-rose-300 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="pt-2 space-y-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Lưu
              </button>
            </div>
          </form>
        ) : (
          <p className="text-xs sm:text-sm text-slate-300 pl-9">{comment.content}</p>
        )}

        {/* Form Reply */}
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="pl-9 pt-2 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Trả lời ${comment.username}...`}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
            </button>
          </form>
        )}
      </div>

      {/* ĐỆ QUY: Render tiếp các comment con cấp tiếp theo */}
      {childReplies.length > 0 && (
        <div className="pl-4 sm:pl-6 border-l-2 border-indigo-500/30 space-y-3">
          {childReplies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              currentUserId={currentUserId}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}