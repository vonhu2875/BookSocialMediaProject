package com.vtbn.booksocial.dto.response;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDetailResponse {
    private int id;
    private String content;
    private int userId;
    private String username;
    private String avatar;

    private int chapterId;

    private Integer parentCommentId;

    private Instant createdDate;

    private Instant updatedDate;
}
