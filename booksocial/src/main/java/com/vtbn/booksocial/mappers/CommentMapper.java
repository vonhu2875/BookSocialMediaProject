package com.vtbn.booksocial.mappers;

import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.CommentDetailResponse;
import com.vtbn.booksocial.dto.response.CommentListResponse;
import com.vtbn.booksocial.entities.Comment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CommentMapper {
    public Comment toComment(CommentRequest request) {
        return Comment.builder()
                .content(request.getContent())
                .build();
    }

    public CommentDetailResponse toCommentDetailResponse(Comment comment) {
        return CommentDetailResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .avatar(comment.getUser().getAvatar())
                .chapterId(comment.getChapter().getId())
                .parentCommentId(comment.getCommentParent() != null
                                ? comment.getCommentParent().getId()
                                : null)
                .createdDate(comment.getCreatedDate())
                .updatedDate(comment.getUpdatedDate())
                .build();
    }
    public CommentListResponse toCommentListResponse(Comment comment) {
        return CommentListResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .avatar(comment.getUser().getAvatar())
                .parentCommentId(
                        comment.getCommentParent() != null
                                ? comment.getCommentParent().getId()
                                : null)
                .createdDate(comment.getCreatedDate())
                .updatedDate(comment.getUpdatedDate())
                .build();
    }
}
