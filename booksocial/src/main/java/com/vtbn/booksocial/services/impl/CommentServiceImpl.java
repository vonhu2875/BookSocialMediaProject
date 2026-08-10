package com.vtbn.booksocial.services.impl;

import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.CommentDetailResponse;
import com.vtbn.booksocial.dto.response.CommentListResponse;
import com.vtbn.booksocial.entities.Chapter;
import com.vtbn.booksocial.entities.Comment;
import com.vtbn.booksocial.entities.User;
import com.vtbn.booksocial.enums.UserRole;
import com.vtbn.booksocial.exceptions.AppException;
import com.vtbn.booksocial.exceptions.ErrorCode;
import com.vtbn.booksocial.mappers.CommentMapper;
import com.vtbn.booksocial.repositories.ChapterRepository;
import com.vtbn.booksocial.repositories.CommentRepository;
import com.vtbn.booksocial.repositories.UserRepository;
import com.vtbn.booksocial.services.CommentService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final CommentMapper commentMapper;
    private final CommentRepository commentRepository;

    public CommentServiceImpl(UserRepository userRepository, ChapterRepository chapterRepository, CommentMapper commentMapper, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.commentMapper = commentMapper;
        this.commentRepository = commentRepository;
    }

    @Override
    public CommentDetailResponse createComment(Authentication authentication, int chapterId, CommentRequest request) {
        // Lấy user hiện tại
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // Kiểm tra chapter
        Chapter chapter = chapterRepository.findById(chapterId);

        if (chapter == null) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }

        // Convert request -> entity
        Comment comment = commentMapper.toComment(request);

        // Gán các quan hệ
        comment.setUser(user);
        comment.setChapter(chapter);

        // Lưu
        commentRepository.save(comment);

        // Entity -> response
        return commentMapper.toCommentDetailResponse(comment);
    }

    @Override
    public List<CommentListResponse> getCommentsByChapter(int chapterId) {
        // Kiểm tra chapter tồn tại
        Chapter chapter = chapterRepository.findById(chapterId);

        if (chapter == null) {
            throw new AppException(ErrorCode.CHAPTER_NOT_FOUND);
        }

        List<Comment> comments = commentRepository.findByChapterIdOrderByCreatedDateAsc(chapterId);

        return comments.stream()
                .map(commentMapper::toCommentListResponse)
                .toList();
    }

    @Override
    public CommentDetailResponse getComment(int commentId) {
        Comment comment = commentRepository.findById(commentId);
        if (comment == null) {
            throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
        }

        return commentMapper.toCommentDetailResponse(comment);
    }

    @Override
    public CommentDetailResponse createReply(Authentication authentication, int commentId, CommentRequest request) {
        // User hiện tại
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        // Tìm comment cha
        Comment parentComment = commentRepository.findById(commentId);

        if (parentComment == null) {
            throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
        }

//        // Không cho reply một reply
//        if (parentComment.getCommentParent() != null) {
//            throw new AppException(ErrorCode.COMMENT_REPLY_NOT_ALLOWED);
//        }

        // Tạo reply
        Comment reply = commentMapper.toComment(request);

        reply.setUser(user);
        reply.setChapter(parentComment.getChapter());
        reply.setCommentParent(parentComment);

        // Lưu
        commentRepository.save(reply);

        return commentMapper.toCommentDetailResponse(reply);
    }

    @Override
    public CommentDetailResponse updateComment(Authentication authentication, int commentId, CommentRequest request) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Comment comment = commentRepository.findById(commentId);

        if (comment == null) {
            throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
        }

        // Chỉ người tạo comment mới được sửa
        if (comment.getUser().getId() != user.getId()) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        comment.setContent(request.getContent());

        comment = commentRepository.save(comment);

        return commentMapper.toCommentDetailResponse(comment);
    }

    @Override
    public void deleteComment(Authentication authentication, int commentId) {
        String username = authentication.getName();

        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Comment comment = commentRepository.findById(commentId);

        if (comment == null) {
            throw new AppException(ErrorCode.COMMENT_NOT_FOUND);
        }

        // Người tạo hoặc Admin mới được xóa
        boolean isOwner =
                comment.getUser().getId() == user.getId();

        boolean isAdmin =
                user.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AppException(ErrorCode.ACCESS_DENIED);
        }

        commentRepository.delete(comment);
    }
}
