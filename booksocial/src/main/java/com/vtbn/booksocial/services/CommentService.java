package com.vtbn.booksocial.services;

import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.CommentDetailResponse;
import com.vtbn.booksocial.dto.response.CommentListResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface CommentService {
    CommentDetailResponse createComment(Authentication authentication, int chapterId, CommentRequest request);
    List<CommentListResponse> getCommentsByChapter(int chapterId);
    CommentDetailResponse getComment(int commentId);
    CommentDetailResponse createReply(Authentication authentication,int commentId,CommentRequest request);
    CommentDetailResponse updateComment(Authentication authentication,int commentId,CommentRequest request);
    void deleteComment(Authentication authentication,int commentId);
}
