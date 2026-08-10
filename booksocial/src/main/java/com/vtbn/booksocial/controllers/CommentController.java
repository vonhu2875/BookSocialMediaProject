package com.vtbn.booksocial.controllers;

import com.vtbn.booksocial.dto.request.CommentRequest;
import com.vtbn.booksocial.dto.response.ApiResponse;
import com.vtbn.booksocial.dto.response.CommentDetailResponse;
import com.vtbn.booksocial.services.CommentService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentController {
    private final CommentService commentService;
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    @GetMapping("/{commentId}")
    public ApiResponse<CommentDetailResponse> getComment(
            @PathVariable int commentId
    ) {
        CommentDetailResponse response =
                commentService.getComment(commentId);

        return ApiResponse.<CommentDetailResponse>builder()
                .result(response)
                .build();
    }
    @PostMapping("/{commentId}/replies")
    public ApiResponse<CommentDetailResponse> createReply(Authentication authentication,@PathVariable int commentId,@Valid @RequestBody CommentRequest request) {
        CommentDetailResponse response = commentService.createReply(authentication,commentId,request);
        return ApiResponse.<CommentDetailResponse>builder().result(response).build();
    }
    @PutMapping("/{commentId}")
    public ApiResponse<CommentDetailResponse> updateComment(Authentication authentication,@PathVariable int commentId,@Valid @RequestBody CommentRequest request) {
        CommentDetailResponse response = commentService.updateComment(authentication,commentId, request);
        return ApiResponse.<CommentDetailResponse>builder()
                .result(response)
                .build();
    }
    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(Authentication authentication,@PathVariable int commentId) {
        commentService.deleteComment(authentication,commentId);
        return ApiResponse.<Void>builder().message("Delete comment success").build();
    }

}
